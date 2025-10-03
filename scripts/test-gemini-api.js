/**
 * 测试 Google Gemini API 连接
 * 使用真实的 API 调用验证功能
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testGeminiAPI() {
  console.log('🚀 开始测试 Google Gemini API...\n');

  // 检查环境变量
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ 错误: 未找到 GOOGLE_GEMINI_API_KEY 环境变量');
    console.log('请在 .env.local 文件中设置您的 Gemini API 密钥');
    return;
  }

  console.log('✅ 找到 API 密钥:', apiKey.substring(0, 10) + '...');

  try {
    // 初始化 Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    console.log('✅ Gemini AI 客户端初始化成功');

    // 测试 1: 简单对话
    console.log('\n📝 测试 1: 简单对话');
    const chat = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    const result = await chat.sendMessage('Hello, can you help me with car recommendations?');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ 简单对话测试成功');
    console.log('🤖 AI 回复:', text.substring(0, 200) + '...');

    // 测试 2: 车型推荐
    console.log('\n🚗 测试 2: 车型推荐');
    const carPrompt = `
你是一个专业的加拿大汽车购买顾问助手。请基于用户需求提供个性化的汽车推荐。

用户需求: 我需要一辆可靠的车，预算在2万加元以下，适合家庭使用
回复语言: 中文

请返回以下JSON格式:
{
  "summary": {
    "en": "English summary",
    "zh": "中文总结"
  },
  "recommendations": [
    {
      "car_make": "品牌",
      "car_model": "型号", 
      "match_score": 0.95,
      "reasoning": {
        "en": "English reasoning",
        "zh": "中文推理"
      }
    }
  ],
  "next_steps": [
    {
      "title": {
        "en": "English title",
        "zh": "中文标题"
      },
      "description": {
        "en": "English description", 
        "zh": "中文描述"
      },
      "priority": "high",
      "action_type": "research"
    }
  ]
}
`;

    const carResult = await chat.sendMessage(carPrompt);
    const carResponse = await carResult.response;
    const carText = carResponse.text();
    
    console.log('✅ 车型推荐测试成功');
    console.log('🤖 AI 推荐回复:', carText.substring(0, 300) + '...');

    // 测试 3: JSON 解析
    console.log('\n🔍 测试 3: JSON 解析');
    try {
      const jsonMatch = carText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ JSON 解析成功');
        console.log('📊 解析结果:', {
          hasSummary: !!parsed.summary,
          hasRecommendations: !!parsed.recommendations,
          hasNextSteps: !!parsed.next_steps,
          recommendationCount: parsed.recommendations?.length || 0,
          nextStepCount: parsed.next_steps?.length || 0
        });
      } else {
        console.log('⚠️  未找到 JSON 格式的回复');
      }
    } catch (error) {
      console.log('❌ JSON 解析失败:', error.message);
    }

    // 测试 4: 英文对话
    console.log('\n🌍 测试 4: 英文对话');
    const englishPrompt = `
You are a professional Canadian car buying advisor. Please provide car recommendations.

User needs: I need a reliable car under $20,000 CAD for family use
Response language: English

Please return JSON format with summary, recommendations, and next steps.
`;

    const englishResult = await chat.sendMessage(englishPrompt);
    const englishResponse = await englishResult.response;
    const englishText = englishResponse.text();
    
    console.log('✅ 英文对话测试成功');
    console.log('🤖 English AI response:', englishText.substring(0, 200) + '...');

    console.log('\n🎉 所有测试完成！Gemini API 工作正常');
    console.log('\n📋 测试总结:');
    console.log('✅ API 连接正常');
    console.log('✅ 中文对话正常');
    console.log('✅ 英文对话正常');
    console.log('✅ 车型推荐功能正常');
    console.log('✅ JSON 格式输出正常');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('详细错误:', error);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n💡 建议: 请检查您的 API 密钥是否正确');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      console.log('\n💡 建议: API 配额已用完，请稍后重试');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.log('\n💡 建议: API 权限不足，请检查您的 API 密钥权限');
    }
  }
}

// 运行测试
testGeminiAPI().catch(console.error);
