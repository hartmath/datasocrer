-- Fix Admin Access for DataCSV
-- Run this in your Supabase SQL Editor

-- Step 1: First, let's see what users exist in auth.users
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 10;

-- Step 2: Create a profile for your user (replace 'hartmath@gmail.com' with your actual email)
-- This will create a profile with admin role
INSERT INTO profiles (id, email, role, first_name, last_name) 
SELECT 
  id, 
  email, 
  'admin' as role,
  COALESCE(raw_user_meta_data->>'first_name', 'Admin') as first_name,
  COALESCE(raw_user_meta_data->>'last_name', 'User') as last_name
FROM auth.users 
WHERE email = 'hartmath@gmail.com'  -- Replace with your actual email
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- Step 3: Verify the profile was created
SELECT * FROM profiles WHERE email = 'hartmath@gmail.com';  -- Replace with your actual email

-- Step 4: If you want to make any user an admin, you can also do this:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- Success message
SELECT '🎉 Admin access should now work for hartmath@gmail.com' as message;

