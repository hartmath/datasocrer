-- Fix missing tables and data issues for DataCSV application
-- This script creates ALL required tables and fixes data issues

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- CONTENT ITEMS TABLE (from main migration)
-- ========================================

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

-- Enable RLS
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Policies for content items
CREATE POLICY "Anyone can view content items"
  ON content_items FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage content items"
  ON content_items FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ========================================
-- ENSURE OTHER REQUIRED TABLES EXIST
-- ========================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Providers table
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  website_url text,
  logo_url text,
  rating numeric(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Datasets table
CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id),
  provider_id uuid REFERENCES providers(id),
  price_cents integer NOT NULL DEFAULT 0,
  original_price_cents integer,
  currency text DEFAULT 'USD',
  size_description text,
  record_count integer,
  update_frequency text,
  data_format jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  rating numeric(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  total_downloads integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User balances table (from lead import migration)
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

-- Policies for user_balances
CREATE POLICY "Users can view their own balance"
  ON user_balances FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own balance settings"
  ON user_balances FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- ========================================
-- WISHLIST ITEMS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dataset_id uuid NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, dataset_id)
);

-- Enable RLS for wishlist_items
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Policies for wishlist_items
CREATE POLICY "Users can view their own wishlist items"
  ON wishlist_items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist items"
  ON wishlist_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items"
  ON wishlist_items FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_dataset_id ON wishlist_items(dataset_id);

-- Ensure content_items has default data
INSERT INTO content_items (key, type, value, label, section) VALUES
('site_name', 'text', 'DataCSV', 'Site Name', 'global'),
('site_tagline', 'text', 'Premium Data Marketplace', 'Site Tagline', 'global'),
('hero_title', 'text', 'Find Premium Data for Your Business', 'Hero Title', 'home'),
('hero_subtitle', 'text', 'Access verified, high-quality datasets to power your analytics and business intelligence', 'Hero Subtitle', 'home'),
('footer_description', 'text', 'Your trusted partner for premium data intelligence and business insights.', 'Footer Description', 'global')
ON CONFLICT (key) DO NOTHING;

-- Ensure user_balances is created for existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  -- Create user_balances for any users that don't have them
  FOR user_record IN 
    SELECT DISTINCT u.id 
    FROM auth.users u 
    LEFT JOIN user_balances ub ON u.id = ub.user_id 
    WHERE ub.user_id IS NULL
  LOOP
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
      user_record.id,
      0,
      0,
      false,
      10000,
      50000,
      now(),
      now()
    ) ON CONFLICT (user_id) DO NOTHING;
  END LOOP;
END $$;

-- Fix pricing data - convert any dollar values to cents in datasets table
-- (This assumes some data might be stored as dollars instead of cents)
-- Only run if datasets table exists and has data
DO $$
BEGIN
  -- Check if datasets table exists and has the price_cents column
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'datasets' 
    AND column_name = 'price_cents'
    AND table_schema = 'public'
  ) THEN
    -- Update price_cents if values look like dollars instead of cents
    UPDATE datasets 
    SET price_cents = CASE 
      WHEN price_cents < 100 AND price_cents > 0 THEN price_cents * 100  -- Convert dollars to cents
      ELSE price_cents  -- Keep existing cents values
    END
    WHERE price_cents < 100 AND price_cents > 0;

    -- Update original_price_cents if values look like dollars instead of cents
    UPDATE datasets 
    SET original_price_cents = CASE 
      WHEN original_price_cents < 100 AND original_price_cents > 0 THEN original_price_cents * 100  -- Convert dollars to cents
      ELSE original_price_cents  -- Keep existing cents values
    END
    WHERE original_price_cents < 100 AND original_price_cents > 0;
  END IF;
END $$;

-- ========================================
-- INSERT SAMPLE DATA
-- ========================================

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, icon) VALUES 
(gen_random_uuid(), 'Insurance', 'insurance', 'Insurance leads and data', 'shield'),
(gen_random_uuid(), 'Finance', 'finance', 'Financial services data', 'dollar-sign'),
(gen_random_uuid(), 'Healthcare', 'healthcare', 'Healthcare industry data', 'heart'),
(gen_random_uuid(), 'Real Estate', 'real-estate', 'Property and real estate data', 'home'),
(gen_random_uuid(), 'Technology', 'technology', 'Tech industry data', 'cpu')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample providers
INSERT INTO providers (id, name, slug, description, website_url, rating, total_reviews, verified) VALUES 
(gen_random_uuid(), 'DataPro Analytics', 'datapro-analytics', 'Leading provider of verified business data', 'https://datapro.example.com', 4.8, 256, true),
(gen_random_uuid(), 'InsureConnect', 'insure-connect', 'Specialized insurance leads', 'https://insureconnect.example.com', 4.7, 189, true),
(gen_random_uuid(), 'FinanceFirst', 'finance-first', 'Premium financial services data', 'https://financefirst.example.com', 4.6, 134, true)
ON CONFLICT (slug) DO NOTHING;

-- Ensure sample datasets exist with correct pricing (in cents)
INSERT INTO datasets (
  id,
  title,
  slug,
  description,
  category_id,
  provider_id,
  price_cents,
  original_price_cents,
  currency,
  size_description,
  record_count,
  update_frequency,
  data_format,
  tags,
  featured,
  active,
  rating,
  total_reviews,
  total_downloads
) VALUES 
(
  gen_random_uuid(),
  'Life Insurance Prospects - Verified',
  'life-insurance-prospects-verified',
  'High-quality verified life insurance prospects with detailed demographics',
  (SELECT id FROM categories WHERE slug = 'insurance' LIMIT 1),
  (SELECT id FROM providers WHERE slug = 'datapro-analytics' LIMIT 1),
  325,  -- $3.25 in cents
  399,  -- $3.99 in cents
  'USD',
  'Medium',
  5000,
  'Weekly',
  '["CSV", "Excel"]'::jsonb,
  '["life insurance", "verified", "prospects"]'::jsonb,
  true,
  true,
  4.8,
  145,
  3200
),
(
  gen_random_uuid(),
  'Premium Health Insurance Leads - Q1 2024',
  'premium-health-insurance-leads-q1-2024',
  'Fresh health insurance leads from Q1 2024 with high conversion potential',
  (SELECT id FROM categories WHERE slug = 'insurance' LIMIT 1),
  (SELECT id FROM providers WHERE slug = 'insure-connect' LIMIT 1),
  250,  -- $2.50 in cents
  300,  -- $3.00 in cents
  'USD',
  'Large',
  8000,
  'Monthly',
  '["CSV", "JSON"]'::jsonb,
  '["health insurance", "premium", "2024"]'::jsonb,
  true,
  true,
  4.6,
  89,
  1500
),
(
  gen_random_uuid(),
  'Financial Services Prospects - Premium',
  'financial-services-prospects-premium',
  'High-value financial services prospects with detailed income data',
  (SELECT id FROM categories WHERE slug = 'finance' LIMIT 1),
  (SELECT id FROM providers WHERE slug = 'finance-first' LIMIT 1),
  450,  -- $4.50 in cents
  550,  -- $5.50 in cents
  'USD',
  'Large',
  12000,
  'Bi-weekly',
  '["CSV", "JSON", "Excel"]'::jsonb,
  '["financial services", "premium", "high-value"]'::jsonb,
  true,
  true,
  4.7,
  67,
  2100
)
ON CONFLICT (slug) DO UPDATE SET
  price_cents = EXCLUDED.price_cents,
  original_price_cents = EXCLUDED.original_price_cents,
  updated_at = now();
