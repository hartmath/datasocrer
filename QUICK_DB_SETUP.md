# 🚀 Quick Database Setup for DataCSV

## 📋 What You Need

1. **Supabase Project** - Create one at [supabase.com](https://supabase.com)
2. **Your Project URL and API Key**

## 🔧 Setup Steps

### 1. Go to Supabase Dashboard
- Visit [supabase.com](https://supabase.com)
- Sign in and select your project

### 2. Open SQL Editor
- Click on **SQL Editor** in the left sidebar
- Click **New Query**

### 3. Copy and Paste This SQL

```sql
-- Enable RLS on all tables
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_balances ENABLE ROW LEVEL SECURITY;

-- Create essential tables
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Insert sample data
INSERT INTO datasets (title, slug, description, price_cents) VALUES
  ('Health Insurance Leads Q1 2024', 'health-insurance-leads-q1-2024', 'Premium health insurance leads', 2500),
  ('Life Insurance Prospects', 'life-insurance-prospects', 'High-quality life insurance prospects', 3250)
ON CONFLICT (slug) DO NOTHING;

-- Create basic policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Anyone can view datasets" ON datasets FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own balance" ON user_balances FOR SELECT USING (auth.uid() = user_id);
```

### 4. Run the SQL
- Click **Run** button
- Wait for all commands to complete

### 5. Check Your Tables
- Go to **Table Editor** in left sidebar
- You should see: `profiles`, `content_items`, `datasets`, `cart_items`, `orders`, `user_balances`

## ✅ You're Done!

Your database is now set up with:
- ✅ All necessary tables
- ✅ Sample data
- ✅ Security policies
- ✅ Basic functionality

## 🚨 If You Get Errors

**"relation does not exist"** - This is normal for new projects, just run the SQL again.

**"permission denied"** - Make sure you're using the right API key from Settings → API.

## 🔄 Test It

1. Start your app: `npm run dev`
2. Try to sign up a new user
3. Check if you can see the sample datasets

Your DataCSV platform should now work with a real database! 🎉
