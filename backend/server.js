// Perfect Your Goals Backend Server - Full Updated Version

import express from "express";
import pkg from "pg";
const { Pool } = pkg;

import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// ======================
// __dirname for ES Modules
// ======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// Load .env
// ======================
dotenv.config({ path: path.join(__dirname, ".env") });

// ======================
// Express App
// ======================
const app = express();
const upload = multer();

// ======================
// Middleware
// ======================
app.use(
  cors({
    origin: [
      "https://perfect-goals.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ======================
// Root Routes
// ======================
app.get("/", (req, res) => {
  res.send("✅ Perfect Goals Backend is Running!");
});

app.get("/ping", (req, res) => {
  res.json({
    message: "pong",
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ======================
// PostgreSQL Connection
// ======================
console.log("🔍 Environment Check");
console.log("DATABASE_URL Exists:", !!process.env.DATABASE_URL);

const poolConfig = process.env.DATABASE_URL
  ? {
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  }
  : {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "perfectgoal",
    password: process.env.DB_PASSWORD || "",
    port: Number(process.env.DB_PORT || 5432),
  };

const db = new Pool(poolConfig);

// ======================
// DB Connection Test
// ======================
db.connect()
  .then(() => {
    console.log("✅ PostgreSQL Connected Successfully!");
  })
  .catch((err) => {
    console.error("❌ PostgreSQL Connection Failed:", err.message);
  });

// ======================
// SETUP DATABASE
// ======================
app.get("/setup-database", async (req, res) => {
  try {

    // ======================
    // ADMINS TABLE
    // ======================
    await db.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ======================
    // USERS TABLE
    // ======================
    await db.query(`
      CREATE TABLE IF NOT EXISTS userregistrations (
        id SERIAL PRIMARY KEY,

        "fullName" VARCHAR(255) NOT NULL,
        "contactNumber" VARCHAR(20),
        "alternateNumber" VARCHAR(20),

        email VARCHAR(255),

        dob DATE,
        address TEXT,

        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,

        "registrationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        "accountNumber" VARCHAR(100),
        "bankName" VARCHAR(255),
        "branchName" VARCHAR(255),
        "ifscCode" VARCHAR(50),

        signature BYTEA,

        access VARCHAR(20) DEFAULT 'granted'
          CHECK (access IN ('granted', 'denied')),

        signature_status VARCHAR(20) DEFAULT 'pending'
          CHECK (
            signature_status IN (
              'pending',
              'approved',
              'rejected',
              'not_signed'
            )
          ),

        signature_uploaded_at TIMESTAMP,
        signature_approved_at TIMESTAMP
      )
    `);

    // ======================
    // USER PROGRESS TABLE
    // ======================
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,

        user_id INTEGER UNIQUE NOT NULL,

        total_entries INTEGER DEFAULT 500,
        completed_entries INTEGER DEFAULT 0,

        registration_date DATE,
        submission_end_date DATE,

        penalty DECIMAL(10,2) DEFAULT 0.00,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
        REFERENCES userregistrations(id)
        ON DELETE CASCADE
      )
    `);

    // ======================
    // DATA ENTRIES TABLE
    // ======================
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
        ssc_passing_year VARCHAR(20),
        ssc_diploma VARCHAR(255),

        hsc_result VARCHAR(50),
        hsc_board VARCHAR(255),
        hsc_passing_year VARCHAR(20),
        hsc_diploma VARCHAR(255),

        graduation_degree VARCHAR(255),
        graduation_year VARCHAR(20),
        graduation_result VARCHAR(50),
        graduation_university VARCHAR(255),

        post_graduation_degree VARCHAR(255),
        post_graduation_year VARCHAR(20),
        post_graduation_result VARCHAR(50),
        post_graduation_university VARCHAR(255),

        higher_education TEXT,

        total_experience_years VARCHAR(10),
        total_experience_months VARCHAR(10),
        total_companies_worked VARCHAR(10),

        last_current_employer VARCHAR(255),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
        REFERENCES userregistrations(id)
        ON DELETE CASCADE,

        UNIQUE (resume_id, user_id)
      )
    `);

    // ======================
    // DEFAULT ADMINS
    // ======================
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

    res.json({
      success: true,
      message: "✅ Database Setup Completed Successfully!",
    });

  } catch (err) {

    console.error("❌ Setup Database Error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ======================
// REGISTER
// ======================
app.post("/register", async (req, res) => {

  const {
    fullName,
    contactNumber,
    alternateNumber,
    email,
    dob,
    address,
    username,
    password,
  } = req.body;

  try {

    // CHECK USER EXISTS
    const existingUser = await db.query(
      `SELECT id FROM userregistrations WHERE username = $1`,
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username Already Exists",
      });
    }

    const result = await db.query(
      `
      INSERT INTO userregistrations (
        "fullName",
        "contactNumber",
        "alternateNumber",
        email,
        dob,
        address,
        username,
        password
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id
      `,
      [
        fullName,
        contactNumber,
        alternateNumber,
        email,
        dob,
        address,
        username,
        password,
      ]
    );

    const userId = result.rows[0].id;

    // CREATE USER PROGRESS
    await db.query(
      `
      INSERT INTO user_progress (
        user_id,
        registration_date,
        submission_end_date
      )
      VALUES (
        $1,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '8 days'
      )
      `,
      [userId]
    );

    res.json({
      success: true,
      message: "✅ Registration Successful",
      user_id: userId,
    });

  } catch (err) {

    console.error("❌ Registration Error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ======================
// LOGIN
// ======================
app.post("/login", async (req, res) => {

  const { username, password } = req.body;

  try {

    // ADMIN LOGIN
    const adminResult = await db.query(
      `
      SELECT id, username, role
      FROM admins
      WHERE username = $1
      AND password = $2
      `,
      [username, password]
    );

    if (adminResult.rows.length > 0) {

      return res.json({
        success: true,
        message: "✅ Admin Login Successful",
        user: adminResult.rows[0],
      });
    }

    // USER LOGIN
    const userResult = await db.query(
      `
      SELECT *
      FROM userregistrations
      WHERE username = $1
      AND password = $2
      `,
      [username, password]
    );

    if (userResult.rows.length > 0) {

      return res.json({
        success: true,
        message: "✅ User Login Successful",
        user: {
          ...userResult.rows[0],
          role: "user",
        },
      });
    }

    res.status(401).json({
      success: false,
      message: "❌ Invalid Username or Password",
    });

  } catch (err) {

    console.error("❌ Login Error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ======================
// GET ALL USERS
// ======================
app.get("/api/users", async (req, res) => {

  try {

    const result = await db.query(`
      SELECT *
      FROM userregistrations
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ======================
// GET SINGLE USER
// ======================
app.get("/api/user/:id", async (req, res) => {

  try {

    const result = await db.query(
      `SELECT * FROM userregistrations WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ======================
// DELETE USER
// ======================
app.delete("/api/users/:id", async (req, res) => {

  try {

    const result = await db.query(
      `DELETE FROM userregistrations WHERE id = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.json({
      success: true,
      message: "✅ User Deleted Successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ======================
// UPLOAD SIGNATURE
// ======================
app.post(
  "/api/upload-signature/:user_id",
  upload.single("signature"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          message: "No Signature Uploaded",
        });
      }

      await db.query(
        `
        UPDATE userregistrations
        SET
          signature = $1,
          signature_status = 'pending',
          signature_uploaded_at = CURRENT_TIMESTAMP
        WHERE id = $2
        `,
        [req.file.buffer, req.params.user_id]
      );

      res.json({
        success: true,
        message: "✅ Signature Uploaded Successfully",
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ======================
// GET SIGNATURE STATUS
// ======================
app.get("/api/signature-status/:user_id", async (req, res) => {

  try {

    const result = await db.query(
      `
      SELECT
        signature_status,
        signature_uploaded_at,
        signature_approved_at
      FROM userregistrations
      WHERE id = $1
      `,
      [req.params.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ======================
// APPROVE / REJECT SIGNATURE
// ======================
app.put("/api/admin/signature-approval/:user_id", async (req, res) => {

  const { action } = req.body;

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({
      message: "Invalid Action",
    });
  }

  try {

    const status =
      action === "approve"
        ? "approved"
        : "rejected";

    await db.query(
      `
      UPDATE userregistrations
      SET
        signature_status = $1,
        signature_approved_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [status, req.params.user_id]
    );

    res.json({
      success: true,
      message: `✅ Signature ${action}d Successfully`,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ======================
// GET ALL SIGNATURES
// ======================
app.get("/api/admin/signatures", async (req, res) => {

  try {

    const result = await db.query(`
      SELECT
        id,
        "fullName",
        username,
        signature_status,
        signature_uploaded_at,
        signature_approved_at,
        CASE
          WHEN signature IS NOT NULL
          THEN true
          ELSE false
        END AS has_signature
      FROM userregistrations
      ORDER BY signature_uploaded_at DESC
    `);

    res.json({
      signatures: result.rows,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ======================
// GET SIGNATURE IMAGE
// ======================
app.get("/api/user-signature/:user_id", async (req, res) => {

  try {

    const result = await db.query(
      `
      SELECT signature
      FROM userregistrations
      WHERE id = $1
      `,
      [req.params.user_id]
    );

    if (
      result.rows.length === 0 ||
      !result.rows[0].signature
    ) {
      return res.status(404).json({
        message: "Signature Not Found",
      });
    }

    res.setHeader("Content-Type", "image/png");

    res.send(result.rows[0].signature);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ======================
// ADD ADMIN
// ======================
app.post("/add-admin", async (req, res) => {

  const { username, password } = req.body;

  try {

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and Password required",
      });
    }

    const existingAdmin = await db.query(
      `SELECT id FROM admins WHERE username = $1`,
      [username]
    );

    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    await db.query(
      `
      INSERT INTO admins (username, password, role)
      VALUES ($1, $2, 'admin')
      `,
      [username, password]
    );

    res.json({
      success: true,
      message: "✅ Admin Added Successfully",
    });

  } catch (err) {

    console.error("❌ Add Admin Error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

  console.log(`🚀 Server Running On Port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);

});