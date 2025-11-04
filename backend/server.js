import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
const upload = multer();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173", // React app ka URL
}));

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});
// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shivani@2003",
  database: "perfectgoal"
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

      // 3️⃣ Invalid credentials
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

// Get user by ID
app.get("/api/user/:user_id", (req, res) => {
  const userId = req.params.user_id;

  db.query(
    "SELECT id, fullName, contactNumber, alternateNumber, email, dob, address, username, registrationDate, accountNumber, bankName, branchName, ifscCode FROM userregistrations WHERE id = ?",

    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      if (results.length === 0) return res.status(404).json({ message: "User not found" });

      const user = results[0];
      res.json({ user });
    }
  );
});

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
app.listen(5000, () => console.log("Server running on port 5000"));