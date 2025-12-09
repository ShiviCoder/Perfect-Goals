-- Production Database Setup Script
-- Run this on your Railway/Production MySQL database

-- 1. Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (change password after first login!)
INSERT INTO admins (username, password, role) 
VALUES ('admin', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- 2. Create userregistrations table
CREATE TABLE IF NOT EXISTS userregistrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(255) NOT NULL,
  contactNumber VARCHAR(20),
  alternateNumber VARCHAR(20),
  email VARCHAR(255),
  dob DATE,
  address TEXT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accountNumber VARCHAR(50),
  bankName VARCHAR(255),
  branchName VARCHAR(255),
  ifscCode VARCHAR(20),
  signature LONGBLOB,
  access ENUM('granted', 'denied') DEFAULT 'granted'
);

-- 3. Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_entries INT DEFAULT 500,
  completed_entries INT DEFAULT 0,
  registration_date DATE,
  submission_end_date DATE,
  penalty DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES userregistrations(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_progress (user_id)
);

-- 4. Create data_entries table (comprehensive form data)
CREATE TABLE IF NOT EXISTS data_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resume_id INT NOT NULL,
  user_id INT NOT NULL,
  
  -- Personal Details
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
  
  -- Address Details
  address TEXT,
  landmark VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(20),
  mobile VARCHAR(20),
  email VARCHAR(255),
  
  -- SSC Education
  ssc_result VARCHAR(50),
  ssc_board VARCHAR(255),
  ssc_passing_year VARCHAR(10),
  ssc_diploma VARCHAR(255),
  
  -- HSC Education
  hsc_result VARCHAR(50),
  hsc_board VARCHAR(255),
  hsc_passing_year VARCHAR(10),
  hsc_diploma VARCHAR(255),
  
  -- Graduation
  graduation_degree VARCHAR(255),
  graduation_year VARCHAR(10),
  graduation_result VARCHAR(50),
  graduation_university VARCHAR(255),
  
  -- Post Graduation
  post_graduation_degree VARCHAR(255),
  post_graduation_year VARCHAR(10),
  post_graduation_result VARCHAR(50),
  post_graduation_university VARCHAR(255),
  
  -- Higher Education
  higher_education TEXT,
  
  -- Employment Details
  total_experience_years VARCHAR(10),
  total_experience_months VARCHAR(10),
  total_companies_worked VARCHAR(10),
  last_current_employer VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES userregistrations(id) ON DELETE CASCADE,
  UNIQUE KEY unique_resume_user (resume_id, user_id)
);

-- Verify tables were created
SHOW TABLES;

-- Check table structures
DESCRIBE admins;
DESCRIBE userregistrations;
DESCRIBE user_progress;
DESCRIBE data_entries;

SELECT 'Database setup completed successfully!' AS Status;
