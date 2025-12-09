-- Create comprehensive data_entries table for resume data
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
  
  UNIQUE KEY unique_resume_user (resume_id, user_id),
  INDEX idx_user_id (user_id),
  INDEX idx_resume_id (resume_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
