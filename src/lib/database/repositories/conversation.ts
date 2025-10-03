import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../../types/database';
import { 
  Conversation, 
  CreateConversationData, 
  UpdateConversationData,
  ConversationWithMessages,
  ConversationDetailResponse,
  PaginationParams,
  APIListResponse
} from '@/types';
import { handleSupabaseError } from '@/lib/supabase';

type ConversationRow = Database['public']['Tables']['conversations']['Row'];
type ConversationInsert = Database['public']['Tables']['conversations']['Insert'];
type ConversationUpdate = Database['public']['Tables']['conversations']['Update'];

export class ConversationRepository {
  constructor(private client: SupabaseClient<Database>) {}

  // 根据ID查找对话
  async findById(id: string): Promise<Conversation | null> {
    try {
      const { data, error } = await this.client
        .from('conversations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 对话不存在
        }
        throw handleSupabaseError(error);
      }

      return this.mapRowToConversation(data);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 根据用户ID查找对话列表
  async findByUserId(userId: string, pagination?: PaginationParams): Promise<APIListResponse<Conversation>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const offset = (page - 1) * limit;

      // 获取总数
      const { count, error: countError } = await this.client
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        throw handleSupabaseError(countError);
      }

      // 获取数据
      const { data, error } = await this.client
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw handleSupabaseError(error);
      }

      const conversations = data.map(row => this.mapRowToConversation(row));
      const total = count || 0;

      return {
        data: conversations,
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

  // 根据会话ID查找对话
  async findBySessionId(sessionId: string): Promise<Conversation | null> {
    try {
      const { data, error } = await this.client
        .from('conversations')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 对话不存在
        }
        throw handleSupabaseError(error);
      }

      return this.mapRowToConversation(data);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 创建对话
  async create(data: CreateConversationData): Promise<Conversation> {
    try {
      const conversationData: ConversationInsert = {
        user_id: data.user_id || null,
        title: data.title || null,
        language: data.language,
        session_id: data.session_id
      };

      const { data: result, error } = await this.client
        .from('conversations')
        .insert(conversationData)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToConversation(result);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 更新对话
  async update(id: string, data: UpdateConversationData): Promise<Conversation> {
    try {
      const updateData: ConversationUpdate = {
        title: data.title,
        summary: data.summary,
        updated_at: new Date().toISOString()
      };

      // 移除undefined值
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof ConversationUpdate] === undefined) {
          delete updateData[key as keyof ConversationUpdate];
        }
      });

      const { data: result, error } = await this.client
        .from('conversations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToConversation(result);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 删除对话
  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.client
        .from('conversations')
        .delete()
        .eq('id', id);

      if (error) {
        throw handleSupabaseError(error);
      }
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 更新对话摘要
  async updateSummary(id: string, summary: string): Promise<void> {
    try {
      const { error } = await this.client
        .from('conversations')
        .update({ 
          summary,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw handleSupabaseError(error);
      }
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 获取对话详情（包含消息、推荐、下一步建议）
  async getWithMessages(id: string): Promise<ConversationDetailResponse | null> {
    try {
      // 获取对话基本信息
      const conversation = await this.findById(id);
      if (!conversation) {
        return null;
      }

      // 获取消息
      const { data: messages, error: messagesError } = await this.client
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });

      if (messagesError) {
        throw handleSupabaseError(messagesError);
      }

      // 获取推荐
      const { data: recommendations, error: recommendationsError } = await this.client
        .from('recommendations')
        .select(`
          *,
          cars (*)
        `)
        .eq('conversation_id', id)
        .order('created_at', { ascending: false });

      if (recommendationsError) {
        throw handleSupabaseError(recommendationsError);
      }

      // 获取下一步建议
      const { data: nextSteps, error: nextStepsError } = await this.client
        .from('next_steps')
        .select('*')
        .eq('conversation_id', id)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (nextStepsError) {
        throw handleSupabaseError(nextStepsError);
      }

      return {
        conversation,
        messages: messages.map(msg => ({
          id: msg.id,
          type: msg.type as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at),
          metadata: msg.metadata || {}
        })),
        recommendations: recommendations
          .filter(rec => rec.cars !== null)
          .map(rec => ({
            id: rec.id,
            car: {
              id: rec.cars!.id,
              make: rec.cars!.make,
              model: rec.cars!.model,
              year_min: rec.cars!.year_min,
              year_max: rec.cars!.year_max,
              price_min: rec.cars!.price_min || undefined,
              price_max: rec.cars!.price_max || undefined,
              currency: rec.cars!.currency,
              category: rec.cars!.category,
              fuel_type: rec.cars!.fuel_type,
              description_en: rec.cars!.description_en || undefined,
              description_zh: rec.cars!.description_zh || undefined,
              pros_en: rec.cars!.pros_en || undefined,
              pros_zh: rec.cars!.pros_zh || undefined,
              cons_en: rec.cars!.cons_en || undefined,
              cons_zh: rec.cars!.cons_zh || undefined,
              features: rec.cars!.features || [],
              image_url: rec.cars!.image_url || undefined,
              reliability_score: rec.cars!.reliability_score || undefined,
              fuel_economy: rec.cars!.fuel_economy || undefined,
              safety_rating: rec.cars!.safety_rating || undefined,
              is_active: rec.cars!.is_active,
              created_at: new Date(rec.cars!.created_at),
              updated_at: new Date(rec.cars!.updated_at)
            },
            match_score: rec.match_score,
            reasoning: {
              en: rec.reasoning_en || '',
              zh: rec.reasoning_zh || ''
            }
          })),
        next_steps: nextSteps.map(step => ({
          id: step.id,
          title: {
            en: step.title_en,
            zh: step.title_zh
          },
          description: {
            en: step.description_en || '',
            zh: step.description_zh || ''
          },
          priority: step.priority as 'high' | 'medium' | 'low',
          action_type: step.action_type as 'research' | 'visit' | 'contact' | 'prepare',
          url: step.url || undefined,
          metadata: step.metadata || {},
          is_completed: step.is_completed || false,
          created_at: new Date(step.created_at)
        }))
      };
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 获取带消息的对话列表
  async findWithMessages(userId: string, pagination?: PaginationParams): Promise<APIListResponse<ConversationWithMessages>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const offset = (page - 1) * limit;

      // 获取总数
      const { count, error: countError } = await this.client
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        throw handleSupabaseError(countError);
      }

      // 获取对话数据
      const { data: conversations, error: conversationsError } = await this.client
        .from('conversations')
        .select(`
          *,
          messages (id, created_at)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (conversationsError) {
        throw handleSupabaseError(conversationsError);
      }

      const conversationsWithMessages = conversations.map(conv => {
        const messages = conv.messages as any[] || [];
        const lastMessage = messages.length > 0 
          ? messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
          : null;

        return {
          ...this.mapRowToConversation(conv),
          messages: messages.map(msg => ({
            id: msg.id,
            type: msg.type as 'user' | 'assistant',
            content: msg.content,
            timestamp: new Date(msg.created_at),
            metadata: msg.metadata || {}
          })),
          message_count: messages.length,
          last_message_at: lastMessage ? new Date(lastMessage.created_at) : undefined
        };
      });

      const total = count || 0;

      return {
        data: conversationsWithMessages,
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

  // 归档旧对话
  async archiveOldConversations(olderThanDays: number): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const { data, error } = await this.client
        .from('conversations')
        .delete()
        .lt('updated_at', cutoffDate.toISOString())
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
        .from('conversations')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }

  // 将数据库行映射为对话对象
  private mapRowToConversation(row: ConversationRow): Conversation {
    return {
      id: row.id,
      user_id: row.user_id || undefined,
      title: row.title || undefined,
      summary: row.summary || undefined,
      language: row.language as 'en' | 'zh',
      session_id: row.session_id,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }
}

// 导出接口类型
export interface ConversationRepository {
  findById(id: string): Promise<Conversation | null>;
  findByUserId(userId: string, pagination?: PaginationParams): Promise<APIListResponse<Conversation>>;
  findBySessionId(sessionId: string): Promise<Conversation | null>;
  create(data: CreateConversationData): Promise<Conversation>;
  update(id: string, data: UpdateConversationData): Promise<Conversation>;
  delete(id: string): Promise<void>;
  updateSummary(id: string, summary: string): Promise<void>;
  getWithMessages(id: string): Promise<ConversationDetailResponse | null>;
  findWithMessages(userId: string, pagination?: PaginationParams): Promise<APIListResponse<ConversationWithMessages>>;
  archiveOldConversations(olderThanDays: number): Promise<number>;
  healthCheck(): Promise<boolean>;
}
