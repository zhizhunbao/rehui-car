#!/usr/bin/env node

/**
 * MCP 数据库连接测试脚本
 * 使用 MCP 工具验证数据库连接和表结构
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testDatabaseConnection() {
  console.log('🔍 开始 MCP 数据库连接测试...\n');

  try {
    // 创建 Supabase 客户端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('✅ Supabase 客户端创建成功');
    console.log(`📡 连接 URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);

    // 测试基本连接
    console.log('\n🔌 测试数据库连接...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('❌ 数据库连接失败:', connectionError.message);
      return false;
    }

    console.log('✅ 数据库连接成功');

    // 检查所有表是否存在
    console.log('\n📋 检查数据库表结构...');
    
    const tables = [
      'users',
      'cars', 
      'conversations',
      'messages',
      'recommendations',
      'next_steps'
    ];

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ 表 ${table} 不存在或无法访问: ${error.message}`);
        } else {
          console.log(`✅ 表 ${table} 存在且可访问`);
        }
      } catch (err) {
        console.log(`❌ 表 ${table} 检查失败: ${err.message}`);
      }
    }

    // 检查示例数据
    console.log('\n📊 检查示例数据...');
    
    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .select('*')
      .limit(5);

    if (carsError) {
      console.log('❌ 无法获取汽车数据:', carsError.message);
    } else {
      console.log(`✅ 找到 ${carsData.length} 条汽车数据`);
      if (carsData.length > 0) {
        console.log('📝 示例汽车数据:');
        carsData.forEach((car, index) => {
          console.log(`  ${index + 1}. ${car.make} ${car.model} (${car.year_min}-${car.year_max})`);
        });
      }
    }

    // 检查用户数据
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(3);

    if (usersError) {
      console.log('❌ 无法获取用户数据:', usersError.message);
    } else {
      console.log(`✅ 找到 ${usersData.length} 条用户数据`);
    }

    console.log('\n🎉 MCP 数据库测试完成！');
    return true;

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
    return false;
  }
}

// 运行测试
if (require.main === module) {
  testDatabaseConnection()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ 测试失败:', error);
      process.exit(1);
    });
}

module.exports = { testDatabaseConnection };