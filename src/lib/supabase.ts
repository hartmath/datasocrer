import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create client with proper error handling
let supabase: any = null

try {
  if (supabaseUrl && supabaseAnonKey && 
      supabaseUrl !== 'https://placeholder.supabase.co' && 
      supabaseAnonKey !== 'placeholder-key' &&
      supabaseUrl.includes('supabase.co') && 
      supabaseAnonKey.startsWith('eyJ')) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Supabase client initialized successfully')
  } else {
    console.warn('⚠️ Supabase not configured properly. URL:', supabaseUrl, 'Key length:', supabaseAnonKey?.length)
    console.warn('Please click "Connect to Supabase" button to set up your database.')
  }
} catch (error) {
  console.error('❌ Failed to initialize Supabase:', error)
}

export { supabase }