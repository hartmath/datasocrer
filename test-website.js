// Simple test script to check website functionality
// Run this in browser console to test admin functionality

console.log('🔍 Testing Website Functionality...');

// Test 1: Check if Supabase is connected
console.log('1. Testing Supabase Connection...');
if (typeof window !== 'undefined' && window.supabase) {
  console.log('✅ Supabase client found');
} else {
  console.log('❌ Supabase client not found');
}

// Test 2: Check environment variables
console.log('2. Testing Environment Variables...');
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseUrl.includes('supabase.co')) {
  console.log('✅ Supabase URL configured');
} else {
  console.log('❌ Supabase URL not configured properly');
}

if (supabaseKey && supabaseKey.startsWith('eyJ')) {
  console.log('✅ Supabase key configured');
} else {
  console.log('❌ Supabase key not configured properly');
}

// Test 3: Check authentication state
console.log('3. Testing Authentication State...');
// This would need to be run in the actual app context

// Test 4: Check for console errors
console.log('4. Checking for Console Errors...');
const originalError = console.error;
let errorCount = 0;
console.error = function(...args) {
  errorCount++;
  originalError.apply(console, args);
};

// Test 5: Check localStorage
console.log('5. Testing Local Storage...');
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('✅ Local storage working');
} catch (e) {
  console.log('❌ Local storage error:', e);
}

console.log('🧪 Test completed. Check results above.');


