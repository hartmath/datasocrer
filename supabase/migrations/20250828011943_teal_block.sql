/*
  # Create Core Application Tables

  1. New Tables
    - `categories` - Data categories with icons and colors
    - `providers` - Data providers with ratings and verification
    - `datasets` - Dataset listings with relationships to categories and providers
    - `reviews` - User reviews for datasets
    - `cart_items` - Shopping cart functionality
    - `order_items` - Order line items

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for public read access and user-specific operations

  3. Sample Data
    - Add sample categories, providers, and datasets for immediate functionality
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Database',
  color text NOT NULL DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now()
);

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  logo_url text,
  website text,
  rating numeric(3,2) DEFAULT 4.5,
  total_reviews integer DEFAULT 0,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create datasets table
CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  long_description text,
  category_id uuid REFERENCES categories(id),
  provider_id uuid REFERENCES providers(id),
  price numeric(10,2) NOT NULL DEFAULT 0,
  original_price numeric(10,2),
  currency text DEFAULT 'USD',
  size_description text DEFAULT 'Medium',
  record_count integer DEFAULT 1000,
  update_frequency text DEFAULT 'Monthly',
  data_format text[] DEFAULT ARRAY['CSV', 'JSON'],
  tags text[] DEFAULT ARRAY[]::text[],
  image_url text,
  sample_data jsonb,
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  rating numeric(3,2) DEFAULT 4.5,
  total_reviews integer DEFAULT 0,
  total_downloads integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  comment text NOT NULL,
  verified_purchase boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_items') THEN
    CREATE TABLE order_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id uuid NOT NULL,
      dataset_id uuid REFERENCES datasets(id),
      quantity integer DEFAULT 1,
      unit_price numeric(10,2) NOT NULL,
      total_price numeric(10,2) NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Providers are viewable by everyone" ON providers FOR SELECT USING (true);
CREATE POLICY "Active datasets are viewable by everyone" ON datasets FOR SELECT USING (active = true);
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can manage their cart items" ON cart_items FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Insert sample categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Health Insurance', 'health', 'Comprehensive health insurance leads including individual, family, and group plans', 'Heart', '#ef4444'),
('Life Insurance', 'life', 'Life insurance prospects seeking term, whole, and universal life coverage', 'Shield', '#3b82f6'),
('Medicare', 'medicare', 'Medicare supplement, advantage, and prescription drug plan leads', 'Users', '#8b5cf6'),
('Auto Insurance', 'auto', 'Vehicle insurance leads for personal and commercial auto coverage', 'Car', '#f59e0b'),
('Property Insurance', 'property', 'Home, renters, and commercial property insurance prospects', 'Home', '#10b981'),
('Business Insurance', 'business', 'Commercial insurance leads for liability, workers comp, and business protection', 'Building', '#6366f1')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample providers
INSERT INTO providers (name, slug, description, rating, total_reviews, verified) VALUES
('LeadGen Pro', 'leadgen-pro', 'Premium insurance lead generation with 15+ years of experience in the industry', 4.8, 245, true),
('InsureConnect', 'insure-connect', 'Specialized in high-quality health and life insurance leads with real-time delivery', 4.7, 189, true),
('AgentLeads Plus', 'agent-leads-plus', 'Comprehensive lead solutions for independent insurance agents nationwide', 4.6, 156, true),
('ProspectFlow', 'prospect-flow', 'Advanced lead qualification and delivery platform for insurance professionals', 4.9, 298, true),
('InsuranceLeads.com', 'insurance-leads-com', 'Trusted source for exclusive insurance leads across all major product lines', 4.5, 134, true),
('LeadMaster', 'lead-master', 'Technology-driven lead generation with advanced targeting and analytics', 4.7, 203, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample datasets
INSERT INTO datasets (title, slug, description, category_id, provider_id, price, record_count, tags, featured, rating, total_reviews, total_downloads) VALUES
(
  'Premium Health Insurance Leads - Q1 2024',
  'premium-health-leads-q1-2024',
  'High-quality health insurance leads with complete contact information and qualification data',
  (SELECT id FROM categories WHERE slug = 'health'),
  (SELECT id FROM providers WHERE slug = 'leadgen-pro'),
  2.50,
  5000,
  ARRAY['health', 'individual', 'family', 'qualified'],
  true,
  4.8,
  45,
  1250
),
(
  'Life Insurance Prospects - Verified',
  'life-insurance-prospects-verified',
  'Pre-qualified life insurance prospects with income verification and coverage needs assessment',
  (SELECT id FROM categories WHERE slug = 'life'),
  (SELECT id FROM providers WHERE slug = 'insure-connect'),
  3.25,
  2500,
  ARRAY['life', 'term', 'whole-life', 'verified'],
  true,
  4.7,
  32,
  890
),
(
  'Medicare Supplement Leads - Age 65+',
  'medicare-supplement-leads-65plus',
  'Exclusive Medicare supplement leads for seniors turning 65 and existing Medicare beneficiaries',
  (SELECT id FROM categories WHERE slug = 'medicare'),
  (SELECT id FROM providers WHERE slug = 'prospect-flow'),
  4.00,
  1800,
  ARRAY['medicare', 'supplement', 'seniors', 'exclusive'],
  false,
  4.9,
  28,
  675
)
ON CONFLICT (slug) DO NOTHING;