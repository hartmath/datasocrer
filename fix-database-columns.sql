-- DataCSV Database Fix Script
-- This will add missing columns to existing tables

-- Step 1: Add missing columns to existing tables
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS price_cents INTEGER DEFAULT 0;
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Step 2: Update existing datasets with proper pricing
UPDATE datasets SET price_cents = 2500 WHERE slug = 'health-insurance-leads-q1-2024';
UPDATE datasets SET price_cents = 3250 WHERE slug = 'life-insurance-prospects';

-- Step 3: Insert sample data if it doesn't exist
INSERT INTO datasets (title, slug, description, price_cents) VALUES
  ('Health Insurance Leads Q1 2024', 'health-insurance-leads-q1-2024', 'Premium health insurance leads', 2500),
  ('Life Insurance Prospects', 'life-insurance-prospects', 'High-quality life insurance prospects', 3250)
ON CONFLICT (slug) DO NOTHING;

-- Step 4: Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

-- Step 5: Create basic policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Anyone can view datasets" ON datasets FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own balance" ON user_balances FOR SELECT USING (auth.uid() = user_id);

-- Success message
SELECT '🎉 Database fixed successfully! Missing columns added and data updated.' as message;
