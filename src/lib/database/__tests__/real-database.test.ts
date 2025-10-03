import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../types/database';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 调试信息
console.log('🔍 Environment variables check:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required Supabase environment variables');
}

// 在测试中动态创建Supabase客户端
let supabase: ReturnType<typeof createClient<Database>>;

describe('Real Database Integration Tests', () => {
  let testUserId: string;
  let testConversationId: string;
  let testMessageId: string;

  beforeAll(async () => {
    // 初始化Supabase客户端
    supabase = createClient<Database>(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
    
    // 清理测试数据
    await cleanupTestData();
  });

  afterAll(async () => {
    // 测试完成后清理数据
    await cleanupTestData();
  });

  beforeEach(async () => {
    // 每个测试前清理相关数据
    if (testMessageId) {
      try {
        await supabase.from('messages').delete().eq('id', testMessageId);
      } catch (error) {
        // 忽略删除错误
      }
    }
    if (testConversationId) {
      try {
        await supabase.from('conversations').delete().eq('id', testConversationId);
      } catch (error) {
        // 忽略删除错误
      }
    }
    if (testUserId) {
      try {
        await supabase.from('users').delete().eq('id', testUserId);
      } catch (error) {
        // 忽略删除错误
      }
    }
  });

  describe('Database Connection', () => {
    it('should connect to database successfully', async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('count', { count: 'exact', head: true });

        console.log('Connection test result:', { data, error });
        
        if (error) {
          console.error('Supabase error details:', error);
        }
        
        expect(error).toBeNull();
        expect(data).toBeDefined();
      } catch (err) {
        console.error('Test error:', err);
        throw err;
      }
    });

    it('should query cars table', async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('id, make, model')
          .limit(5);

        console.log('Cars query result:', { data, error });
        
        if (error) {
          console.error('Cars query error details:', error);
        }
        
        expect(error).toBeNull();
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
        
        if (data && data.length > 0) {
          expect(data[0]).toHaveProperty('id');
          expect(data[0]).toHaveProperty('make');
          expect(data[0]).toHaveProperty('model');
        }
      } catch (err) {
        console.error('Cars query test error:', err);
        throw err;
      }
    });
  });

  describe('User Operations', () => {
    it('should create and find user', async () => {
      const timestamp = Date.now();
      const userData = {
        email: `test-${timestamp}@example.com`,
        name: 'Test User',
        language: 'zh',
        session_id: `test-session-${timestamp}`
      };

      // 创建用户
      const { data: createdUser, error: createError } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      expect(createError).toBeNull();
      expect(createdUser).toBeDefined();
      expect(createdUser?.email).toBe(`test-${timestamp}@example.com`);
      expect(createdUser?.name).toBe('Test User');
      
      testUserId = createdUser!.id;

      // 查找用户
      const { data: foundUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('id', testUserId)
        .single();

      expect(findError).toBeNull();
      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(`test-${timestamp}@example.com`);
    });

    it('should update user', async () => {
      // 先创建用户
      const timestamp = Date.now();
      const { data: createdUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: `update-test-${timestamp}@example.com`,
          name: 'Update Test User',
          language: 'en',
          session_id: `update-session-${timestamp}`
        })
        .select()
        .single();

      expect(createError).toBeNull();
      expect(createdUser).toBeDefined();
      testUserId = createdUser!.id;

      // 更新用户
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          name: 'Updated Name',
          language: 'zh'
        })
        .eq('id', testUserId)
        .select()
        .single();

      expect(updateError).toBeNull();
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.name).toBe('Updated Name');
      expect(updatedUser?.language).toBe('zh');
    });
  });

  describe('Conversation Operations', () => {
    it('should create and find conversation', async () => {
      // 先创建用户
      const timestamp = Date.now();
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          email: `conv-test-${timestamp}@example.com`,
          name: 'Conv Test User',
          language: 'zh',
          session_id: `conv-session-${timestamp}`
        })
        .select()
        .single();

      expect(userError).toBeNull();
      expect(user).toBeDefined();
      testUserId = user!.id;

      const conversationData = {
        user_id: testUserId,
        title: 'Test Conversation',
        language: 'zh',
        session_id: `conv-session-${timestamp}`
      };

      // 创建对话
      const { data: createdConversation, error: createError } = await supabase
        .from('conversations')
        .insert(conversationData)
        .select()
        .single();

      expect(createError).toBeNull();
      expect(createdConversation).toBeDefined();
      expect(createdConversation?.title).toBe('Test Conversation');
      expect(createdConversation?.user_id).toBe(testUserId);
      
      testConversationId = createdConversation!.id;

      // 查找对话
      const { data: foundConversation, error: findError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', testConversationId)
        .single();

      expect(findError).toBeNull();
      expect(foundConversation).toBeDefined();
      expect(foundConversation?.title).toBe('Test Conversation');
    });

    it('should find conversations by user ID', async () => {
      // 先创建用户和对话
      const timestamp = Date.now();
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          email: `list-test-${timestamp}@example.com`,
          name: 'List Test User',
          language: 'zh',
          session_id: `list-session-${timestamp}`
        })
        .select()
        .single();

      expect(userError).toBeNull();
      expect(user).toBeDefined();
      testUserId = user!.id;

      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: testUserId,
          title: 'List Test Conversation',
          language: 'zh',
          session_id: `list-session-${timestamp}`
        })
        .select()
        .single();

      expect(convError).toBeNull();
      expect(conversation).toBeDefined();
      testConversationId = conversation!.id;

      // 查找用户的对话列表
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', testUserId);

      expect(error).toBeNull();
      expect(conversations).toBeDefined();
      expect(conversations).toHaveLength(1);
      expect(conversations![0].title).toBe('List Test Conversation');
    });
  });

  describe('Message Operations', () => {
    it('should create and find messages', async () => {
      // 先创建用户和对话
      const timestamp = Date.now();
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          email: `msg-test-${timestamp}@example.com`,
          name: 'Msg Test User',
          language: 'zh',
          session_id: `msg-session-${timestamp}`
        })
        .select()
        .single();

      expect(userError).toBeNull();
      expect(user).toBeDefined();
      testUserId = user!.id;

      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: testUserId,
          title: 'Msg Test Conversation',
          language: 'zh',
          session_id: `msg-session-${timestamp}`
        })
        .select()
        .single();

      expect(convError).toBeNull();
      expect(conversation).toBeDefined();
      testConversationId = conversation!.id;

      const messageData = {
        conversation_id: testConversationId,
        type: 'user',
        content: 'Hello, this is a test message'
      };

      // 创建消息
      const { data: createdMessage, error: createError } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      expect(createError).toBeNull();
      expect(createdMessage).toBeDefined();
      expect(createdMessage?.content).toBe('Hello, this is a test message');
      expect(createdMessage?.type).toBe('user');
      
      testMessageId = createdMessage!.id;

      // 查找消息
      const { data: messages, error: findError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', testConversationId);

      expect(findError).toBeNull();
      expect(messages).toBeDefined();
      expect(messages).toHaveLength(1);
      expect(messages![0].content).toBe('Hello, this is a test message');
    });
  });

  describe('Car Operations', () => {
    it('should find cars', async () => {
      const { data: cars, error } = await supabase
        .from('cars')
        .select('*')
        .limit(5);

      expect(error).toBeNull();
      expect(cars).toBeDefined();
      expect(Array.isArray(cars)).toBe(true);
      
      if (cars && cars.length > 0) {
        const firstCar = cars[0];
        expect(firstCar).toHaveProperty('id');
        expect(firstCar).toHaveProperty('make');
        expect(firstCar).toHaveProperty('model');
      }
    });

    it('should search cars', async () => {
      const { data: cars, error } = await supabase
        .from('cars')
        .select('*')
        .ilike('make', '%Toyota%')
        .limit(5);

      expect(error).toBeNull();
      expect(cars).toBeDefined();
      expect(Array.isArray(cars)).toBe(true);
    });
  });

  describe('Database Health Check', () => {
    it('should check all tables are accessible', async () => {
      const tables = ['users', 'conversations', 'messages', 'cars', 'recommendations', 'next_steps'] as const;
      
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        expect(error).toBeNull();
      }
    });
  });

  // 清理测试数据的辅助函数
  async function cleanupTestData() {
    try {
      // 清理消息
      if (testMessageId) {
        await supabase.from('messages').delete().eq('id', testMessageId);
      }
      // 清理对话
      if (testConversationId) {
        await supabase.from('conversations').delete().eq('id', testConversationId);
      }
      // 清理用户
      if (testUserId) {
        await supabase.from('users').delete().eq('id', testUserId);
      }
    } catch (error) {
      console.warn('Cleanup error:', error);
    }
  }
});
