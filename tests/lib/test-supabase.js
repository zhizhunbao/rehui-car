#!/usr/bin/env node

/**
 * 步骤 4: Supabase 客户端测试
 * 测试 Supabase 客户端的配置和功能
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

/**
 * Test Supabase client configuration
 */
async function testSupabaseClient() {
  console.log('🔧 测试 Supabase 客户端配置');
  console.log('==============================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ 缺少 Supabase URL 或匿名密钥');
    return false;
  }

  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('✅ Supabase 客户端创建成功');
    console.log(`   URL: ${supabaseUrl.substring(0, 50)}...`);
    console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...`);

    return true;
  } catch (error) {
    console.error('❌ Supabase 客户端创建失败:', error.message);
    return false;
  }
}

/**
 * Test basic database operations
 */
async function testBasicOperations() {
  console.log('\n🔍 测试基本数据库操作');
  console.log('==============================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const results = {};

  // Test users table operations
  try {
    console.log('\n👤 测试用户表操作');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, language, session_id, created_at, updated_at')
      .limit(5);

    if (usersError) {
      console.log(`⚠️  用户表查询: ${usersError.message}`);
      results.users = false;
    } else {
      console.log(`✅ 用户表查询成功，找到 ${usersData.length} 条记录`);
      results.users = true;
    }
  } catch (error) {
    console.log(`❌ 用户表操作失败: ${error.message}`);
    results.users = false;
  }

  // Test cars table operations
  try {
    console.log('\n🚗 测试汽车表操作');
    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .select('id, make, model, year_min, year_max, price_min, price_max, category, fuel_type')
      .limit(5);

    if (carsError) {
      console.log(`⚠️  汽车表查询: ${carsError.message}`);
      results.cars = false;
    } else {
      console.log(`✅ 汽车表查询成功，找到 ${carsData.length} 条记录`);
      results.cars = true;
    }
  } catch (error) {
    console.log(`❌ 汽车表操作失败: ${error.message}`);
    results.cars = false;
  }

  // Test conversations table operations
  try {
    console.log('\n💬 测试对话表操作');
    const { data: convData, error: convError } = await supabase
      .from('conversations')
      .select('id, user_id, title, summary, language, session_id, created_at, updated_at')
      .limit(5);

    if (convError) {
      console.log(`⚠️  对话表查询: ${convError.message}`);
      results.conversations = false;
    } else {
      console.log(`✅ 对话表查询成功，找到 ${convData.length} 条记录`);
      results.conversations = true;
    }
  } catch (error) {
    console.log(`❌ 对话表操作失败: ${error.message}`);
    results.conversations = false;
  }

  // Test messages table operations
  try {
    console.log('\n📝 测试消息表操作');
    const { data: msgData, error: msgError } = await supabase
      .from('messages')
      .select('id, conversation_id, type, content, metadata, created_at, updated_at')
      .limit(5);

    if (msgError) {
      console.log(`⚠️  消息表查询: ${msgError.message}`);
      results.messages = false;
    } else {
      console.log(`✅ 消息表查询成功，找到 ${msgData.length} 条记录`);
      results.messages = true;
    }
      } catch (error) {
    console.log(`❌ 消息表操作失败: ${error.message}`);
    results.messages = false;
  }

  // Test recommendations table operations
  try {
    console.log('\n🎯 测试推荐表操作');
    const { data: recData, error: recError } = await supabase
      .from('recommendations')
      .select('id, conversation_id, message_id, car_id, match_score, reasoning_en, reasoning_zh, created_at, updated_at')
      .limit(5);

    if (recError) {
      console.log(`⚠️  推荐表查询: ${recError.message}`);
      results.recommendations = false;
    } else {
      console.log(`✅ 推荐表查询成功，找到 ${recData.length} 条记录`);
      results.recommendations = true;
    }
  } catch (error) {
    console.log(`❌ 推荐表操作失败: ${error.message}`);
    results.recommendations = false;
  }

  // Test next_steps table operations
  try {
    console.log('\n📋 测试下一步行动表操作');
    const { data: stepsData, error: stepsError } = await supabase
      .from('next_steps')
      .select('id, conversation_id, message_id, title_en, title_zh, description_en, description_zh, priority, action_type, url, created_at, updated_at')
      .limit(5);

    if (stepsError) {
      console.log(`⚠️  下一步行动表查询: ${stepsError.message}`);
      results.next_steps = false;
    } else {
      console.log(`✅ 下一步行动表查询成功，找到 ${stepsData.length} 条记录`);
      results.next_steps = true;
    }
  } catch (error) {
    console.log(`❌ 下一步行动表操作失败: ${error.message}`);
    results.next_steps = false;
  }

  return results;
}

/**
 * Test advanced queries and relationships
 */
async function testAdvancedQueries() {
  console.log('\n🔗 测试高级查询和关系');
  console.log('==============================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const results = {};

  // Test conversation with user relationship
  try {
    console.log('\n👤💬 测试对话-用户关系查询');
    const { data: convUserData, error: convUserError } = await supabase
      .from('conversations')
      .select(`
        id,
        title,
        summary,
        language,
        users!inner(id, name, email, language)
      `)
      .limit(3);

    if (convUserError) {
      console.log(`⚠️  对话-用户关系查询: ${convUserError.message}`);
      results.conversationUser = false;
    } else {
      console.log(`✅ 对话-用户关系查询成功，找到 ${convUserData.length} 条记录`);
      results.conversationUser = true;
    }
  } catch (error) {
    console.log(`❌ 对话-用户关系查询失败: ${error.message}`);
    results.conversationUser = false;
  }

  // Test messages with conversation relationship
  try {
    console.log('\n💬📝 测试消息-对话关系查询');
    const { data: msgConvData, error: msgConvError } = await supabase
      .from('messages')
      .select(`
        id,
        type,
        content,
        created_at,
        conversations!inner(id, title, language)
      `)
      .limit(3);

    if (msgConvError) {
      console.log(`⚠️  消息-对话关系查询: ${msgConvError.message}`);
      results.messageConversation = false;
    } else {
      console.log(`✅ 消息-对话关系查询成功，找到 ${msgConvData.length} 条记录`);
      results.messageConversation = true;
    }
  } catch (error) {
    console.log(`❌ 消息-对话关系查询失败: ${error.message}`);
    results.messageConversation = false;
  }

  // Test recommendations with full relationships
  try {
    console.log('\n🎯🔗 测试推荐完整关系查询');
    const { data: recData, error: recError } = await supabase
      .from('recommendations')
      .select(`
        id,
        match_score,
        reasoning_zh,
        conversations!inner(id, title),
        cars!inner(id, make, model, category, fuel_type)
      `)
      .limit(3);

    if (recError) {
      console.log(`⚠️  推荐关系查询: ${recError.message}`);
      results.recommendationFull = false;
    } else {
      console.log(`✅ 推荐关系查询成功，找到 ${recData.length} 条记录`);
      results.recommendationFull = true;
    }
  } catch (error) {
    console.log(`❌ 推荐关系查询失败: ${error.message}`);
    results.recommendationFull = false;
  }

  // Test next_steps with conversation relationship
  try {
    console.log('\n📋🔗 测试下一步行动关系查询');
    const { data: stepsData, error: stepsError } = await supabase
      .from('next_steps')
      .select(`
        id,
        title_zh,
        description_zh,
        priority,
        action_type,
        conversations!inner(id, title)
      `)
      .limit(3);

    if (stepsError) {
      console.log(`⚠️  下一步行动关系查询: ${stepsError.message}`);
      results.nextStepsConversation = false;
    } else {
      console.log(`✅ 下一步行动关系查询成功，找到 ${stepsData.length} 条记录`);
      results.nextStepsConversation = true;
    }
  } catch (error) {
    console.log(`❌ 下一步行动关系查询失败: ${error.message}`);
    results.nextStepsConversation = false;
  }

  return results;
}

/**
 * Test filtering and search operations
 */
async function testFilteringAndSearch() {
  console.log('\n🔍 测试过滤和搜索操作');
  console.log('==============================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const results = {};

  // Test car filtering by category
  try {
    console.log('\n🚗 测试汽车分类过滤');
    const { data: sedanData, error: sedanError } = await supabase
      .from('cars')
      .select('id, make, model, category, fuel_type')
      .eq('category', 'sedan')
      .limit(5);

    if (sedanError) {
      console.log(`⚠️  轿车过滤查询: ${sedanError.message}`);
      results.carCategoryFilter = false;
    } else {
      console.log(`✅ 轿车过滤查询成功，找到 ${sedanData.length} 条记录`);
      results.carCategoryFilter = true;
    }
  } catch (error) {
    console.log(`❌ 汽车分类过滤失败: ${error.message}`);
    results.carCategoryFilter = false;
  }

  // Test car filtering by price range
  try {
    console.log('\n💰 测试汽车价格范围过滤');
    const { data: priceData, error: priceError } = await supabase
      .from('cars')
      .select('id, make, model, price_min, price_max')
      .gte('price_min', 200000)
      .lte('price_max', 300000)
      .limit(5);

    if (priceError) {
      console.log(`⚠️  价格范围过滤查询: ${priceError.message}`);
      results.carPriceFilter = false;
    } else {
      console.log(`✅ 价格范围过滤查询成功，找到 ${priceData.length} 条记录`);
      results.carPriceFilter = true;
    }
  } catch (error) {
    console.log(`❌ 汽车价格过滤失败: ${error.message}`);
    results.carPriceFilter = false;
  }

  // Test message filtering by type
  try {
    console.log('\n📝 测试消息类型过滤');
    const { data: msgData, error: msgError } = await supabase
      .from('messages')
      .select('id, type, content')
      .eq('type', 'user')
      .limit(5);

    if (msgError) {
      console.log(`⚠️  用户消息过滤查询: ${msgError.message}`);
      results.messageTypeFilter = false;
    } else {
      console.log(`✅ 用户消息过滤查询成功，找到 ${msgData.length} 条记录`);
      results.messageTypeFilter = true;
    }
  } catch (error) {
    console.log(`❌ 消息类型过滤失败: ${error.message}`);
    results.messageTypeFilter = false;
  }

  // Test recommendation filtering by match score
  try {
    console.log('\n🎯 测试推荐匹配分数过滤');
    const { data: recData, error: recError } = await supabase
      .from('recommendations')
      .select('id, match_score, reasoning_zh')
      .gte('match_score', 0.8)
      .order('match_score', { ascending: false })
      .limit(5);

    if (recError) {
      console.log(`⚠️  推荐匹配分数过滤查询: ${recError.message}`);
      results.recommendationScoreFilter = false;
    } else {
      console.log(`✅ 推荐匹配分数过滤查询成功，找到 ${recData.length} 条记录`);
      results.recommendationScoreFilter = true;
    }
  } catch (error) {
    console.log(`❌ 推荐匹配分数过滤失败: ${error.message}`);
    results.recommendationScoreFilter = false;
  }

  return results;
}

/**
 * Test error handling and edge cases
 */
async function testErrorHandling() {
  console.log('\n⚠️  测试错误处理和边界情况');
  console.log('==============================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const results = {};

  // Test invalid table query
  try {
    console.log('\n❌ 测试无效表查询');
    const { data, error } = await supabase
      .from('invalid_table')
      .select('*')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      console.log('✅ 无效表查询正确返回错误');
      results.invalidTable = true;
    } else {
      console.log('⚠️  无效表查询未返回预期错误');
      results.invalidTable = false;
    }
  } catch (error) {
    console.log(`❌ 无效表查询测试失败: ${error.message}`);
    results.invalidTable = false;
  }

  // Test invalid column query
  try {
    console.log('\n❌ 测试无效列查询');
    const { data, error } = await supabase
      .from('users')
      .select('invalid_column')
      .limit(1);

    if (error) {
      console.log('✅ 无效列查询正确返回错误');
      results.invalidColumn = true;
    } else {
      console.log('⚠️  无效列查询未返回预期错误');
      results.invalidColumn = false;
    }
  } catch (error) {
    console.log(`❌ 无效列查询测试失败: ${error.message}`);
    results.invalidColumn = false;
  }

  // Test empty result query
  try {
    console.log('\n🔍 测试空结果查询');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'nonexistent@example.com')
      .limit(1);

    if (error) {
      console.log(`⚠️  空结果查询返回错误: ${error.message}`);
      results.emptyResult = false;
    } else {
      console.log(`✅ 空结果查询成功，返回 ${data.length} 条记录`);
      results.emptyResult = true;
    }
  } catch (error) {
    console.log(`❌ 空结果查询测试失败: ${error.message}`);
    results.emptyResult = false;
  }

  return results;
}

/**
 * Run all Supabase client tests
 */
async function runAllTests() {
  console.log('🚀 开始 Supabase 客户端测试');
  console.log('====================================');

  const clientResult = await testSupabaseClient();
  const basicResults = await testBasicOperations();
  const advancedResults = await testAdvancedQueries();
  const filterResults = await testFilteringAndSearch();
  const errorResults = await testErrorHandling();

  console.log('\n📊 Supabase 客户端测试结果汇总');
  console.log('==============================');
  
  // Basic operations results
  console.log('\n基本操作测试:');
  const basicTableNames = Object.keys(basicResults);
  let basicAllPassed = true;
  for (const tableName of basicTableNames) {
    const status = basicResults[tableName] ? '✅ 通过' : '❌ 失败';
    console.log(`  ${tableName}: ${status}`);
    if (!basicResults[tableName]) basicAllPassed = false;
  }

  // Advanced queries results
  console.log('\n高级查询测试:');
  const advancedTableNames = Object.keys(advancedResults);
  let advancedAllPassed = true;
  for (const queryName of advancedTableNames) {
    const status = advancedResults[queryName] ? '✅ 通过' : '❌ 失败';
    console.log(`  ${queryName}: ${status}`);
    if (!advancedResults[queryName]) advancedAllPassed = false;
  }

  // Filtering results
  console.log('\n过滤搜索测试:');
  const filterTableNames = Object.keys(filterResults);
  let filterAllPassed = true;
  for (const filterName of filterTableNames) {
    const status = filterResults[filterName] ? '✅ 通过' : '❌ 失败';
    console.log(`  ${filterName}: ${status}`);
    if (!filterResults[filterName]) filterAllPassed = false;
  }

  // Error handling results
  console.log('\n错误处理测试:');
  const errorTableNames = Object.keys(errorResults);
  let errorAllPassed = true;
  for (const errorName of errorTableNames) {
    const status = errorResults[errorName] ? '✅ 通过' : '❌ 失败';
    console.log(`  ${errorName}: ${status}`);
    if (!errorResults[errorName]) errorAllPassed = false;
  }

  const allPassed = clientResult && basicAllPassed && advancedAllPassed && filterAllPassed && errorAllPassed;

  console.log('\n🏁 Supabase 客户端测试完成');
  console.log('==============================');
  console.log(`客户端配置: ${clientResult ? '✅ 通过' : '❌ 失败'}`);
  console.log(`基本操作: ${basicAllPassed ? '✅ 通过' : '❌ 失败'}`);
  console.log(`高级查询: ${advancedAllPassed ? '✅ 通过' : '❌ 失败'}`);
  console.log(`过滤搜索: ${filterAllPassed ? '✅ 通过' : '❌ 失败'}`);
  console.log(`错误处理: ${errorAllPassed ? '✅ 通过' : '❌ 失败'}`);
  console.log(`总体结果: ${allPassed ? '✅ 全部通过' : '❌ 存在问题'}`);

  if (!allPassed) {
    console.log('\n💡 建议:');
    console.log('1. 检查数据库表是否正确创建');
    console.log('2. 验证示例数据是否正确插入');
    console.log('3. 检查 Supabase 项目配置');
    console.log('4. 验证网络连接和权限设置');
  }

  return allPassed;
}

// Run tests if this file is executed directly
if (process.argv[1].endsWith('test-supabase.js')) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('测试过程中发生错误:', error);
    process.exit(1);
  });
}

export { runAllTests };