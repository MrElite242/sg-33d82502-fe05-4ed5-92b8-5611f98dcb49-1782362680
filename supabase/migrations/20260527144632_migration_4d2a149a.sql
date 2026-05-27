-- Add business-specific columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_license TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_type TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_phone TEXT;

-- Add comments for business fields
COMMENT ON COLUMN profiles.company_name IS 'Cannabis business company name';
COMMENT ON COLUMN profiles.company_license IS 'Cannabis business license number';
COMMENT ON COLUMN profiles.company_type IS 'Business type: cultivation, manufacturing, testing, retail, transport, vertically-integrated';
COMMENT ON COLUMN profiles.company_address IS 'Business physical address';
COMMENT ON COLUMN profiles.company_phone IS 'Business phone number';