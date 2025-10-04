import { ChatMessage, Language, BilingualText } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/types';
import { CarRecommendation, NextStep } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/types';

// Gemini API配置
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
const GEMINI_MODEL = 'gemini-2.0-flash-exp';

// 环境变量验证
function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing required environment variable: GEMINI_API_KEY');
  }
  return apiKey;
}

// Gemini API响应类型
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

// AI推荐响应类型
export interface AIRecommendationResponse {
  summary: BilingualText;
  recommendations: CarRecommendation[];
  next_steps: NextStep[];
}

/**
 * 生成聊天响应
 * @param messages 聊天消息数组
 * @param language 语言设置
 * @returns AI生成的响应文本
 */
export async function generateChatResponse(
  messages: ChatMessage[],
  language: Language
): Promise<string> {
  try {
    const apiKey = getGeminiApiKey();
    
    const systemPrompt = language === 'zh' 
      ? '你是专业的加拿大汽车购买顾问，请用中文回复用户的问题。'
      : 'You are a professional Canadian car buying advisor. Please respond to user questions in English.';

    // 构建Gemini格式的消息
    const geminiMessages = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\n${messages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}` }]
      }
    ];

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Failed to generate chat response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 生成汽车推荐
 * @param userMessage 用户消息
 * @param language 语言设置
 * @returns AI推荐响应
 */
export async function generateCarRecommendation(
  userMessage: string,
  language: Language
): Promise<AIRecommendationResponse> {
  try {
    const apiKey = getGeminiApiKey();
    
    const prompt = language === 'zh'
      ? `基于用户需求"${userMessage}"，生成汽车推荐。返回JSON格式：
{
  "summary": { "en": "英文摘要", "zh": "中文摘要" },
  "recommendations": [
    {
      "car_id": "车型ID",
      "match_score": 0.85,
      "reasoning_en": "英文推荐理由",
      "reasoning_zh": "中文推荐理由"
    }
  ],
  "next_steps": [
    {
      "title_en": "英文标题",
      "title_zh": "中文标题",
      "description_en": "英文描述",
      "description_zh": "中文描述",
      "priority": "high",
      "action_type": "research"
    }
  ]
}`
      : `Based on user requirement "${userMessage}", generate car recommendations. Return JSON format:
{
  "summary": { "en": "English summary", "zh": "Chinese summary" },
  "recommendations": [
    {
      "car_id": "car_id",
      "match_score": 0.85,
      "reasoning_en": "English reasoning",
      "reasoning_zh": "Chinese reasoning"
    }
  ],
  "next_steps": [
    {
      "title_en": "English title",
      "title_zh": "Chinese title",
      "description_en": "English description",
      "description_zh": "Chinese description",
      "priority": "high",
      "action_type": "research"
    }
  ]
}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const content = data.candidates[0].content.parts[0].text;
    
    try {
      return JSON.parse(content) as AIRecommendationResponse;
    } catch (parseError) {
      throw new Error(`Failed to parse Gemini response as JSON: ${parseError}`);
    }
  } catch (error) {
    console.error('Gemini recommendation error:', error);
    throw new Error(`Failed to generate car recommendation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Gemini健康检查
 * @returns 是否可用
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const apiKey = getGeminiApiKey();
    
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: 'Hello' }]
        }],
        generationConfig: {
          maxOutputTokens: 10,
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Gemini health check failed:', error);
    return false;
  }
}

/**
 * 获取Gemini API使用统计
 * @returns API使用信息
 */
export async function getUsageStats(): Promise<{
  total_tokens: number;
  model: string;
  timestamp: string;
}> {
  try {
    const apiKey = getGeminiApiKey();
    
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: 'Test' }]
        }],
        generationConfig: {
          maxOutputTokens: 1,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    return {
      total_tokens: data.usageMetadata?.totalTokenCount || 0,
      model: GEMINI_MODEL,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to get Gemini usage stats:', error);
    throw new Error(`Failed to get usage stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
