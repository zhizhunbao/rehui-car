/**
 * GROQ AI 测试脚本
 * 测试 GROQ AI 集成的各项功能
 */

const { execSync } = require('child_process');
const path = require('path');

// 测试配置
const TEST_CONFIG = {
  timeout: 30000, // 30秒超时
  retries: 3,
  verbose: true
};

// 测试用例
const testCases = [
  {
    name: 'GROQ Health Check',
    description: '测试 GROQ API 连接状态',
    test: async () => {
      try {
        const { healthCheck } = await import('../src/lib/groq.ts');
        const isHealthy = await healthCheck();
        return {
          success: isHealthy,
          message: isHealthy ? 'GROQ API 连接正常' : 'GROQ API 连接失败'
        };
      } catch (error) {
        return {
          success: false,
          message: `GROQ 健康检查失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'GROQ Chat Response',
    description: '测试 GROQ 聊天响应生成',
    test: async () => {
      try {
        const { generateChatResponse } = await import('../src/lib/groq.ts');
        
        const messages = [
          {
            role: 'user',
            content: 'I need a car for commuting to work, budget around $30,000'
          }
        ];
        
        const response = await generateChatResponse(messages, 'en');
        
        return {
          success: response && response.summary && response.recommendations,
          message: response ? 'GROQ 聊天响应生成成功' : 'GROQ 聊天响应生成失败',
          data: response
        };
      } catch (error) {
        return {
          success: false,
          message: `GROQ 聊天响应测试失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'GROQ Car Recommendation',
    description: '测试 GROQ 车型推荐功能',
    test: async () => {
      try {
        const { generateCarRecommendation } = await import('../src/lib/groq.ts');
        
        const userMessage = 'I want a family SUV with good fuel economy, budget $40,000';
        const response = await generateCarRecommendation(userMessage, 'en');
        
        return {
          success: response && response.recommendations && response.recommendations.length > 0,
          message: response ? 'GROQ 车型推荐生成成功' : 'GROQ 车型推荐生成失败',
          data: response
        };
      } catch (error) {
        return {
          success: false,
          message: `GROQ 车型推荐测试失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'GROQ Conversation Summary',
    description: '测试 GROQ 对话摘要生成',
    test: async () => {
      try {
        const { generateConversationSummary } = await import('../src/lib/groq.ts');
        
        const messages = [
          {
            role: 'user',
            content: 'I need help choosing a car'
          },
          {
            role: 'assistant',
            content: 'I can help you find the perfect car. What is your budget?'
          },
          {
            role: 'user',
            content: 'Around $25,000, looking for something reliable'
          }
        ];
        
        const summary = await generateConversationSummary(messages, 'en');
        
        return {
          success: summary && summary.en && summary.zh,
          message: summary ? 'GROQ 对话摘要生成成功' : 'GROQ 对话摘要生成失败',
          data: summary
        };
      } catch (error) {
        return {
          success: false,
          message: `GROQ 对话摘要测试失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'GROQ Chinese Support',
    description: '测试 GROQ 中文支持',
    test: async () => {
      try {
        const { generateChatResponse } = await import('../src/lib/groq.ts');
        
        const messages = [
          {
            role: 'user',
            content: '我需要一辆家用车，预算30万人民币'
          }
        ];
        
        const response = await generateChatResponse(messages, 'zh');
        
        return {
          success: response && response.summary && response.summary.zh,
          message: response ? 'GROQ 中文支持正常' : 'GROQ 中文支持失败',
          data: response
        };
      } catch (error) {
        return {
          success: false,
          message: `GROQ 中文支持测试失败: ${error.message}`
        };
      }
    }
  }
];

/**
 * 运行单个测试
 */
async function runTest(testCase) {
  console.log(`\n🧪 运行测试: ${testCase.name}`);
  console.log(`📝 描述: ${testCase.description}`);
  
  const startTime = Date.now();
  
  try {
    const result = await Promise.race([
      testCase.test(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('测试超时')), TEST_CONFIG.timeout)
      )
    ]);
    
    const duration = Date.now() - startTime;
    
    if (result.success) {
      console.log(`✅ 测试通过 (${duration}ms)`);
      if (result.message) {
        console.log(`💬 ${result.message}`);
      }
      if (TEST_CONFIG.verbose && result.data) {
        console.log(`📊 响应数据:`, JSON.stringify(result.data, null, 2));
      }
    } else {
      console.log(`❌ 测试失败 (${duration}ms)`);
      console.log(`💬 ${result.message}`);
    }
    
    return {
      name: testCase.name,
      success: result.success,
      duration,
      message: result.message,
      data: result.data
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`❌ 测试异常 (${duration}ms)`);
    console.log(`💬 错误: ${error.message}`);
    
    return {
      name: testCase.name,
      success: false,
      duration,
      message: error.message,
      error: error
    };
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('🚀 开始 GROQ AI 测试');
  console.log('=' .repeat(50));
  
  const results = [];
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    const result = await runTest(testCase);
    results.push(result);
    
    if (result.success) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 测试结果汇总');
  console.log('=' .repeat(50));
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`📈 总计: ${results.length}`);
  console.log(`📊 成功率: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  // 显示失败的测试
  const failedTests = results.filter(r => !r.success);
  if (failedTests.length > 0) {
    console.log('\n❌ 失败的测试:');
    failedTests.forEach(test => {
      console.log(`  - ${test.name}: ${test.message}`);
    });
  }
  
  return {
    total: results.length,
    passed,
    failed,
    results
  };
}

/**
 * 主函数
 */
async function main() {
  try {
    const results = await runAllTests();
    
    if (results.failed > 0) {
      process.exit(1);
    } else {
      console.log('\n🎉 所有测试通过！');
      process.exit(0);
    }
  } catch (error) {
    console.error('💥 测试运行失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  runTest,
  runAllTests,
  testCases
};
