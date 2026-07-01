-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  price_monthly numeric NOT NULL,
  price_annual numeric NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('general', 'doctor')),
  popular boolean DEFAULT false,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  max_users integer,
  max_locations integer,
  storage_gb integer,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES subscription_plans(id),
  billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  status text NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')) DEFAULT 'trial',
  trial_ends_at timestamp with time zone,
  current_period_start timestamp with time zone NOT NULL DEFAULT now(),
  current_period_end timestamp with time zone NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for subscription_plans (public read)
CREATE POLICY "public_read_plans" ON subscription_plans
  FOR SELECT USING (active = true);

-- Policies for user_subscriptions (users can only see their own)
CREATE POLICY "select_own_subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert_own_subscription" ON user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_subscription" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscription_plans_plan_id ON subscription_plans(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_type ON subscription_plans(plan_type);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- Insert general plans from config
INSERT INTO subscription_plans (plan_id, name, description, price_monthly, price_annual, plan_type, popular, features, max_users, max_locations, storage_gb)
VALUES 
  ('starter', 'Starter', 'Perfect for small operations just getting started', 99, 950, 'general', false, 
   '["Basic cultivation tracking", "Up to 5 strains", "Simple inventory management", "Basic compliance reports", "Email support", "1 location", "10GB storage"]'::jsonb, 
   3, 1, 10),
  ('professional', 'Professional', 'For growing businesses that need advanced features', 249, 2390, 'general', true,
   '["Advanced cultivation tracking", "Unlimited strains", "Full inventory management", "Manufacturing tracking", "Testing lab integration", "Advanced compliance & reporting", "Priority support", "Up to 5 locations", "100GB storage", "API access"]'::jsonb,
   10, 5, 100),
  ('enterprise', 'Enterprise', 'Complete solution for large-scale operations', 549, 5270, 'general', false,
   '["Everything in Professional", "Unlimited locations", "White-label options", "Custom integrations", "Dedicated account manager", "24/7 phone support", "Advanced analytics & BI", "Multi-state compliance", "Unlimited storage", "Custom training"]'::jsonb,
   NULL, NULL, NULL);

-- Insert doctor plans from config
INSERT INTO subscription_plans (plan_id, name, description, price_monthly, price_annual, plan_type, popular, features, max_users, max_locations, storage_gb)
VALUES 
  ('doctor-starter', 'Starter', 'Essential tools for individual practitioners', 149, 1430, 'doctor', false,
   '["Up to 50 patients", "Basic prescription management", "HIPAA-compliant storage", "Email support", "5GB storage"]'::jsonb,
   1, 1, 5),
  ('doctor-professional', 'Professional', 'Advanced features for growing practices', 299, 2870, 'doctor', true,
   '["Up to 200 patients", "Advanced prescription tracking", "Telehealth integration", "Patient portal", "Priority support", "25GB storage", "Analytics dashboard"]'::jsonb,
   5, 3, 25),
  ('doctor-enterprise', 'Enterprise', 'Complete solution for large practices', 649, 6230, 'doctor', false,
   '["Unlimited patients", "Multi-provider support", "Custom workflows", "API access", "Dedicated support", "Unlimited storage", "Advanced reporting"]'::jsonb,
   NULL, NULL, NULL);