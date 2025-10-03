/**
 * Google Gemini AI 客户端
 * 提供 AI 对话、车型推荐、摘要生成等功能
 */

import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';
import { ChatMessage, Language, BilingualText, CarRecommendation, NextStep } from '@/types';

// 确保环境变量正确加载
import dotenv from 'dotenv';
import path from 'path';

// 使用绝对路径确保找到 .env.local 文件
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// Gemini 配置
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY environment variable is required');
}

// 初始化 Gemini AI
export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 模型配置
const MODEL_NAME = 'gemini-2.5-flash';
const GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};

/**
 * 创建聊天会话
 */
export function createChatSession(): ChatSession {
  const model = genAI.getGenerativeModel({ 
    model: MODEL_NAME,
    generationConfig: GENERATION_CONFIG,
  });
  
  return model.startChat({
    history: [],
    generationConfig: GENERATION_CONFIG,
  });
}

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
    const session = createChatSession();
    
    // 构建提示词
    const prompt = buildChatPrompt(messages, language);
    
    // 发送请求
    const result = await session.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    // 解析响应
    return parseAIResponse(text);
  } catch (error) {
    console.error('Gemini API error:', error);
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
    const session = createChatSession();
    
    // 构建车型推荐提示词
    const prompt = buildCarRecommendationPrompt(userMessage, language);
    
    // 发送请求
    const result = await session.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    // 解析响应
    return parseAIResponse(text);
  } catch (error) {
    console.error('Gemini API error:', error);
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
    const session = createChatSession();
    
    // 构建摘要提示词
    const prompt = buildSummaryPrompt(messages, language);
    
    // 发送请求
    const result = await session.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    // 解析摘要
    return parseSummaryResponse(text);
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate conversation summary');
  }
}

/**
 * 构建聊天提示词
 */
function buildChatPrompt(messages: ChatMessage[], language: Language): string {
  const systemPrompt = getSystemPrompt(language);
  const conversationHistory = messages
    .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');
  
  return `${systemPrompt}

对话历史：
${conversationHistory}

请基于以上对话历史，提供有用的汽车购买建议。`;
}

/**
 * 构建车型推荐提示词
 */
function buildCarRecommendationPrompt(userMessage: string, language: Language): string {
  const systemPrompt = getSystemPrompt(language);
  
  return `${systemPrompt}

用户需求：${userMessage}

请基于用户需求提供个性化的汽车推荐。`;
}

/**
 * 构建摘要提示词
 */
function buildSummaryPrompt(messages: ChatMessage[], language: Language): string {
  const conversationHistory = messages
    .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
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
    // 尝试提取 JSON 部分
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      summary: parsed.summary || { en: 'AI response generated', zh: 'AI 响应已生成' },
      recommendations: parsed.recommendations || [],
      next_steps: parsed.next_steps || []
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    
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
    const session = createChatSession();
    const result = await session.sendMessage('Hello');
    await result.response;
    return true;
  } catch (error) {
    console.error('Gemini health check failed:', error);
    return false;
  }
}
