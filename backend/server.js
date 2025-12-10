import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer();

const app = express();

// CORS middleware - MUST be first
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
  res.json({ message: "pong", env: process.env.NODE_ENV });
});

// Add new admin user endpoint
app.get("/add-admin", async (req, res) => {
  try {
    await db.query(`
      INSERT INTO admins (username, password, role) 
      VALUES ('AnkitPatel', 'ankit@20', 'admin')
      ON CONFLICT (username) DO NOTHING
    `);

    res.json({ 
      message: "✅ Admin user 'AnkitPatel' added successfully!",
      username: "AnkitPatel"
    });
  } catch (err) {
    console.error("Add admin error:", err);
    res.status(500).json({ error: "Failed to add admin user", details: err.message });
  }
});

// Setup database tables endpoint
app.get("/setup-database", async (req, res) => {
  try {
    // Create tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      INSERT INTO admins (username, password, role) 
      VALUES ('admin', 'admin123', 'admin')
      ON CONFLICT (username) DO NOTHING
    `);

    await db.query(`
      INSERT INTO admins (username, password, role) 
      VALUES ('AnkitPatel', 'ankit@20', 'admin')
      ON CONFLICT (username) DO NOTHING
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS userregistrations (
        id SERIAL PRIMARY KEY,
        "fullName" VARCHAR(255) NOT NULL,
        "contactNumber" VARCHAR(20),
        "alternateNumber" VARCHAR(20),
        email VARCHAR(255),
        dob DATE,
        address TEXT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        "registrationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "accountNumber" VARCHAR(50),
        "bankName" VARCHAR(255),
        "branchName" VARCHAR(255),
        "ifscCode" VARCHAR(20),
        signature BYTEA,
        access VARCHAR(20) DEFAULT 'granted' CHECK (access IN ('granted', 'denied'))
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        total_entries INTEGER DEFAULT 500,
        completed_entries INTEGER DEFAULT 0,
        registration_date DATE,
        submission_end_date DATE,
        penalty DECIMAL(10, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES userregistrations(id) ON DELETE CASCADE,
        UNIQUE (user_id)
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS data_entries (
        id SERIAL PRIMARY KEY,
        resume_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        first_name VARCHAR(100),
        middle_name VARCHAR(100),
        last_name VARCHAR(100),
        dob VARCHAR(50),
        gender VARCHAR(20),
        nationality VARCHAR(100),
        marital_status VARCHAR(50),
        passport VARCHAR(100),
        hobbies TEXT,
        languages_known TEXT,
        address TEXT,
        landmark VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        mobile VARCHAR(20),
        email VARCHAR(255),
        ssc_result VARCHAR(50),
        ssc_board VARCHAR(255),
        ssc_passing_year VARCHAR(10),
        ssc_diploma VARCHAR(255),
        hsc_result VARCHAR(50),
        hsc_board VARCHAR(255),
        hsc_passing_year VARCHAR(10),
        hsc_diploma VARCHAR(255),
        graduation_degree VARCHAR(255),
        graduation_year VARCHAR(10),
        graduation_result VARCHAR(50),
        graduation_university VARCHAR(255),
        post_graduation_degree VARCHAR(255),
        post_graduation_year VARCHAR(10),
        post_graduation_result VARCHAR(50),
        post_graduation_university VARCHAR(255),
        higher_education TEXT,
        total_experience_years VARCHAR(10),
        total_experience_months VARCHAR(10),
        total_companies_worked VARCHAR(10),
        last_current_employer VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES userregistrations(id) ON DELETE CASCADE,
        UNIQUE (resume_id, user_id)
      )
    `);

    res.json({ 
      message: "✅ Database tables created successfully!",
      tables: ["admins", "userregistrations", "user_progress", "data_entries"]
    });
  } catch (err) {
    console.error("Database setup error:", err);
    res.status(500).json({ error: "Failed to create tables", details: err.message });
  }
});

// PostgreSQL Connection with environment variables
console.log("🔍 Environment check:");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL (first 50 chars):", process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + "..." : "NOT SET");

const db = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'perfectgoal'}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
db.connect()
  .then(() => {
    console.log("✅ PostgreSQL connected successfully!");
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err);
    console.log("🔍 Connection string being used:", process.env.DATABASE_URL ? "DATABASE_URL" : "fallback localhost");
    process.exit(1);
  });

// ✅ Unified Login Route (replaces both admin-login and user login)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("🔐 Login attempt:", username, password);

  try {
    // 1️⃣ Check admin table first
    const adminQuery = "SELECT id, username, role FROM admins WHERE username = $1 AND password = $2";
    const adminResult = await db.query(adminQuery, [username, password]);

    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];
      return res.json({
        message: "✅ Admin login successful!",
        user: {
          id: admin.id,
          username: admin.username,
          role: "admin",
        },
      });
    }

    // 2️⃣ If not admin, check userregistrations
    const userQuery = `
      SELECT 
        id, username, "fullName", email, address, "contactNumber", "alternateNumber", 
        dob, "accountNumber", "bankName", "branchName", "ifscCode", access 
      FROM userregistrations 
      WHERE username = $1 AND password = $2
    `;

    const userResult = await db.query(userQuery, [username, password]);

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      return res.json({
        message: "✅ User login successful!",
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          address: user.address,
          contactNumber: user.contactNumber,
          alternateNumber: user.alternateNumber,
          dob: user.dob,
          accountNumber: user.accountNumber,
          bankName: user.bankName,
          branchName: user.branchName,
          ifscCode: user.ifscCode,
          access: user.access,
          role: "user",
        },
      });
    }

    return res.status(401).json({ message: "❌ Invalid username or password" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

//Registration API 
app.post("/register", async (req, res) => {
  const { fullName, contactNumber, alternateNumber, email, dob, address, username, password } = req.body;

  try {
    const insertUserQuery = `
      INSERT INTO userregistrations 
      ("fullName", "contactNumber", "alternateNumber", email, dob, address, username, password) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id
    `;

    const result = await db.query(insertUserQuery, [fullName, contactNumber, alternateNumber, email, dob, address, username, password]);
    const newUserId = result.rows[0].id;

    // ✅ Create linked user_progress record (8-day submission window)
    const progressQuery = `
      INSERT INTO user_progress (user_id, registration_date, submission_end_date)
      VALUES ($1, CURRENT_DATE, CURRENT_DATE + INTERVAL '8 days')
    `;

    await db.query(progressQuery, [newUserId]);

    res.json({
      message: "✅ Registration successful!",
      user_id: newUserId,
    });
  } catch (err) {
    console.error("❌ User registration error:", err);
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

// Note: Main /api/user/:user_id endpoint is defined later (includes progress data)

app.post("/api/progress/complete/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  
  try {
    await db.query(
      "UPDATE user_progress SET completed_entries = completed_entries + 1 WHERE user_id = $1",
      [userId]
    );
    res.json({ message: "Progress updated" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Get Resume List Endpoint
app.get("/api/resumes", (req, res) => {
  // Check which resumes actually exist
  const resumesDir = path.join(__dirname, "resumes");
  const existingResumes = [];
  
  // Check for resumes 1-500
  for (let i = 1; i <= 500; i++) {
    const resumePath = path.join(resumesDir, `resume_${i}.pdf`);
    if (fs.existsSync(resumePath)) {
      existingResumes.push({ id: i, exists: true });
    } else {
      existingResumes.push({ id: i, exists: false });
    }
  }
  
  const availableResumes = existingResumes.filter(r => r.exists).map(r => ({ id: r.id }));
  
  res.json({ 
    resumes: availableResumes.length > 0 ? availableResumes : Array.from({ length: 500 }, (_, i) => ({ id: i + 1 })),
    totalAvailable: availableResumes.length,
    resumesDir: resumesDir
  });
});

// ✅ Get Single Resume PDF Endpoint
app.get("/api/resumes/:resumeId/pdf", (req, res) => {
  const resumeId = req.params.resumeId;
  
  const resumePath = path.join(__dirname, "resumes", `resume_${resumeId}.pdf`);
  
  console.log(`📄 Attempting to serve resume ${resumeId} from: ${resumePath}`);
  
  if (!fs.existsSync(resumePath)) {
    console.error(`❌ Resume ${resumeId} not found at: ${resumePath}`);
    return res.status(404).json({ 
      error: `Resume ${resumeId} not found. Please ensure resume_${resumeId}.pdf exists in backend/resumes/ folder.`,
      path: resumePath
    });
  }
  
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="resume_${resumeId}.pdf"`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  
  const fileStream = fs.createReadStream(resumePath);
  
  fileStream.on("error", (err) => {
    console.error(`❌ Error reading resume ${resumeId}:`, err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Error reading PDF file", details: err.message });
    }
  });
  
  fileStream.on("open", () => {
    console.log(`✅ Successfully serving resume ${resumeId}`);
  });
  
  fileStream.pipe(res);
});

// ✅ Data Entry Submission Endpoint
app.post("/api/data-entry", async (req, res) => {
  const {
    resumeId,
    userId,
    firstName,
    middleName,
    lastName,
    dob,
    gender,
    nationality,
    maritalStatus,
    passport,
    hobbies,
    languagesKnown,
    address,
    landmark,
    city,
    state,
    pincode,
    mobile,
    email,
    sscResult,
    sscBoard,
    sscPassingYear,
    sscDiploma,
    hscResult,
    hscBoard,
    hscPassingYear,
    hscDiploma,
    graduationDegree,
    graduationYear,
    graduationResult,
    graduationUniversity,
    postGraduationDegree,
    postGraduationYear,
    postGraduationResult,
    postGraduationUniversity,
    higherEducation,
    totalExperienceYears,
    totalExperienceMonths,
    totalCompaniesWorked,
    lastCurrentEmployer,
  } = req.body;

  // Validate required fields
  console.log("📦 Received data:", { resumeId, userId, firstName, lastName, mobile, email });
  console.log("📦 Full request body:", req.body);
  
  const isValidField = (field) => field && field.trim() !== "" && field.trim() !== "NA";
  
  if (!resumeId || !userId || !isValidField(firstName) || !isValidField(lastName) || !isValidField(mobile) || !isValidField(email)) {
    console.log("❌ Validation failed:", {
      resumeId,
      userId,
      firstName,
      lastName,
      mobile,
      email,
      hasResumeId: !!resumeId,
      hasUserId: !!userId,
      hasFirstName: isValidField(firstName),
      hasLastName: isValidField(lastName),
      hasMobile: isValidField(mobile),
      hasEmail: isValidField(email)
    });
    return res.status(400).json({ 
      error: "Missing required fields",
      details: "Required fields must be filled: firstName, lastName, mobile, email (cannot be empty or 'NA')"
    });
  }

  try {
    // Insert data entry into database
    const query = `
      INSERT INTO data_entries (
        resume_id, user_id, 
        first_name, middle_name, last_name, dob, gender, nationality, marital_status, 
        passport, hobbies, languages_known, address, landmark, city, state, pincode, 
        mobile, email,
        ssc_result, ssc_board, ssc_passing_year, ssc_diploma,
        hsc_result, hsc_board, hsc_passing_year, hsc_diploma,
        graduation_degree, graduation_year, graduation_result, graduation_university,
        post_graduation_degree, post_graduation_year, post_graduation_result, post_graduation_university,
        higher_education,
        total_experience_years, total_experience_months, total_companies_worked, last_current_employer,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, NOW())
      RETURNING id
    `;

    const result = await db.query(query, [
      resumeId, userId,
      firstName || "NA", middleName || "NA", lastName || "NA", dob || "NA", gender || "NA", 
      nationality || "NA", maritalStatus || "NA", passport || "NA", hobbies || "NA", 
      languagesKnown || "NA", address || "NA", landmark || "NA", city || "NA", state || "NA", 
      pincode || "NA", mobile || "NA", email || "NA",
      sscResult || "NA", sscBoard || "NA", sscPassingYear || "NA", sscDiploma || "NA",
      hscResult || "NA", hscBoard || "NA", hscPassingYear || "NA", hscDiploma || "NA",
      graduationDegree || "NA", graduationYear || "NA", graduationResult || "NA", graduationUniversity || "NA",
      postGraduationDegree || "NA", postGraduationYear || "NA", postGraduationResult || "NA", 
      postGraduationUniversity || "NA", higherEducation || "NA",
      totalExperienceYears || "NA", totalExperienceMonths || "NA", totalCompaniesWorked || "NA", 
      lastCurrentEmployer || "NA"
    ]);

    // Update progress
    await db.query(
      "UPDATE user_progress SET completed_entries = completed_entries + 1 WHERE user_id = $1",
      [userId]
    );

    res.json({ 
      message: "Data entry saved successfully", 
      entryId: result.rows[0].id 
    });
  } catch (err) {
    console.error("Data entry error:", err);
    return res.status(500).json({ error: "Failed to save data entry", details: err.message });
  }
});

// ✅ Get Resume Submission Status for User
app.get("/api/resume-status/:user_id", async (req, res) => {
  const userId = req.params.user_id;

  try {
    const query = `
      SELECT resume_id, created_at 
      FROM data_entries 
      WHERE user_id = $1
      ORDER BY resume_id
    `;

    const result = await db.query(query, [userId]);
    const submittedResumes = result.rows.map(row => row.resume_id);
    res.json({ submittedResumes });
  } catch (err) {
    console.error("Error fetching resume status:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// ✅ Get User Progress
app.get("/api/progress/:user_id", async (req, res) => {
  const userId = req.params.user_id;

  try {
    const query = `
      SELECT 
        total_entries,
        completed_entries,
        registration_date,
        submission_end_date,
        penalty
      FROM user_progress 
      WHERE user_id = $1
    `;

    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Progress not found for this user" });
    }

    const progress = result.rows[0];
    res.json({
      totalEntries: progress.total_entries,
      completedEntries: progress.completed_entries,
      pendingEntries: progress.total_entries - progress.completed_entries,
      registrationDate: progress.registration_date,
      submissionEndDate: progress.submission_end_date,
      penalty: progress.penalty
    });
  } catch (err) {
    console.error("Error fetching progress:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/change-password/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  const { oldPassword, newPassword } = req.body;

  try {
    // 1. Check if user exists and old password matches
    const query = "SELECT * FROM userregistrations WHERE id = $1";
    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    console.log("DB password:", JSON.stringify(user.password));
    console.log("Typed old password:", JSON.stringify(oldPassword));

    if (user.password.trim() !== oldPassword.trim()) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // 2. Update password
    const updateQuery = "UPDATE userregistrations SET password = $1 WHERE id = $2";
    await db.query(updateQuery, [newPassword, userId]);

    res.json({ message: "✅ Password changed successfully!" });
  } catch (err) {
    console.error("Password change error:", err);
    return res.status(500).json({ message: "Error updating password", error: err.message });
  }
});

// Update user profile & bank details
app.put("/api/user/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  const { accountNumber = "", bankName = "", branchName = "", ifscCode = "" } = req.body;

  try {
    const query = `
      UPDATE userregistrations
      SET "accountNumber" = $1, "bankName" = $2, "branchName" = $3, "ifscCode" = $4
      WHERE id = $5
    `;

    await db.query(query, [accountNumber, bankName, branchName, ifscCode, userId]);

    // Fetch updated user
    const fetchResult = await db.query("SELECT * FROM userregistrations WHERE id = $1", [userId]);
    res.json({ user: fetchResult.rows[0] });
  } catch (err) {
    console.error("DB update error:", err);
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

// Get all users (Admin panel ke liye)
app.get("/api/users", async (req, res) => {
  try {
    const query = `SELECT id, "fullName", email, username, "contactNumber", address, dob, "registrationDate", "accountNumber", "bankName", "branchName", "ifscCode" FROM userregistrations`;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

// ✅ Get all users with their task progress (for Admin Tasks tab)
app.get("/api/admin/users-progress", async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id,
        u."fullName",
        u.username,
        u.email,
        u."contactNumber",
        u."registrationDate",
        COALESCE(p.total_entries, 500) as total_entries,
        COALESCE(p.completed_entries, 0) as completed_entries,
        p.registration_date,
        p.submission_end_date,
        COALESCE(p.penalty, 0) as penalty,
        CASE 
          WHEN p.total_entries IS NULL OR p.total_entries = 0 THEN 0
          ELSE ROUND((COALESCE(p.completed_entries, 0)::numeric / p.total_entries) * 100, 2)
        END as completion_percentage
      FROM userregistrations u
      LEFT JOIN user_progress p ON u.id = p.user_id
      ORDER BY u."registrationDate" DESC
    `;

    const result = await db.query(query);
    console.log(`✅ Fetched ${result.rows.length} users with progress data`);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching users progress:", err);
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM userregistrations WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// Upload user signature
app.post("/api/upload-signature/:user_id", upload.single("signature"), async (req, res) => {
  const userId = req.params.user_id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No signature uploaded" });
  }

  try {
    const query = "UPDATE userregistrations SET signature = $1 WHERE id = $2";
    await db.query(query, [file.buffer, userId]);
    res.json({ success: true, message: "✅ Signature uploaded successfully!" });
  } catch (err) {
    console.error("Signature save error:", err);
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

// ✅ Route to fetch user's signature as an image
app.get("/api/user-signature/:user_id", async (req, res) => {
  const userId = req.params.user_id;

  try {
    const query = "SELECT signature FROM userregistrations WHERE id = $1";
    const result = await db.query(query, [userId]);

    if (result.rows.length === 0 || !result.rows[0].signature) {
      return res.status(404).json({ message: "No signature found" });
    }

    res.setHeader("Content-Type", "image/png");
    res.send(result.rows[0].signature);
  } catch (err) {
    console.error("Signature fetch error:", err);
    return res.status(500).json({ message: "Database error" });
  }
});

// PUT /api/admin/extend-submission/:user_id
app.put("/api/admin/extend-submission/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { newEndDate } = req.body;

  if (!newEndDate) {
    return res.status(400).json({ message: "⚠️ newEndDate is required" });
  }

  try {
    const updateQuery = "UPDATE user_progress SET submission_end_date = $1 WHERE user_id = $2";
    const result = await db.query(updateQuery, [newEndDate, user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "❌ User not found in progress table" });
    }

    // ✅ Fetch updated info to return to frontend
    const fetchQuery = `
      SELECT u."fullName", u.username, p.registration_date, p.submission_end_date
      FROM userregistrations u
      JOIN user_progress p ON u.id = p.user_id
      WHERE u.id = $1
    `;

    const fetchResult = await db.query(fetchQuery, [user_id]);

    res.json({
      message: "✅ Submission date extended successfully!",
      updatedUser: fetchResult.rows[0],
    });
  } catch (err) {
    console.error("Error updating submission_end_date:", err);
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

app.get("/api/user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const query = `
      SELECT 
        ur.id,
        ur."fullName",
        ur.email,
        ur.username,
        ur."registrationDate",
        ur."contactNumber",
        ur."alternateNumber",
        ur.address,
        ur.dob,
        ur."bankName",
        ur."branchName",
        ur."ifscCode",
        ur."accountNumber",
        up.registration_date AS progress_registration_date,
        up.submission_end_date AS submission_end_date,
        up.completed_entries,
        up.total_entries,
        up.penalty
      FROM userregistrations ur
      LEFT JOIN user_progress up ON ur.id = up.user_id
      WHERE ur.id = $1
    `;

    const result = await db.query(query, [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User data fetched with progress:", result.rows[0]);
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("❌ Database error:", err);
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});