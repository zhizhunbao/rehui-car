import { Language } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/types';

/**
 * 汽车推荐提示词模板
 * @param userMessage 用户消息
 * @param language 语言设置
 * @returns 格式化的提示词
 */
export const CAR_RECOMMENDATION_PROMPT = (
  userMessage: string,
  language: Language
): string => {
  const basePrompt = language === 'zh' 
    ? `你是专业的加拿大汽车购买顾问。请基于用户需求提供详细的汽车推荐。

用户需求: ${userMessage}

请返回JSON格式的推荐结果：
{
  "summary": {
    "en": "英文摘要 - 简要总结用户需求和推荐策略",
    "zh": "中文摘要 - 简要总结用户需求和推荐策略"
  },
  "recommendations": [
    {
      "car_id": "车型唯一标识",
      "match_score": 0.85,
      "reasoning_en": "英文推荐理由 - 详细说明为什么推荐这款车",
      "reasoning_zh": "中文推荐理由 - 详细说明为什么推荐这款车"
    }
  ],
  "next_steps": [
    {
      "title_en": "英文标题 - 下一步行动标题",
      "title_zh": "中文标题 - 下一步行动标题", 
      "description_en": "英文描述 - 详细说明下一步行动",
      "description_zh": "中文描述 - 详细说明下一步行动",
      "priority": "high|medium|low",
      "action_type": "research|visit|contact|prepare"
    }
  ]
}

请确保：
1. 推荐理由要具体且实用
2. 匹配分数要合理（0-1之间）
3. 下一步行动要可操作
4. 所有文本都要符合用户的语言偏好`
    : `You are a professional Canadian car buying advisor. Please provide detailed car recommendations based on user requirements.

User requirement: ${userMessage}

Please return JSON format recommendation results:
{
  "summary": {
    "en": "English summary - Briefly summarize user needs and recommendation strategy",
    "zh": "Chinese summary - Briefly summarize user needs and recommendation strategy"
  },
  "recommendations": [
    {
      "car_id": "unique car identifier",
      "match_score": 0.85,
      "reasoning_en": "English reasoning - Detailed explanation of why this car is recommended",
      "reasoning_zh": "Chinese reasoning - Detailed explanation of why this car is recommended"
    }
  ],
  "next_steps": [
    {
      "title_en": "English title - Next step action title",
      "title_zh": "Chinese title - Next step action title",
      "description_en": "English description - Detailed explanation of next step action",
      "description_zh": "Chinese description - Detailed explanation of next step action",
      "priority": "high|medium|low",
      "action_type": "research|visit|contact|prepare"
    }
  ]
}

Please ensure:
1. Recommendation reasoning is specific and practical
2. Match scores are reasonable (between 0-1)
3. Next steps are actionable
4. All text matches user's language preference`;

  return basePrompt;
};

/**
 * 聊天对话提示词模板
 * @param language 语言设置
 * @returns 系统提示词
 */
export const CHAT_SYSTEM_PROMPT = (language: Language): string => {
  return language === 'zh'
    ? `你是专业的加拿大汽车购买顾问，具有以下特点：

1. 专业知识：
   - 熟悉加拿大汽车市场
   - 了解各品牌车型特点
   - 掌握汽车购买流程
   - 熟悉保险和贷款政策

2. 服务态度：
   - 耐心细致，认真倾听
   - 客观中立，不偏不倚
   - 以用户需求为导向
   - 提供实用建议

3. 回复要求：
   - 用中文回复
   - 语言简洁明了
   - 提供具体建议
   - 避免过于技术化的术语

请根据用户的问题提供专业、实用的汽车购买建议。`
    : `You are a professional Canadian car buying advisor with the following characteristics:

1. Professional Knowledge:
   - Familiar with Canadian car market
   - Understand various brand and model features
   - Master car buying process
   - Familiar with insurance and loan policies

2. Service Attitude:
   - Patient and detailed, listen carefully
   - Objective and neutral, unbiased
   - User needs oriented
   - Provide practical advice

3. Response Requirements:
   - Reply in English
   - Language is concise and clear
   - Provide specific suggestions
   - Avoid overly technical terms

Please provide professional and practical car buying advice based on user questions.`;
};

/**
 * 车型搜索提示词模板
 * @param searchQuery 搜索查询
 * @param language 语言设置
 * @returns 搜索提示词
 */
