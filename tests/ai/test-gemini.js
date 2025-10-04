/**
 * Gemini AI 测试脚本
 * 测试 Gemini AI 集成的各项功能
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
    name: 'Gemini Health Check',
    description: '测试 Gemini API 连接状态',
    test: async () => {
      try {
        const { healthCheck } = await import('../src/lib/gemini.ts');
        const isHealthy = await healthCheck();
        return {
          success: isHealthy,
          message: isHealthy ? 'Gemini API 连接正常' : 'Gemini API 连接失败'
        };
      } catch (error) {
        return {
          success: false,
          message: `Gemini 健康检查失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Gemini Chat Response',
    description: '测试 Gemini 聊天响应生成',
    test: async () => {
      try {
        const { generateChatResponse } = await import('../src/lib/gemini.ts');
        
        const messages = [
          {
            role: 'user',
            content: 'I need a reliable car for daily commuting, budget around $25,000'
          }
        ];
        
        const response = await generateChatResponse(messages, 'en');
        
        return {
          success: response && response.summary && response.recommendations,
          message: response ? 'Gemini 聊天响应生成成功' : 'Gemini 聊天响应生成失败',
          data: response
        };
      } catch (error) {
        return {
          success: false,
          message: `Gemini 聊天响应测试失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Gemini Car Recommendation',
    description: '测试 Gemini 车型推荐功能',
    test: async () => {
      try {
        const { generateCarRecommendation } = await import('../src/lib/gemini.ts');
        
        const userMessage = 'I want a fuel-efficient sedan for city driving, budget $30,000';
        const response = await generateCarRecommendation(userMessage, 'en');
        
        return {
          success: response && response.recommendations && response.recommendations.length > 0,
          message: response ? 'Gemini 车型推荐生成成功' : 'Gemini 车型推荐生成失败',
          data: response
        };
      } catch (error) {
        return {
          success: false,
          message: `Gemini 车型推荐测试失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Gemini Conversation Summary',
    description: '测试 Gemini 对话摘要生成',
    test: async () => {
      try {
        const { generateConversationSummary } = await import('../src/lib/gemini.ts');
        
        const messages = [
          {
            role: 'user',
            content: 'I am looking for a family car'
          },
          {
            role: 'assistant',
            content: 'Great! I can help you find the perfect family car. What is your budget range?'
          },
          {
            role: 'user',
            content: 'Around $35,000, need good safety features'
          },
          {
            role: 'assistant',
            content: 'Perfect! Safety is important for family cars. Do you prefer SUV or sedan?'
          }
        ];
        
        const summary = await generateConversationSummary(messages, 'en');
        
        return {
          success: summary && summary.en && summary.zh,
          message: summary ? 'Gemini 对话摘要生成成功' : 'Gemini 对话摘要生成失败',
          data: summary
        };
      } catch (error) {
        return {
          success: false,
          message: `Gemini 对话摘要测试失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Gemini Chinese Support',
    description: '测试 Gemini 中文支持',
    test: async () => {
      try {
        const { generateChatResponse } = await import('../src/lib/gemini.ts');
        
        const messages = [
          {
            role: 'user',
            content: '我需要一辆适合家庭使用的汽车，预算25万人民币'
          }
        ];
        
        const response = await generateChatResponse(messages, 'zh');
        
        return {
          success: response && response.summary && response.summary.zh,
          message: response ? 'Gemini 中文支持正常' : 'Gemini 中文支持失败',
          data: response
        };
      } catch (error) {
        return {
          success: false,
          message: `Gemini 中文支持测试失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Gemini Response Format',
    description: '测试 Gemini 响应格式正确性',
    test: async () => {
      try {
        const { generateChatResponse } = await import('../src/lib/gemini.ts');
        
        const messages = [
          {
            role: 'user',
            content: 'I need a car recommendation'
          }
        ];
        
        const response = await generateChatResponse(messages, 'en');
        
        // 验证响应格式
        const isValid = response && 
          response.summary && 
          typeof response.summary.en === 'string' &&
          typeof response.summary.zh === 'string' &&
          Array.isArray(response.recommendations) &&
          Array.isArray(response.next_steps);
        
        return {
          success: isValid,
          message: isValid ? 'Gemini 响应格式正确' : 'Gemini 响应格式错误',
          data: response
        };
      } catch (error) {
        return {
          success: false,
          message: `Gemini 响应格式测试失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Gemini Error Handling',
    description: '测试 Gemini 错误处理',
    test: async () => {
      try {
        const { generateChatResponse } = await import('../src/lib/gemini.ts');
        
        // 测试空消息
        const messages = [];
        const response = await generateChatResponse(messages, 'en');
        
        return {
          success: response && response.summary,
          message: response ? 'Gemini 错误处理正常' : 'Gemini 错误处理失败',
          data: response
        };
      } catch (error) {
        return {
          success: false,
          message: `Gemini 错误处理测试失败: ${error.message}`
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
  console.log('🚀 开始 Gemini AI 测试');
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
