-- SUPER SIMPLE DATABASE FIX
-- This just creates the missing tables and adds essential data
-- Run this to fix console errors

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create content_items table (fixes 404 error)
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

-- 2. Create user_balances table (fixes 404 error)  
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

-- 3. Create wishlist_items table (fixes 400 error)
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dataset_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, dataset_id)
);

-- 4. Add essential content data (ignore conflicts)
INSERT INTO content_items (key, type, value, label, section) VALUES
('site_name', 'text', 'DataCSV', 'Site Name', 'global'),
('site_tagline', 'text', 'Premium Data Marketplace', 'Site Tagline', 'global'),
('hero_title', 'text', 'Find Premium Data for Your Business', 'Hero Title', 'home'),
('hero_subtitle', 'text', 'Access verified, high-quality datasets to power your analytics and business intelligence', 'Hero Subtitle', 'home'),
('footer_description', 'text', 'Your trusted partner for premium data intelligence and business insights.', 'Footer Description', 'global')
ON CONFLICT (key) DO NOTHING;

-- 5. Create user balances for existing users (ignore conflicts)
INSERT INTO user_balances (user_id, balance_cents, reserved_cents, auto_recharge_enabled, recharge_threshold_cents, recharge_amount_cents)
SELECT 
  id,
  0,
  0,
  false,
  10000,
  50000
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM user_balances WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;
