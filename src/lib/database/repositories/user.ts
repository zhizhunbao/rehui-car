import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../../types/database';
import { User, CreateUserData, UpdateUserData } from '@/types';
import { handleSupabaseError } from '@/lib/supabase';

type UserRow = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export class UserRepository {
  constructor(private client: SupabaseClient<Database>) {}

  // 根据ID查找用户
  async findById(id: string): Promise<User | null> {
    try {
      const { data, error } = await this.client
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 用户不存在
        }
        throw handleSupabaseError(error);
      }

      return this.mapRowToUser(data);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 根据邮箱查找用户
  async findByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await this.client
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 用户不存在
        }
        throw handleSupabaseError(error);
      }

      return this.mapRowToUser(data);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 根据会话ID查找用户
  async findBySessionId(sessionId: string): Promise<User | null> {
    try {
      const { data, error } = await this.client
        .from('users')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 用户不存在
        }
        throw handleSupabaseError(error);
      }

      return this.mapRowToUser(data);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 创建用户
  async create(data: CreateUserData): Promise<User> {
    try {
      const userData: UserInsert = {
        email: data.email || null,
        name: data.name || null,
        language: data.language || 'zh',
        session_id: data.session_id
      };

      const { data: result, error } = await this.client
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToUser(result);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 更新用户
  async update(id: string, data: UpdateUserData): Promise<User> {
    try {
      const updateData: UserUpdate = {
        email: data.email,
        name: data.name,
        language: data.language,
        updated_at: new Date().toISOString()
      };

      // 移除undefined值
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof UserUpdate] === undefined) {
          delete updateData[key as keyof UserUpdate];
        }
      });

      const { data: result, error } = await this.client
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToUser(result);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 删除用户
  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.client
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        throw handleSupabaseError(error);
      }
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 创建或更新用户（upsert）
  async upsert(data: CreateUserData): Promise<User> {
    try {
      const userData: UserInsert = {
        email: data.email || null,
        name: data.name || null,
        language: data.language || 'zh',
        session_id: data.session_id
      };

      const { data: result, error } = await this.client
        .from('users')
        .upsert(userData, {
          onConflict: 'session_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToUser(result);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 获取用户统计信息
  async getStats(): Promise<{
    total: number;
    active: number;
    byLanguage: Record<string, number>;
  }> {
    try {
      const { data: users, error } = await this.client
        .from('users')
        .select('language, created_at');

      if (error) {
        throw handleSupabaseError(error);
      }

      const total = users.length;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const active = users.filter(user => 
        new Date(user.created_at) > thirtyDaysAgo
      ).length;

      const byLanguage = users.reduce((acc, user) => {
        const lang = user.language || 'unknown';
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return { total, active, byLanguage };
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.client
        .from('users')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }

  // 将数据库行映射为用户对象
  private mapRowToUser(row: UserRow): User {
    return {
      id: row.id,
      email: row.email || undefined,
      name: row.name || undefined,
      language: row.language as 'en' | 'zh',
      session_id: row.session_id,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }
}

// 导出接口类型
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findBySessionId(sessionId: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
  upsert(data: CreateUserData): Promise<User>;
  getStats(): Promise<{
    total: number;
    active: number;
    byLanguage: Record<string, number>;
  }>;
  healthCheck(): Promise<boolean>;
}
