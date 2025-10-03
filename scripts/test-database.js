const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testDatabase() {
  console.log('🔍 Testing database tables and data...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 测试所有表
    const tables = ['users', 'conversations', 'messages', 'cars', 'recommendations', 'next_steps'];
    
    for (const table of tables) {
      console.log(`\n📊 Testing ${table} table...`);
      
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(5);
      
      if (error) {
        console.error(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${count} records found`);
        if (data && data.length > 0) {
          console.log(`   Sample record:`, JSON.stringify(data[0], null, 2));
        }
      }
    }
    
    // 测试视图
    console.log('\n📊 Testing views...');
    const { data: popularCars, error: viewError } = await supabase
      .from('popular_cars')
      .select('*')
      .limit(3);
    
    if (viewError) {
      console.error(`❌ popular_cars view: ${viewError.message}`);
    } else {
      console.log(`✅ popular_cars view: ${popularCars?.length || 0} records`);
    }
    
    console.log('\n🎉 Database test completed!');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testDatabase();
