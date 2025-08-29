/*
  Lead Import System Migration
  
  This migration adds tables and functions for automated lead import
  from advertising platforms with balance management.
*/

-- ========================================
-- LEAD IMPORT CONFIGURATIONS
-- ========================================

CREATE TABLE IF NOT EXISTS lead_import_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_source text NOT NULL CHECK (campaign_source IN ('facebook', 'google', 'linkedin', 'twitter', 'custom')),
  campaign_id text NOT NULL,
  campaign_name text NOT NULL,
  webhook_url text NOT NULL,
  api_credentials jsonb DEFAULT '{}',
  lead_mapping jsonb DEFAULT '{}',
  pricing jsonb NOT NULL DEFAULT '{}',
  filters jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, campaign_source, campaign_id)
);

-- Enable RLS
ALTER TABLE lead_import_configs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own import configs"
  ON lead_import_configs FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all import configs"
  ON lead_import_configs FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ========================================
-- IMPORTED LEADS
-- ========================================

CREATE TABLE IF NOT EXISTS imported_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id text NOT NULL,
  source_platform text NOT NULL,
  source_lead_id text NOT NULL,
  lead_data jsonb NOT NULL DEFAULT '{}',
  quality_score integer DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
  cost_cents integer NOT NULL DEFAULT 0,
  imported_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed', 'refunded')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, source_platform, source_lead_id)
);

-- Enable RLS
ALTER TABLE imported_leads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own imported leads"
  ON imported_leads FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create imported leads"
  ON imported_leads FOR INSERT TO authenticated
  WITH CHECK (true); -- Webhook service will insert

CREATE POLICY "Admins can view all imported leads"
  ON imported_leads FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ========================================
-- USER BALANCES
-- ========================================

CREATE TABLE IF NOT EXISTS user_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance_cents integer NOT NULL DEFAULT 0 CHECK (balance_cents >= 0),
  reserved_cents integer NOT NULL DEFAULT 0 CHECK (reserved_cents >= 0),
  last_recharge_at timestamptz,
  auto_recharge_enabled boolean DEFAULT false,
  recharge_threshold_cents integer DEFAULT 10000,
  recharge_amount_cents integer DEFAULT 50000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own balance"
  ON user_balances FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own balance settings"
  ON user_balances FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage balances"
  ON user_balances FOR ALL TO authenticated
  USING (true); -- For system operations

CREATE POLICY "Admins can view all balances"
  ON user_balances FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ========================================
-- BALANCE TRANSACTIONS
-- ========================================

CREATE TABLE IF NOT EXISTS balance_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('recharge', 'deduction', 'refund', 'auto_recharge', 'bonus')),
  amount_cents integer NOT NULL,
  description text,
  reference_id text, -- Lead ID, Payment Intent ID, etc.
  balance_after_cents integer,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE balance_transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own transactions"
  ON balance_transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create transactions"
  ON balance_transactions FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all transactions"
  ON balance_transactions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ========================================
-- SAVED PAYMENT METHODS
-- ========================================

CREATE TABLE IF NOT EXISTS saved_payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id text NOT NULL,
  stripe_customer_id text NOT NULL,
  card_brand text,
  card_last_four text,
  card_exp_month integer,
  card_exp_year integer,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE saved_payment_methods ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own payment methods"
  ON saved_payment_methods FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- ========================================
-- NOTIFICATIONS
-- ========================================

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own notifications"
  ON notifications FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- ========================================
-- INDEXES
-- ========================================

-- Lead import configs
CREATE INDEX IF NOT EXISTS idx_lead_import_configs_user_id ON lead_import_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_import_configs_active ON lead_import_configs(active);
CREATE INDEX IF NOT EXISTS idx_lead_import_configs_source ON lead_import_configs(campaign_source);

-- Imported leads
CREATE INDEX IF NOT EXISTS idx_imported_leads_user_id ON imported_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_imported_leads_status ON imported_leads(status);
CREATE INDEX IF NOT EXISTS idx_imported_leads_imported_at ON imported_leads(imported_at);
CREATE INDEX IF NOT EXISTS idx_imported_leads_source ON imported_leads(source_platform);
CREATE INDEX IF NOT EXISTS idx_imported_leads_quality ON imported_leads(quality_score);

-- User balances
CREATE INDEX IF NOT EXISTS idx_user_balances_user_id ON user_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_user_balances_auto_recharge ON user_balances(auto_recharge_enabled);

-- Balance transactions
CREATE INDEX IF NOT EXISTS idx_balance_transactions_user_id ON balance_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_balance_transactions_type ON balance_transactions(type);
CREATE INDEX IF NOT EXISTS idx_balance_transactions_created_at ON balance_transactions(created_at);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ========================================
-- FUNCTIONS
-- ========================================

-- Function to deduct balance atomically
CREATE OR REPLACE FUNCTION deduct_balance(
  p_user_id uuid,
  p_amount_cents integer,
  p_lead_id text DEFAULT NULL
) RETURNS boolean AS $$
DECLARE
  current_balance integer;
  new_balance integer;
