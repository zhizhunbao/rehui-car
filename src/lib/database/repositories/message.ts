import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../../types/database';
import { ChatMessage, CreateMessageData, PaginationParams, APIListResponse } from '@/types';
import { handleSupabaseError } from '@/lib/supabase';

type MessageRow = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];

export class MessageRepository {
  constructor(private client: SupabaseClient<Database>) {}

  // 根据对话ID查找消息列表
  async findByConversationId(conversationId: string, pagination?: PaginationParams): Promise<APIListResponse<ChatMessage>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 50;
      const offset = (page - 1) * limit;

      // 获取总数
      const { count, error: countError } = await this.client
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId);

      if (countError) {
        throw handleSupabaseError(countError);
      }

      // 获取数据
      const { data, error } = await this.client
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) {
        throw handleSupabaseError(error);
      }

      const messages = data.map(row => this.mapRowToMessage(row));
      const total = count || 0;

      return {
        data: messages,
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 根据ID查找消息
  async findById(id: string): Promise<ChatMessage | null> {
    try {
      const { data, error } = await this.client
        .from('messages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 消息不存在
        }
        throw handleSupabaseError(error);
      }

      return this.mapRowToMessage(data);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 创建消息
  async create(data: CreateMessageData): Promise<ChatMessage> {
    try {
      const messageData: MessageInsert = {
        conversation_id: data.conversation_id,
        type: data.type,
        content: data.content,
        metadata: data.metadata || {}
      };

      const { data: result, error } = await this.client
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToMessage(result);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 批量创建消息
  async createMany(messages: CreateMessageData[]): Promise<ChatMessage[]> {
    try {
      const messageData: MessageInsert[] = messages.map(data => ({
        conversation_id: data.conversation_id,
        type: data.type,
        content: data.content,
        metadata: data.metadata || {}
      }));

      const { data: results, error } = await this.client
        .from('messages')
        .insert(messageData)
        .select();

      if (error) {
        throw handleSupabaseError(error);
      }

      return results.map(row => this.mapRowToMessage(row));
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 更新消息
  async update(id: string, content: string, metadata?: Record<string, any>): Promise<ChatMessage> {
    try {
      const updateData: Partial<MessageInsert> = {
        content,
        metadata: metadata || {}
      };

      const { data: result, error } = await this.client
        .from('messages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToMessage(result);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 删除消息
  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.client
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) {
        throw handleSupabaseError(error);
      }
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 根据对话ID删除所有消息
  async deleteByConversationId(conversationId: string): Promise<number> {
    try {
      const { data, error } = await this.client
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId)
        .select('id');

      if (error) {
        throw handleSupabaseError(error);
      }

      return data?.length || 0;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 获取对话的最新消息
  async getLatestMessage(conversationId: string): Promise<ChatMessage | null> {
    try {
      const { data, error } = await this.client
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 没有消息
        }
        throw handleSupabaseError(error);
      }

      return this.mapRowToMessage(data);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 获取对话的消息统计
  async getMessageStats(conversationId: string): Promise<{
    total: number;
    userMessages: number;
    assistantMessages: number;
    lastMessageAt: Date | null;
  }> {
    try {
      const { data, error } = await this.client
        .from('messages')
        .select('type, created_at')
        .eq('conversation_id', conversationId);

      if (error) {
        throw handleSupabaseError(error);
      }

      const total = data.length;
      const userMessages = data.filter(msg => msg.type === 'user').length;
      const assistantMessages = data.filter(msg => msg.type === 'assistant').length;
      
      const lastMessage = data.length > 0 
        ? data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        : null;

      return {
        total,
        userMessages,
        assistantMessages,
        lastMessageAt: lastMessage ? new Date(lastMessage.created_at) : null
      };
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 搜索消息内容
  async searchMessages(conversationId: string, query: string, pagination?: PaginationParams): Promise<APIListResponse<ChatMessage>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;
      const offset = (page - 1) * limit;

      // 使用全文搜索
      const { data, error } = await this.client
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .textSearch('content', query)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw handleSupabaseError(error);
      }

      const messages = data.map(row => this.mapRowToMessage(row));

      // 获取总数（简化版本，实际可能需要更复杂的查询）
      const { count, error: countError } = await this.client
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId)
        .textSearch('content', query);

      if (countError) {
        throw handleSupabaseError(countError);
      }

      const total = count || 0;

      return {
        data: messages,
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 清理旧消息
  async cleanupOldMessages(olderThanDays: number): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const { data, error } = await this.client
        .from('messages')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .select('id');

      if (error) {
        throw handleSupabaseError(error);
      }

      return data?.length || 0;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.client
        .from('messages')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }

  // 将数据库行映射为消息对象
  private mapRowToMessage(row: MessageRow): ChatMessage {
    return {
      id: row.id,
      type: row.type as 'user' | 'assistant',
      content: row.content,
      timestamp: new Date(row.created_at),
      metadata: row.metadata || {}
    };
  }
}

// 导出接口类型
export interface MessageRepository {
  findByConversationId(conversationId: string, pagination?: PaginationParams): Promise<APIListResponse<ChatMessage>>;
  findById(id: string): Promise<ChatMessage | null>;
  create(data: CreateMessageData): Promise<ChatMessage>;
  createMany(messages: CreateMessageData[]): Promise<ChatMessage[]>;
  update(id: string, content: string, metadata?: Record<string, any>): Promise<ChatMessage>;
  delete(id: string): Promise<void>;
  deleteByConversationId(conversationId: string): Promise<number>;
  getLatestMessage(conversationId: string): Promise<ChatMessage | null>;
  getMessageStats(conversationId: string): Promise<{
    total: number;
    userMessages: number;
    assistantMessages: number;
    lastMessageAt: Date | null;
  }>;
  searchMessages(conversationId: string, query: string, pagination?: PaginationParams): Promise<APIListResponse<ChatMessage>>;
  cleanupOldMessages(olderThanDays: number): Promise<number>;
  healthCheck(): Promise<boolean>;
}
