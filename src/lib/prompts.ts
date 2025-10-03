/**
 * AI 提示词模板
 * 包含各种场景的提示词模板，用于生成一致的 AI 响应
 */

import { Language, BilingualText } from '@/types';

/**
 * 车型推荐提示词模板
 */
export const CAR_RECOMMENDATION_PROMPT = (userMessage: string, language: Language) => {
  const isChinese = language === 'zh';
  
  return isChinese ? `
你是一个专业的加拿大汽车购买顾问助手。请基于用户需求提供个性化的汽车推荐和购买指导。

用户需求: ${userMessage}
回复语言: 中文

请在推荐中包含以下信息：
- 车型品牌和型号
- 匹配度评分 (0-1)
- 推荐理由 (中英文)
- 价格范围 (加元)
- 适用场景
- 优缺点分析

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
` : `
You are a professional Canadian car buying advisor assistant. Please provide personalized car recommendations and buying guidance based on user needs.

User needs: ${userMessage}
Response language: English

Please include the following information in your recommendations:
- Car brand and model
- Match score (0-1)
- Reasoning (English and Chinese)
- Price range (CAD)
- Use cases
- Pros and cons analysis

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
};

/**
 * 对话摘要提示词模板
 */
export const CONVERSATION_SUMMARY_PROMPT = (messages: string[], language: Language) => {
  const isChinese = language === 'zh';
  const conversationText = messages.join('\n');
  
  return isChinese ? `
请为以下对话生成一个简洁的摘要，使用中文：

对话内容：
${conversationText}

请返回JSON格式：
{
  "summary": {
    "en": "English summary",
    "zh": "中文摘要"
  }
}
` : `
Please generate a concise summary for the following conversation in English:

Conversation:
${conversationText}

Please return JSON format:
{
  "summary": {
    "en": "English summary",
    "zh": "中文摘要"
  }
}
`;
};

/**
 * 车型比较提示词模板
 */
export const CAR_COMPARISON_PROMPT = (cars: string[], language: Language) => {
  const isChinese = language === 'zh';
  const carsText = cars.join('\n');
  
  return isChinese ? `
请比较以下车型，提供详细的对比分析：

车型列表：
${carsText}

请从以下维度进行比较：
- 价格性价比
- 可靠性评分
- 燃油经济性
- 安全评级
- 适用场景
- 维护成本
- 保值率

请返回JSON格式：
{
  "summary": {
    "en": "English summary",
    "zh": "中文总结"
  },
  "comparison": [
    {
      "car": "车型名称",
      "score": 8.5,
      "pros": ["优点1", "优点2"],
      "cons": ["缺点1", "缺点2"],
      "recommendation": "推荐理由"
    }
  ],
  "winner": "推荐车型",
  "reasoning": "选择理由"
}
` : `
Please compare the following cars and provide detailed comparison analysis:

Car list:
${carsText}

Please compare from the following dimensions:
- Price value
- Reliability score
- Fuel economy
- Safety rating
- Use cases
- Maintenance cost
- Resale value

Please return JSON format:
{
  "summary": {
    "en": "English summary",
    "zh": "中文总结"
  },
  "comparison": [
    {
      "car": "Car name",
      "score": 8.5,
      "pros": ["Pro 1", "Pro 2"],
      "cons": ["Con 1", "Con 2"],
      "recommendation": "Recommendation reason"
    }
  ],
  "winner": "Recommended car",
  "reasoning": "Selection reason"
}
`;
};

/**
 * 预算分析提示词模板
 */
export const BUDGET_ANALYSIS_PROMPT = (budget: number, currency: string, language: Language) => {
  const isChinese = language === 'zh';
  
  return isChinese ? `
请基于预算 ${budget} ${currency} 提供汽车购买建议：

预算分析维度：
- 新车 vs 二手车选择
- 不同价位段的车型推荐
- 贷款 vs 全款购买建议
- 保险和维护成本估算
- 保值率考虑
- 分期付款方案

请返回JSON格式：
{
  "summary": {
    "en": "English summary",
    "zh": "中文总结"
  },
  "budget_analysis": {
    "new_cars": ["新车推荐1", "新车推荐2"],
    "used_cars": ["二手车推荐1", "二手车推荐2"],
    "financing_options": ["贷款方案1", "贷款方案2"],
    "total_cost_estimate": {
      "purchase": 25000,
      "insurance": 2000,
      "maintenance": 1500,
      "total_first_year": 28500
    }
  },
  "recommendations": [
    {
      "type": "new_car",
      "car": "推荐车型",
      "price": 25000,
      "reasoning": "推荐理由"
    }
  ]
}
` : `
Please provide car buying advice based on budget ${budget} ${currency}:

Budget analysis dimensions:
- New car vs used car options
- Car recommendations in different price ranges
- Loan vs cash purchase advice
- Insurance and maintenance cost estimates
- Resale value considerations
- Payment plan options

Please return JSON format:
{
  "summary": {
    "en": "English summary",
    "zh": "中文总结"
  },
  "budget_analysis": {
    "new_cars": ["New car 1", "New car 2"],
    "used_cars": ["Used car 1", "Used car 2"],
    "financing_options": ["Financing 1", "Financing 2"],
    "total_cost_estimate": {
      "purchase": 25000,
      "insurance": 2000,
      "maintenance": 1500,
      "total_first_year": 28500
    }
  },
  "recommendations": [
    {
      "type": "new_car",
      "car": "Recommended car",
      "price": 25000,
      "reasoning": "Recommendation reason"
    }
  ]
}
`;
};

/**
 * 购车流程指导提示词模板
 */
export const BUYING_PROCESS_PROMPT = (language: Language) => {
  const isChinese = language === 'zh';
  
  return isChinese ? `
请提供详细的加拿大购车流程指导：

购车流程步骤：
1. 需求分析和预算制定
2. 车型研究和比较
3. 经销商选择和预约试驾
4. 车辆检查和历史报告
5. 价格谈判和合同签署
6. 贷款申请和审批
7. 保险购买
8. 车辆注册和上牌
9. 交车和验收
10. 后续维护和服务

请返回JSON格式：
{
  "summary": {
    "en": "English summary",
    "zh": "中文总结"
  },
  "process_steps": [
    {
      "step": 1,
      "title": {
        "en": "English title",
        "zh": "中文标题"
      },
      "description": {
        "en": "English description",
        "zh": "中文描述"
      },
      "tips": ["提示1", "提示2"],
      "documents_needed": ["文件1", "文件2"]
    }
  ],
  "important_notes": [
    "重要提醒1",
    "重要提醒2"
  ]
}
` : `
Please provide detailed Canadian car buying process guidance:

Car buying process steps:
1. Needs analysis and budget planning
2. Car research and comparison
3. Dealer selection and test drive appointment
4. Vehicle inspection and history report
5. Price negotiation and contract signing
6. Loan application and approval
7. Insurance purchase
8. Vehicle registration and licensing
9. Delivery and acceptance
10. Follow-up maintenance and service

Please return JSON format:
{
  "summary": {
    "en": "English summary",
    "zh": "中文总结"
  },
  "process_steps": [
    {
      "step": 1,
      "title": {
        "en": "English title",
        "zh": "中文标题"
      },
      "description": {
        "en": "English description",
        "zh": "中文描述"
      },
      "tips": ["Tip 1", "Tip 2"],
      "documents_needed": ["Document 1", "Document 2"]
    }
  ],
  "important_notes": [
    "Important note 1",
    "Important note 2"
  ]
}
`;
};

/**
 * 错误处理提示词模板
 */
export const ERROR_HANDLING_PROMPT = (error: string, language: Language) => {
  const isChinese = language === 'zh';
  
  return isChinese ? `
抱歉，在处理您的请求时遇到了问题：${error}

请稍后重试，或者您可以：
1. 重新描述您的需求
2. 提供更具体的信息
3. 尝试不同的关键词

我会继续为您提供汽车购买建议。
` : `
Sorry, we encountered an issue while processing your request: ${error}

Please try again later, or you can:
1. Redescribe your needs
2. Provide more specific information
3. Try different keywords

I'll continue to provide car buying advice for you.
`;
};

/**
 * 获取双语文本的工具函数
 */
export function getBilingualText(text: BilingualText, language: Language): string {
  return text[language] || text.en || '';
}

/**
 * 格式化双语文本
 */
export function formatBilingualText(en: string, zh: string): BilingualText {
  return { en, zh };
}

/**
 * 验证提示词响应格式
 */
export function validatePromptResponse(response: any): boolean {
  return (
    response &&
    response.summary &&
    response.summary.en &&
    response.summary.zh &&
    typeof response.summary.en === 'string' &&
    typeof response.summary.zh === 'string'
  );
}