BEGIN
  -- Get current balance and lock the row
  SELECT balance_cents INTO current_balance
  FROM user_balances
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Check if sufficient balance
  IF current_balance < p_amount_cents THEN
    RETURN false;
  END IF;

  -- Calculate new balance
  new_balance := current_balance - p_amount_cents;

  -- Update balance
  UPDATE user_balances
  SET 
    balance_cents = new_balance,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- Record transaction
  INSERT INTO balance_transactions (
    user_id,
    type,
    amount_cents,
    description,
    reference_id,
    balance_after_cents,
    created_at
  ) VALUES (
    p_user_id,
    'deduction',
    -p_amount_cents,
    'Lead import charge',
    p_lead_id,
    new_balance,
    now()
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add balance
CREATE OR REPLACE FUNCTION add_balance(
  p_user_id uuid,
  p_amount_cents integer
) RETURNS void AS $$
DECLARE
  new_balance integer;
BEGIN
  -- Update balance atomically
  UPDATE user_balances
  SET 
    balance_cents = balance_cents + p_amount_cents,
    updated_at = now(),
    last_recharge_at = CASE WHEN p_amount_cents > 0 THEN now() ELSE last_recharge_at END
  WHERE user_id = p_user_id
  RETURNING balance_cents INTO new_balance;

  -- If no existing balance record, create one
  IF NOT FOUND THEN
    INSERT INTO user_balances (
      user_id,
      balance_cents,
      created_at,
      updated_at,
      last_recharge_at
    ) VALUES (
      p_user_id,
      p_amount_cents,
      now(),
      now(),
      CASE WHEN p_amount_cents > 0 THEN now() ELSE NULL END
    );
    new_balance := p_amount_cents;
  END IF;

  -- Record transaction
  INSERT INTO balance_transactions (
    user_id,
    type,
    amount_cents,
    description,
    balance_after_cents,
    created_at
  ) VALUES (
    p_user_id,
    CASE WHEN p_amount_cents > 0 THEN 'recharge' ELSE 'deduction' END,
    p_amount_cents,
    CASE WHEN p_amount_cents > 0 THEN 'Balance recharge' ELSE 'Balance deduction' END,
    new_balance,
    now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user balance with auto-creation
CREATE OR REPLACE FUNCTION get_or_create_user_balance(p_user_id uuid)
RETURNS TABLE(
  balance_cents integer,
  reserved_cents integer,
  auto_recharge_enabled boolean,
  recharge_threshold_cents integer,
  recharge_amount_cents integer
) AS $$
BEGIN
  -- Try to get existing balance
  RETURN QUERY
  SELECT 
    ub.balance_cents,
    ub.reserved_cents,
    ub.auto_recharge_enabled,
    ub.recharge_threshold_cents,
    ub.recharge_amount_cents
  FROM user_balances ub
  WHERE ub.user_id = p_user_id;

  -- If no balance found, create one
  IF NOT FOUND THEN
    INSERT INTO user_balances (
      user_id,
      balance_cents,
      reserved_cents,
      auto_recharge_enabled,
      recharge_threshold_cents,
      recharge_amount_cents,
      created_at,
      updated_at
    ) VALUES (
      p_user_id,
      0,
      0,
      false,
      10000,
      50000,
      now(),
      now()
    );

    RETURN QUERY
    SELECT 0, 0, false, 10000, 50000;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- TRIGGERS
-- ========================================

-- Update timestamps
CREATE TRIGGER lead_import_configs_updated_at 
  BEFORE UPDATE ON lead_import_configs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_balances_updated_at 
  BEFORE UPDATE ON user_balances 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER saved_payment_methods_updated_at 
  BEFORE UPDATE ON saved_payment_methods 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create user balance when profile is created
CREATE OR REPLACE FUNCTION create_user_balance_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_balances (
    user_id,
    balance_cents,
    reserved_cents,
    auto_recharge_enabled,
    recharge_threshold_cents,
    recharge_amount_cents,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    0,
    0,
    false,
    10000, -- $100 threshold
    50000, -- $500 recharge amount
    now(),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'create_user_balance_on_signup') THEN
    CREATE TRIGGER create_user_balance_on_signup
      AFTER INSERT ON profiles
      FOR EACH ROW EXECUTE FUNCTION create_user_balance_on_signup();
  END IF;
END $$;

-- ========================================
-- VIEWS FOR ANALYTICS
-- ========================================

-- Lead import analytics
CREATE OR REPLACE VIEW lead_import_analytics AS
SELECT 
  DATE_TRUNC('day', imported_at) as date,
  source_platform,
  COUNT(*) as leads_imported,
  AVG(quality_score) as avg_quality_score,
  SUM(cost_cents) as total_cost_cents,
  COUNT(*) FILTER (WHERE status = 'delivered') as delivered_count,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_count
FROM imported_leads
GROUP BY DATE_TRUNC('day', imported_at), source_platform
ORDER BY date DESC, source_platform;

-- User balance summary
CREATE OR REPLACE VIEW user_balance_summary AS
SELECT 
  u.id as user_id,
  p.email,
  p.first_name,
  p.last_name,
  ub.balance_cents,
  ub.auto_recharge_enabled,
  COUNT(il.id) as total_leads_imported,
  SUM(il.cost_cents) as total_spent_cents,
  MAX(il.imported_at) as last_lead_imported
FROM auth.users u
JOIN profiles p ON u.id = p.id
LEFT JOIN user_balances ub ON u.id = ub.user_id
LEFT JOIN imported_leads il ON u.id = il.user_id
GROUP BY u.id, p.email, p.first_name, p.last_name, ub.balance_cents, ub.auto_recharge_enabled
ORDER BY total_spent_cents DESC NULLS LAST;

-- Revenue from lead imports
CREATE OR REPLACE VIEW lead_import_revenue AS
SELECT 
  DATE_TRUNC('month', imported_at) as month,
  source_platform,
  COUNT(*) as leads_count,
  SUM(cost_cents) as revenue_cents,
  AVG(cost_cents) as avg_cost_per_lead_cents,
  COUNT(DISTINCT user_id) as unique_users
FROM imported_leads
WHERE status = 'delivered'
GROUP BY DATE_TRUNC('month', imported_at), source_platform
ORDER BY month DESC, revenue_cents DESC;

