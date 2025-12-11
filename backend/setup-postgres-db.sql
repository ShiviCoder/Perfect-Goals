-- PostgreSQL Database Setup Script
-- Run this on your Render PostgreSQL database

-- 1. Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (change password after first login!)
INSERT INTO admins (username, password, role) 
VALUES ('admin', 'admin123', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 2. Create userregistrations table
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
  access VARCHAR(20) DEFAULT 'granted' CHECK (access IN ('granted', 'denied')),
  signature_status VARCHAR(20) DEFAULT 'pending' CHECK (signature_status IN ('pending', 'approved', 'rejected')),
  signature_uploaded_at TIMESTAMP,
  signature_approved_at TIMESTAMP
);

-- 3. Create user_progress table
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
);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Create data_entries table (comprehensive form data)
CREATE TABLE IF NOT EXISTS data_entries (
  id SERIAL PRIMARY KEY,
  resume_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  
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
  UNIQUE (resume_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_userregistrations_username ON userregistrations(username);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_data_entries_user_id ON data_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_data_entries_resume_id ON data_entries(resume_id);

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check table structures
\d admins;
\d userregistrations;
\d user_progress;
\d data_entries;

SELECT 'PostgreSQL database setup completed successfully!' AS status;