/**
 * AI 工具函数
 * 提供 AI 相关的实用工具和辅助函数
 */

import { ChatMessage, Language, BilingualText, CarRecommendation, NextStep } from '@/types';
import { cleanResponse, validateResponseFormat, getDefaultResponse } from './prompts';

/**
 * 解析 AI 响应
 */
export function parseAIResponse(response: string): {
  summary: BilingualText;
  recommendations: CarRecommendation[];
  next_steps: NextStep[];
} {
  try {
    const cleanedResponse = cleanResponse(response);
    const parsed = JSON.parse(cleanedResponse);
    
    if (validateResponseFormat(parsed)) {
      return parsed;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    console.error('Raw response:', response.substring(0, 500) + '...');
    
    // 返回默认响应
    return getDefaultResponse('error', 'en');
  }
}

/**
 * 解析摘要响应
 */
export function parseSummaryResponse(response: string): BilingualText {
  try {
    const cleanedResponse = cleanResponse(response);
    const parsed = JSON.parse(cleanedResponse);
    
    if (parsed.summary && parsed.summary.en && parsed.summary.zh) {
      return parsed.summary;
    } else {
      throw new Error('Invalid summary format');
    }
  } catch (error) {
    console.error('Failed to parse summary response:', error);
    return { en: 'Conversation summary', zh: '对话摘要' };
  }
}

/**
 * 格式化聊天消息历史
 */
export function formatChatHistory(messages: ChatMessage[]): string {
  return messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');
}

/**
 * 提取用户需求关键词
 */
export function extractUserNeeds(userMessage: string): {
  budget?: string;
  usage?: string;
  preferences?: string[];
  special_requirements?: string[];
} {
  const needs: any = {};
  
  // 预算关键词
  const budgetKeywords = ['budget', 'price', 'cost', 'afford', '预算', '价格', '费用', '负担'];
  if (budgetKeywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
    needs.budget = extractBudgetRange(userMessage);
  }
  
  // 用途关键词
  const usageKeywords = ['commute', 'family', 'business', 'travel', 'daily', '通勤', '家庭', '商务', '旅行', '日常'];
  if (usageKeywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
    needs.usage = extractUsageType(userMessage);
  }
  
  // 偏好关键词
  const preferenceKeywords = ['brand', 'model', 'color', 'size', 'brand', '品牌', '型号', '颜色', '大小'];
  if (preferenceKeywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
    needs.preferences = extractPreferences(userMessage);
  }
  
  // 特殊需求关键词
  const specialKeywords = ['electric', 'hybrid', 'electric', 'safety', 'fuel', '环保', '混合动力', '电动', '安全', '燃油'];
  if (specialKeywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
    needs.special_requirements = extractSpecialRequirements(userMessage);
  }
  
  return needs;
}

/**
 * 提取预算范围
 */
function extractBudgetRange(message: string): string {
  const budgetPatterns = [
    /(\$[\d,]+(?:-\$[\d,]+)?)/g,
    /(\d+(?:,\d{3})*(?:-\d+(?:,\d{3})*)?\s*(?:dollars?|CAD|USD))/gi,
    /(预算.*?(\d+(?:,\d{3})*(?:-\d+(?:,\d{3})*)?))/gi
  ];
  
  for (const pattern of budgetPatterns) {
    const match = message.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  return 'Not specified';
}

/**
 * 提取用途类型
 */
function extractUsageType(message: string): string {
  const usageTypes = {
    'commute': ['commute', 'work', 'office', '通勤', '工作', '办公室'],
    'family': ['family', 'kids', 'children', '家庭', '孩子', '儿童'],
    'business': ['business', 'work', 'professional', '商务', '工作', '专业'],
    'travel': ['travel', 'road trip', 'vacation', '旅行', '公路旅行', '度假'],
    'daily': ['daily', 'everyday', 'regular', '日常', '每天', '常规']
  };
  
  for (const [type, keywords] of Object.entries(usageTypes)) {
    if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
      return type;
    }
  }
  
  return 'general';
}

/**
 * 提取偏好
 */
function extractPreferences(message: string): string[] {
  const preferences: string[] = [];
  
  // 品牌偏好
  const brands = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Lexus', 'Acura', 'Mazda', 'Subaru'];
  brands.forEach(brand => {
    if (message.toLowerCase().includes(brand.toLowerCase())) {
      preferences.push(`brand:${brand}`);
    }
  });
  
  // 颜色偏好
  const colors = ['black', 'white', 'red', 'blue', 'silver', 'gray', '黑色', '白色', '红色', '蓝色', '银色', '灰色'];
  colors.forEach(color => {
    if (message.toLowerCase().includes(color.toLowerCase())) {
      preferences.push(`color:${color}`);
    }
  });
  
  // 尺寸偏好
  const sizes = ['compact', 'mid-size', 'full-size', 'SUV', 'sedan', 'hatchback', '紧凑型', '中型', '大型', 'SUV', '轿车', '掀背车'];
  sizes.forEach(size => {
    if (message.toLowerCase().includes(size.toLowerCase())) {
      preferences.push(`size:${size}`);
    }
  });
  
  return preferences;
}

/**
 * 提取特殊需求
 */
function extractSpecialRequirements(message: string): string[] {
  const requirements: string[] = [];
  
  const specialNeeds = {
    'electric': ['electric', 'EV', 'battery', '电动', '电池'],
    'hybrid': ['hybrid', '混合动力'],
    'safety': ['safety', 'safe', 'security', '安全'],
    'fuel_efficient': ['fuel efficient', 'gas mileage', 'MPG', '燃油效率', '省油'],
    'luxury': ['luxury', 'premium', '豪华', '高端'],
    'performance': ['performance', 'speed', 'power', '性能', '速度', '动力']
  };
  
  for (const [need, keywords] of Object.entries(specialNeeds)) {
    if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
      requirements.push(need);
    }
  }
  
  return requirements;
}

