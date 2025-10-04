/**
 * AI 集成测试脚本
 * 测试 AI 模块之间的集成和协作
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
    name: 'AI Module Import Integration',
    description: '测试 AI 模块导入集成',
    test: async () => {
      try {
        // 测试所有 AI 模块是否能正确导入
        const groq = await import('../src/lib/groq.ts');
        const gemini = await import('../src/lib/gemini.ts');
        const prompts = await import('../src/lib/prompts.ts');
        const aiUtils = await import('../src/lib/ai-utils.ts');
        const carResources = await import('../src/lib/constants/car-resources.ts');
        
        const hasGroq = groq && groq.generateChatResponse;
        const hasGemini = gemini && gemini.generateChatResponse;
        const hasPrompts = prompts && prompts.SYSTEM_PROMPTS;
        const hasAiUtils = aiUtils && aiUtils.parseAIResponse;
        const hasCarResources = carResources && carResources.CAR_BRANDS;
        
        return {
          success: hasGroq && hasGemini && hasPrompts && hasAiUtils && hasCarResources,
          message: 'AI 模块导入集成成功',
          data: {
            groq: hasGroq,
            gemini: hasGemini,
            prompts: hasPrompts,
            aiUtils: hasAiUtils,
            carResources: hasCarResources
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `AI 模块导入集成失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Prompt and AI Utils Integration',
    description: '测试提示词和 AI 工具函数集成',
    test: async () => {
      try {
        const { buildChatPrompt } = await import('../src/lib/prompts.ts');
        const { parseAIResponse, formatChatHistory } = await import('../src/lib/ai-utils.ts');
        
        // 构建提示词
        const messages = [
          { role: 'user', content: 'I need a car' },
          { role: 'assistant', content: 'What is your budget?' }
        ];
        
        const prompt = buildChatPrompt(messages, 'en');
        const history = formatChatHistory(messages);
        
        // 模拟 AI 响应
        const mockResponse = JSON.stringify({
          summary: { en: 'Test', zh: '测试' },
          recommendations: [],
          next_steps: []
        });
        
        const parsedResponse = parseAIResponse(mockResponse);
        
        return {
          success: prompt && history && parsedResponse,
          message: '提示词和 AI 工具函数集成成功',
          data: {
            prompt: prompt.substring(0, 100) + '...',
            history,
            parsedResponse
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `提示词和 AI 工具函数集成失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Car Resources and AI Utils Integration',
    description: '测试汽车资源和 AI 工具函数集成',
    test: async () => {
      try {
        const { CAR_BRANDS, getBrandInfo } = await import('../src/lib/constants/car-resources.ts');
        const { extractUserNeeds, generateRecommendationReasoning } = await import('../src/lib/ai-utils.ts');
        
        // 测试品牌信息获取
        const toyotaInfo = getBrandInfo('toyota');
        const hondaInfo = getBrandInfo('honda');
        
        // 测试用户需求提取
        const userMessage = 'I want a Toyota Camry for commuting';
        const needs = extractUserNeeds(userMessage);
        
        // 测试推荐理由生成
        const reasoning = generateRecommendationReasoning(needs, 'Toyota', 'Camry', 'en');
        
        return {
          success: toyotaInfo && hondaInfo && needs && reasoning,
          message: '汽车资源和 AI 工具函数集成成功',
          data: {
            toyotaInfo: toyotaInfo.name,
            hondaInfo: hondaInfo.name,
            needs,
            reasoning
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `汽车资源和 AI 工具函数集成失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'End-to-End AI Workflow',
    description: '测试端到端 AI 工作流程',
    test: async () => {
      try {
        const { buildChatPrompt } = await import('../src/lib/prompts.ts');
        const { parseAIResponse, extractUserNeeds, generateNextSteps } = await import('../src/lib/ai-utils.ts');
        const { CAR_BRANDS } = await import('../src/lib/constants/car-resources.ts');
        
        // 模拟完整的 AI 工作流程
        const userMessage = 'I need a reliable family car, budget $40,000';
        const messages = [{ role: 'user', content: userMessage }];
        
        // 1. 构建提示词
        const prompt = buildChatPrompt(messages, 'en');
        
        // 2. 提取用户需求
        const needs = extractUserNeeds(userMessage);
        
        // 3. 生成下一步建议
        const nextSteps = generateNextSteps(needs, 'en');
        
        // 4. 模拟 AI 响应解析
        const mockAIResponse = JSON.stringify({
          summary: { 
            en: 'I recommend reliable family cars within your budget', 
            zh: '我推荐您预算范围内可靠的家庭汽车' 
          },
          recommendations: [
            {
              car_make: 'Toyota',
              car_model: 'Camry',
              match_score: 0.9,
              reasoning: { en: 'Reliable and spacious', zh: '可靠且宽敞' }
            }
          ],
          next_steps: nextSteps
        });
        
        const parsedResponse = parseAIResponse(mockAIResponse);
        
        return {
          success: prompt && needs && nextSteps && parsedResponse,
          message: '端到端 AI 工作流程成功',
          data: {
            prompt: prompt.substring(0, 100) + '...',
            needs,
            nextSteps: nextSteps.length,
            parsedResponse: !!parsedResponse.summary
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `端到端 AI 工作流程失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Multi-Language Support Integration',
    description: '测试多语言支持集成',
    test: async () => {
      try {
        const { buildChatPrompt, getSystemPrompt } = await import('../src/lib/prompts.ts');
        const { detectLanguage, generateRecommendationReasoning } = await import('../src/lib/ai-utils.ts');
        
        // 测试英文
        const englishMessages = [{ role: 'user', content: 'I need a car' }];
        const englishPrompt = buildChatPrompt(englishMessages, 'en');
        const englishSystem = getSystemPrompt('car_advisor', 'en');
        
        // 测试中文
        const chineseMessages = [{ role: 'user', content: '我需要一辆车' }];
        const chinesePrompt = buildChatPrompt(chineseMessages, 'zh');
        const chineseSystem = getSystemPrompt('car_advisor', 'zh');
        
        // 测试语言检测
        const englishLang = detectLanguage('Hello world');
        const chineseLang = detectLanguage('你好世界');
        
        // 测试多语言推荐理由
        const needs = { usage: 'family' };
        const englishReasoning = generateRecommendationReasoning(needs, 'Toyota', 'Camry', 'en');
        const chineseReasoning = generateRecommendationReasoning(needs, 'Toyota', 'Camry', 'zh');
        
        return {
          success: englishPrompt && chinesePrompt && 
                   englishSystem && chineseSystem &&
                   englishLang === 'en' && chineseLang === 'zh' &&
                   englishReasoning.en && chineseReasoning.zh,
          message: '多语言支持集成成功',
          data: {
            englishPrompt: englishPrompt.substring(0, 50) + '...',
            chinesePrompt: chinesePrompt.substring(0, 50) + '...',
            englishSystem: englishSystem.substring(0, 50) + '...',
            chineseSystem: chineseSystem.substring(0, 50) + '...',
            languageDetection: { english: englishLang, chinese: chineseLang },
            reasoning: { english: englishReasoning.en, chinese: chineseReasoning.zh }
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `多语言支持集成失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Error Handling Integration',
    description: '测试错误处理集成',
    test: async () => {
      try {
        const { parseAIResponse } = await import('../src/lib/ai-utils.ts');
        const { getDefaultResponse } = await import('../src/lib/prompts.ts');
        
        // 测试无效响应解析
        const invalidResponse = 'Invalid JSON response';
        const parsedInvalid = parseAIResponse(invalidResponse);
        
        // 测试默认响应
        const errorResponse = getDefaultResponse('error', 'en');
        const noRecommendationsResponse = getDefaultResponse('no_recommendations', 'zh');
        
        return {
          success: parsedInvalid && errorResponse && noRecommendationsResponse,
          message: '错误处理集成成功',
          data: {
            invalidParsed: !!parsedInvalid.summary,
            errorResponse: !!errorResponse.summary,
            noRecommendationsResponse: !!noRecommendationsResponse.summary
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `错误处理集成失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Performance Integration Test',
    description: '测试性能集成',
    test: async () => {
      try {
        const { formatChatHistory, generateSessionId, calculateResponseTime } = await import('../src/lib/ai-utils.ts');
        
        const startTime = Date.now();
        
        // 测试大量消息格式化
        const messages = Array.from({ length: 100 }, (_, i) => ({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: `Message ${i}`
        }));
        
        const formatted = formatChatHistory(messages);
        
        // 测试会话ID生成性能
        const sessionIds = Array.from({ length: 1000 }, () => generateSessionId());
        const uniqueIds = new Set(sessionIds);
        
        const endTime = Date.now();
        const responseTime = calculateResponseTime(startTime, endTime);
        
        return {
          success: formatted && uniqueIds.size === 1000 && responseTime < 1000,
          message: '性能集成测试成功',
          data: {
            formattedLength: formatted.length,
            uniqueIds: uniqueIds.size,
            responseTime
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `性能集成测试失败: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Data Flow Integration',
    description: '测试数据流集成',
    test: async () => {
      try {
        const { buildChatPrompt } = await import('../src/lib/prompts.ts');
        const { extractUserNeeds, calculateMatchScore, generateNextSteps } = await import('../src/lib/ai-utils.ts');
        const { CAR_BRANDS, getBrandInfo } = await import('../src/lib/constants/car-resources.ts');
        
        // 模拟完整的数据流
        const userMessage = 'I want a Toyota Camry for family use, budget $35,000';
        
        // 1. 提取需求
        const needs = extractUserNeeds(userMessage);
        
        // 2. 获取品牌信息
        const toyotaInfo = getBrandInfo('toyota');
        
        // 3. 计算匹配度
        const carRecommendation = {
          car_make: 'Toyota',
          car_model: 'Camry',
          match_score: 0.9,
          reasoning: { en: 'Good family car', zh: '好家庭车' }
        };
        
        const matchScore = calculateMatchScore(needs, carRecommendation);
        
        // 4. 生成下一步
        const nextSteps = generateNextSteps(needs, 'en');
        
        // 5. 构建提示词
        const messages = [{ role: 'user', content: userMessage }];
        const prompt = buildChatPrompt(messages, 'en');
        
        return {
          success: needs && toyotaInfo && matchScore >= 0 && nextSteps && prompt,
          message: '数据流集成成功',
          data: {
            needs,
            brandInfo: toyotaInfo.name,
            matchScore,
            nextStepsCount: nextSteps.length,
            promptLength: prompt.length
          }
        };
      } catch (error) {
        return {
          success: false,
          message: `数据流集成失败: ${error.message}`
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
  console.log('🚀 开始 AI 集成测试');
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
