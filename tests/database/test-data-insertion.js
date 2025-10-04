#!/usr/bin/env node

/**
 * 步骤 4: 数据库数据插入测试
 * 测试示例数据的插入和查询功能
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

/**
 * Test sample data insertion and retrieval
 */
async function testDataInsertion() {
  console.log('📊 测试数据插入和查询');
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

  const results = {};

  // Test cars data
  try {
    console.log('\n🚗 测试汽车数据');
    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .select('*')
      .limit(5);

    if (carsError) {
      console.log(`❌ 汽车数据查询失败: ${carsError.message}`);
      results.cars = false;
    } else {
      console.log(`✅ 汽车数据查询成功，找到 ${carsData.length} 条记录`);
      if (carsData.length > 0) {
        console.log(`   示例: ${carsData[0].make} ${carsData[0].model}`);
      }
      results.cars = carsData.length > 0;
    }
  } catch (error) {
    console.log(`❌ 汽车数据测试失败: ${error.message}`);
    results.cars = false;
  }

  // Test users data
  try {
    console.log('\n👤 测试用户数据');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      console.log(`❌ 用户数据查询失败: ${usersError.message}`);
      results.users = false;
    } else {
      console.log(`✅ 用户数据查询成功，找到 ${usersData.length} 条记录`);
      if (usersData.length > 0) {
        console.log(`   示例: ${usersData[0].name} (${usersData[0].email})`);
      }
      results.users = usersData.length > 0;
    }
  } catch (error) {
    console.log(`❌ 用户数据测试失败: ${error.message}`);
    results.users = false;
  }

  // Test conversations data
  try {
    console.log('\n💬 测试对话数据');
    const { data: convData, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .limit(5);

    if (convError) {
      console.log(`❌ 对话数据查询失败: ${convError.message}`);
      results.conversations = false;
    } else {
      console.log(`✅ 对话数据查询成功，找到 ${convData.length} 条记录`);
      if (convData.length > 0) {
        console.log(`   示例: ${convData[0].title}`);
      }
      results.conversations = convData.length > 0;
    }
  } catch (error) {
    console.log(`❌ 对话数据测试失败: ${error.message}`);
    results.conversations = false;
  }

  // Test messages data
  try {
    console.log('\n📝 测试消息数据');
    const { data: msgData, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .limit(5);

    if (msgError) {
      console.log(`❌ 消息数据查询失败: ${msgError.message}`);
      results.messages = false;
    } else {
      console.log(`✅ 消息数据查询成功，找到 ${msgData.length} 条记录`);
      if (msgData.length > 0) {
        console.log(`   示例: ${msgData[0].content.substring(0, 50)}...`);
      }
      results.messages = msgData.length > 0;
    }
  } catch (error) {
    console.log(`❌ 消息数据测试失败: ${error.message}`);
    results.messages = false;
  }

  // Test recommendations data
  try {
    console.log('\n🎯 测试推荐数据');
    const { data: recData, error: recError } = await supabase
      .from('recommendations')
      .select('*')
      .limit(5);

    if (recError) {
      console.log(`❌ 推荐数据查询失败: ${recError.message}`);
      results.recommendations = false;
    } else {
      console.log(`✅ 推荐数据查询成功，找到 ${recData.length} 条记录`);
      if (recData.length > 0) {
        console.log(`   示例: 匹配分数 ${recData[0].match_score}`);
      }
      results.recommendations = recData.length > 0;
    }
  } catch (error) {
    console.log(`❌ 推荐数据测试失败: ${error.message}`);
    results.recommendations = false;
  }

  // Test next_steps data
  try {
    console.log('\n📋 测试下一步行动数据');
    const { data: stepsData, error: stepsError } = await supabase
      .from('next_steps')
      .select('*')
      .limit(5);

    if (stepsError) {
      console.log(`❌ 下一步行动数据查询失败: ${stepsError.message}`);
      results.next_steps = false;
    } else {
      console.log(`✅ 下一步行动数据查询成功，找到 ${stepsData.length} 条记录`);
      if (stepsData.length > 0) {
        console.log(`   示例: ${stepsData[0].title_zh}`);
      }
      results.next_steps = stepsData.length > 0;
    }
  } catch (error) {
    console.log(`❌ 下一步行动数据测试失败: ${error.message}`);
    results.next_steps = false;
  }

  return results;
}

/**
 * Test data relationships and foreign keys
 */
async function testDataRelationships() {
  console.log('\n🔗 测试数据关系和外键');
  console.log('==============================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Test conversation-user relationship
  try {
    console.log('\n👤💬 测试对话-用户关系');
    const { data: convUserData, error: convUserError } = await supabase
      .from('conversations')
      .select(`
        id,
        title,
        users!inner(id, name, email)
      `)
      .limit(3);

    if (convUserError) {
      console.log(`⚠️  对话-用户关系测试: ${convUserError.message}`);
    } else {
      console.log(`✅ 对话-用户关系正常，找到 ${convUserData.length} 条关联记录`);
    }
  } catch (error) {
    console.log(`❌ 对话-用户关系测试失败: ${error.message}`);
  }

  // Test message-conversation relationship
  try {
    console.log('\n💬📝 测试消息-对话关系');
    const { data: msgConvData, error: msgConvError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        conversations!inner(id, title)
      `)
      .limit(3);

    if (msgConvError) {
      console.log(`⚠️  消息-对话关系测试: ${msgConvError.message}`);
    } else {
      console.log(`✅ 消息-对话关系正常，找到 ${msgConvData.length} 条关联记录`);
    }
  } catch (error) {
    console.log(`❌ 消息-对话关系测试失败: ${error.message}`);
  }

  // Test recommendation relationships
  try {
    console.log('\n🎯🔗 测试推荐关系');
    const { data: recData, error: recError } = await supabase
      .from('recommendations')
      .select(`
        id,
        match_score,
        conversations!inner(id, title),
        cars!inner(id, make, model)
      `)
      .limit(3);

    if (recError) {
      console.log(`⚠️  推荐关系测试: ${recError.message}`);
    } else {
      console.log(`✅ 推荐关系正常，找到 ${recData.length} 条关联记录`);
    }
  } catch (error) {
    console.log(`❌ 推荐关系测试失败: ${error.message}`);
  }

  // Test next_steps relationships
  try {
    console.log('\n📋🔗 测试下一步行动关系');
    const { data: stepsData, error: stepsError } = await supabase
      .from('next_steps')
      .select(`
        id,
        title_zh,
        conversations!inner(id, title)
      `)
      .limit(3);

    if (stepsError) {
      console.log(`⚠️  下一步行动关系测试: ${stepsError.message}`);
    } else {
      console.log(`✅ 下一步行动关系正常，找到 ${stepsData.length} 条关联记录`);
    }
  } catch (error) {
    console.log(`❌ 下一步行动关系测试失败: ${error.message}`);
  }
}

/**
 * Test data integrity and constraints
 */
async function testDataIntegrity() {
  console.log('\n🛡️  测试数据完整性和约束');
  console.log('==============================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Test unique constraints
  try {
    console.log('\n🔑 测试唯一性约束');
    
    // Test email uniqueness in users
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('email')
      .limit(10);

    if (usersError) {
      console.log(`⚠️  用户邮箱唯一性测试: ${usersError.message}`);
    } else {
      const emails = usersData.map(user => user.email);
      const uniqueEmails = new Set(emails);
      if (emails.length === uniqueEmails.size) {
        console.log('✅ 用户邮箱唯一性约束正常');
      } else {
        console.log('❌ 发现重复的邮箱地址');
      }
    }
  } catch (error) {
    console.log(`❌ 唯一性约束测试失败: ${error.message}`);
  }

  // Test data types and formats
  try {
    console.log('\n📋 测试数据类型和格式');
    
    // Test cars data types
    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .select('price_min, price_max, reliability_score, fuel_economy, safety_rating')
      .limit(5);

    if (carsError) {
      console.log(`⚠️  汽车数据类型测试: ${carsError.message}`);
    } else {
      let dataTypesValid = true;
      for (const car of carsData) {
        if (typeof car.price_min !== 'number' || typeof car.price_max !== 'number') {
          dataTypesValid = false;
          break;
        }
      }
      console.log(dataTypesValid ? '✅ 汽车数据类型正确' : '❌ 汽车数据类型错误');
    }
  } catch (error) {
    console.log(`❌ 数据类型测试失败: ${error.message}`);
  }

  // Test enum values
  try {
    console.log('\n📝 测试枚举值');
    
    // Test message types
    const { data: msgData, error: msgError } = await supabase
      .from('messages')
      .select('type')
      .limit(10);

    if (msgError) {
      console.log(`⚠️  消息类型枚举测试: ${msgError.message}`);
    } else {
      const validTypes = ['user', 'assistant', 'system'];
      const messageTypes = msgData.map(msg => msg.type);
      const invalidTypes = messageTypes.filter(type => !validTypes.includes(type));
      
      if (invalidTypes.length === 0) {
        console.log('✅ 消息类型枚举值正确');
      } else {
        console.log(`❌ 发现无效的消息类型: ${invalidTypes.join(', ')}`);
      }
    }
  } catch (error) {
    console.log(`❌ 枚举值测试失败: ${error.message}`);
  }
}

/**
 * Run all data insertion tests
 */
async function runAllTests() {
  console.log('🚀 开始数据库数据插入测试');
  console.log('====================================');

  const dataResults = await testDataInsertion();
  await testDataRelationships();
  await testDataIntegrity();

  console.log('\n📊 数据插入测试结果汇总');
  console.log('==============================');
  
  const tableNames = Object.keys(dataResults);
  let allDataPresent = true;

  for (const tableName of tableNames) {
    const status = dataResults[tableName] ? '✅ 有数据' : '❌ 无数据';
    console.log(`${tableName}: ${status}`);
    if (!dataResults[tableName]) {
      allDataPresent = false;
    }
  }

  console.log('\n🏁 数据库数据插入测试完成');
  console.log('==============================');
  console.log(`总体结果: ${allDataPresent ? '✅ 所有表都有数据' : '❌ 部分表缺少数据'}`);

  if (!allDataPresent) {
    console.log('\n💡 建议:');
    console.log('1. 运行示例数据插入脚本');
    console.log('2. 检查数据插入脚本是否正确执行');
    console.log('3. 验证数据库权限设置');
  }

  return allDataPresent;
}

// Run tests if this file is executed directly
if (process.argv[1].endsWith('test-data-insertion.js')) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('测试过程中发生错误:', error);
    process.exit(1);
  });
}

export { runAllTests };
