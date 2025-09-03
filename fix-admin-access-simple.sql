-- Fix Admin Access for DataCSV - Simple Version
-- Run this in your Supabase SQL Editor

-- Step 1: First, let's see what columns exist in the profiles table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Step 2: Let's see what users exist in auth.users
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 10;

-- Step 3: Create a profile for your user with only existing columns
INSERT INTO profiles (id, email, role) 
SELECT 
  id, 
  email, 
  'admin' as role
FROM auth.users 
WHERE email = 'hartmath@gmail.com'  -- Replace with your actual email
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- Step 4: Verify the profile was created
SELECT * FROM profiles WHERE email = 'hartmath@gmail.com';  -- Replace with your actual email

-- Success message
SELECT '🎉 Admin access should now work for hartmath@gmail.com' as message;

