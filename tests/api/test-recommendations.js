/**
 * 推荐API测试脚本
 * 测试 /api/recommendations 接口
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { supabase } from '../../src/lib/supabase.js';

// 测试数据
let testUserId;
let testConversationId;
let testMessageId;
let testCarId;
let testRecommendationId;

describe('Recommendations API', () => {
  beforeAll(async () => {
    // 创建测试用户
    const testUser = {
      id: crypto.randomUUID(),
      email: 'test@example.com',
      name: '测试用户',
      language: 'zh',
      session_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: user } = await supabase
      .from('users')
      .upsert(testUser)
      .select()
      .single();

    testUserId = user.id;

    // 创建测试会话
    const testConversation = {
      id: crypto.randomUUID(),
      user_id: testUserId,
      title: '测试推荐对话',
      language: 'zh',
      session_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: conversation } = await supabase
      .from('conversations')
      .insert(testConversation)
      .select()
      .single();

    testConversationId = conversation.id;

    // 创建测试消息
    const testMessage = {
      id: crypto.randomUUID(),
      conversation_id: testConversationId,
      type: 'user',
      content: '我想找一辆SUV',
      created_at: new Date().toISOString()
    };

    const { data: message } = await supabase
      .from('messages')
      .insert(testMessage)
      .select()
      .single();

    testMessageId = message.id;

    // 创建测试车型
    const testCar = {
      id: crypto.randomUUID(),
      make: 'Toyota',
      model: 'RAV4',
      year_min: 2020,
      year_max: 2024,
      price_min: 25000,
      price_max: 35000,
      currency: 'CAD',
      category: 'SUV',
      fuel_type: 'Gasoline',
      description_en: 'A reliable compact SUV',
      description_zh: '一款可靠的紧凑型SUV',
      pros_en: ['Reliable', 'Fuel efficient'],
      pros_zh: ['可靠', '省油'],
      cons_en: ['Limited cargo space'],
      cons_zh: ['行李空间有限'],
      features: ['AWD', 'Backup camera'],
      image_url: 'https://example.com/rav4.jpg',
      reliability_score: 85,
      fuel_economy: 8.5,
      safety_rating: 5,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: car } = await supabase
      .from('cars')
      .insert(testCar)
      .select()
      .single();

    testCarId = car.id;

    // 创建测试推荐
    const testRecommendation = {
      id: crypto.randomUUID(),
      conversation_id: testConversationId,
      message_id: testMessageId,
      car_id: testCarId,
      match_score: 85,
      reasoning_en: 'Based on your preference for SUVs, this Toyota RAV4 is a great match.',
      reasoning_zh: '根据您对SUV的偏好，这款丰田RAV4是一个很好的选择。',
      created_at: new Date().toISOString()
    };

    const { data: recommendation } = await supabase
      .from('recommendations')
      .insert(testRecommendation)
      .select()
      .single();

    testRecommendationId = recommendation.id;
  });

  afterAll(async () => {
    // 清理测试数据
    if (testRecommendationId) {
      await supabase.from('recommendations').delete().eq('id', testRecommendationId);
    }
    if (testCarId) {
      await supabase.from('cars').delete().eq('id', testCarId);
    }
    if (testMessageId) {
      await supabase.from('messages').delete().eq('id', testMessageId);
    }
    if (testConversationId) {
      await supabase.from('conversations').delete().eq('id', testConversationId);
    }
    if (testUserId) {
      await supabase.from('users').delete().eq('id', testUserId);
    }
  });

  describe('GET /api/recommendations', () => {
    test('应该返回推荐列表', async () => {
      const response = await fetch('/api/recommendations');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('recommendations');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.recommendations)).toBe(true);
    });

    test('应该支持按会话ID筛选', async () => {
      const response = await fetch(`/api/recommendations?conversation_id=${testConversationId}`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data.recommendations)).toBe(true);

      // 应该至少包含我们创建的测试推荐
      const hasTestRecommendation = data.recommendations.some(rec => rec.id === testRecommendationId);
      expect(hasTestRecommendation).toBe(true);
    });

    test('应该支持按消息ID筛选', async () => {
      const response = await fetch(`/api/recommendations?message_id=${testMessageId}`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data.recommendations)).toBe(true);

      const hasTestRecommendation = data.recommendations.some(rec => rec.id === testRecommendationId);
      expect(hasTestRecommendation).toBe(true);
    });

    test('应该支持按车型ID筛选', async () => {
      const response = await fetch(`/api/recommendations?car_id=${testCarId}`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data.recommendations)).toBe(true);

      const hasTestRecommendation = data.recommendations.some(rec => rec.id === testRecommendationId);
      expect(hasTestRecommendation).toBe(true);
    });

    test('应该支持按最小分数筛选', async () => {
      const response = await fetch('/api/recommendations?min_score=80');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data.recommendations)).toBe(true);

      // 所有推荐的分数都应该 >= 80
      data.recommendations.forEach(rec => {
        expect(rec.match_score).toBeGreaterThanOrEqual(80);
      });
    });

    test('应该按匹配分数降序排列', async () => {
      const response = await fetch('/api/recommendations');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data.recommendations)).toBe(true);

      // 验证推荐按分数降序排列
      for (let i = 1; i < data.recommendations.length; i++) {
        expect(data.recommendations[i - 1].match_score).toBeGreaterThanOrEqual(
          data.recommendations[i].match_score
        );
      }
    });

    test('应该支持分页', async () => {
      const response = await fetch('/api/recommendations?limit=10&offset=0');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.pagination).toHaveProperty('limit', 10);
      expect(data.pagination).toHaveProperty('offset', 0);
      expect(data.pagination).toHaveProperty('total');
      expect(data.pagination).toHaveProperty('hasMore');
    });

    test('应该包含关联的车型和会话信息', async () => {
      const response = await fetch(`/api/recommendations?conversation_id=${testConversationId}`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data.recommendations)).toBe(true);

      if (data.recommendations.length > 0) {
        const recommendation = data.recommendations[0];
        expect(recommendation).toHaveProperty('car');
        expect(recommendation).toHaveProperty('conversation');
        expect(recommendation.car).toHaveProperty('id');
        expect(recommendation.car).toHaveProperty('make');
        expect(recommendation.car).toHaveProperty('model');
        expect(recommendation.conversation).toHaveProperty('id');
        expect(recommendation.conversation).toHaveProperty('title');
      }
    });

    test('应该验证参数格式', async () => {
      const response = await fetch('/api/recommendations?limit=invalid');
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });

    test('应该正确处理空结果', async () => {
      const response = await fetch('/api/recommendations?conversation_id=00000000-0000-0000-0000-000000000000');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data.recommendations)).toBe(true);
      expect(data.recommendations).toHaveLength(0);
    });
  });

  describe('POST /api/recommendations', () => {
    test('应该成功创建新推荐', async () => {
      // 创建新的测试车型
      const newCar = {
        id: crypto.randomUUID(),
        make: 'Honda',
        model: 'CR-V',
        year_min: 2021,
        year_max: 2024,
        price_min: 28000,
        price_max: 38000,
        currency: 'CAD',
        category: 'SUV',
        fuel_type: 'Gasoline',
        description_en: 'A popular crossover SUV',
        description_zh: '一款受欢迎的跨界SUV',
        pros_en: ['Spacious interior', 'Good fuel economy'],
        pros_zh: ['内部空间宽敞', '燃油经济性好'],
        cons_en: ['CVT transmission'],
        cons_zh: ['CVT变速箱'],
        features: ['AWD', 'Honda Sensing'],
        image_url: 'https://example.com/crv.jpg',
        reliability_score: 88,
        fuel_economy: 7.8,
        safety_rating: 5,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: car } = await supabase
        .from('cars')
        .insert(newCar)
        .select()
        .single();

      const newRecommendation = {
        conversation_id: testConversationId,
        message_id: testMessageId,
        car_id: car.id,
        match_score: 90,
        reasoning_en: 'This Honda CR-V offers excellent space and reliability.',
        reasoning_zh: '这款本田CR-V提供了优秀的空间和可靠性。'
      };

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecommendation),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data).toHaveProperty('recommendation');
      expect(data).toHaveProperty('message');
      expect(data.recommendation.match_score).toBe(90);
      expect(data.recommendation.reasoning_en).toBe('This Honda CR-V offers excellent space and reliability.');
      expect(data.recommendation.reasoning_zh).toBe('这款本田CR-V提供了优秀的空间和可靠性。');

      // 清理创建的推荐和车型
      await supabase.from('recommendations').delete().eq('id', data.recommendation.id);
      await supabase.from('cars').delete().eq('id', car.id);
    });

    test('应该验证关联的会话和消息存在', async () => {
      const invalidRecommendation = {
        conversation_id: crypto.randomUUID(), // 不存在的会话ID
        message_id: crypto.randomUUID(), // 不存在的消息ID
        car_id: testCarId,
        match_score: 85,
        reasoning_en: 'Invalid recommendation'
      };

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidRecommendation),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('关联的会话不存在');
    });

    test('应该验证车型存在且激活', async () => {
      const invalidRecommendation = {
        conversation_id: testConversationId,
        message_id: testMessageId,
        car_id: crypto.randomUUID(), // 不存在的车型ID
        match_score: 85,
        reasoning_en: 'Invalid car recommendation'
      };

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidRecommendation),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('车型不存在或已停用');
    });

    test('应该验证匹配分数范围', async () => {
      const invalidRecommendation = {
        conversation_id: testConversationId,
        message_id: testMessageId,
        car_id: testCarId,
        match_score: 150, // 超过100的最大值
        reasoning_en: 'Score too high'
      };

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidRecommendation),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });

    test('应该验证理由长度限制', async () => {
      const longReasoning = 'a'.repeat(1500); // 超过1000字符限制

      const invalidRecommendation = {
        conversation_id: testConversationId,
        message_id: testMessageId,
        car_id: testCarId,
        match_score: 85,
        reasoning_en: longReasoning
      };

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidRecommendation),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });

    test('应该自动生成推荐ID和时间戳', async () => {
      const newRecommendation = {
        conversation_id: testConversationId,
        message_id: testMessageId,
        car_id: testCarId,
        match_score: 75,
        reasoning_en: 'Auto-generated ID recommendation'
      };

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecommendation),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.recommendation).toHaveProperty('id');
      expect(data.recommendation).toHaveProperty('created_at');

      // 清理创建的推荐
      await supabase.from('recommendations').delete().eq('id', data.recommendation.id);
    });

    test('应该验证必填参数', async () => {
      const invalidRecommendation = {
        // 缺少必填参数
        match_score: 85
      };

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidRecommendation),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });

    test('应该验证UUID格式', async () => {
      const invalidRecommendation = {
        conversation_id: 'invalid-uuid',
        message_id: testMessageId,
        car_id: testCarId,
        match_score: 85,
        reasoning_en: 'Invalid UUID format'
      };

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidRecommendation),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });
  });
});
