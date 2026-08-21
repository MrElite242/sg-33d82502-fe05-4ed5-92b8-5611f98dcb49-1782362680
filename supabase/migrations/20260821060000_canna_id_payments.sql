-- Canna ID 360™ - Payment System for Permits
-- Locals: $5.00 for 30-day permit
-- Tourists: $10.00 for 30-day permit

-- Add payment fields to canna_id_credentials table
ALTER TABLE canna_id_credentials 
ADD COLUMN IF NOT EXISTS permit_type VARCHAR(20) DEFAULT 'local',
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS payment_currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS permit_duration_days INTEGER DEFAULT 30;

-- Add check constraints
ALTER TABLE canna_id_credentials
ADD CONSTRAINT check_permit_type CHECK (permit_type IN ('local', 'tourist')),
ADD CONSTRAINT check_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'waived'));

-- Add comments
COMMENT ON COLUMN canna_id_credentials.permit_type IS 'Type of permit: local ($5/30 days) or tourist ($10/30 days)';
COMMENT ON COLUMN canna_id_credentials.payment_status IS 'Payment status: pending, paid, failed, refunded, or waived (for government issued)';
COMMENT ON COLUMN canna_id_credentials.payment_amount IS 'Amount paid for the permit in USD';
COMMENT ON COLUMN canna_id_credentials.payment_currency IS 'Currency code (USD)';
COMMENT ON COLUMN canna_id_credentials.stripe_payment_intent_id IS 'Stripe payment intent ID for payment tracking';
COMMENT ON COLUMN canna_id_credentials.permit_duration_days IS 'Duration of permit in days (default 30)';

-- Create payment records table for tracking all payments
CREATE TABLE IF NOT EXISTS canna_id_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_id UUID NOT NULL REFERENCES canna_id_credentials(id) ON DELETE CASCADE,
  credential_number VARCHAR(20) NOT NULL,
  permit_type VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_charge_id VARCHAR(255),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  jurisdiction VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_canna_id_payments_credential_id ON canna_id_payments(credential_id);
CREATE INDEX idx_canna_id_payments_stripe_payment_intent ON canna_id_payments(stripe_payment_intent_id);
CREATE INDEX idx_canna_id_payments_status ON canna_id_payments(payment_status);
CREATE INDEX idx_canna_id_payments_created_at ON canna_id_payments(created_at DESC);

-- Add comments
COMMENT ON TABLE canna_id_payments IS 'Payment records for Canna ID 360™ permits';
COMMENT ON COLUMN canna_id_payments.permit_type IS 'local ($5) or tourist ($10)';
COMMENT ON COLUMN canna_id_payments.amount IS 'Payment amount in USD';

-- Enable RLS
ALTER TABLE canna_id_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for canna_id_payments
CREATE POLICY "Government officials can view all payments"
  ON canna_id_payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email LIKE '%@government.%'
    )
    OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'government_official')
    )
  );

CREATE POLICY "System can insert payment records"
  ON canna_id_payments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update payment records"
  ON canna_id_payments
  FOR UPDATE
  USING (true);