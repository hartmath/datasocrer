/*
  Complete DataCSV Database Setup
  
  This migration sets up all tables needed for a fully functional data marketplace:
  - User profiles with roles
  - Content management
  - Dataset management 
  - Order processing
  - Payment tracking
  - Download management
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- USER PROFILES & ROLES
-- ========================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'provider')),
  company text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ========================================
-- CONTENT MANAGEMENT
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
-- CATEGORIES
-- ========================================

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  parent_id uuid REFERENCES categories(id),
  sort_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies for categories
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ========================================
-- PROVIDERS
-- ========================================

CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  website text,
  logo_url text,
  contact_email text,
  verified boolean DEFAULT false,
  rating numeric(3,2) DEFAULT 0,
  total_datasets integer DEFAULT 0,
  total_downloads integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Policies for providers
CREATE POLICY "Anyone can view providers"
  ON providers FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage providers"
  ON providers FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ========================================
-- DATASETS
-- ========================================

CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id),
  provider_id uuid REFERENCES providers(id),
  price_cents integer NOT NULL DEFAULT 0,
  file_url text,
  file_size bigint,
  file_format text,
  preview_url text,
  sample_data jsonb,
  metadata jsonb DEFAULT '{}',
  tags text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  total_downloads integer DEFAULT 0,
  rating numeric(3,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

-- Policies for datasets
CREATE POLICY "Anyone can view active datasets"
  ON datasets FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins and providers can manage datasets"
  ON datasets FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.role = 'admin' OR profiles.role = 'provider')
    )
  );

-- ========================================
-- ORDERS
-- ========================================

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  total_amount_cents integer NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  payment_intent_id text, -- Stripe payment intent ID
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  payment_method jsonb,
  billing_details jsonb,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending orders"
  ON orders FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all orders"
  ON orders FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ========================================
-- ORDER ITEMS
-- ========================================

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  dataset_id uuid NOT NULL REFERENCES datasets(id),
  price_cents integer NOT NULL,
  quantity integer DEFAULT 1,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for order items
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their own orders"
  ON order_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ========================================
-- SUBSCRIPTIONS
-- ========================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  status text NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid', 'trialing')),
  plan_name text NOT NULL,
  plan_price_cents integer NOT NULL,
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_end timestamptz,
  cancelled_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ========================================
-- DOWNLOADS (Updated from existing)
-- ========================================

-- The downloads table already exists from the previous migration
-- But let's ensure it has all needed columns

DO $$
BEGIN
  -- Add any missing columns to downloads table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloads' AND column_name = 'metadata') THEN
    ALTER TABLE downloads ADD COLUMN metadata jsonb DEFAULT '{}';
  END IF;
END $$;

-- ========================================
-- WISHLISTS
-- ========================================

CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  dataset_id uuid NOT NULL REFERENCES datasets(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, dataset_id)
);

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Policies for wishlists
CREATE POLICY "Users can manage their own wishlist"
  ON wishlists FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- ========================================
-- REVIEWS & RATINGS
-- ========================================

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  dataset_id uuid NOT NULL REFERENCES datasets(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  verified_purchase boolean DEFAULT false,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, dataset_id)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews"
  ON reviews FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ========================================
-- FUNCTIONS & TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER datasets_updated_at BEFORE UPDATE ON datasets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORDER-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8));
END;
$$ LANGUAGE plpgsql;

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- ========================================
-- INDEXES
-- ========================================

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_datasets_category_id ON datasets(category_id);
CREATE INDEX IF NOT EXISTS idx_datasets_provider_id ON datasets(provider_id);
CREATE INDEX IF NOT EXISTS idx_datasets_active ON datasets(active);
CREATE INDEX IF NOT EXISTS idx_datasets_featured ON datasets(featured);
CREATE INDEX IF NOT EXISTS idx_datasets_created_at ON datasets(created_at);
CREATE INDEX IF NOT EXISTS idx_datasets_price_cents ON datasets(price_cents);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_dataset_id ON order_items(dataset_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_reviews_dataset_id ON reviews(dataset_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);

-- Text search indexes
CREATE INDEX IF NOT EXISTS idx_datasets_title_search ON datasets USING GIN(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_datasets_description_search ON datasets USING GIN(to_tsvector('english', description));

-- ========================================
-- SEED DATA
-- ========================================

-- Insert initial admin user (you can customize this)
DO $$
BEGIN
  -- Only insert if no admin exists
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin') THEN
    -- Note: You'll need to create this user in Supabase auth first
    INSERT INTO profiles (id, email, first_name, last_name, role)
    VALUES (
      '00000000-0000-0000-0000-000000000000', -- Placeholder - replace with real admin user ID
      'admin@datacsv.com',
      'Admin',
      'User',
      'admin'
    ) ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Insert sample categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Insurance Data', 'insurance', 'Health, Life, Auto, and Property Insurance Leads', '🛡️'),
  ('B2B Prospects', 'b2b', 'Business-to-Business Contact Lists and Leads', '🏢'),
  ('Consumer Data', 'consumer', 'Consumer Demographics and Behavior Data', '👥'),
  ('Real Estate', 'real-estate', 'Property Data and Real Estate Leads', '🏠'),
  ('Financial Services', 'financial', 'Investment and Financial Service Leads', '💰'),
  ('Healthcare', 'healthcare', 'Medical and Healthcare Industry Data', '⚕️')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample provider
INSERT INTO providers (name, slug, description, verified) VALUES
  ('DataCSV Premium', 'datacsv-premium', 'Premium verified data provider offering high-quality, compliant datasets', true)
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- VIEWS FOR ANALYTICS
-- ========================================

-- Revenue analytics view
CREATE OR REPLACE VIEW revenue_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as order_count,
  SUM(total_amount_cents) as total_revenue_cents,
  AVG(total_amount_cents) as avg_order_value_cents
FROM orders 
WHERE payment_status = 'succeeded'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Dataset popularity view
CREATE OR REPLACE VIEW dataset_popularity AS
SELECT 
  d.id,
  d.title,
  d.price_cents,
  d.total_downloads,
  COUNT(oi.id) as total_orders,
  SUM(oi.price_cents) as total_revenue_cents,
  AVG(r.rating) as avg_rating
FROM datasets d
LEFT JOIN order_items oi ON d.id = oi.dataset_id
LEFT JOIN reviews r ON d.id = r.dataset_id AND r.approved = true
WHERE d.active = true
GROUP BY d.id, d.title, d.price_cents, d.total_downloads
ORDER BY total_orders DESC, total_downloads DESC;

-- User activity view
CREATE OR REPLACE VIEW user_activity AS
SELECT 
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.created_at as signup_date,
  COUNT(DISTINCT o.id) as total_orders,
  SUM(o.total_amount_cents) as total_spent_cents,
  COUNT(DISTINCT d.id) as total_downloads,
  MAX(o.created_at) as last_order_date
FROM profiles p
LEFT JOIN orders o ON p.id = o.user_id AND o.payment_status = 'succeeded'
LEFT JOIN downloads d ON p.id = d.user_id
GROUP BY p.id, p.email, p.first_name, p.last_name, p.created_at
ORDER BY total_spent_cents DESC NULLS LAST;
