import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../../types/database';
import { CarRecommendation, CreateRecommendationData, PaginationParams, APIListResponse } from '@/types';
import { handleSupabaseError } from '@/lib/supabase';

type RecommendationRow = Database['public']['Tables']['recommendations']['Row'];
type RecommendationInsert = Database['public']['Tables']['recommendations']['Insert'];

export class RecommendationRepository {
  constructor(private client: SupabaseClient<Database>) {}

  // 根据消息ID查找推荐
  async findByMessageId(messageId: string): Promise<CarRecommendation[]> {
    try {
      const { data, error } = await this.client
        .from('recommendations')
        .select(`
          *,
          cars (*)
        `)
        .eq('message_id', messageId)
        .order('match_score', { ascending: false });

      if (error) {
        throw handleSupabaseError(error);
      }

      return data.map(row => this.mapRowToRecommendation(row));
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 根据对话ID查找推荐
  async findByConversationId(conversationId: string, pagination?: PaginationParams): Promise<APIListResponse<CarRecommendation>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;
      const offset = (page - 1) * limit;

      // 获取总数
      const { count, error: countError } = await this.client
        .from('recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId);

      if (countError) {
        throw handleSupabaseError(countError);
      }

      // 获取数据
      const { data, error } = await this.client
        .from('recommendations')
        .select(`
          *,
          cars (*)
        `)
        .eq('conversation_id', conversationId)
        .order('match_score', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw handleSupabaseError(error);
      }

      const recommendations = data.map(row => this.mapRowToRecommendation(row));
      const total = count || 0;

      return {
        data: recommendations,
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

  // 根据ID查找推荐
  async findById(id: string): Promise<CarRecommendation | null> {
    try {
      const { data, error } = await this.client
        .from('recommendations')
        .select(`
          *,
          cars (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 推荐不存在
        }
        throw handleSupabaseError(error);
      }

      return this.mapRowToRecommendation(data);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 创建推荐
  async create(data: CreateRecommendationData): Promise<CarRecommendation> {
    try {
      const recommendationData: RecommendationInsert = {
        conversation_id: data.conversation_id,
        message_id: data.message_id,
        car_id: data.car_id,
        match_score: data.match_score,
        reasoning_en: data.reasoning_en || null,
        reasoning_zh: data.reasoning_zh || null
      };

      const { data: result, error } = await this.client
        .from('recommendations')
        .insert(recommendationData)
        .select(`
          *,
          cars (*)
        `)
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToRecommendation(result);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 批量创建推荐
  async createMany(recommendations: CreateRecommendationData[]): Promise<CarRecommendation[]> {
    try {
      const recommendationData: RecommendationInsert[] = recommendations.map(data => ({
        conversation_id: data.conversation_id,
        message_id: data.message_id,
        car_id: data.car_id,
        match_score: data.match_score,
        reasoning_en: data.reasoning_en || null,
        reasoning_zh: data.reasoning_zh || null
      }));

      const { data: results, error } = await this.client
        .from('recommendations')
        .insert(recommendationData)
        .select(`
          *,
          cars (*)
        `);

      if (error) {
        throw handleSupabaseError(error);
      }

      return results.map(row => this.mapRowToRecommendation(row));
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 更新推荐评分
  async updateMatchScore(id: string, matchScore: number): Promise<CarRecommendation> {
    try {
      const { data, error } = await this.client
        .from('recommendations')
        .update({ match_score: matchScore })
        .eq('id', id)
        .select(`
          *,
          cars (*)
        `)
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToRecommendation(data);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 删除推荐
  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.client
        .from('recommendations')
        .delete()
        .eq('id', id);

      if (error) {
        throw handleSupabaseError(error);
      }
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 根据消息ID删除推荐
  async deleteByMessageId(messageId: string): Promise<number> {
    try {
      const { data, error } = await this.client
        .from('recommendations')
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

  // 根据对话ID删除推荐
  async deleteByConversationId(conversationId: string): Promise<number> {
    try {
      const { data, error } = await this.client
        .from('recommendations')
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

  // 获取推荐统计
  async getStats(conversationId?: string): Promise<{
    total: number;
    averageScore: number;
    topCars: Array<{ car_id: string; count: number; average_score: number }>;
  }> {
    try {
      let query = this.client
        .from('recommendations')
        .select('car_id, match_score');

      if (conversationId) {
        query = query.eq('conversation_id', conversationId);
      }

      const { data, error } = await query;

      if (error) {
        throw handleSupabaseError(error);
      }

      const total = data.length;
      const averageScore = total > 0 
        ? data.reduce((sum, rec) => sum + rec.match_score, 0) / total 
        : 0;

      // 统计每个车型的推荐次数和平均评分
      const carStats = data.reduce((acc, rec) => {
        const carId = rec.car_id;
        if (!acc[carId]) {
          acc[carId] = { count: 0, totalScore: 0 };
        }
        acc[carId].count++;
        acc[carId].totalScore += rec.match_score;
        return acc;
      }, {} as Record<string, { count: number; totalScore: number }>);

      const topCars = Object.entries(carStats)
        .map(([car_id, stats]) => ({
          car_id,
          count: stats.count,
          average_score: stats.totalScore / stats.count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        total,
        averageScore,
        topCars
      };
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 获取热门推荐车型
  async getPopularRecommendedCars(limit: number = 10): Promise<Array<{
    car_id: string;
    make: string;
    model: string;
    recommendation_count: number;
    average_score: number;
  }>> {
    try {
      const { data, error } = await this.client
        .from('recommendations')
        .select(`
          car_id,
          match_score,
          cars!inner (make, model)
        `);

      if (error) {
        throw handleSupabaseError(error);
      }

      // 统计每个车型的推荐数据
      const carStats = data.reduce((acc, rec) => {
        const carId = rec.car_id;
        const car = rec.cars as any;
        
        if (!acc[carId]) {
          acc[carId] = {
            car_id: carId,
            make: car.make,
            model: car.model,
            count: 0,
            totalScore: 0
          };
        }
        acc[carId].count++;
        acc[carId].totalScore += rec.match_score;
        return acc;
      }, {} as Record<string, any>);

      return Object.values(carStats)
        .map((stats: any) => ({
          car_id: stats.car_id,
          make: stats.make,
          model: stats.model,
          recommendation_count: stats.count,
          average_score: stats.totalScore / stats.count
        }))
        .sort((a, b) => b.recommendation_count - a.recommendation_count)
        .slice(0, limit);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.client
        .from('recommendations')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }

  // 将数据库行映射为推荐对象
  private mapRowToRecommendation(row: RecommendationRow & { cars?: any }): CarRecommendation {
    const car = row.cars ? {
      id: row.cars.id,
      make: row.cars.make,
      model: row.cars.model,
      year_min: row.cars.year_min,
      year_max: row.cars.year_max,
      price_min: row.cars.price_min,
      price_max: row.cars.price_max,
      currency: row.cars.currency,
      category: row.cars.category,
      fuel_type: row.cars.fuel_type,
      description_en: row.cars.description_en,
      description_zh: row.cars.description_zh,
      pros_en: row.cars.pros_en,
      pros_zh: row.cars.pros_zh,
      cons_en: row.cars.cons_en,
      cons_zh: row.cars.cons_zh,
      features: row.cars.features,
      image_url: row.cars.image_url,
      reliability_score: row.cars.reliability_score,
      fuel_economy: row.cars.fuel_economy,
      safety_rating: row.cars.safety_rating,
      is_active: row.cars.is_active,
      created_at: new Date(row.cars.created_at),
      updated_at: new Date(row.cars.updated_at)
    } : null;

    return {
      id: row.id,
      car: car!,
      match_score: row.match_score,
      reasoning: {
        en: row.reasoning_en || '',
        zh: row.reasoning_zh || ''
      }
    };
  }
}

// 导出接口类型
export interface RecommendationRepository {
  findByMessageId(messageId: string): Promise<CarRecommendation[]>;
  findByConversationId(conversationId: string, pagination?: PaginationParams): Promise<APIListResponse<CarRecommendation>>;
  findById(id: string): Promise<CarRecommendation | null>;
  create(data: CreateRecommendationData): Promise<CarRecommendation>;
  createMany(recommendations: CreateRecommendationData[]): Promise<CarRecommendation[]>;
  updateMatchScore(id: string, matchScore: number): Promise<CarRecommendation>;
  delete(id: string): Promise<void>;
  deleteByMessageId(messageId: string): Promise<number>;
  deleteByConversationId(conversationId: string): Promise<number>;
  getStats(conversationId?: string): Promise<{
    total: number;
    averageScore: number;
    topCars: Array<{ car_id: string; count: number; average_score: number }>;
  }>;
  getPopularRecommendedCars(limit?: number): Promise<Array<{
    car_id: string;
    make: string;
    model: string;
    recommendation_count: number;
    average_score: number;
  }>>;
  healthCheck(): Promise<boolean>;
}
