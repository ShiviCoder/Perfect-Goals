import express from "express";
import mysql from "mysql2";
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

// MySQL Connection with environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "perfectgoal"
});

// Connect to database with error handling
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    process.exit(1);
  }
  console.log("✅ MySQL connected successfully!");
});


// ✅ Unified Login Route (replaces both admin-login and user login)
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("🔐 Login attempt:", username, password);

  // 1️⃣ Check admin table first
  const adminQuery = "SELECT id, username, role FROM admins WHERE username = ? AND password = ?";
  db.query(adminQuery, [username, password], (adminErr, adminResult) => {
    if (adminErr) return res.status(500).json({ message: "Database error", error: adminErr });

    if (adminResult.length > 0) {
      const admin = adminResult[0];
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
        id, username, fullName, email, address, contactNumber, alternateNumber, 
        dob, accountNumber, bankName, branchName, ifscCode, access 
      FROM userregistrations 
      WHERE username = ? AND password = ?
    `;

    db.query(userQuery, [username, password], (userErr, userResult) => {
      if (userErr) return res.status(500).json({ message: "Database error", error: userErr });

      if (userResult.length > 0) {
        const user = userResult[0];
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
    });
  });
});


//Registration API 
app.post("/register", (req, res) => {
  const { fullName, contactNumber, alternateNumber, email, dob, address, username, password } = req.body;

  const insertUserQuery = `
    INSERT INTO userregistrations 
    (fullName, contactNumber, alternateNumber, email, dob, address, username, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertUserQuery, [fullName, contactNumber, alternateNumber, email, dob, address, username, password], (err, result) => {
    if (err) {
      console.error("❌ User registration error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    const newUserId = result.insertId;

    // ✅ Create linked user_progress record (8-day submission window)
    const progressQuery = `
      INSERT INTO user_progress (user_id, registration_date, submission_end_date)
      VALUES (?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 8 DAY))
    `;

    db.query(progressQuery, [newUserId], (err2) => {
      if (err2) {
        console.error("⚠️ Error creating progress row:", err2);
        return res.status(500).json({ message: "User created but progress row failed", error: err2 });
      }

      res.json({
        message: "✅ Registration successful!",
        user_id: newUserId,
      });
    });
  });
});

// Note: Main /api/user/:user_id endpoint is defined later (includes progress data)

app.post("/api/progress/complete/:user_id", (req, res) => {
  const userId = req.params.user_id;
  db.query(
    "UPDATE user_progress SET completed_entries = completed_entries + 1 WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Progress updated" });
    }
  );
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
  
  // Path to resume PDF file
  // Resumes should be named: resume_1.pdf, resume_2.pdf, ..., resume_500.pdf
  // Place them in: backend/resumes/ folder
  const resumePath = path.join(__dirname, "resumes", `resume_${resumeId}.pdf`);
  
  console.log(`📄 Attempting to serve resume ${resumeId} from: ${resumePath}`);
  
  // Check if file exists
  if (!fs.existsSync(resumePath)) {
    console.error(`❌ Resume ${resumeId} not found at: ${resumePath}`);
    return res.status(404).json({ 
      error: `Resume ${resumeId} not found. Please ensure resume_${resumeId}.pdf exists in backend/resumes/ folder.`,
      path: resumePath
    });
  }
  
  // Set headers for PDF with CORS
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="resume_${resumeId}.pdf"`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  
  // Send the PDF file with error handling
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
app.post("/api/data-entry", (req, res) => {
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
  
  // Check if required fields exist and are not empty strings or "NA"
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    query,
    [
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
    ],
    (err, result) => {
      if (err) {
        console.error("Data entry error:", err);
        return res.status(500).json({ error: "Failed to save data entry", details: err.message });
      }

      // Update progress
      db.query(
        "UPDATE user_progress SET completed_entries = completed_entries + 1 WHERE user_id = ?",
        [userId],
        (updateErr) => {
          if (updateErr) {
            console.error("Progress update error:", updateErr);
          }
        }
      );

      res.json({ 
        message: "Data entry saved successfully", 
        entryId: result.insertId 
      });
    }
  );
});

// ✅ Get Resume Submission Status for User
app.get("/api/resume-status/:user_id", (req, res) => {
  const userId = req.params.user_id;

  const query = `
    SELECT resume_id, created_at 
    FROM data_entries 
    WHERE user_id = ?
    ORDER BY resume_id
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching resume status:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Return array of submitted resume IDs
    const submittedResumes = results.map(row => row.resume_id);
    res.json({ submittedResumes });
  });
});

