-- QUICK DATABASE FIX - Run this first to test
-- This creates the essential missing tables and fixes immediate issues

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create content_items table
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'image', 'html')),
  value text NOT NULL DEFAULT '',
  label text NOT NULL,
  section text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for content_items
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Create basic policy for content_items
CREATE POLICY IF NOT EXISTS "Anyone can view content items"
  ON content_items FOR SELECT TO anon, authenticated
  USING (true);

-- Add essential content items
INSERT INTO content_items (key, type, value, label, section) VALUES
('site_name', 'text', 'DataCSV', 'Site Name', 'global'),
('site_tagline', 'text', 'Premium Data Marketplace', 'Site Tagline', 'global'),
('hero_title', 'text', 'Find Premium Data for Your Business', 'Hero Title', 'home'),
('hero_subtitle', 'text', 'Access verified, high-quality datasets to power your analytics and business intelligence', 'Hero Subtitle', 'home')
ON CONFLICT (key) DO NOTHING;

-- Create user_balances table  
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

-- Enable RLS for user_balances
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

-- Create basic policy for user_balances
CREATE POLICY IF NOT EXISTS "Users can view their own balance"
  ON user_balances FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Create wishlist_items table (assuming datasets table exists)
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dataset_id uuid NOT NULL, -- Removing FK constraint for now
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, dataset_id)
);

-- Enable RLS for wishlist_items
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Create basic policy for wishlist_items
CREATE POLICY IF NOT EXISTS "Users can view their own wishlist items"
  ON wishlist_items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Create user balance for current user if not exists
DO $$
BEGIN
  -- This will create a balance for any authenticated user
  INSERT INTO user_balances (
    user_id,
    balance_cents,
    reserved_cents,
    auto_recharge_enabled,
    recharge_threshold_cents,
    recharge_amount_cents
  ) 
  SELECT 
    id,
    0,
    0,
    false,
    10000,
    50000
  FROM auth.users 
  WHERE id NOT IN (SELECT user_id FROM user_balances)
  ON CONFLICT (user_id) DO NOTHING;
END $$;
