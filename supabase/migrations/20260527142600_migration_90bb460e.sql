-- Add user_role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_role TEXT CHECK (user_role IN ('doctor', 'pharmacy', 'patient', 'admin'));

-- Add role-specific fields
-- Doctor fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medical_license TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS npi_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dea_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signature_data TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS practice_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS practice_address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS practice_phone TEXT;

-- Pharmacy fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pharmacy_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pharmacy_license TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pharmacy_address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pharmacy_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pharmacy_hours TEXT;

-- Patient fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medical_conditions TEXT[];

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON profiles(user_role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Simple RLS policies without recursion
-- Drop existing policies
DROP POLICY IF EXISTS "select_own" ON profiles;
DROP POLICY IF EXISTS "insert_own" ON profiles;
DROP POLICY IF EXISTS "update_own" ON profiles;

-- Users can only see and manage their own profile
CREATE POLICY "select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

COMMENT ON COLUMN profiles.user_role IS 'User role: doctor, pharmacy, patient, or admin';