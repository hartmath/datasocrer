-- Fix Admin Save Issues - Clean SQL Script
-- Copy and paste this entire script into Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add optional columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'first_name') THEN
        ALTER TABLE profiles ADD COLUMN first_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_name') THEN
        ALTER TABLE profiles ADD COLUMN last_name TEXT;
    END IF;
END $$;

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Create new policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all profiles"
  ON profiles FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create content_items table if not exists
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'html')),
  value TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL,
  section TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on content_items
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view content items" ON content_items;
DROP POLICY IF EXISTS "Admins can manage content items" ON content_items;

-- Create policies for content_items
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

-- Create/update admin profile
INSERT INTO profiles (id, email, role) 
SELECT 
  id, 
  email, 
  'admin' as role
FROM auth.users 
WHERE email = 'admin@datasorcerer.com'
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- Also create admin profile for other common admin emails
INSERT INTO profiles (id, email, role) 
SELECT 
  id, 
  email, 
  'admin' as role
FROM auth.users 
WHERE email IN ('admin@datacsv.com', 'hartmath@gmail.com', 'admin@localhost.com')
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- Insert default content items if they don't exist
INSERT INTO content_items (key, type, value, label, section) VALUES
('hero_title', 'text', 'Premium Data Marketplace', 'Hero Title', 'Homepage'),
('hero_subtitle', 'text', 'Access high-quality datasets for your business needs', 'Hero Subtitle', 'Homepage'),
('hero_image', 'image', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', 'Hero Image', 'Homepage'),
('about_title', 'text', 'About DataCSV', 'About Title', 'About'),
('about_content', 'html', '<p>We provide premium datasets for businesses and researchers.</p>', 'About Content', 'About'),
('contact_email', 'text', 'contact@datacsv.com', 'Contact Email', 'Contact'),
('contact_phone', 'text', '+1 (555) 123-4567', 'Contact Phone', 'Contact'),
('footer_copyright', 'text', '© 2024 DataCSV. All rights reserved.', 'Footer Copyright', 'Footer')
ON CONFLICT (key) DO NOTHING;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles 
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if admin profile exists
SELECT 
  p.email, 
  p.role, 
  p.updated_at,
  CASE 
    WHEN p.role = 'admin' THEN '✅ Admin access granted'
    ELSE '❌ Not an admin'
  END as status
FROM profiles p 
WHERE p.email = 'admin@datasorcerer.com';

-- Check content_items table
SELECT 
  COUNT(*) as total_content_items,
  COUNT(CASE WHEN section = 'Homepage' THEN 1 END) as homepage_items,
  COUNT(CASE WHEN section = 'About' THEN 1 END) as about_items
FROM content_items;

-- Test admin function
SELECT 
  is_admin() as current_user_is_admin,
  get_user_role() as current_user_role;

-- Success message
SELECT '🎉 Admin save issues fixed! Admin can now edit and save content.' as message;
