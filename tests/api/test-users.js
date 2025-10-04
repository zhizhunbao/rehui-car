/**
 * 用户API测试脚本
 * 测试 /api/users 接口
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { supabase } from '../../src/lib/supabase.js';

// 测试数据
let testUserId;

describe('Users API', () => {
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
  });

  afterAll(async () => {
    // 清理测试数据
    if (testUserId) {
      await supabase.from('users').delete().eq('id', testUserId);
    }
  });

  describe('GET /api/users', () => {
    test('应该返回用户列表', async () => {
      const response = await fetch('/api/users');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('users');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.users)).toBe(true);
    });

    test('应该支持按语言筛选', async () => {
      const response = await fetch('/api/users?language=zh');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data.users)).toBe(true);

      // 验证所有返回的用户都是中文用户
      data.users.forEach(user => {
        expect(user.language).toBe('zh');
      });
    });

    test('应该支持搜索功能', async () => {
      const response = await fetch('/api/users?search=测试');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data.users)).toBe(true);

      // 应该至少包含我们创建的测试用户
      const hasTestUser = data.users.some(user => user.id === testUserId);
      expect(hasTestUser).toBe(true);
    });

    test('应该支持分页', async () => {
      const response = await fetch('/api/users?limit=10&offset=0');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.pagination).toHaveProperty('limit', 10);
      expect(data.pagination).toHaveProperty('offset', 0);
      expect(data.pagination).toHaveProperty('total');
      expect(data.pagination).toHaveProperty('hasMore');
    });

    test('应该验证参数格式', async () => {
      const response = await fetch('/api/users?limit=invalid');
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });

    test('应该正确处理空结果', async () => {
      const response = await fetch('/api/users?search=不存在的用户');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data.users)).toBe(true);
      expect(data.users).toHaveLength(0);
    });
  });

  describe('POST /api/users', () => {
    test('应该成功创建新用户', async () => {
      const newUser = {
        email: 'newuser@example.com',
        name: '新用户',
        language: 'en',
        session_id: crypto.randomUUID()
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('message');
      expect(data.user.email).toBe('newuser@example.com');
      expect(data.user.name).toBe('新用户');
      expect(data.user.language).toBe('en');

      // 清理创建的用户
      await supabase.from('users').delete().eq('id', data.user.id);
    });

    test('应该处理重复的session_id', async () => {
      // 先创建一个用户
      const existingUser = {
        email: 'existing@example.com',
        name: '已存在的用户',
        language: 'zh',
        session_id: 'duplicate-session-id'
      };

      const { data: createdUser } = await supabase
        .from('users')
        .insert(existingUser)
        .select()
        .single();

      // 尝试用相同的session_id创建用户
      const duplicateUser = {
        email: 'duplicate@example.com',
        name: '重复用户',
        language: 'en',
        session_id: 'duplicate-session-id'
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(duplicateUser),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('message');
      expect(data.message).toBe('用户已存在，返回现有用户信息');
      expect(data.user.email).toBe('existing@example.com'); // 应该返回已存在的用户

      // 清理测试用户
      await supabase.from('users').delete().eq('id', createdUser.id);
    });

    test('应该使用默认语言当未指定时', async () => {
      const newUser = {
        name: '无语言用户',
        session_id: crypto.randomUUID()
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.user.language).toBe('zh'); // 默认语言应该是中文

      // 清理创建的用户
      await supabase.from('users').delete().eq('id', data.user.id);
    });

    test('应该验证必填参数', async () => {
      const invalidUser = {
        email: 'invalid-email' // 无效的邮箱格式
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidUser),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });

    test('应该验证邮箱格式', async () => {
      const invalidUser = {
        email: 'invalid-email',
        name: '无效邮箱用户',
        session_id: crypto.randomUUID()
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidUser),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });

    test('应该验证姓名长度', async () => {
      const longName = 'a'.repeat(150); // 超过100字符限制

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: longName,
          session_id: crypto.randomUUID()
        }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });

    test('应该验证session_id必填', async () => {
      const invalidUser = {
        name: '无session用户',
        language: 'zh'
        // 缺少session_id
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidUser),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('请求参数无效');
    });

    test('应该自动生成用户ID和时间戳', async () => {
      const newUser = {
        name: '自动生成用户',
        session_id: crypto.randomUUID()
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.user).toHaveProperty('id');
      expect(data.user).toHaveProperty('created_at');
      expect(data.user).toHaveProperty('updated_at');

      // 清理创建的用户
      await supabase.from('users').delete().eq('id', data.user.id);
    });
  });
});
