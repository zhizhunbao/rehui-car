/**
 * 会话详情API测试脚本
 * 测试 /api/conversations/[id] 接口
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { supabase } from '../../src/lib/supabase.js';

// 测试数据
let testUserId;
let testConversationId;
let testMessageId;

describe('Conversation Detail API', () => {
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
      title: '测试对话详情',
      summary: '这是一个用于测试详情功能的对话',
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
      content: '这是一条测试消息',
      created_at: new Date().toISOString()
    };

    const { data: message } = await supabase
      .from('messages')
      .insert(testMessage)
      .select()
      .single();

    testMessageId = message.id;
  });

  afterAll(async () => {
    // 清理测试数据
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

  describe('GET /api/conversations/[id]', () => {
    test('应该返回会话详情', async () => {
      const response = await fetch(`/api/conversations/${testConversationId}`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('conversation');
      expect(data).toHaveProperty('statistics');
      expect(data.conversation.id).toBe(testConversationId);
      expect(data.conversation.title).toBe('测试对话详情');
      expect(data.statistics).toHaveProperty('messageCount');
    });

    test('应该返回404当会话不存在', async () => {
      const nonExistentId = crypto.randomUUID();
      const response = await fetch(`/api/conversations/${nonExistentId}`);
      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data.error).toBe('会话不存在');
    });

    test('应该返回400当ID格式无效', async () => {
      const response = await fetch('/api/conversations/invalid-id');
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('会话ID格式无效');
    });
  });

  describe('PUT /api/conversations/[id]', () => {
    test('应该成功更新会话信息', async () => {
      const updateData = {
        title: '更新后的对话标题',
        summary: '更新后的对话摘要',
        language: 'en'
      };

      const response = await fetch(`/api/conversations/${testConversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('conversation');
      expect(data).toHaveProperty('message');
      expect(data.conversation.title).toBe('更新后的对话标题');
      expect(data.conversation.summary).toBe('更新后的对话摘要');
      expect(data.conversation.language).toBe('en');
    });

    test('应该只更新提供的字段', async () => {
      const updateData = {
        title: '只更新标题'
      };

      const response = await fetch(`/api/conversations/${testConversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.conversation.title).toBe('只更新标题');
      expect(data.conversation.language).toBe('en'); // 应该保持之前的值
    });

    test('应该更新updated_at时间戳', async () => {
      const beforeUpdate = new Date();

      const updateData = {
        summary: '测试更新时间戳'
      };

      const response = await fetch(`/api/conversations/${testConversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      const updatedAt = new Date(data.conversation.updated_at);
      expect(updatedAt.getTime()).toBeGreaterThan(beforeUpdate.getTime());
    });

    test('应该返回404当更新不存在的会话', async () => {
      const nonExistentId = crypto.randomUUID();
      const updateData = { title: '不存在的会话' };

      const response = await fetch(`/api/conversations/${nonExistentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data.error).toBe('会话不存在');
    });

    test('应该验证更新数据的格式', async () => {
      const invalidUpdateData = {
        title: '' // 空标题应该被拒绝
      };

      const response = await fetch(`/api/conversations/${testConversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidUpdateData),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });
  });

  describe('DELETE /api/conversations/[id]', () => {
    test('应该成功删除会话', async () => {
      // 创建一个专门用于删除测试的会话
      const conversationToDelete = {
        id: crypto.randomUUID(),
        user_id: testUserId,
        title: '待删除对话',
        language: 'zh',
        session_id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: createdConversation } = await supabase
        .from('conversations')
        .insert(conversationToDelete)
        .select()
        .single();

      const response = await fetch(`/api/conversations/${createdConversation.id}`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.message).toBe('会话删除成功');

      // 验证会话已被删除
      const { data: deletedConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', createdConversation.id)
        .single();

      expect(deletedConversation).toBeNull();
    });

    test('应该删除相关的消息记录', async () => {
      // 创建一个带消息的会话
      const conversationWithMessages = {
        id: crypto.randomUUID(),
        user_id: testUserId,
        title: '带消息的对话',
        language: 'zh',
        session_id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: createdConversation } = await supabase
        .from('conversations')
        .insert(conversationWithMessages)
        .select()
        .single();

      // 添加测试消息
      const testMessages = [
        {
          id: crypto.randomUUID(),
          conversation_id: createdConversation.id,
          type: 'user',
          content: '用户消息1',
          created_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          conversation_id: createdConversation.id,
          type: 'assistant',
          content: '助手消息1',
          created_at: new Date().toISOString()
        }
      ];

      await supabase.from('messages').insert(testMessages);

      // 删除会话
      const response = await fetch(`/api/conversations/${createdConversation.id}`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(200);

      // 验证消息也被删除了
      const { data: remainingMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', createdConversation.id);

      expect(remainingMessages).toHaveLength(0);
    });

    test('应该返回404当删除不存在的会话', async () => {
      const nonExistentId = crypto.randomUUID();

      const response = await fetch(`/api/conversations/${nonExistentId}`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data.error).toBe('会话不存在');
    });

    test('应该返回400当ID格式无效', async () => {
      const response = await fetch('/api/conversations/invalid-id', {
        method: 'DELETE',
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('会话ID格式无效');
    });
  });
});
