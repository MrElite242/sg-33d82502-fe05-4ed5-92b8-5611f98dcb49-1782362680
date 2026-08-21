-- Canna ID 360™ - Audit Log for Credential Status Changes
-- Tracks all status changes, revocations, suspensions, and reactivations

CREATE TABLE IF NOT EXISTS canna_id_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_id UUID NOT NULL REFERENCES canna_id_credentials(id) ON DELETE CASCADE,
  credential_number TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('issued', 'verified', 'suspended', 'revoked', 'reactivated', 'expired')),
  previous_status TEXT,
  new_status TEXT,
  action_by TEXT NOT NULL, -- Email or ID of official who performed action
  action_reason TEXT,
  verification_location TEXT, -- For 'verified' actions - retailer location
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast credential lookups
CREATE INDEX idx_canna_id_audit_credential ON canna_id_audit_logs(credential_id);
CREATE INDEX idx_canna_id_audit_number ON canna_id_audit_logs(credential_number);
CREATE INDEX idx_canna_id_audit_action ON canna_id_audit_logs(action_type);
CREATE INDEX idx_canna_id_audit_date ON canna_id_audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE canna_id_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only government officials can view audit logs
CREATE POLICY "Government officials can view audit logs"
  ON canna_id_audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_role IN ('government', 'admin')
    )
  );

-- Policy: System can insert audit logs (for API usage)
CREATE POLICY "System can insert audit logs"
  ON canna_id_audit_logs
  FOR INSERT
  WITH CHECK (true);

-- Function to automatically log credential status changes
CREATE OR REPLACE FUNCTION log_credential_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if status actually changed
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO canna_id_audit_logs (
      credential_id,
      credential_number,
      action_type,
      previous_status,
      new_status,
      action_by,
      action_reason
    ) VALUES (
      NEW.id,
      NEW.credential_number,
      CASE NEW.status
        WHEN 'suspended' THEN 'suspended'
        WHEN 'revoked' THEN 'revoked'
        WHEN 'active' THEN 'reactivated'
        WHEN 'expired' THEN 'expired'
        ELSE 'updated'
      END,
      OLD.status,
      NEW.status,
      COALESCE(current_setting('app.current_user_email', true), 'system'),
      COALESCE(NEW.notes, 'Status change')
    );
  -- Log initial issuance
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO canna_id_audit_logs (
      credential_id,
      credential_number,
      action_type,
      new_status,
      action_by
    ) VALUES (
      NEW.id,
      NEW.credential_number,
      'issued',
      NEW.status,
      NEW.issuing_authority
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic audit logging
CREATE TRIGGER trigger_log_credential_status
  AFTER INSERT OR UPDATE ON canna_id_credentials
  FOR EACH ROW
  EXECUTE FUNCTION log_credential_status_change();

COMMENT ON TABLE canna_id_audit_logs IS 'Audit trail for all Canna ID 360™ credential actions and status changes';
COMMENT ON COLUMN canna_id_audit_logs.action_type IS 'Type of action: issued, verified, suspended, revoked, reactivated, expired';
COMMENT ON COLUMN canna_id_audit_logs.action_by IS 'Email or user ID of official who performed the action';