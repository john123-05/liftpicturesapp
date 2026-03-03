import { createClient } from '@supabase/supabase-js';

// Declare variables at top level
let supabase: ReturnType<typeof createClient>;
let supabaseConfigured: boolean;

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const hasValidSupabaseUrl = !!supabaseUrl && !supabaseUrl.includes('your-project-id');
const hasValidSupabaseAnonKey = !!supabaseAnonKey && !supabaseAnonKey.includes('your-anon-key');

// Comprehensive environment check
console.log('🔍 Supabase Environment Check:');
console.log('EXPO_PUBLIC_SUPABASE_URL exists:', hasValidSupabaseUrl);
console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY exists:', hasValidSupabaseAnonKey);

if (hasValidSupabaseUrl) {
  console.log('Supabase URL:', supabaseUrl);
  console.log('URL format valid:', supabaseUrl.startsWith('https://'));
  console.log('URL contains supabase.co:', supabaseUrl.includes('.supabase.co'));
} else {
  console.error('ERROR: EXPO_PUBLIC_SUPABASE_URL environment variable is missing!');
}

if (hasValidSupabaseAnonKey) {
  console.log('Anon key length:', supabaseAnonKey.length);
  console.log('Anon key starts with:', supabaseAnonKey.substring(0, 10) + '...');
} else {
  console.error('ERROR: EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable is missing!');
}

// Check if environment variables are properly configured
if (!hasValidSupabaseUrl || !hasValidSupabaseAnonKey) {
  console.error('❌ SUPABASE CONFIGURATION ERROR:');
  console.error('Please create a .env file in your project root with:');
  console.error('EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here');
  console.error('Please check your .env file in the root of your project.');
  console.error('After creating/updating .env, restart your dev server!');
  
  // Don't throw error, create dummy client to prevent app crash
  supabase = createClient('https://dummy.supabase.co', 'dummy-key');
  supabaseConfigured = false;
} else if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error('❌ INVALID SUPABASE URL FORMAT:');
  console.error('Your EXPO_PUBLIC_SUPABASE_URL should be in format:');
  console.error('https://your-project-id.supabase.co');
  console.error('Current URL:', supabaseUrl);
  
  supabase = createClient('https://dummy.supabase.co', 'dummy-key');
  supabaseConfigured = false;
} else {
  console.log('✅ Supabase environment configured correctly');
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  supabaseConfigured = true;
}

export { supabase, supabaseConfigured };
