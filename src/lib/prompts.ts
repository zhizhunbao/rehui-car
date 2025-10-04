/**
 * AI 提示词管理
 * 统一管理所有 AI 提示词模板和系统消息
 */

import { Language, ChatMessage } from '@/types';

/**
 * 系统提示词模板
 */
export const SYSTEM_PROMPTS = {
  car_advisor: {
    zh: `你是一个专业的加拿大汽车购买顾问助手。你的任务是：

1. 理解用户的汽车购买需求
2. 基于预算、用途、偏好等因素提供个性化推荐
3. 提供详细的车型分析和比较
4. 给出实用的购买建议和后续步骤

请始终保持专业、友好和有用的态度。`,
    en: `You are a professional Canadian car buying advisor assistant. Your tasks are:

1. Understand user's car buying needs
2. Provide personalized recommendations based on budget, usage, preferences
3. Offer detailed car model analysis and comparisons
4. Give practical buying advice and next steps

Always maintain a professional, friendly, and helpful attitude.`
  },

  car_recommender: {
    zh: `你是一个汽车推荐专家。请基于以下信息提供精准的车型推荐：

- 用户预算范围
- 主要用途（通勤、家庭、商务等）
- 偏好品牌和车型
- 特殊需求（环保、性能、空间等）

请提供3-5个推荐车型，并说明推荐理由。`,
    en: `You are a car recommendation expert. Please provide accurate car recommendations based on:

- User's budget range
- Primary usage (commuting, family, business, etc.)
- Preferred brands and models
- Special requirements (eco-friendly, performance, space, etc.)

Please provide 3-5 recommended models with reasoning.`
  },

  conversation_summarizer: {
    zh: `请为以下对话生成一个简洁的摘要，突出关键信息和用户需求。`,
    en: `Please generate a concise summary of the following conversation, highlighting key information and user needs.`
  }
};

/**
 * 提示词模板
 */
export const PROMPT_TEMPLATES = {
  chat_response: {
    zh: `基于以下对话历史，请提供有用的汽车购买建议：

对话历史：
{conversationHistory}

请返回JSON格式的响应。`,
    en: `Based on the following conversation history, please provide useful car buying advice:

Conversation History:
{conversationHistory}

Please return a JSON formatted response.`
  },

  car_recommendation: {
    zh: `用户需求：{userMessage}

请基于用户需求提供个性化的汽车推荐，包括：
1. 推荐车型及理由
2. 价格范围
3. 主要特点
4. 购买建议

请返回JSON格式。`,
    en: `User Requirements: {userMessage}

Please provide personalized car recommendations based on user needs, including:
1. Recommended models and reasoning
2. Price range
3. Key features
4. Buying advice

Please return JSON format.`
  },

  conversation_summary: {
    zh: `请为以下对话生成摘要：

对话内容：
{conversationHistory}

请返回JSON格式：
{
  "summary": {
    "en": "English summary",
    "zh": "中文摘要"
  }
}`,
    en: `Please generate a summary for the following conversation:

Conversation:
{conversationHistory}

Please return JSON format:
{
  "summary": {
    "en": "English summary",
    "zh": "中文摘要"
  }
}`
  }
};

/**
 * 响应格式模板
 */
export const RESPONSE_FORMATS = {
  chat_response: {
    structure: {
      summary: {
        en: "string",
        zh: "string"
      },
      recommendations: [
        {
          car_make: "string",
          car_model: "string",
          match_score: "number (0-1)",
          reasoning: {
            en: "string",
            zh: "string"
          }
        }
      ],
      next_steps: [
        {
          title: {
            en: "string",
            zh: "string"
          },
          description: {
            en: "string",
            zh: "string"
          },
          priority: "high|medium|low",
          action_type: "research|contact|test_drive|purchase"
        }
      ]
    }
  }
};

/**
 * 构建聊天提示词
 */
export function buildChatPrompt(messages: ChatMessage[], language: Language): string {
  const conversationHistory = messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');
  
  return PROMPT_TEMPLATES.chat_response[language].replace('{conversationHistory}', conversationHistory);
}

/**
 * 构建车型推荐提示词
 */
export function buildCarRecommendationPrompt(userMessage: string, language: Language): string {
  return PROMPT_TEMPLATES.car_recommendation[language].replace('{userMessage}', userMessage);
}

/**
 * 构建摘要提示词
 */
export function buildSummaryPrompt(messages: ChatMessage[], language: Language): string {
  const conversationHistory = messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');
  
  return PROMPT_TEMPLATES.conversation_summary[language].replace('{conversationHistory}', conversationHistory);
}

/**
 * 获取系统提示词
 */
export function getSystemPrompt(type: keyof typeof SYSTEM_PROMPTS, language: Language): string {
  return SYSTEM_PROMPTS[type][language];
}

/**
 * 验证响应格式
 */
export function validateResponseFormat(response: any): boolean {
  try {
    // 检查基本结构
    if (!response.summary || !response.recommendations || !response.next_steps) {
      return false;
    }
    
    // 检查摘要格式
    if (!response.summary.en || !response.summary.zh) {
      return false;
    }
    
    // 检查推荐格式
    if (!Array.isArray(response.recommendations)) {
      return false;
    }
    
    // 检查下一步格式
    if (!Array.isArray(response.next_steps)) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 清理和格式化响应
 */
export function cleanResponse(response: string): string {
  let cleaned = response.trim();
  
  // 移除markdown代码块标记
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  
  // 尝试提取 JSON 部分
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  // 修复常见的JSON格式问题
  cleaned = cleaned
    .replace(/,(\s*[}\]])/g, '$1') // 移除多余的逗号
    .replace(/([{\[,])\s*([}\]])/g, '$1$2') // 修复空对象/数组
    .replace(/([^\\])\n/g, '$1\\n') // 转义换行符
    .replace(/([^\\])\r/g, '$1\\r') // 转义回车符
    .replace(/([^\\])\t/g, '$1\\t'); // 转义制表符
  
  return cleaned;
}

/**
 * 默认响应模板
 */
export const DEFAULT_RESPONSES = {
  error: {
    zh: {
      summary: {
        en: "I apologize, but I encountered an error processing your request.",
        zh: "抱歉，处理您的请求时遇到了错误。"
      },
      recommendations: [],
      next_steps: []
    }
  },
  
  no_recommendations: {
    zh: {
      summary: {
        en: "I need more information to provide car recommendations.",
        zh: "我需要更多信息来提供汽车推荐。"
      },
      recommendations: [],
      next_steps: [
        {
          title: {
            en: "Provide more details",
            zh: "提供更多详细信息"
          },
          description: {
            en: "Please tell me about your budget, usage needs, and preferences.",
            zh: "请告诉我您的预算、使用需求和偏好。"
          },
          priority: "high",
          action_type: "research"
        }
      ]
    }
  }
};

/**
 * 获取默认响应
 */
export function getDefaultResponse(type: keyof typeof DEFAULT_RESPONSES, language: Language) {
  return DEFAULT_RESPONSES[type][language as keyof typeof DEFAULT_RESPONSES[typeof type]];
}