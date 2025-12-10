-- Add new admin user AnkitPatel
-- Run this SQL command in your PostgreSQL database

INSERT INTO admins (username, password, role) 
VALUES ('AnkitPatel', 'ankit@20', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Verify the admin was added
SELECT id, username, role, created_at FROM admins WHERE username = 'AnkitPatel';