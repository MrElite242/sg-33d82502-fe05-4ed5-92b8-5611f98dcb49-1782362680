-- Canna ID 360™ - National Cannabis User Credential System
-- Privacy-focused credential issuance and verification

-- Credential Status Enum
CREATE TYPE credential_status AS ENUM ('active', 'suspended', 'revoked', 'expired');

-- Canna ID Credentials Table
CREATE TABLE IF NOT EXISTS canna_id_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User Information
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_number VARCHAR(50) UNIQUE NOT NULL, -- Format: CB360-XXXXXXXX
  
  -- Personal Information (Verified)
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(50),
  national_id_number VARCHAR(100) NOT NULL, -- Encrypted/Hashed
  
  -- Jurisdiction & Eligibility
  jurisdiction VARCHAR(100) NOT NULL, -- Country/Region
  region VARCHAR(100), -- State/Province
  eligibility_status BOOLEAN DEFAULT true,
  eligibility_reason TEXT, -- Medical, Adult-Use, etc.
  
  -- Credential Lifecycle
  status credential_status DEFAULT 'active',
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  issued_by UUID REFERENCES auth.users(id), -- Government official
  issuing_authority VARCHAR(255), -- Government agency name
  
  -- Verification
  qr_code_data TEXT, -- Secure QR payload
  verification_token VARCHAR(255) UNIQUE, -- For API verification
  
  -- Audit Trail
  last_verified_at TIMESTAMPTZ,
  verification_count INTEGER DEFAULT 0,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credential Verification Log (Audit Trail)
CREATE TABLE IF NOT EXISTS credential_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_id UUID REFERENCES canna_id_credentials(id) ON DELETE CASCADE,
  verified_by UUID REFERENCES auth.users(id), -- Retailer/Dispensary staff
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  verification_location VARCHAR(255), -- Dispensary name/location
  verification_result BOOLEAN, -- true = eligible, false = not eligible
  verification_method VARCHAR(50), -- 'qr_scan', 'manual', 'api'
  ip_address INET,
  user_agent TEXT
);

-- Indexes for Performance
CREATE INDEX idx_canna_id_user ON canna_id_credentials(user_id);
CREATE INDEX idx_canna_id_credential_number ON canna_id_credentials(credential_number);
CREATE INDEX idx_canna_id_jurisdiction ON canna_id_credentials(jurisdiction);
CREATE INDEX idx_canna_id_status ON canna_id_credentials(status);
CREATE INDEX idx_canna_id_expires ON canna_id_credentials(expires_at);
CREATE INDEX idx_verification_credential ON credential_verifications(credential_id);
CREATE INDEX idx_verification_date ON credential_verifications(verified_at);

-- Updated At Trigger
CREATE OR REPLACE FUNCTION update_canna_id_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_canna_id_updated_at
  BEFORE UPDATE ON canna_id_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_canna_id_updated_at();

-- Row Level Security (RLS)
ALTER TABLE canna_id_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE credential_verifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own credential
CREATE POLICY "users_view_own_credential" ON canna_id_credentials
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Government officials can view all credentials
CREATE POLICY "government_view_all_credentials" ON canna_id_credentials
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('government', 'admin')
    )
  );

-- Policy: Government officials can issue credentials
CREATE POLICY "government_issue_credentials" ON canna_id_credentials
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('government', 'admin')
    )
  );

-- Policy: Government officials can update credentials
CREATE POLICY "government_update_credentials" ON canna_id_credentials
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('government', 'admin')
    )
  );

-- Policy: Retailers can log verifications
CREATE POLICY "retailers_log_verifications" ON credential_verifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('retail', 'dispensary', 'government', 'admin')
    )
  );

-- Policy: Government can view all verifications
CREATE POLICY "government_view_verifications" ON credential_verifications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('government', 'admin')
    )
  );

-- Function: Generate Credential Number
CREATE OR REPLACE FUNCTION generate_credential_number()
RETURNS VARCHAR AS $$
DECLARE
  new_number VARCHAR;
  number_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate format: CB360-XXXXXXXX (8 random alphanumeric characters)
    new_number := 'CB360-' || upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if number already exists
    SELECT EXISTS(SELECT 1 FROM canna_id_credentials WHERE credential_number = new_number) INTO number_exists;
    
    -- Exit loop if unique
    EXIT WHEN NOT number_exists;
  END LOOP;
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function: Check Age Eligibility (21+)
CREATE OR REPLACE FUNCTION check_age_eligibility(dob DATE)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (CURRENT_DATE - dob) >= INTERVAL '21 years';
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE canna_id_credentials IS 'Canna ID 360™ - National cannabis user credentials with privacy-preserving verification';
COMMENT ON TABLE credential_verifications IS 'Audit trail for all credential verification attempts';
COMMENT ON COLUMN canna_id_credentials.qr_code_data IS 'Encrypted QR code payload containing verification token only';
COMMENT ON COLUMN canna_id_credentials.verification_token IS 'Unique token for API-based verification - returns only eligibility status';