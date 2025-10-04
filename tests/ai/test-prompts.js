/**
 * AI 提示词测试脚本
 * 测试提示词管理模块的各项功能
 */

const { execSync } = require('child_process');
const path = require('path');

// 测试配置
const TEST_CONFIG = {
  timeout: 10000, // 10秒超时
  retries: 3,
  verbose: true
};

// 测试用例
const testCases = [
  {
    name: 'System Prompts Import',
    description: '测试系统提示词导入',
    test: async () => {
      try {
        const { SYSTEM_PROMPTS } = await import('../src/lib/prompts.ts');
        
        const hasCarAdvisor = SYSTEM_PROMPTS.car_advisor && 
          SYSTEM_PROMPTS.car_advisor.zh && 
          SYSTEM_PROMPTS.car_advisor.en;
        
        const hasCarRecommender = SYSTEM_PROMPTS.car_recommender && 
          SYSTEM_PROMPTS.car_recommender.zh && 
          SYSTEM_PROMPTS.car_recommender.en;
        
        const hasSummarizer = SYSTEM_PROMPTS.conversation_summarizer && 
          SYSTEM_PROMPTS.conversation_summarizer.zh && 
          SYSTEM_PROMPTS.conversation_summarizer.en;
        
        return {
          success: hasCarAdvisor && hasCarRecommender && hasSummarizer,
          message: '系统提示词导入成功',
          data: {
            car_advisor: hasCarAdvisor,
            car_recommender: hasCarRecommender,
            conversation_summarizer: hasSummarizer
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `系统提示词导入失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Prompt Templates Import',
    description: '测试提示词模板导入',
    test: async () => {
      try {
        const { PROMPT_TEMPLATES } = await import('../src/lib/prompts.ts');
        
        const hasChatResponse = PROMPT_TEMPLATES.chat_response && 
          PROMPT_TEMPLATES.chat_response.zh && 
          PROMPT_TEMPLATES.chat_response.en;
        
        const hasCarRecommendation = PROMPT_TEMPLATES.car_recommendation && 
          PROMPT_TEMPLATES.car_recommendation.zh && 
          PROMPT_TEMPLATES.car_recommendation.en;
        
        const hasConversationSummary = PROMPT_TEMPLATES.conversation_summary && 
          PROMPT_TEMPLATES.conversation_summary.zh && 
          PROMPT_TEMPLATES.conversation_summary.en;
        
        return {
          success: hasChatResponse && hasCarRecommendation && hasConversationSummary,
          message: '提示词模板导入成功',
          data: {
            chat_response: hasChatResponse,
            car_recommendation: hasCarRecommendation,
            conversation_summary: hasConversationSummary
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `提示词模板导入失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Build Chat Prompt',
    description: '测试构建聊天提示词',
    test: async () => {
      try {
        const { buildChatPrompt } = await import('../src/lib/prompts.ts');
        
        const messages = [
          {
            role: 'user',
            content: 'I need a car for commuting'
          },
          {
            role: 'assistant',
            content: 'I can help you find the perfect car. What is your budget?'
          }
        ];
        
        const englishPrompt = buildChatPrompt(messages, 'en');
        const chinesePrompt = buildChatPrompt(messages, 'zh');
        
        const isEnglishValid = englishPrompt.includes('Conversation History') && 
          englishPrompt.includes('I need a car for commuting');
        
        const isChineseValid = chinesePrompt.includes('对话历史') && 
          chinesePrompt.includes('I need a car for commuting');
        
        return {
          success: isEnglishValid && isChineseValid,
          message: '聊天提示词构建成功',
          data: {
            english: englishPrompt,
            chinese: chinesePrompt
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `聊天提示词构建失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Build Car Recommendation Prompt',
    description: '测试构建车型推荐提示词',
    test: async () => {
      try {
        const { buildCarRecommendationPrompt } = await import('../src/lib/prompts.ts');
        
        const userMessage = 'I want a fuel-efficient sedan for $30,000';
        
        const englishPrompt = buildCarRecommendationPrompt(userMessage, 'en');
        const chinesePrompt = buildCarRecommendationPrompt(userMessage, 'zh');
        
        const isEnglishValid = englishPrompt.includes('User Requirements') && 
          englishPrompt.includes(userMessage);
        
        const isChineseValid = chinesePrompt.includes('用户需求') && 
          chinesePrompt.includes(userMessage);
        
        return {
          success: isEnglishValid && isChineseValid,
          message: '车型推荐提示词构建成功',
          data: {
            english: englishPrompt,
            chinese: chinesePrompt
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `车型推荐提示词构建失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Build Summary Prompt',
    description: '测试构建摘要提示词',
    test: async () => {
      try {
        const { buildSummaryPrompt } = await import('../src/lib/prompts.ts');
        
        const messages = [
          {
            role: 'user',
            content: 'I need a family car'
          },
          {
            role: 'assistant',
            content: 'What is your budget?'
          }
        ];
        
        const englishPrompt = buildSummaryPrompt(messages, 'en');
        const chinesePrompt = buildSummaryPrompt(messages, 'zh');
        
        const isEnglishValid = englishPrompt.includes('Please generate a summary') && 
          englishPrompt.includes('I need a family car');
        
        const isChineseValid = chinesePrompt.includes('请为以下对话生成摘要') && 
          chinesePrompt.includes('I need a family car');
        
        return {
          success: isEnglishValid && isChineseValid,
          message: '摘要提示词构建成功',
          data: {
            english: englishPrompt,
            chinese: chinesePrompt
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `摘要提示词构建失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Get System Prompt',
    description: '测试获取系统提示词',
    test: async () => {
      try {
        const { getSystemPrompt } = await import('../src/lib/prompts.ts');
        
        const carAdvisorEn = getSystemPrompt('car_advisor', 'en');
        const carAdvisorZh = getSystemPrompt('car_advisor', 'zh');
        
        const isEnglishValid = carAdvisorEn.includes('professional Canadian car buying advisor');
        const isChineseValid = carAdvisorZh.includes('专业的加拿大汽车购买顾问');
        
        return {
          success: isEnglishValid && isChineseValid,
          message: '系统提示词获取成功',
          data: {
            english: carAdvisorEn,
            chinese: carAdvisorZh
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `系统提示词获取失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Validate Response Format',
    description: '测试响应格式验证',
    test: async () => {
      try {
        const { validateResponseFormat } = await import('../src/lib/prompts.ts');
        
        const validResponse = {
          summary: { en: 'Test', zh: '测试' },
          recommendations: [],
          next_steps: []
        };
        
        const invalidResponse = {
          summary: { en: 'Test' }, // 缺少 zh
          recommendations: 'not an array'
        };
        
        const isValidValid = validateResponseFormat(validResponse);
        const isInvalidValid = validateResponseFormat(invalidResponse);
        
        return {
          success: isValidValid && !isInvalidValid,
          message: '响应格式验证成功',
          data: {
            valid_response: isValidValid,
            invalid_response: isInvalidValid
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `响应格式验证失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Clean Response',
    description: '测试响应清理功能',
    test: async () => {
      try {
        const { cleanResponse } = await import('../src/lib/prompts.ts');
        
        const markdownResponse = '```json\n{"test": "value"}\n```';
        const jsonResponse = '{"test": "value"}';
        const mixedResponse = 'Some text {"test": "value"} more text';
        
        const cleanedMarkdown = cleanResponse(markdownResponse);
        const cleanedJson = cleanResponse(jsonResponse);
        const cleanedMixed = cleanResponse(mixedResponse);
        
        const isMarkdownCleaned = cleanedMarkdown === '{"test": "value"}';
        const isJsonCleaned = cleanedJson === '{"test": "value"}';
        const isMixedCleaned = cleanedMixed === '{"test": "value"}';
        
        return {
          success: isMarkdownCleaned && isJsonCleaned && isMixedCleaned,
          message: '响应清理成功',
          data: {
            markdown: { original: markdownResponse, cleaned: cleanedMarkdown },
            json: { original: jsonResponse, cleaned: cleanedJson },
            mixed: { original: mixedResponse, cleaned: cleanedMixed }
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `响应清理失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Get Default Response',
    description: '测试获取默认响应',
    test: async () => {
      try {
        const { getDefaultResponse } = await import('../src/lib/prompts.ts');
        
        const errorResponse = getDefaultResponse('error', 'en');
        const noRecommendationsResponse = getDefaultResponse('no_recommendations', 'zh');
        
        const hasErrorResponse = errorResponse && 
          errorResponse.summary && 
          errorResponse.summary.en;
        
        const hasNoRecommendationsResponse = noRecommendationsResponse && 
          noRecommendationsResponse.summary && 
          noRecommendationsResponse.summary.zh;
        
        return {
          success: hasErrorResponse && hasNoRecommendationsResponse,
          message: '默认响应获取成功',
          data: {
            error_response: errorResponse,
            no_recommendations_response: noRecommendationsResponse
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `默认响应获取失败: ${error.message}`
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
        console.log(`📊 测试数据:`, JSON.stringify(result.data, null, 2));
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
  console.log('🚀 开始 AI 提示词测试');
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
