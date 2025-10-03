const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration');
    console.log('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.log('SUPABASE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
    return;
  }
  
  console.log('✅ Environment variables loaded');
  console.log('📍 Supabase URL:', supabaseUrl);
  console.log('🔑 API Key:', supabaseKey.substring(0, 20) + '...');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    const { data, error } = await supabase
      .from('cars')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      return;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log('📊 Cars table accessible');
    
    // Test authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.log('ℹ️  Auth test (expected to fail for anon key):', authError.message);
    } else {
      console.log('✅ Auth working, user:', user);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testSupabaseConnection(); 