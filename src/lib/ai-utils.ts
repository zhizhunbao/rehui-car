import { Language, BilingualText } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/types';
import { CarRecommendation, NextStep } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/types';

/**
 * AI工具函数集合
 * 提供AI集成相关的工具函数
 */

/**
 * 验证AI响应格式
 * @param response AI响应对象
 * @returns 是否为有效格式
 */
export function validateAIResponse(response: any): boolean {
  try {
    // 检查基本结构
    if (!response || typeof response !== 'object') {
      return false;
    }

    // 检查summary字段
    if (!response.summary || typeof response.summary !== 'object') {
      return false;
    }

    // 检查summary的双语字段
    if (!response.summary.en || !response.summary.zh) {
      return false;
    }

    // 检查recommendations字段
    if (!Array.isArray(response.recommendations)) {
      return false;
    }

    // 检查next_steps字段
    if (!Array.isArray(response.next_steps)) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('AI响应验证失败:', error);
    return false;
  }
}

/**
 * 格式化AI响应
 * @param response 原始AI响应
 * @param language 目标语言
 * @returns 格式化后的响应
 */
export function formatAIResponse(
  response: any,
  language: Language
): {
  summary: string;
  recommendations: CarRecommendation[];
  next_steps: NextStep[];
} {
  try {
    if (!validateAIResponse(response)) {
      throw new Error('Invalid AI response format');
    }

    return {
      summary: response.summary[language] || response.summary.en || response.summary.zh,
      recommendations: response.recommendations || [],
      next_steps: response.next_steps || []
    };
  } catch (error) {
    console.error('AI响应格式化失败:', error);
    throw new Error(`Failed to format AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 生成默认AI响应
 * @param language 语言设置
 * @returns 默认响应
 */
export function generateDefaultResponse(language: Language): {
  summary: BilingualText;
  recommendations: CarRecommendation[];
  next_steps: NextStep[];
} {
  const defaultSummary = language === 'zh'
    ? {
        en: 'Unable to generate recommendations at this time. Please try again later.',
        zh: '目前无法生成推荐，请稍后再试。'
      }
    : {
        en: 'Unable to generate recommendations at this time. Please try again later.',
        zh: '目前无法生成推荐，请稍后再试。'
      };

  const defaultNextSteps: NextStep[] = language === 'zh'
    ? [
        {
          id: 'default-1',
          title: {
            en: 'Try Again',
            zh: '重试'
          },
          description: {
            en: 'Please try asking your question again.',
            zh: '请重新提出您的问题。'
          },
          priority: 'medium' as const,
          action_type: 'research' as const
        }
      ]
    : [
        {
          id: 'default-1',
          title: {
            en: 'Try Again',
            zh: '重试'
          },
          description: {
            en: 'Please try asking your question again.',
            zh: '请重新提出您的问题。'
          },
          priority: 'medium' as const,
          action_type: 'research' as const
        }
      ];

  return {
    summary: defaultSummary,
    recommendations: [],
    next_steps: defaultNextSteps
  };
}

/**
 * 合并多个AI响应
 * @param responses AI响应数组
 * @param language 语言设置
 * @returns 合并后的响应
 */
export function mergeAIResponses(
  responses: any[],
  language: Language
): {
  summary: BilingualText;
  recommendations: CarRecommendation[];
  next_steps: NextStep[];
} {
  try {
    if (!responses || responses.length === 0) {
      return generateDefaultResponse(language);
    }

    // 过滤有效响应
    const validResponses = responses.filter(response => validateAIResponse(response));
    
    if (validResponses.length === 0) {
      return generateDefaultResponse(language);
    }

    // 合并摘要
    const mergedSummary: BilingualText = {
      en: validResponses.map(r => r.summary?.en || '').filter(s => s).join(' '),
      zh: validResponses.map(r => r.summary?.zh || '').filter(s => s).join(' ')
    };

    // 合并推荐
    const mergedRecommendations: CarRecommendation[] = validResponses
      .flatMap(r => r.recommendations || [])
      .filter((rec, index, self) => 
        index === self.findIndex(r => r.car_id === rec.car_id)
      );

    // 合并下一步
    const mergedNextSteps: NextStep[] = validResponses
      .flatMap(r => r.next_steps || [])
      .filter((step, index, self) => 
        index === self.findIndex(s => s.id === step.id)
      );

    return {
      summary: mergedSummary,
      recommendations: mergedRecommendations,
      next_steps: mergedNextSteps
    };
  } catch (error) {
    console.error('AI响应合并失败:', error);
    return generateDefaultResponse(language);
  }
}

/**
 * 提取关键词
 * @param text 输入文本
 * @param language 语言设置
 * @returns 关键词数组
 */
export function extractKeywords(text: string, language: Language): string[] {
  try {
    if (!text || typeof text !== 'string') {
      return [];
    }

    // 简单的关键词提取逻辑
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);

    // 过滤常见停用词
    const stopWords = language === 'zh' 
      ? ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这']
      : ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];

    const filteredWords = words.filter(word => !stopWords.includes(word));

    // 返回去重后的关键词
    return Array.from(new Set(filteredWords));
  } catch (error) {
    console.error('关键词提取失败:', error);
    return [];
  }
}

/**
 * 计算文本相似度
 * @param text1 文本1
 * @param text2 文本2
 * @returns 相似度分数 (0-1)
 */
export function calculateSimilarity(text1: string, text2: string): number {
  try {
    if (!text1 || !text2) {
      return 0;
    }

    // 简单的Jaccard相似度计算
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const words1Array = Array.from(words1);
    const words2Array = Array.from(words2);
    
    const intersection = new Set(words1Array.filter(word => words2.has(word)));
    const union = new Set(words1Array.concat(words2Array));

    return intersection.size / union.size;
  } catch (error) {
    console.error('相似度计算失败:', error);
    return 0;
  }
}

/**
 * 生成会话摘要
 * @param messages 消息数组
 * @param language 语言设置
 * @returns 会话摘要
 */
export function generateConversationSummary(
  messages: Array<{ role: string; content: string }>,
  language: Language
): string {
  try {
    if (!messages || messages.length === 0) {
      return language === 'zh' ? '暂无对话内容' : 'No conversation content';
    }

    // 提取用户消息
    const userMessages = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .join(' ');

    if (!userMessages) {
      return language === 'zh' ? '暂无用户输入' : 'No user input';
    }

    // 生成简单摘要
    const keywords = extractKeywords(userMessages, language);
    const topKeywords = keywords.slice(0, 5);

    return language === 'zh' 
      ? `用户咨询了关于${topKeywords.join('、')}的问题`
      : `User inquired about ${topKeywords.join(', ')}`;
  } catch (error) {
    console.error('会话摘要生成失败:', error);
    return language === 'zh' ? '摘要生成失败' : 'Failed to generate summary';
  }
}

/**
 * 验证环境变量
 * @returns 环境变量验证结果
 */
export function validateEnvironmentVariables(): {
  groq: boolean;
  gemini: boolean;
  allValid: boolean;
} {
  const groq = !!process.env.GROQ_API_KEY;
  const gemini = !!process.env.GEMINI_API_KEY;
  
  return {
    groq,
    gemini,
    allValid: groq || gemini // 至少需要一个AI服务可用
  };
}

/**
 * 获取AI服务状态
 * @returns AI服务状态信息
 */
export function getAIServiceStatus(): {
  services: Array<{
    name: string;
    available: boolean;
    apiKey: boolean;
  }>;
  primaryService: string;
  fallbackService: string;
} {
  const env = validateEnvironmentVariables();
  
  const services = [
    {
      name: 'GROQ',
      available: env.groq,
      apiKey: env.groq
    },
    {
      name: 'Gemini',
      available: env.gemini,
      apiKey: env.gemini
    }
  ];

  return {
    services,
    primaryService: env.groq ? 'GROQ' : env.gemini ? 'Gemini' : 'None',
    fallbackService: env.gemini ? 'Gemini' : env.groq ? 'GROQ' : 'None'
  };
}
