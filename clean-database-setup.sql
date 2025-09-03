-- DataCSV Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create essential tables
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user',
  company TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_items (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'html')),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  section TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS datasets (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  provider TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  original_price_cents INTEGER,
  file_size TEXT,
  file_format TEXT,
  download_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS providers (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dataset_id INTEGER REFERENCES datasets(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, dataset_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'failed')),
  payment_intent_id TEXT,
  billing_email TEXT,
  billing_name TEXT,
  billing_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  dataset_id INTEGER REFERENCES datasets(id) ON DELETE CASCADE,
  price_cents INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS downloads (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dataset_id INTEGER REFERENCES datasets(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  download_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan_name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dataset_id INTEGER REFERENCES datasets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, dataset_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dataset_id INTEGER REFERENCES datasets(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, dataset_id)
);

CREATE TABLE IF NOT EXISTS lead_import_configs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'google_ads', 'linkedin', 'twitter', 'tiktok')),
  config_name TEXT NOT NULL,
  webhook_url TEXT,
  api_key TEXT,
  settings JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS imported_leads (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  config_id INTEGER REFERENCES lead_import_configs(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  lead_data JSONB NOT NULL,
  quality_score DECIMAL(3,2),
  is_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_balances (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance_cents INTEGER DEFAULT 0,
  auto_recharge_threshold_cents INTEGER DEFAULT 1000,
  auto_recharge_amount_cents INTEGER DEFAULT 5000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS balance_transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'refund')),
  amount_cents INTEGER NOT NULL,
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_payment_methods (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  last4 TEXT,
  brand TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO categories (name, slug, description) VALUES
  ('Health Insurance', 'health-insurance', 'Health insurance leads and data'),
  ('Life Insurance', 'life-insurance', 'Life insurance prospects and leads'),
  ('Medicare', 'medicare', 'Medicare supplement and advantage leads'),
  ('Auto Insurance', 'auto-insurance', 'Auto insurance leads and data'),
  ('Home Insurance', 'home-insurance', 'Home insurance leads and data')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO providers (name, description, is_verified) VALUES
  ('DataPro Solutions', 'Premium data provider with verified leads', true),
  ('LeadGen Masters', 'Specialized lead generation for insurance', true),
  ('Senior Data Solutions', 'Senior market specialists and Medicare leads', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO datasets (title, slug, description, category, provider, price_cents, original_price_cents, file_size, file_format, tags, is_featured) VALUES
  ('Health Insurance Leads Q1 2024', 'health-insurance-leads-q1-2024', 'Premium health insurance leads with verified contact information', 'Health Insurance', 'DataPro Solutions', 2500, 3000, '2.5 MB', 'CSV', ARRAY['health', 'insurance', 'leads', 'verified'], true),
  ('Life Insurance Prospects - Verified', 'life-insurance-prospects-verified', 'High-quality life insurance prospects with demographic data', 'Life Insurance', 'LeadGen Masters', 3250, 4000, '1.8 MB', 'CSV', ARRAY['life', 'insurance', 'prospects', 'demographics'], true),
  ('Medicare Supplement Leads', 'medicare-supplement-leads', 'Targeted Medicare supplement insurance leads', 'Medicare', 'Senior Data Solutions', 1800, 2200, '1.2 MB', 'CSV', ARRAY['medicare', 'supplement', 'seniors', 'insurance'], false)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_import_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE imported_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Content items policies
DROP POLICY IF EXISTS "Anyone can view content items" ON content_items;
CREATE POLICY "Anyone can view content items" ON content_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage content items" ON content_items;
CREATE POLICY "Admins can manage content items" ON content_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Datasets policies
DROP POLICY IF EXISTS "Anyone can view active datasets" ON datasets;
CREATE POLICY "Anyone can view active datasets" ON datasets FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage datasets" ON datasets;
CREATE POLICY "Admins can manage datasets" ON datasets FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Cart items policies
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
CREATE POLICY "Admins can manage all orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Downloads policies
DROP POLICY IF EXISTS "Users can view own downloads" ON downloads;
CREATE POLICY "Users can view own downloads" ON downloads FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create downloads" ON downloads;
CREATE POLICY "Users can create downloads" ON downloads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wishlist policies
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlist_items;
CREATE POLICY "Users can manage own wishlist" ON wishlist_items FOR ALL USING (auth.uid() = user_id);

-- Reviews policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own reviews" ON reviews;
CREATE POLICY "Users can manage own reviews" ON reviews FOR ALL USING (auth.uid() = user_id);

-- Lead import policies
DROP POLICY IF EXISTS "Users can manage own lead imports" ON lead_import_configs;
CREATE POLICY "Users can manage own lead imports" ON lead_import_configs FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own imported leads" ON imported_leads;
CREATE POLICY "Users can view own imported leads" ON imported_leads FOR SELECT USING (auth.uid() = user_id);

-- User balance policies
DROP POLICY IF EXISTS "Users can view own balance" ON user_balances;
CREATE POLICY "Users can view own balance" ON user_balances FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own balance" ON user_balances;
CREATE POLICY "Users can update own balance" ON user_balances FOR UPDATE USING (auth.uid() = user_id);

-- Balance transactions policies
DROP POLICY IF EXISTS "Users can view own transactions" ON balance_transactions;
CREATE POLICY "Users can view own transactions" ON balance_transactions FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create functions
CREATE OR REPLACE FUNCTION add_balance(
  user_uuid UUID,
  amount_cents INTEGER,
  description TEXT DEFAULT 'Balance added'
) RETURNS VOID AS $$
BEGIN
  -- Update user balance
  INSERT INTO user_balances (user_id, balance_cents)
  VALUES (user_uuid, amount_cents)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    balance_cents = user_balances.balance_cents + amount_cents,
    updated_at = NOW();
  
  -- Record transaction
  INSERT INTO balance_transactions (user_id, type, amount_cents, description)
  VALUES (user_uuid, 'credit', amount_cents, description);
  
  -- Create notification
  INSERT INTO notifications (user_id, type, title, message)
  VALUES (user_uuid, 'balance_added', 'Balance Added', 
          'Your account has been credited with $' || (amount_cents / 100.0)::TEXT);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION deduct_balance(
  user_uuid UUID,
  amount_cents INTEGER,
  description TEXT DEFAULT 'Balance deducted'
) RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT balance_cents INTO current_balance
  FROM user_balances
  WHERE user_id = user_uuid;
  
  -- Check if sufficient balance
  IF current_balance IS NULL OR current_balance < amount_cents THEN
    RETURN FALSE;
  END IF;
  
  -- Update balance
  UPDATE user_balances
  SET balance_cents = balance_cents - amount_cents,
      updated_at = NOW()
  WHERE user_id = user_uuid;
  
  -- Record transaction
  INSERT INTO balance_transactions (user_id, type, amount_cents, description)
  VALUES (user_uuid, 'debit', amount_cents, description);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION generate_order_number() RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || EXTRACT(YEAR FROM NOW()) || '-' || 
         LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' ||
         LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Success message
SELECT '🎉 Database setup completed successfully! Your DataCSV platform is ready to use.' as message;