/**
 * 计算推荐匹配度
 */
export function calculateMatchScore(
  userNeeds: any,
  carRecommendation: CarRecommendation
): number {
  let score = 0;
  let factors = 0;
  
  // 预算匹配
  if (userNeeds.budget && userNeeds.budget !== 'Not specified') {
    score += 0.3;
    factors++;
  }
  
  // 用途匹配
  if (userNeeds.usage && userNeeds.usage !== 'general') {
    score += 0.3;
    factors++;
  }
  
  // 偏好匹配
  if (userNeeds.preferences && userNeeds.preferences.length > 0) {
    score += 0.2;
    factors++;
  }
  
  // 特殊需求匹配
  if (userNeeds.special_requirements && userNeeds.special_requirements.length > 0) {
    score += 0.2;
    factors++;
  }
  
  return factors > 0 ? score / factors : 0.5;
}

/**
 * 生成推荐理由
 */
export function generateRecommendationReasoning(
  userNeeds: any,
  carMake: string,
  carModel: string,
  language: Language
): BilingualText {
  const isChinese = language === 'zh';
  
  let reasoning = '';
  
  if (userNeeds.budget && userNeeds.budget !== 'Not specified') {
    reasoning += isChinese ? `符合您的预算要求。` : `Fits your budget requirements. `;
  }
  
  if (userNeeds.usage && userNeeds.usage !== 'general') {
    const usageText = isChinese ? 
      { 'commute': '通勤', 'family': '家庭', 'business': '商务', 'travel': '旅行', 'daily': '日常' } :
      { 'commute': 'commuting', 'family': 'family', 'business': 'business', 'travel': 'travel', 'daily': 'daily' };
    
    reasoning += isChinese ? 
      `适合${usageText[userNeeds.usage as keyof typeof usageText]}使用。` :
      `Perfect for ${usageText[userNeeds.usage as keyof typeof usageText]} use. `;
  }
  
  if (userNeeds.special_requirements && userNeeds.special_requirements.length > 0) {
    const specialText = isChinese ?
      { 'electric': '电动', 'hybrid': '混合动力', 'safety': '安全', 'fuel_efficient': '省油', 'luxury': '豪华', 'performance': '性能' } :
      { 'electric': 'electric', 'hybrid': 'hybrid', 'safety': 'safety', 'fuel_efficient': 'fuel efficient', 'luxury': 'luxury', 'performance': 'performance' };
    
    const specialFeatures = userNeeds.special_requirements
      .map(req => specialText[req as keyof typeof specialText])
      .join(', ');
    
    reasoning += isChinese ? 
      `具有${specialFeatures}特性。` :
      `Features ${specialFeatures}. `;
  }
  
  if (!reasoning) {
    reasoning = isChinese ? 
      `${carMake} ${carModel} 是一个不错的选择。` :
      `${carMake} ${carModel} is a great choice.`;
  }
  
  return {
    en: reasoning,
    zh: reasoning
  };
}

