/**
 * AI 工具函数
 * 提供 AI 响应处理、数据转换、错误处理等功能
 */

import { ChatMessage, Language, BilingualText, CarRecommendation, NextStep } from '@/types';
import { validatePromptResponse } from './prompts';

/**
 * 解析 AI 响应
 */
export function parseAIResponse(response: string): {
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
    
    // 验证响应格式
    if (!validatePromptResponse(parsed)) {
      throw new Error('Invalid response format');
    }
    
    return {
      summary: parsed.summary || { en: 'AI response generated', zh: 'AI 响应已生成' },
      recommendations: parseRecommendations(parsed.recommendations || []),
      next_steps: parseNextSteps(parsed.next_steps || [])
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
 * 解析推荐数据
 */
function parseRecommendations(recommendations: any[]): CarRecommendation[] {
  if (!Array.isArray(recommendations)) {
    return [];
  }
  
  return recommendations.map((rec, index) => ({
    id: `rec-${Date.now()}-${index}`,
    car: {
      id: `car-${Date.now()}-${index}`,
      make: rec.car_make || 'Unknown',
      model: rec.car_model || 'Unknown',
      year_min: 2020,
      year_max: 2024,
      price_min: 0,
      price_max: 0,
      currency: 'CAD',
      category: 'sedan',
      fuel_type: 'gasoline',
      description_en: rec.reasoning?.en || '',
      description_zh: rec.reasoning?.zh || '',
      pros_en: [],
      pros_zh: [],
      cons_en: [],
      cons_zh: [],
      features: [],
      image_url: '',
      reliability_score: 0,
      fuel_economy: 0,
      safety_rating: 0,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    match_score: Math.min(Math.max(rec.match_score || 0.5, 0), 1),
    reasoning: {
      en: rec.reasoning?.en || 'No reasoning provided',
      zh: rec.reasoning?.zh || '未提供推理'
    }
  }));
}

/**
 * 解析下一步建议数据
 */
function parseNextSteps(nextSteps: any[]): NextStep[] {
  if (!Array.isArray(nextSteps)) {
    return [];
  }
  
  return nextSteps.map((step, index) => ({
    id: `step-${Date.now()}-${index}`,
    title: {
      en: step.title?.en || 'Next Step',
      zh: step.title?.zh || '下一步'
    },
    description: {
      en: step.description?.en || 'No description provided',
      zh: step.description?.zh || '未提供描述'
    },
    priority: ['high', 'medium', 'low'].includes(step.priority) ? step.priority : 'medium',
    action_type: ['research', 'visit', 'contact', 'prepare'].includes(step.action_type) ? step.action_type : 'research',
    url: step.url || undefined,
    metadata: step.metadata || {},
    is_completed: false,
    created_at: new Date()
  }));
}

/**
 * 验证 AI 响应
 */
export function validateAIResponse(response: any): boolean {
  return (
    response &&
    response.summary &&
    response.summary.en &&
    response.summary.zh &&
    Array.isArray(response.recommendations) &&
    Array.isArray(response.next_steps)
  );
}

/**
 * 清理 AI 响应文本
 */
export function cleanAIResponse(text: string): string {
  // 移除多余的空白字符
  let cleaned = text.trim();
  
  // 移除代码块标记
  cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // 移除多余的换行符
  cleaned = cleaned.replace(/\n\s*\n/g, '\n');
  
  return cleaned;
}

/**
 * 提取 JSON 从响应中
 */
export function extractJSONFromResponse(response: string): string | null {
  // 尝试匹配 JSON 对象
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  
  // 尝试匹配 JSON 数组
  const arrayMatch = response.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    return arrayMatch[0];
  }
  
  return null;
}

/**
 * 格式化错误消息
 */
export function formatErrorMessage(error: any, language: Language): string {
  const isChinese = language === 'zh';
  
  if (error instanceof Error) {
    return isChinese ? `错误: ${error.message}` : `Error: ${error.message}`;
  }
  
  if (typeof error === 'string') {
    return isChinese ? `错误: ${error}` : `Error: ${error}`;
  }
  
  return isChinese ? '发生未知错误' : 'Unknown error occurred';
}

/**
 * 重试机制
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries - 1) {
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // 指数退避
      }
    }
  }
  
  throw lastError;
}

/**
 * 流式响应处理
 */
export class StreamResponse {
  private chunks: string[] = [];
  private isComplete = false;
  
  addChunk(chunk: string): void {
    this.chunks.push(chunk);
  }
  
  getCurrentText(): string {
    return this.chunks.join('');
  }
  
  markComplete(): void {
    this.isComplete = true;
  }
  
  isFinished(): boolean {
    return this.isComplete;
  }
  
  getFullResponse(): string {
    return this.chunks.join('');
  }
}

/**
 * 生成会话 ID
 */
export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 生成消息 ID
 */
export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 格式化价格
 */
export function formatPrice(price: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * 格式化日期
 */
export function formatDate(date: Date, language: Language): string {
  const isChinese = language === 'zh';
  
  return new Intl.DateTimeFormat(isChinese ? 'zh-CN' : 'en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证电话号码格式（加拿大）
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+1|1)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/;
  return phoneRegex.test(phone);
}

/**
 * 生成随机字符串
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * 深度合并对象
 */
export function deepMerge(target: any, source: any): any {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