export const CAR_SEARCH_PROMPT = (
  searchQuery: string,
  language: Language
): string => {
  return language === 'zh'
    ? `基于搜索查询"${searchQuery}"，请提供相关的汽车推荐。

请考虑以下因素：
1. 预算范围
2. 车型偏好（轿车、SUV、卡车等）
3. 燃油类型（汽油、混合动力、电动等）
4. 品牌偏好
5. 使用场景（城市通勤、家庭出行、商务等）

请返回JSON格式的搜索结果：
{
  "summary": {
    "en": "英文摘要",
    "zh": "中文摘要"
  },
  "recommendations": [
    {
      "car_id": "车型ID",
      "match_score": 0.8,
      "reasoning_en": "英文推荐理由",
      "reasoning_zh": "中文推荐理由"
    }
  ],
  "search_suggestions": [
    "相关搜索建议1",
    "相关搜索建议2"
  ]
}`
    : `Based on search query "${searchQuery}", please provide relevant car recommendations.

Please consider the following factors:
1. Budget range
2. Vehicle type preference (sedan, SUV, truck, etc.)
3. Fuel type (gasoline, hybrid, electric, etc.)
4. Brand preference
5. Usage scenario (city commuting, family travel, business, etc.)

Please return JSON format search results:
{
  "summary": {
    "en": "English summary",
    "zh": "Chinese summary"
  },
  "recommendations": [
    {
      "car_id": "car_id",
      "match_score": 0.8,
      "reasoning_en": "English reasoning",
      "reasoning_zh": "Chinese reasoning"
    }
  ],
  "search_suggestions": [
    "Related search suggestion 1",
    "Related search suggestion 2"
  ]
}`;
};

/**
 * 价格分析提示词模板
 * @param carInfo 车型信息
 * @param language 语言设置
 * @returns 价格分析提示词
 */
export const PRICE_ANALYSIS_PROMPT = (
  carInfo: string,
  language: Language
): string => {
  return language === 'zh'
    ? `请分析以下车型的价格信息：${carInfo}

请提供：
1. 市场价格范围
2. 性价比分析
3. 保值率评估
4. 购买建议
5. 谈判技巧

返回JSON格式：
{
  "price_range": {
    "min": 最低价格,
    "max": 最高价格,
    "average": 平均价格
  },
  "value_analysis": {
    "en": "英文价值分析",
    "zh": "中文价值分析"
  },
  "depreciation": {
    "rate": "保值率百分比",
    "analysis": {
      "en": "英文保值分析",
      "zh": "中文保值分析"
    }
  },
  "buying_advice": {
    "en": "英文购买建议",
    "zh": "中文购买建议"
  },
  "negotiation_tips": {
    "en": "英文谈判技巧",
    "zh": "中文谈判技巧"
  }
}`
    : `Please analyze the price information for the following car: ${carInfo}

Please provide:
1. Market price range
2. Value analysis
3. Depreciation assessment
4. Buying advice
5. Negotiation tips

Return JSON format:
{
  "price_range": {
    "min": minimum_price,
    "max": maximum_price,
    "average": average_price
  },
  "value_analysis": {
    "en": "English value analysis",
    "zh": "Chinese value analysis"
  },
  "depreciation": {
    "rate": "depreciation_rate_percentage",
    "analysis": {
      "en": "English depreciation analysis",
      "zh": "Chinese depreciation analysis"
    }
  },
  "buying_advice": {
    "en": "English buying advice",
    "zh": "Chinese buying advice"
  },
  "negotiation_tips": {
    "en": "English negotiation tips",
    "zh": "Chinese negotiation tips"
  }
}`;
};

/**
 * 比较分析提示词模板
 * @param cars 车型列表
 * @param language 语言设置
 * @returns 比较分析提示词
 */
export const COMPARISON_PROMPT = (
  cars: string[],
  language: Language
): string => {
  return language === 'zh'
    ? `请比较以下车型：${cars.join(', ')}

请从以下维度进行比较：
1. 价格对比
2. 性能对比
3. 燃油经济性
4. 可靠性
5. 安全性
6. 维护成本
7. 保值率

返回JSON格式：
{
  "comparison": [
    {
      "car_id": "车型ID",
      "score": 综合评分,
      "pros": ["优点1", "优点2"],
      "cons": ["缺点1", "缺点2"]
    }
  ],
  "winner": {
    "car_id": "推荐车型ID",
    "reasoning": {
      "en": "英文推荐理由",
      "zh": "中文推荐理由"
    }
  },
  "summary": {
    "en": "英文总结",
    "zh": "中文总结"
  }
}`
    : `Please compare the following cars: ${cars.join(', ')}

Please compare from the following dimensions:
1. Price comparison
2. Performance comparison
3. Fuel economy
4. Reliability
5. Safety
6. Maintenance cost
7. Depreciation rate

Return JSON format:
{
  "comparison": [
    {
      "car_id": "car_id",
      "score": overall_score,
      "pros": ["advantage1", "advantage2"],
      "cons": ["disadvantage1", "disadvantage2"]
    }
  ],
  "winner": {
    "car_id": "recommended_car_id",
    "reasoning": {
      "en": "English reasoning",
      "zh": "Chinese reasoning"
    }
  },
  "summary": {
    "en": "English summary",
    "zh": "Chinese summary"
  }
}`;
};

/**
 * 错误处理提示词模板
 * @param error 错误信息
 * @param language 语言设置
 * @returns 错误处理提示词
 */
export const ERROR_HANDLING_PROMPT = (
  error: string,
  language: Language
): string => {
  return language === 'zh'
    ? `抱歉，处理您的请求时遇到了问题：${error}

请尝试：
1. 重新描述您的需求
2. 提供更具体的信息
3. 稍后再试

如果问题持续存在，请联系技术支持。`
    : `Sorry, we encountered a problem processing your request: ${error}

Please try:
1. Rephrase your requirements
2. Provide more specific information
3. Try again later

If the problem persists, please contact technical support.`;
};