/**
 * 生成下一步建议
 */
export function generateNextSteps(
  userNeeds: any,
  language: Language
): NextStep[] {
  const isChinese = language === 'zh';
  const steps: NextStep[] = [];
  
  // 基础研究步骤
  steps.push({
    title: {
      en: "Research the recommended models",
      zh: "研究推荐的车型"
    },
    description: {
      en: "Look up detailed specifications, reviews, and pricing for the recommended cars.",
      zh: "查找推荐汽车的详细规格、评论和价格。"
    },
    priority: "high",
    action_type: "research"
  });
  
  // 试驾建议
  steps.push({
    title: {
      en: "Schedule test drives",
      zh: "安排试驾"
    },
    description: {
      en: "Contact local dealerships to schedule test drives for your top choices.",
      zh: "联系当地经销商安排您首选车型的试驾。"
    },
    priority: "high",
    action_type: "test_drive"
  });
  
  // 预算规划
  if (userNeeds.budget && userNeeds.budget !== 'Not specified') {
    steps.push({
      title: {
        en: "Plan your financing",
        zh: "规划您的融资"
      },
      description: {
        en: "Research financing options and get pre-approved for a loan if needed.",
        zh: "研究融资选择，如需要可预先申请贷款。"
      },
      priority: "medium",
      action_type: "research"
    });
  }
  
  // 保险研究
  steps.push({
    title: {
      en: "Research insurance costs",
      zh: "研究保险费用"
    },
    description: {
      en: "Get insurance quotes for the cars you're considering.",
      zh: "为您考虑的汽车获取保险报价。"
    },
    priority: "medium",
    action_type: "research"
  });
  
  return steps;
}

/**
 * 验证聊天消息
 */
export function validateChatMessage(message: ChatMessage): boolean {
  return (
    message.role === 'user' || message.role === 'assistant'
  ) && 
  typeof message.content === 'string' && 
  message.content.trim().length > 0;
}

/**
 * 清理用户输入
 */
export function cleanUserInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ') // 合并多个空格
    .replace(/[^\w\s\u4e00-\u9fff.,!?$]/g, '') // 保留字母、数字、中文、标点符号
    .substring(0, 1000); // 限制长度
}

/**
 * 检测语言
 */
export function detectLanguage(text: string): Language {
  const chinesePattern = /[\u4e00-\u9fff]/;
  return chinesePattern.test(text) ? 'zh' : 'en';
}

/**
 * 生成会话ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

/**
 * 计算响应时间
 */
export function calculateResponseTime(startTime: number, endTime: number): number {
  return endTime - startTime;
}

/**
 * 检查API健康状态
 */
export async function checkAPIHealth(apiFunction: () => Promise<boolean>): Promise<{
  healthy: boolean;
  responseTime: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    const healthy = await apiFunction();
    const responseTime = calculateResponseTime(startTime, Date.now());
    
    return {
      healthy,
      responseTime
    };
  } catch (error) {
    const responseTime = calculateResponseTime(startTime, Date.now());
    
    return {
      healthy: false,
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}