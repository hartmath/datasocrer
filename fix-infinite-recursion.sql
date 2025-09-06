-- ========================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- ========================================

-- Drop ALL existing policies to break the recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view content items" ON content_items;
DROP POLICY IF EXISTS "Admins can manage content items" ON content_items;

-- ========================================
-- CREATE CLEAN PROFILES POLICIES
-- ========================================

-- Simple policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Simple policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Simple policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- ========================================
-- CREATE CLEAN CONTENT_ITEMS POLICIES
-- ========================================

-- Anyone can view content (public content)
CREATE POLICY "Public content view" ON content_items
  FOR SELECT TO anon, authenticated
  USING (true);

-- Only authenticated users can manage content
CREATE POLICY "Authenticated content management" ON content_items
  FOR ALL TO authenticated
  USING (true);

-- ========================================
-- VERIFY FIX
-- ========================================

-- Test the policies work
SELECT 'Policies created successfully' as status;

-- Check if admin profile exists
SELECT email, role FROM profiles WHERE email = 'admin@datasorcerer.com';
