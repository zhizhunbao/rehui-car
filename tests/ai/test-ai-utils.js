/**
 * AI 工具函数测试脚本
 * 测试 AI 工具函数模块的各项功能
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
    name: 'Parse AI Response',
    description: '测试解析 AI 响应',
    test: async () => {
      try {
        const { parseAIResponse } = await import('../src/lib/ai-utils.ts');
        
        const validResponse = JSON.stringify({
          summary: { en: 'Test summary', zh: '测试摘要' },
          recommendations: [
            {
              car_make: 'Toyota',
              car_model: 'Camry',
              match_score: 0.9,
              reasoning: { en: 'Good choice', zh: '好选择' }
            }
          ],
          next_steps: [
            {
              title: { en: 'Research', zh: '研究' },
              description: { en: 'Look into options', zh: '研究选项' },
              priority: 'high',
              action_type: 'research'
            }
          ]
        });
        
        const result = parseAIResponse(validResponse);
        
        return {
          success: result && 
            result.summary && 
            result.recommendations && 
            result.next_steps,
          message: 'AI 响应解析成功',
          data: result
        };
      } catch (error) {
        return {
          success: false,
          message: `AI 响应解析失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Parse Summary Response',
    description: '测试解析摘要响应',
    test: async () => {
      try {
        const { parseSummaryResponse } = await import('../src/lib/ai-utils.ts');
        
        const summaryResponse = JSON.stringify({
          summary: { en: 'Conversation summary', zh: '对话摘要' }
        });
        
        const result = parseSummaryResponse(summaryResponse);
        
        return {
          success: result && result.en && result.zh,
          message: '摘要响应解析成功',
          data: result
        };
      } catch (error) {
        return {
          success: false,
          message: `摘要响应解析失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Format Chat History',
    description: '测试格式化聊天历史',
    test: async () => {
      try {
        const { formatChatHistory } = await import('../src/lib/ai-utils.ts');
        
        const messages = [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
          { role: 'user', content: 'I need help' }
        ];
        
        const formatted = formatChatHistory(messages);
        
        const expectedFormat = 'User: Hello\nAssistant: Hi there!\nUser: I need help';
        
        return {
          success: formatted === expectedFormat,
          message: '聊天历史格式化成功',
          data: { formatted, expected: expectedFormat }
        };
      } catch (error) {
        return {
          success: false,
          message: `聊天历史格式化失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Extract User Needs',
    description: '测试提取用户需求',
    test: async () => {
      try {
        const { extractUserNeeds } = await import('../src/lib/ai-utils.ts');
        
        const userMessage = 'I need a car for commuting, budget around $30,000, prefer Toyota';
        const needs = extractUserNeeds(userMessage);
        
        const hasBudget = needs.budget && needs.budget !== 'Not specified';
        const hasUsage = needs.usage && needs.usage !== 'general';
        const hasPreferences = needs.preferences && needs.preferences.length > 0;
        
        return {
          success: hasBudget || hasUsage || hasPreferences,
          message: '用户需求提取成功',
          data: needs
        };
      } catch (error) {
        return {
          success: false,
          message: `用户需求提取失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Calculate Match Score',
    description: '测试计算匹配度',
    test: async () => {
      try {
        const { calculateMatchScore } = await import('../src/lib/ai-utils.ts');
        
        const userNeeds = {
          budget: '$30,000',
          usage: 'commute',
          preferences: ['Toyota']
        };
        
        const carRecommendation = {
          car_make: 'Toyota',
          car_model: 'Camry',
          match_score: 0.9,
          reasoning: { en: 'Good match', zh: '好匹配' }
        };
        
        const score = calculateMatchScore(userNeeds, carRecommendation);
        
        return {
          success: typeof score === 'number' && score >= 0 && score <= 1,
          message: '匹配度计算成功',
          data: { score, userNeeds, carRecommendation }
        };
      } catch (error) {
        return {
          success: false,
          message: `匹配度计算失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Generate Recommendation Reasoning',
    description: '测试生成推荐理由',
    test: async () => {
      try {
        const { generateRecommendationReasoning } = await import('../src/lib/ai-utils.ts');
        
        const userNeeds = {
          budget: '$30,000',
          usage: 'commute',
          special_requirements: ['fuel_efficient']
        };
        
        const reasoningEn = generateRecommendationReasoning(userNeeds, 'Toyota', 'Camry', 'en');
        const reasoningZh = generateRecommendationReasoning(userNeeds, 'Toyota', 'Camry', 'zh');
        
        const hasEnglishReasoning = reasoningEn.en && reasoningEn.en.length > 0;
        const hasChineseReasoning = reasoningZh.zh && reasoningZh.zh.length > 0;
        
        return {
          success: hasEnglishReasoning && hasChineseReasoning,
          message: '推荐理由生成成功',
          data: { english: reasoningEn, chinese: reasoningZh }
        };
      } catch (error) {
        return {
          success: false,
          message: `推荐理由生成失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Generate Next Steps',
    description: '测试生成下一步建议',
    test: async () => {
      try {
        const { generateNextSteps } = await import('../src/lib/ai-utils.ts');
        
        const userNeeds = {
          budget: '$30,000',
          usage: 'family'
        };
        
        const nextStepsEn = generateNextSteps(userNeeds, 'en');
        const nextStepsZh = generateNextSteps(userNeeds, 'zh');
        
        const hasEnglishSteps = nextStepsEn && nextStepsEn.length > 0;
        const hasChineseSteps = nextStepsZh && nextStepsZh.length > 0;
        
        return {
          success: hasEnglishSteps && hasChineseSteps,
          message: '下一步建议生成成功',
          data: { english: nextStepsEn, chinese: nextStepsZh }
        };
      } catch (error) {
        return {
          success: false,
          message: `下一步建议生成失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Validate Chat Message',
    description: '测试验证聊天消息',
    test: async () => {
      try {
        const { validateChatMessage } = await import('../src/lib/ai-utils.ts');
        
        const validMessage = { role: 'user', content: 'Hello' };
        const invalidMessage1 = { role: 'invalid', content: 'Hello' };
        const invalidMessage2 = { role: 'user', content: '' };
        
        const isValidValid = validateChatMessage(validMessage);
        const isInvalidValid1 = validateChatMessage(invalidMessage1);
        const isInvalidValid2 = validateChatMessage(invalidMessage2);
        
        return {
          success: isValidValid && !isInvalidValid1 && !isInvalidValid2,
          message: '聊天消息验证成功',
          data: {
            valid: isValidValid,
            invalid1: isInvalidValid1,
            invalid2: isInvalidValid2
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `聊天消息验证失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Clean User Input',
    description: '测试清理用户输入',
    test: async () => {
      try {
        const { cleanUserInput } = await import('../src/lib/ai-utils.ts');
        
        const dirtyInput = '  Hello   world!  \n\t  ';
        const cleaned = cleanUserInput(dirtyInput);
        
        const isCleaned = cleaned === 'Hello world!' && cleaned.length <= 1000;
        
        return {
          success: isCleaned,
          message: '用户输入清理成功',
          data: { original: dirtyInput, cleaned }
        };
      } catch (error) {
        return {
          success: false,
          message: `用户输入清理失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Detect Language',
    description: '测试语言检测',
    test: async () => {
      try {
        const { detectLanguage } = await import('../src/lib/ai-utils.ts');
        
        const englishText = 'Hello world';
        const chineseText = '你好世界';
        const mixedText = 'Hello 世界';
        
        const englishLang = detectLanguage(englishText);
        const chineseLang = detectLanguage(chineseText);
        const mixedLang = detectLanguage(mixedText);
        
        return {
          success: englishLang === 'en' && chineseLang === 'zh' && mixedLang === 'zh',
          message: '语言检测成功',
          data: {
            english: englishLang,
            chinese: chineseLang,
            mixed: mixedLang
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `语言检测失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Generate Session ID',
    description: '测试生成会话ID',
    test: async () => {
      try {
        const { generateSessionId } = await import('../src/lib/ai-utils.ts');
        
        const sessionId1 = generateSessionId();
        const sessionId2 = generateSessionId();
        
        const isUnique = sessionId1 !== sessionId2;
        const hasCorrectFormat = sessionId1.startsWith('session_');
        
        return {
          success: isUnique && hasCorrectFormat,
          message: '会话ID生成成功',
          data: { sessionId1, sessionId2 }
        };
      } catch (error) {
        return {
          success: false,
          message: `会话ID生成失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Format Timestamp',
    description: '测试格式化时间戳',
    test: async () => {
      try {
        const { formatTimestamp } = await import('../src/lib/ai-utils.ts');
        
        const timestamp = Date.now();
        const formatted = formatTimestamp(timestamp);
        
        const isISOFormat = formatted.includes('T') && formatted.includes('Z');
        
        return {
          success: isISOFormat,
          message: '时间戳格式化成功',
          data: { timestamp, formatted }
        };
      } catch (error) {
        return {
          success: false,
          message: `时间戳格式化失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Calculate Response Time',
    description: '测试计算响应时间',
    test: async () => {
      try {
        const { calculateResponseTime } = await import('../src/lib/ai-utils.ts');
        
        const startTime = Date.now();
        const endTime = startTime + 1000; // 1秒后
        
        const responseTime = calculateResponseTime(startTime, endTime);
        
        return {
          success: responseTime === 1000,
          message: '响应时间计算成功',
          data: { startTime, endTime, responseTime }
        };
      } catch (error) {
        return {
          success: false,
          message: `响应时间计算失败: ${error.message}`
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
  console.log('🚀 开始 AI 工具函数测试');
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