// ✅ Get User Progress
app.get("/api/progress/:user_id", (req, res) => {
  const userId = req.params.user_id;

  const query = `
    SELECT 
      total_entries,
      completed_entries,
      registration_date,
      submission_end_date,
      penalty
    FROM user_progress 
    WHERE user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching progress:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Progress not found for this user" });
    }

    const progress = results[0];
    res.json({
      totalEntries: progress.total_entries,
      completedEntries: progress.completed_entries,
      pendingEntries: progress.total_entries - progress.completed_entries,
      registrationDate: progress.registration_date,
      submissionEndDate: progress.submission_end_date,
      penalty: progress.penalty
    });
  });
});

app.post("/api/change-password/:user_id", (req, res) => {
  const userId = req.params.user_id;          // Get user ID from URL
  const { oldPassword, newPassword } = req.body;

  // 1. Check if user exists and old password matches
  const query = "SELECT * FROM userregistrations WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    console.log("DB password:", JSON.stringify(user.password));
    console.log("Typed old password:", JSON.stringify(oldPassword));

    if (user.password.trim() !== oldPassword.trim()) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // 2. Update password
    const updateQuery = "UPDATE userregistrations SET password = ? WHERE id = ?";
    db.query(updateQuery, [newPassword, userId], (updateErr) => {
      if (updateErr) return res.status(500).json({ message: "Error updating password", error: updateErr });

      res.json({ message: "✅ Password changed successfully!" });
    });
  });
});
// Update user profile & bank details
app.put("/api/user/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const { accountNumber = "", bankName = "", branchName = "", ifscCode = "" } = req.body; // default to empty string

  const query = `
    UPDATE userregistrations
    SET accountNumber = ?, bankName = ?, branchName = ?, ifscCode = ?
    WHERE id = ?
  `;

  db.query(query, [accountNumber, bankName, branchName, ifscCode, userId], (err, result) => {
    if (err) {
      console.error("DB update error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    // Fetch updated user
    db.query("SELECT * FROM userregistrations WHERE id = ?", [userId], (err2, results) => {
      if (err2) return res.status(500).json({ message: "Database error", error: err2 });
      res.json({ user: results[0] }); // consistent format
    });
  });
});

// Get all users (Admin panel ke liye)
app.get("/api/users", (req, res) => {
  const query = "SELECT id, fullName, email, username, contactNumber, address, dob, registrationDate, accountNumber, bankName, branchName, ifscCode FROM userregistrations";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json(results);
  });
});

// ✅ Get all users with their task progress (for Admin Tasks tab)
app.get("/api/admin/users-progress", (req, res) => {
  const query = `
    SELECT 
      u.id,
      u.fullName,
      u.username,
      u.email,
      u.contactNumber,
      u.registrationDate,
      COALESCE(p.total_entries, 500) as total_entries,
      COALESCE(p.completed_entries, 0) as completed_entries,
      p.registration_date,
      p.submission_end_date,
      COALESCE(p.penalty, 0) as penalty,
      CASE 
        WHEN p.total_entries IS NULL OR p.total_entries = 0 THEN 0
        ELSE ROUND((COALESCE(p.completed_entries, 0) / p.total_entries) * 100, 2)
      END as completion_percentage
    FROM userregistrations u
    LEFT JOIN user_progress p ON u.id = p.user_id
    ORDER BY u.registrationDate DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching users progress:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    console.log(`✅ Fetched ${results.length} users with progress data`);
    res.json(results);
  });
});


app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  // ✅ Correct table name
  db.query("DELETE FROM userregistrations WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  });
});

// Upload user signature
app.post("/api/upload-signature/:user_id", upload.single("signature"), (req, res) => {
  const userId = req.params.user_id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No signature uploaded" });
  }

  const query = "UPDATE userregistrations SET signature = ? WHERE id = ?";
  db.query(query, [file.buffer, userId], (err) => {
    if (err) {
      console.error("Signature save error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({ success: true, message: "✅ Signature uploaded successfully!" });
  });
});

// ✅ Route to fetch user's signature as an image
app.get("/api/user-signature/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const query = "SELECT signature FROM userregistrations WHERE id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Signature fetch error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0 || !results[0].signature) {
      return res.status(404).json({ message: "No signature found" });
    }

    res.setHeader("Content-Type", "image/png");
    res.send(results[0].signature);
  });
});


// PUT /api/admin/extend-submission/:user_id
app.put("/api/admin/extend-submission/:user_id", (req, res) => {
  const { user_id } = req.params;
  const { newEndDate } = req.body;

  if (!newEndDate) {
    return res.status(400).json({ message: "⚠️ newEndDate is required" });
  }

  const updateQuery = "UPDATE user_progress SET submission_end_date = ? WHERE user_id = ?";

  db.query(updateQuery, [newEndDate, user_id], (err, result) => {
    if (err) {
      console.error("Error updating submission_end_date:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "❌ User not found in progress table" });
    }

    // ✅ Fetch updated info to return to frontend
    const fetchQuery = `
      SELECT u.fullName, u.username, p.registration_date, p.submission_end_date
      FROM userregistrations u
      JOIN user_progress p ON u.id = p.user_id
      WHERE u.id = ?
    `;

    db.query(fetchQuery, [user_id], (err2, rows) => {
      if (err2) {
        console.error("Error fetching updated user:", err2);
        return res.status(500).json({ message: "Error fetching updated data", error: err2 });
      }

      res.json({
        message: "✅ Submission date extended successfully!",
        updatedUser: rows[0],
      });
    });
  });
});

app.get("/api/user/:user_id", (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT 
      ur.id,
      ur.fullName,
      ur.email,
      ur.username,
      ur.registrationDate,
      ur.contactNumber,
      ur.alternateNumber,
      ur.address,
      ur.dob,
      ur.bankName,
      ur.branchName,
      ur.ifscCode,
      ur.accountNumber,
      up.registration_date AS progress_registration_date,
      up.submission_end_date AS submission_end_date,
      up.completed_entries,
      up.total_entries,
      up.penalty
    FROM userregistrations ur
    LEFT JOIN user_progress up ON ur.id = up.user_id
    WHERE ur.id = ?
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User data fetched with progress:", result[0]);
    res.json({ user: result[0] });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});