import { ChatMessage, Language, BilingualText } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/types';
import { CarRecommendation, NextStep } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/types';

// GROQ API配置
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

// 环境变量验证
function getGroqApiKey(): string {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Missing required environment variable: GROQ_API_KEY');
  }
  return apiKey;
}

// GROQ API响应类型
interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    total_tokens: number;
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
    const apiKey = getGroqApiKey();
    
    const systemPrompt = language === 'zh' 
      ? '你是专业的加拿大汽车购买顾问，请用中文回复用户的问题。'
      : 'You are a professional Canadian car buying advisor. Please respond to user questions in English.';

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`GROQ API error: ${response.status} ${response.statusText}`);
    }

    const data: GroqResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from GROQ API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('GROQ API error:', error);
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
    const apiKey = getGroqApiKey();
    
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

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You are a professional Canadian car buying advisor. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`GROQ API error: ${response.status} ${response.statusText}`);
    }

    const data: GroqResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from GROQ API');
    }

    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content) as AIRecommendationResponse;
    } catch (parseError) {
      throw new Error(`Failed to parse GROQ response as JSON: ${parseError}`);
    }
  } catch (error) {
    console.error('GROQ recommendation error:', error);
    throw new Error(`Failed to generate car recommendation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * GROQ健康检查
 * @returns 是否可用
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const apiKey = getGroqApiKey();
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('GROQ health check failed:', error);
    return false;
  }
}

/**
 * 获取GROQ API使用统计
 * @returns API使用信息
 */
export async function getUsageStats(): Promise<{
  total_tokens: number;
  model: string;
  timestamp: string;
}> {
  try {
    const apiKey = getGroqApiKey();
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: 'Test' }],
        max_tokens: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`GROQ API error: ${response.status}`);
    }

    const data: GroqResponse = await response.json();
    
    return {
      total_tokens: data.usage?.total_tokens || 0,
      model: GROQ_MODEL,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to get GROQ usage stats:', error);
    throw new Error(`Failed to get usage stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
