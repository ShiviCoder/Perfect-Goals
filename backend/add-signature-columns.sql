-- Add signature approval columns to userregistrations table
ALTER TABLE userregistrations 
ADD COLUMN IF NOT EXISTS signature_status VARCHAR(20) DEFAULT 'pending' CHECK (signature_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS signature_uploaded_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS signature_approved_at TIMESTAMP;

-- Update existing users without signature to have 'not_signed' status
UPDATE userregistrations 
SET signature_status = 'not_signed' 
WHERE signature IS NULL AND signature_status = 'pending';

-- Show updated table structure
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'userregistrations' 
ORDER BY ordinal_position;