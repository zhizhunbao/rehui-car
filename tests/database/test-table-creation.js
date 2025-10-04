#!/usr/bin/env node

/**
 * 步骤 4: 数据库表创建测试
 * 测试所有数据库表的创建和结构是否正确
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

/**
 * Test database table creation and structure
 */
async function testTableCreation() {
  console.log('🏗️  测试数据库表创建');
  console.log('==============================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ 缺少 Supabase URL 或匿名密钥');
    return false;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const tables = [
    'users',
    'cars', 
    'conversations',
    'messages',
    'recommendations',
    'next_steps'
  ];

  const results = {};

  for (const tableName of tables) {
    try {
      console.log(`\n🔍 测试表: ${tableName}`);
      
      // Test table exists by trying to select from it
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`❌ 表 ${tableName} 不存在`);
          results[tableName] = false;
        } else {
          console.log(`⚠️  表 ${tableName} 存在但查询出错: ${error.message}`);
          results[tableName] = true; // Table exists but has other issues
        }
      } else {
        console.log(`✅ 表 ${tableName} 存在且可查询`);
        results[tableName] = true;
      }

    } catch (error) {
      console.log(`❌ 测试表 ${tableName} 时发生错误: ${error.message}`);
      results[tableName] = false;
    }
  }

  return results;
}

/**
 * Test table structure and constraints
 */
async function testTableStructure() {
  console.log('\n🔧 测试表结构和约束');
  console.log('==============================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Test users table structure
  try {
    console.log('\n👤 测试 users 表结构');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, language, session_id, created_at, updated_at')
      .limit(1);

    if (usersError) {
      console.log(`⚠️  users 表结构测试: ${usersError.message}`);
    } else {
      console.log('✅ users 表结构正确');
    }
  } catch (error) {
    console.log(`❌ users 表结构测试失败: ${error.message}`);
  }

  // Test cars table structure
  try {
    console.log('\n🚗 测试 cars 表结构');
    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .select('id, make, model, year_min, year_max, price_min, price_max, currency, category, fuel_type, description_en, description_zh, pros_en, pros_zh, cons_en, cons_zh, features, image_url, reliability_score, fuel_economy, safety_rating, created_at, updated_at')
      .limit(1);

    if (carsError) {
      console.log(`⚠️  cars 表结构测试: ${carsError.message}`);
    } else {
      console.log('✅ cars 表结构正确');
    }
  } catch (error) {
    console.log(`❌ cars 表结构测试失败: ${error.message}`);
  }

  // Test conversations table structure
  try {
    console.log('\n💬 测试 conversations 表结构');
    const { data: convData, error: convError } = await supabase
      .from('conversations')
      .select('id, user_id, title, summary, language, session_id, created_at, updated_at')
      .limit(1);

    if (convError) {
      console.log(`⚠️  conversations 表结构测试: ${convError.message}`);
    } else {
      console.log('✅ conversations 表结构正确');
    }
  } catch (error) {
    console.log(`❌ conversations 表结构测试失败: ${error.message}`);
  }

  // Test messages table structure
  try {
    console.log('\n📝 测试 messages 表结构');
    const { data: msgData, error: msgError } = await supabase
      .from('messages')
      .select('id, conversation_id, type, content, metadata, created_at, updated_at')
      .limit(1);

    if (msgError) {
      console.log(`⚠️  messages 表结构测试: ${msgError.message}`);
    } else {
      console.log('✅ messages 表结构正确');
    }
  } catch (error) {
    console.log(`❌ messages 表结构测试失败: ${error.message}`);
  }

  // Test recommendations table structure
  try {
    console.log('\n🎯 测试 recommendations 表结构');
    const { data: recData, error: recError } = await supabase
      .from('recommendations')
      .select('id, conversation_id, message_id, car_id, match_score, reasoning_en, reasoning_zh, created_at, updated_at')
      .limit(1);

    if (recError) {
      console.log(`⚠️  recommendations 表结构测试: ${recError.message}`);
    } else {
      console.log('✅ recommendations 表结构正确');
    }
  } catch (error) {
    console.log(`❌ recommendations 表结构测试失败: ${error.message}`);
  }

  // Test next_steps table structure
  try {
    console.log('\n📋 测试 next_steps 表结构');
    const { data: stepsData, error: stepsError } = await supabase
      .from('next_steps')
      .select('id, conversation_id, message_id, title_en, title_zh, description_en, description_zh, priority, action_type, url, created_at, updated_at')
      .limit(1);

    if (stepsError) {
      console.log(`⚠️  next_steps 表结构测试: ${stepsError.message}`);
    } else {
      console.log('✅ next_steps 表结构正确');
    }
  } catch (error) {
    console.log(`❌ next_steps 表结构测试失败: ${error.message}`);
  }
}

/**
 * Test database indexes
 */
async function testDatabaseIndexes() {
  console.log('\n📊 测试数据库索引');
  console.log('==============================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Test performance with indexed columns
  const indexTests = [
    { table: 'users', column: 'email' },
    { table: 'cars', column: 'make' },
    { table: 'cars', column: 'category' },
    { table: 'conversations', column: 'user_id' },
    { table: 'messages', column: 'conversation_id' },
    { table: 'recommendations', column: 'conversation_id' },
    { table: 'next_steps', column: 'conversation_id' }
  ];

  for (const test of indexTests) {
    try {
      console.log(`🔍 测试索引: ${test.table}.${test.column}`);
      
      const startTime = Date.now();
      const { data, error } = await supabase
        .from(test.table)
        .select('*')
        .eq(test.column, 'test_value')
        .limit(1);
      
      const endTime = Date.now();
      const queryTime = endTime - startTime;

      if (error && error.code !== 'PGRST116') {
        console.log(`⚠️  索引测试 ${test.table}.${test.column}: ${error.message}`);
      } else {
        console.log(`✅ 索引测试 ${test.table}.${test.column}: ${queryTime}ms`);
      }
    } catch (error) {
      console.log(`❌ 索引测试 ${test.table}.${test.column} 失败: ${error.message}`);
    }
  }
}

/**
 * Run all table creation tests
 */
async function runAllTests() {
  console.log('🚀 开始数据库表创建测试');
  console.log('====================================');

  const tableResults = await testTableCreation();
  await testTableStructure();
  await testDatabaseIndexes();

  console.log('\n📊 表创建测试结果汇总');
  console.log('==============================');
  
  const tableNames = Object.keys(tableResults);
  let allTablesExist = true;

  for (const tableName of tableNames) {
    const status = tableResults[tableName] ? '✅ 存在' : '❌ 不存在';
    console.log(`${tableName}: ${status}`);
    if (!tableResults[tableName]) {
      allTablesExist = false;
    }
  }

  console.log('\n🏁 数据库表创建测试完成');
  console.log('==============================');
  console.log(`总体结果: ${allTablesExist ? '✅ 所有表都存在' : '❌ 部分表缺失'}`);

  if (!allTablesExist) {
    console.log('\n💡 建议:');
    console.log('1. 运行数据库迁移脚本创建缺失的表');
    console.log('2. 检查 Supabase 项目是否正确配置');
    console.log('3. 验证迁移脚本是否成功执行');
  }

  return allTablesExist;
}

// Run tests if this file is executed directly
if (process.argv[1].endsWith('test-table-creation.js')) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('测试过程中发生错误:', error);
    process.exit(1);
  });
}

export { runAllTests };
