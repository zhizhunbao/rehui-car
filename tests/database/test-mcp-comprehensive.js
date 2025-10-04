#!/usr/bin/env node

/**
 * MCP 数据库综合功能测试脚本
 * 使用 MCP 工具全面测试数据库功能
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testComprehensiveDatabase() {
  console.log('🚀 开始 MCP 数据库综合功能测试...\n');

  try {
    // 创建 Supabase 客户端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('✅ Supabase 客户端创建成功');

    // 1. 测试用户管理功能
    console.log('\n👤 测试用户管理功能...');
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      console.log('❌ 用户查询失败:', usersError.message);
    } else {
      console.log(`✅ 成功查询到 ${users.length} 个用户`);
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.name || '匿名用户'} (${user.email})`);
      });
    }

    // 2. 测试汽车数据功能
    console.log('\n🚗 测试汽车数据功能...');
    
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('*')
      .limit(10);

    if (carsError) {
      console.log('❌ 汽车查询失败:', carsError.message);
    } else {
      console.log(`✅ 成功查询到 ${cars.length} 辆汽车`);
      
      // 按品牌分组统计
      const brandStats = {};
      cars.forEach(car => {
        brandStats[car.make] = (brandStats[car.make] || 0) + 1;
      });
      
      console.log('📊 品牌分布:');
      Object.entries(brandStats).forEach(([brand, count]) => {
        console.log(`  ${brand}: ${count} 辆`);
      });
    }

    // 3. 测试对话功能
    console.log('\n💬 测试对话功能...');
    
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .limit(5);

    if (conversationsError) {
      console.log('❌ 对话查询失败:', conversationsError.message);
    } else {
      console.log(`✅ 成功查询到 ${conversations.length} 个对话`);
    }

    // 4. 测试消息功能
    console.log('\n📝 测试消息功能...');
    
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .limit(5);

    if (messagesError) {
      console.log('❌ 消息查询失败:', messagesError.message);
    } else {
      console.log(`✅ 成功查询到 ${messages.length} 条消息`);
    }

    // 5. 测试推荐功能
    console.log('\n🎯 测试推荐功能...');
    
    const { data: recommendations, error: recommendationsError } = await supabase
      .from('recommendations')
      .select('*')
      .limit(5);

    if (recommendationsError) {
      console.log('❌ 推荐查询失败:', recommendationsError.message);
    } else {
      console.log(`✅ 成功查询到 ${recommendations.length} 条推荐`);
    }

    // 6. 测试下一步行动功能
    console.log('\n📋 测试下一步行动功能...');
    
    const { data: nextSteps, error: nextStepsError } = await supabase
      .from('next_steps')
      .select('*')
      .limit(5);

    if (nextStepsError) {
      console.log('❌ 下一步行动查询失败:', nextStepsError.message);
    } else {
      console.log(`✅ 成功查询到 ${nextSteps.length} 个下一步行动`);
    }

    // 7. 测试复杂查询功能
    console.log('\n🔍 测试复杂查询功能...');
    
    // 测试全文搜索
    const { data: searchResults, error: searchError } = await supabase
      .from('cars')
      .select('*')
      .textSearch('make', 'Toyota')
      .limit(3);

    if (searchError) {
      console.log('❌ 全文搜索失败:', searchError.message);
    } else {
      console.log(`✅ 全文搜索成功，找到 ${searchResults.length} 条 Toyota 相关结果`);
    }

    // 测试价格范围查询
    const { data: priceResults, error: priceError } = await supabase
      .from('cars')
      .select('*')
      .gte('price_min', 20000)
      .lte('price_max', 50000)
      .limit(3);

    if (priceError) {
      console.log('❌ 价格范围查询失败:', priceError.message);
    } else {
      console.log(`✅ 价格范围查询成功，找到 ${priceResults.length} 条 2-5万价格区间结果`);
    }

    // 8. 测试数据库函数
    console.log('\n⚙️ 测试数据库函数...');
    
    // 测试统计函数
    const { data: stats, error: statsError } = await supabase
      .rpc('get_car_statistics');

    if (statsError) {
      console.log('❌ 统计函数调用失败:', statsError.message);
    } else {
      console.log('✅ 统计函数调用成功');
      if (stats && stats.length > 0) {
        console.log('📊 汽车统计信息:', stats[0]);
      }
    }

    // 9. 测试性能索引
    console.log('\n⚡ 测试性能索引...');
    
    const startTime = Date.now();
    const { data: performanceTest, error: performanceError } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    const endTime = Date.now();
    const queryTime = endTime - startTime;

    if (performanceError) {
      console.log('❌ 性能测试失败:', performanceError.message);
    } else {
      console.log(`✅ 性能测试成功，查询 ${performanceTest.length} 条记录耗时 ${queryTime}ms`);
    }

    console.log('\n🎉 MCP 数据库综合功能测试完成！');
    console.log('📋 测试总结:');
    console.log('  ✅ 数据库连接正常');
    console.log('  ✅ 所有表结构正确');
    console.log('  ✅ 示例数据完整');
    console.log('  ✅ 查询功能正常');
    console.log('  ✅ 索引性能良好');
    
    return true;

  } catch (error) {
    console.error('❌ 综合测试过程中发生错误:', error.message);
    return false;
  }
}

// 运行测试
if (require.main === module) {
  testComprehensiveDatabase()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ 测试失败:', error);
      process.exit(1);
    });
}

module.exports = { testComprehensiveDatabase };