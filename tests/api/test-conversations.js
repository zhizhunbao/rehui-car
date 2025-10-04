/**
 * 会话API测试脚本
 * 测试 /api/conversations 接口
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { supabase } from '../../src/lib/supabase.js';

// 测试数据
let testUserId;
let testConversationId;

describe('Conversations API', () => {
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
      title: '测试对话',
      summary: '这是一个测试对话',
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
  });

  afterAll(async () => {
    // 清理测试数据
    if (testConversationId) {
      await supabase.from('conversations').delete().eq('id', testConversationId);
    }
    if (testUserId) {
      await supabase.from('users').delete().eq('id', testUserId);
    }
  });

  describe('GET /api/conversations', () => {
    test('应该返回会话列表', async () => {
      const response = await fetch('/api/conversations');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('conversations');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.conversations)).toBe(true);
    });

    test('应该支持按用户ID筛选', async () => {
      const response = await fetch(`/api/conversations?userId=${testUserId}`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data.conversations)).toBe(true);

      // 应该至少包含我们创建的测试会话
      const hasTestConversation = data.conversations.some(conv => conv.id === testConversationId);
      expect(hasTestConversation).toBe(true);
    });

    test('应该支持搜索功能', async () => {
      const response = await fetch('/api/conversations?search=测试');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data.conversations)).toBe(true);
    });

    test('应该支持分页', async () => {
      const response = await fetch('/api/conversations?limit=10&offset=0');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.pagination).toHaveProperty('limit', 10);
      expect(data.pagination).toHaveProperty('offset', 0);
    });

    test('应该验证参数格式', async () => {
      const response = await fetch('/api/conversations?limit=invalid');
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });
  });

  describe('POST /api/conversations', () => {
    test('应该成功创建新会话', async () => {
      const newConversation = {
        userId: testUserId,
        title: '新测试对话',
        language: 'zh',
        summary: '这是一个新创建的测试对话'
      };

      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConversation),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data).toHaveProperty('conversation');
      expect(data).toHaveProperty('message');
      expect(data.conversation.title).toBe('新测试对话');
      expect(data.conversation.language).toBe('zh');

      // 清理创建的会话
      await supabase.from('conversations').delete().eq('id', data.conversation.id);
    });

    test('应该创建会话时自动生成ID和时间戳', async () => {
      const newConversation = {
        title: '自动生成ID的对话'
      };

      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConversation),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.conversation).toHaveProperty('id');
      expect(data.conversation).toHaveProperty('created_at');
      expect(data.conversation).toHaveProperty('updated_at');
      expect(data.conversation).toHaveProperty('session_id');

      // 清理创建的会话
      await supabase.from('conversations').delete().eq('id', data.conversation.id);
    });

    test('应该验证必填参数', async () => {
      const invalidConversation = {};

      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidConversation),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });

    test('应该验证标题长度', async () => {
      const longTitle = 'a'.repeat(300); // 超过200字符限制

      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: longTitle
        }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });
  });
});
