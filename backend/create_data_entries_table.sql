-- Create data_entries table for storing resume data entry submissions
CREATE TABLE IF NOT EXISTS data_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resume_id INT NOT NULL,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT 'NA',
  experience VARCHAR(100) DEFAULT 'NA',
  skills TEXT DEFAULT 'NA',
  education VARCHAR(255) DEFAULT 'NA',
  current_company VARCHAR(255) DEFAULT 'NA',
  current_position VARCHAR(255) DEFAULT 'NA',
  expected_salary VARCHAR(100) DEFAULT 'NA',
  location VARCHAR(255) DEFAULT 'NA',
  notice_period VARCHAR(50) DEFAULT 'NA',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES userregistrations(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_resume_id (resume_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


