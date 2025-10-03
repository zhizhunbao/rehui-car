import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../../types/database';
import { NextStep, CreateNextStepData, PaginationParams, APIListResponse } from '@/types';
import { handleSupabaseError } from '@/lib/supabase';

type NextStepRow = Database['public']['Tables']['next_steps']['Row'];
type NextStepInsert = Database['public']['Tables']['next_steps']['Insert'];

export class NextStepRepository {
  constructor(private client: SupabaseClient<Database>) {}

  // 根据消息ID查找下一步建议
  async findByMessageId(messageId: string): Promise<NextStep[]> {
    try {
      const { data, error } = await this.client
        .from('next_steps')
        .select('*')
        .eq('message_id', messageId)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        throw handleSupabaseError(error);
      }

      return data.map(row => this.mapRowToNextStep(row));
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 根据对话ID查找下一步建议
  async findByConversationId(conversationId: string, pagination?: PaginationParams): Promise<APIListResponse<NextStep>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;
      const offset = (page - 1) * limit;

      // 获取总数
      const { count, error: countError } = await this.client
        .from('next_steps')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId);

      if (countError) {
        throw handleSupabaseError(countError);
      }

      // 获取数据
      const { data, error } = await this.client
        .from('next_steps')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw handleSupabaseError(error);
      }

      const nextSteps = data.map(row => this.mapRowToNextStep(row));
      const total = count || 0;

      return {
        data: nextSteps,
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

  // 根据ID查找下一步建议
  async findById(id: string): Promise<NextStep | null> {
    try {
      const { data, error } = await this.client
        .from('next_steps')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 建议不存在
        }
        throw handleSupabaseError(error);
      }

      return this.mapRowToNextStep(data);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 创建下一步建议
  async create(data: CreateNextStepData): Promise<NextStep> {
    try {
      const nextStepData: NextStepInsert = {
        conversation_id: data.conversation_id,
        message_id: data.message_id,
        title_en: data.title_en,
        title_zh: data.title_zh,
        description_en: data.description_en || null,
        description_zh: data.description_zh || null,
        priority: data.priority,
        action_type: data.action_type,
        url: data.url || null,
        metadata: data.metadata || {},
        is_completed: data.is_completed || false
      };

      const { data: result, error } = await this.client
        .from('next_steps')
        .insert(nextStepData)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToNextStep(result);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 批量创建下一步建议
  async createMany(nextSteps: CreateNextStepData[]): Promise<NextStep[]> {
    try {
      const nextStepData: NextStepInsert[] = nextSteps.map(data => ({
        conversation_id: data.conversation_id,
        message_id: data.message_id,
        title_en: data.title_en,
        title_zh: data.title_zh,
        description_en: data.description_en || null,
        description_zh: data.description_zh || null,
        priority: data.priority,
        action_type: data.action_type,
        url: data.url || null,
        metadata: data.metadata || {},
        is_completed: data.is_completed || false
      }));

      const { data: results, error } = await this.client
        .from('next_steps')
        .insert(nextStepData)
        .select();

      if (error) {
        throw handleSupabaseError(error);
      }

      return results.map(row => this.mapRowToNextStep(row));
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 更新下一步建议
  async update(id: string, data: Partial<{
    title_en: string;
    title_zh: string;
    description_en: string;
    description_zh: string;
    priority: 'high' | 'medium' | 'low';
    action_type: 'research' | 'visit' | 'contact' | 'prepare';
    url: string;
    metadata: Record<string, any>;
    is_completed: boolean;
  }>): Promise<NextStep> {
    try {
      const { data: result, error } = await this.client
        .from('next_steps')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToNextStep(result);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 标记为完成
  async markAsCompleted(id: string): Promise<NextStep> {
    try {
      const { data, error } = await this.client
        .from('next_steps')
        .update({ is_completed: true })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToNextStep(data);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 标记为未完成
  async markAsIncomplete(id: string): Promise<NextStep> {
    try {
      const { data, error } = await this.client
        .from('next_steps')
        .update({ is_completed: false })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToNextStep(data);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 删除下一步建议
  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.client
        .from('next_steps')
        .delete()
        .eq('id', id);

      if (error) {
        throw handleSupabaseError(error);
      }
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 根据消息ID删除下一步建议
  async deleteByMessageId(messageId: string): Promise<number> {
    try {
      const { data, error } = await this.client
        .from('next_steps')
        .delete()
        .eq('message_id', messageId)
        .select('id');

      if (error) {
        throw handleSupabaseError(error);
      }

      return data?.length || 0;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 根据对话ID删除下一步建议
  async deleteByConversationId(conversationId: string): Promise<number> {
    try {
      const { data, error } = await this.client
        .from('next_steps')
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

  // 获取按优先级分组的建议
  async getByPriority(conversationId: string): Promise<{
    high: NextStep[];
    medium: NextStep[];
    low: NextStep[];
  }> {
    try {
      const { data, error } = await this.client
        .from('next_steps')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false });

      if (error) {
        throw handleSupabaseError(error);
      }

      const nextSteps = data.map(row => this.mapRowToNextStep(row));

      return {
        high: nextSteps.filter(step => step.priority === 'high'),
        medium: nextSteps.filter(step => step.priority === 'medium'),
        low: nextSteps.filter(step => step.priority === 'low')
      };
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 获取按操作类型分组的建议
  async getByActionType(conversationId: string): Promise<{
    research: NextStep[];
    visit: NextStep[];
    contact: NextStep[];
    prepare: NextStep[];
  }> {
    try {
      const { data, error } = await this.client
        .from('next_steps')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        throw handleSupabaseError(error);
      }

      const nextSteps = data.map(row => this.mapRowToNextStep(row));

      return {
        research: nextSteps.filter(step => step.action_type === 'research'),
        visit: nextSteps.filter(step => step.action_type === 'visit'),
        contact: nextSteps.filter(step => step.action_type === 'contact'),
        prepare: nextSteps.filter(step => step.action_type === 'prepare')
      };
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 获取完成统计
  async getCompletionStats(conversationId?: string): Promise<{
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  }> {
    try {
      let query = this.client
        .from('next_steps')
        .select('is_completed');

      if (conversationId) {
        query = query.eq('conversation_id', conversationId);
      }

      const { data, error } = await query;

      if (error) {
        throw handleSupabaseError(error);
      }

      const total = data.length;
      const completed = data.filter(step => step.is_completed).length;
      const pending = total - completed;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      return {
        total,
        completed,
        pending,
        completionRate
      };
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.client
        .from('next_steps')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }

  // 将数据库行映射为下一步建议对象
  private mapRowToNextStep(row: NextStepRow): NextStep {
    return {
      id: row.id,
      title: {
        en: row.title_en,
        zh: row.title_zh
      },
      description: {
        en: row.description_en || '',
        zh: row.description_zh || ''
      },
      priority: row.priority as 'high' | 'medium' | 'low',
      action_type: row.action_type as 'research' | 'visit' | 'contact' | 'prepare',
      url: row.url || undefined,
      metadata: row.metadata || {},
      is_completed: row.is_completed || false,
      created_at: new Date(row.created_at)
    };
  }
}

// 导出接口类型
export interface NextStepRepository {
  findByMessageId(messageId: string): Promise<NextStep[]>;
  findByConversationId(conversationId: string, pagination?: PaginationParams): Promise<APIListResponse<NextStep>>;
  findById(id: string): Promise<NextStep | null>;
  create(data: CreateNextStepData): Promise<NextStep>;
  createMany(nextSteps: CreateNextStepData[]): Promise<NextStep[]>;
  update(id: string, data: Partial<{
    title_en: string;
    title_zh: string;
    description_en: string;
    description_zh: string;
    priority: 'high' | 'medium' | 'low';
    action_type: 'research' | 'visit' | 'contact' | 'prepare';
    url: string;
    metadata: Record<string, any>;
    is_completed: boolean;
  }>): Promise<NextStep>;
  markAsCompleted(id: string): Promise<NextStep>;
  markAsIncomplete(id: string): Promise<NextStep>;
  delete(id: string): Promise<void>;
  deleteByMessageId(messageId: string): Promise<number>;
  deleteByConversationId(conversationId: string): Promise<number>;
  getByPriority(conversationId: string): Promise<{
    high: NextStep[];
    medium: NextStep[];
    low: NextStep[];
  }>;
  getByActionType(conversationId: string): Promise<{
    research: NextStep[];
    visit: NextStep[];
    contact: NextStep[];
    prepare: NextStep[];
  }>;
  getCompletionStats(conversationId?: string): Promise<{
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  }>;
  healthCheck(): Promise<boolean>;
}
