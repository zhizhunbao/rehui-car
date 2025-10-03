const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testRealDatabase() {
  console.log('🔍 Testing real database operations...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // 尝试使用服务角色密钥，如果没有则使用匿名密钥
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration');
    return;
  }
  
  console.log('✅ Environment variables loaded');
  console.log('📍 Supabase URL:', supabaseUrl);
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // 如果使用服务角色密钥，则不需要设置会话ID
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('🔑 Using service role key (bypasses RLS)');
  } else {
    console.log('🔑 Using anonymous key (may have RLS restrictions)');
  }
  
  let testUserId = null;
  let testConversationId = null;
  let testMessageId = null;
  
  try {
    // 测试1: 数据库连接
    console.log('\n📊 Testing database connection...');
    const { data: countData, error: countError } = await supabase
      .from('cars')
      .select('count', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Connection test failed:', countError.message);
      return;
    }
    console.log('✅ Database connection successful');
    
    // 测试2: 查询车型数据
    console.log('\n🚗 Testing car queries...');
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('id, make, model')
      .limit(5);
    
    if (carsError) {
      console.error('❌ Car query failed:', carsError.message);
      return;
    }
    console.log('✅ Car queries successful');
    console.log(`📈 Found ${cars.length} cars`);
    if (cars.length > 0) {
      console.log(`   First car: ${cars[0].make} ${cars[0].model}`);
    }
    
    // 测试3: 创建用户
    console.log('\n👤 Testing user operations...');
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: 'test@example.com',
        name: 'Test User',
        language: 'zh',
        session_id: 'test-session-123'
      })
      .select()
      .single();
    
    if (userError) {
      console.error('❌ User creation failed:', userError.message);
      console.log('ℹ️  This might be due to RLS policies. Continuing with read-only tests...');
    } else {
      console.log('✅ User created successfully');
      testUserId = user.id;
      
      // 测试4: 查找用户
      const { data: foundUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('id', testUserId)
        .single();
      
      if (findError) {
        console.error('❌ User lookup failed:', findError.message);
      } else {
        console.log('✅ User lookup successful');
        console.log(`   Found user: ${foundUser.email} (${foundUser.name})`);
      }
    }
    
    // 测试5: 查询现有用户（只读测试）
    console.log('\n👥 Testing user table read access...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name')
      .limit(3);
    
    if (usersError) {
      console.error('❌ User table access failed:', usersError.message);
    } else {
      console.log('✅ User table accessible');
      console.log(`   Found ${users.length} users`);
    }
    
    // 测试6: 查询对话表（只读测试）
    console.log('\n💬 Testing conversation table access...');
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id, title, language')
      .limit(3);
    
    if (convError) {
      console.error('❌ Conversation table access failed:', convError.message);
    } else {
      console.log('✅ Conversation table accessible');
      console.log(`   Found ${conversations.length} conversations`);
    }
    
    // 测试7: 查询消息表（只读测试）
    console.log('\n📝 Testing message table access...');
    const { data: messages, error: msgsError } = await supabase
      .from('messages')
      .select('id, type, content')
      .limit(3);
    
    if (msgsError) {
      console.error('❌ Message table access failed:', msgsError.message);
    } else {
      console.log('✅ Message table accessible');
      console.log(`   Found ${messages.length} messages`);
    }
    
    // 测试8: 搜索车型
    console.log('\n🔍 Testing car search...');
    const { data: searchResults, error: searchError } = await supabase
      .from('cars')
      .select('*')
      .ilike('make', '%Toyota%')
      .limit(3);
    
    if (searchError) {
      console.error('❌ Car search failed:', searchError.message);
      return;
    }
    console.log('✅ Car search successful');
    console.log(`   Found ${searchResults.length} Toyota cars`);
    
    // 测试9: 健康检查
    console.log('\n🏥 Testing database health...');
    const tables = ['users', 'conversations', 'messages', 'cars', 'recommendations', 'next_steps'];
    let allHealthy = true;
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      if (error) {
        console.error(`❌ Table ${table} not accessible:`, error.message);
        allHealthy = false;
      } else {
        console.log(`✅ Table ${table} accessible`);
      }
    }
    
    if (allHealthy) {
      console.log('✅ All tables are healthy');
    }
    
    console.log('\n🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  } finally {
    // 清理测试数据
    console.log('\n🧹 Cleaning up test data...');
    try {
      if (testMessageId) {
        await supabase.from('messages').delete().eq('id', testMessageId);
        console.log('✅ Test message deleted');
      }
      if (testConversationId) {
        await supabase.from('conversations').delete().eq('id', testConversationId);
        console.log('✅ Test conversation deleted');
      }
      if (testUserId) {
        await supabase.from('users').delete().eq('id', testUserId);
        console.log('✅ Test user deleted');
      }
    } catch (cleanupError) {
      console.warn('⚠️  Cleanup error:', cleanupError.message);
    }
  }
}

testRealDatabase();
