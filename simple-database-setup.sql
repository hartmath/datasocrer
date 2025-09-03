-- DataCSV Simple Database Setup Script
-- Run this in your Supabase SQL Editor

-- Step 1: Create essential tables
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_items (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
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
  price_cents INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_balances (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance_cents INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Insert sample data
INSERT INTO datasets (title, slug, description, price_cents) VALUES
  ('Health Insurance Leads Q1 2024', 'health-insurance-leads-q1-2024', 'Premium health insurance leads', 2500),
  ('Life Insurance Prospects', 'life-insurance-prospects', 'High-quality life insurance prospects', 3250)
ON CONFLICT (slug) DO NOTHING;

-- Step 3: Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

-- Step 4: Create basic policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Anyone can view datasets" ON datasets FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own balance" ON user_balances FOR SELECT USING (auth.uid() = user_id);

-- Success message
SELECT '🎉 Database setup completed successfully! Your DataCSV platform is ready to use.' as message;
