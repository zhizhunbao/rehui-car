/**
 * GROQ AI 客户端
 * 提供 AI 对话、车型推荐、摘要生成等功能
 * 作为 Gemini API 的替代方案，避免配额限制
 */

import Groq from 'groq-sdk';
import { ChatMessage, Language, BilingualText, CarRecommendation, NextStep } from '@/types';

// 确保环境变量正确加载
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// GROQ 配置
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// 验证API密钥
if (!GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY environment variable is required');
}

// 初始化 GROQ AI
export const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // 允许在浏览器环境中使用
});

// 模型配置 - 使用 2025 年可用的 GROQ 模型
const MODEL_NAME = 'llama-3.1-8b-instant'; // 唯一可用的模型

/**
 * 生成聊天响应
 * @param messages 聊天消息历史
 * @param language 语言设置
 * @returns AI 响应
 */
export async function generateChatResponse(
  messages: ChatMessage[],
  language: Language
): Promise<{
  summary: BilingualText;
  recommendations: CarRecommendation[];
  next_steps: NextStep[];
}> {
  try {
    // 构建提示词
    const prompt = buildChatPrompt(messages, language);
    
    // 发送请求
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(language)
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: MODEL_NAME,
      temperature: 0.7,
      max_tokens: 2048,
    });
    
    const response = completion.choices[0]?.message?.content || '';
    
    // 解析响应
    return parseAIResponse(response);
  } catch (error) {
    console.error('GROQ API error:', error);
    throw new Error('Failed to generate AI response');
  }
}

/**
 * 生成车型推荐
 * @param userMessage 用户消息
 * @param language 语言设置
 * @returns 车型推荐响应
 */
export async function generateCarRecommendation(
  userMessage: string,
  language: Language
): Promise<{
  summary: BilingualText;
  recommendations: CarRecommendation[];
  next_steps: NextStep[];
}> {
  try {
    // 构建车型推荐提示词
    const prompt = buildCarRecommendationPrompt(userMessage, language);
    
    // 发送请求
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(language)
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: MODEL_NAME,
      temperature: 0.7,
      max_tokens: 2048,
    });
    
    const response = completion.choices[0]?.message?.content || '';
    
    // 解析响应
    return parseAIResponse(response);
  } catch (error) {
    console.error('GROQ API error:', error);
    throw new Error('Failed to generate car recommendation');
  }
}

/**
 * 生成对话摘要
 * @param messages 消息列表
 * @param language 语言设置
 * @returns 对话摘要
 */
export async function generateConversationSummary(
  messages: ChatMessage[],
  language: Language
): Promise<BilingualText> {
  try {
    // 构建摘要提示词
    const prompt = buildSummaryPrompt(messages, language);
    
    // 发送请求
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates conversation summaries in JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: MODEL_NAME,
      temperature: 0.3,
      max_tokens: 1024,
    });
    
    const response = completion.choices[0]?.message?.content || '';
    
    // 解析摘要
    return parseSummaryResponse(response);
  } catch (error) {
    console.error('GROQ API error:', error);
    throw new Error('Failed to generate conversation summary');
  }
}

/**
 * 构建聊天提示词
 */
function buildChatPrompt(messages: ChatMessage[], language: Language): string {
  const conversationHistory = messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');
  
  return `对话历史：
${conversationHistory}

请基于以上对话历史，提供有用的汽车购买建议。`;
}

/**
 * 构建车型推荐提示词
 */
function buildCarRecommendationPrompt(userMessage: string, language: Language): string {
  return `用户需求：${userMessage}

请基于用户需求提供个性化的汽车推荐。`;
}

/**
 * 构建摘要提示词
 */
function buildSummaryPrompt(messages: ChatMessage[], language: Language): string {
  const conversationHistory = messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');
  
  const languageText = language === 'zh' ? '中文' : '英文';
  
  return `请为以下对话生成一个简洁的摘要，使用${languageText}：

对话内容：
${conversationHistory}

请返回JSON格式：
{
  "summary": {
    "en": "English summary",
    "zh": "中文摘要"
  }
}`;
}

/**
 * 获取系统提示词
 */
function getSystemPrompt(language: Language): string {
  const isChinese = language === 'zh';
  
  return isChinese ? `
你是一个专业的加拿大汽车购买顾问助手。请基于用户需求提供个性化的汽车推荐和购买指导。

请返回以下JSON格式：
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
` : `
You are a professional Canadian car buying advisor assistant. Please provide personalized car recommendations and buying guidance based on user needs.

Please return the following JSON format:
{
  "summary": {
    "en": "English summary",
    "zh": "中文总结"
  },
  "recommendations": [
    {
      "car_make": "Brand",
      "car_model": "Model", 
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
}

/**
 * 解析 AI 响应
 */
function parseAIResponse(response: string): {
  summary: BilingualText;
  recommendations: CarRecommendation[];
  next_steps: NextStep[];
} {
  try {
    // 清理响应文本，移除可能的markdown代码块标记
    let cleanResponse = response.trim();
    
    // 移除markdown代码块标记
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // 尝试提取 JSON 部分
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    let jsonStr = jsonMatch[0];
    
    // 尝试修复常见的JSON格式问题
    jsonStr = jsonStr
      .replace(/,(\s*[}\]])/g, '$1') // 移除多余的逗号
      .replace(/([{\[,])\s*([}\]])/g, '$1$2') // 修复空对象/数组
      .replace(/([^\\])\n/g, '$1\\n') // 转义换行符
      .replace(/([^\\])\r/g, '$1\\r') // 转义回车符
      .replace(/([^\\])\t/g, '$1\\t'); // 转义制表符
    
    const parsed = JSON.parse(jsonStr);
    
    return {
      summary: parsed.summary || { en: 'AI response generated', zh: 'AI 响应已生成' },
      recommendations: parsed.recommendations || [],
      next_steps: parsed.next_steps || []
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    console.error('Raw response:', response.substring(0, 500) + '...');
    
    // 返回默认响应
    return {
      summary: {
        en: "I'll help you find the perfect car based on your needs.",
        zh: "我会根据您的需求帮您找到完美的汽车。"
      },
      recommendations: [],
      next_steps: []
    };
  }
}

/**
 * 解析摘要响应
 */
function parseSummaryResponse(response: string): BilingualText {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.summary || { en: 'Conversation summary', zh: '对话摘要' };
  } catch (error) {
    console.error('Failed to parse summary response:', error);
    return { en: 'Conversation summary', zh: '对话摘要' };
  }
}

/**
 * 健康检查
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Hello'
        }
      ],
      model: MODEL_NAME,
      max_tokens: 10,
    });
    
    return completion.choices[0]?.message?.content ? true : false;
  } catch (error) {
    console.error('GROQ health check failed:', error);
    return false;
  }
}
