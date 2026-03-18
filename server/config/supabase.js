const { createClient } = require('@supabase/supabase-js');

// Supabase Admin client for server-side operations
// Uses the service_role key for full database access
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  console.log('✅ Supabase client initialized');
} catch (error) {
  console.warn('⚠️  Supabase initialization warning:', error.message);
  supabase = null;
}

module.exports = { supabase };
