import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../../types/database';
import { 
  Car, 
  CreateCarData, 
  UpdateCarData, 
  CarFilters, 
  PaginationParams, 
  SortParams,
  APIListResponse,
  CarSearchResponse,
  CarSearchParams,
  Language
} from '@/types';
import { handleSupabaseError } from '@/lib/supabase';

type CarRow = Database['public']['Tables']['cars']['Row'];
type CarInsert = Database['public']['Tables']['cars']['Insert'];
type CarUpdate = Database['public']['Tables']['cars']['Update'];

export class CarRepository {
  constructor(private client: SupabaseClient<Database>) {}

  // 获取所有车型
  async findAll(filters?: CarFilters, pagination?: PaginationParams, sort?: SortParams): Promise<APIListResponse<Car>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;
      const offset = (page - 1) * limit;

      let query = this.client
        .from('cars')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      // 应用筛选条件
      if (filters) {
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.fuel_type) {
          query = query.eq('fuel_type', filters.fuel_type);
        }
        if (filters.make) {
          query = query.eq('make', filters.make);
        }
        if (filters.price_min !== undefined) {
          query = query.gte('price_min', filters.price_min);
        }
        if (filters.price_max !== undefined) {
          query = query.lte('price_max', filters.price_max);
        }
        if (filters.year_min !== undefined) {
          query = query.gte('year_min', filters.year_min);
        }
        if (filters.year_max !== undefined) {
          query = query.lte('year_max', filters.year_max);
        }
        if (filters.reliability_min !== undefined) {
          query = query.gte('reliability_score', filters.reliability_min);
        }
        if (filters.fuel_economy_min !== undefined) {
          query = query.gte('fuel_economy', filters.fuel_economy_min);
        }
        if (filters.safety_rating_min !== undefined) {
          query = query.gte('safety_rating', filters.safety_rating_min);
        }
      }

      // 应用排序
      if (sort) {
        const ascending = sort.sort_order === 'asc';
        query = query.order(sort.sort_by, { ascending });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // 应用分页
      query = query.range(offset, offset + limit - 1);

      const { data, count, error } = await query;

      if (error) {
        throw handleSupabaseError(error);
      }

      const cars = data.map(row => this.mapRowToCar(row));
      const total = count || 0;

      return {
        data: cars,
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

  // 根据ID查找车型
  async findById(id: string, language?: Language): Promise<Car | null> {
    try {
      const { data, error } = await this.client
        .from('cars')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 车型不存在
        }
        throw handleSupabaseError(error);
      }

      return this.mapRowToCar(data);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 搜索车型
  async search(query: string, params?: CarSearchParams): Promise<CarSearchResponse> {
    try {
      const limit = params?.limit || 20;
      const language = params?.language || 'en';

      // 构建搜索查询
      let searchQuery = this.client
        .from('cars')
        .select('*')
        .eq('is_active', true);

      // 根据语言选择搜索字段
      if (language === 'zh') {
        searchQuery = searchQuery.or(`make.ilike.%${query}%,model.ilike.%${query}%,description_zh.ilike.%${query}%`);
      } else {
        searchQuery = searchQuery.or(`make.ilike.%${query}%,model.ilike.%${query}%,description_en.ilike.%${query}%`);
      }

      // 应用额外筛选
      if (params?.category) {
        searchQuery = searchQuery.eq('category', params.category);
      }
      if (params?.price_range) {
        searchQuery = searchQuery
          .gte('price_min', params.price_range[0])
          .lte('price_max', params.price_range[1]);
      }

      searchQuery = searchQuery.limit(limit);

      const { data, error } = await searchQuery;

      if (error) {
        throw handleSupabaseError(error);
      }

      const cars = data.map(row => this.mapRowToCar(row));

      return {
        cars,
        total: cars.length,
        search_query: query,
        suggestions: this.generateSuggestions(cars, language)
      };
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 根据分类查找车型
  async findByCategory(category: string, pagination?: PaginationParams): Promise<APIListResponse<Car>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;
      const offset = (page - 1) * limit;

      const { data, count, error } = await this.client
        .from('cars')
        .select('*', { count: 'exact' })
        .eq('category', category)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw handleSupabaseError(error);
      }

      const cars = data.map(row => this.mapRowToCar(row));
      const total = count || 0;

      return {
        data: cars,
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

  // 查找相似车型
  async findSimilar(carId: string, limit: number = 5): Promise<Car[]> {
    try {
      // 先获取目标车型信息
      const targetCar = await this.findById(carId);
      if (!targetCar) {
        return [];
      }

      // 查找相似车型（同品牌、同分类、价格相近）
      const priceRange = targetCar.price_max && targetCar.price_min 
        ? (targetCar.price_max - targetCar.price_min) * 0.2 
        : 10000;

      const { data, error } = await this.client
        .from('cars')
        .select('*')
        .eq('is_active', true)
        .eq('make', targetCar.make)
        .eq('category', targetCar.category)
        .neq('id', carId)
        .gte('price_min', (targetCar.price_min || 0) - priceRange)
        .lte('price_max', (targetCar.price_max || 0) + priceRange)
        .limit(limit);

      if (error) {
        throw handleSupabaseError(error);
      }

      return data.map(row => this.mapRowToCar(row));
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 获取筛选选项
  async getFilters(): Promise<{
    categories: string[];
    fuel_types: string[];
    makes: string[];
    price_range: { min: number; max: number };
  }> {
    try {
      const { data, error } = await this.client
        .from('cars')
        .select('category, fuel_type, make, price_min, price_max')
        .eq('is_active', true);

      if (error) {
        throw handleSupabaseError(error);
      }

      const categories = [...new Set(data.map(car => car.category))].sort();
      const fuel_types = [...new Set(data.map(car => car.fuel_type))].sort();
      const makes = [...new Set(data.map(car => car.make))].sort();

      const prices = data
        .filter(car => car.price_min && car.price_max)
        .map(car => ({ min: car.price_min!, max: car.price_max! }));

      const price_range = prices.length > 0 
        ? {
            min: Math.min(...prices.map(p => p.min)),
            max: Math.max(...prices.map(p => p.max))
          }
        : { min: 0, max: 0 };

      return {
        categories,
        fuel_types,
        makes,
        price_range
      };
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 创建车型
  async create(data: CreateCarData): Promise<Car> {
    try {
      const carData: CarInsert = {
        make: data.make,
        model: data.model,
        year_min: data.year_min,
        year_max: data.year_max,
        price_min: data.price_min || null,
        price_max: data.price_max || null,
        currency: data.currency || 'CAD',
        category: data.category,
        fuel_type: data.fuel_type,
        description_en: data.description_en || null,
        description_zh: data.description_zh || null,
        pros_en: data.pros_en || null,
        pros_zh: data.pros_zh || null,
        cons_en: data.cons_en || null,
        cons_zh: data.cons_zh || null,
        features: data.features || null,
        image_url: data.image_url || null,
        reliability_score: data.reliability_score || null,
        fuel_economy: data.fuel_economy || null,
        safety_rating: data.safety_rating || null
      };

      const { data: result, error } = await this.client
        .from('cars')
        .insert(carData)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToCar(result);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 更新车型
  async update(id: string, data: UpdateCarData): Promise<Car> {
    try {
      const updateData: CarUpdate = {
        make: data.make,
        model: data.model,
        year_min: data.year_min,
        year_max: data.year_max,
        price_min: data.price_min,
        price_max: data.price_max,
        currency: data.currency,
        category: data.category,
        fuel_type: data.fuel_type,
        description_en: data.description_en,
        description_zh: data.description_zh,
        pros_en: data.pros_en,
        pros_zh: data.pros_zh,
        cons_en: data.cons_en,
        cons_zh: data.cons_zh,
        features: data.features,
        image_url: data.image_url,
        reliability_score: data.reliability_score,
        fuel_economy: data.fuel_economy,
        safety_rating: data.safety_rating,
        updated_at: new Date().toISOString()
      };

      // 移除undefined值
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof CarUpdate] === undefined) {
          delete updateData[key as keyof CarUpdate];
        }
      });

      const { data: result, error } = await this.client
        .from('cars')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return this.mapRowToCar(result);
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 更新车型可用性
  async updateAvailability(id: string, availability: { in_stock: boolean; estimated_delivery?: string }): Promise<void> {
    try {
      const { error } = await this.client
        .from('cars')
        .update({
          metadata: { availability },
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

  // 获取热门车型
  async getPopularCars(limit: number = 10): Promise<Car[]> {
    try {
      const { data, error } = await this.client
        .from('popular_cars')
        .select('*')
        .limit(limit);

      if (error) {
        throw handleSupabaseError(error);
      }

      return data.map(row => this.mapRowToCar(row));
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.client
        .from('cars')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }

  // 生成搜索建议
  private generateSuggestions(cars: Car[], language: Language): string[] {
    const suggestions = new Set<string>();
    
    cars.forEach(car => {
      suggestions.add(car.make);
      suggestions.add(car.model);
      suggestions.add(`${car.make} ${car.model}`);
    });

    return Array.from(suggestions).slice(0, 5);
  }

  // 将数据库行映射为车型对象
  private mapRowToCar(row: CarRow): Car {
    return {
      id: row.id,
      make: row.make,
      model: row.model,
      year_min: row.year_min,
      year_max: row.year_max,
      price_min: row.price_min || undefined,
      price_max: row.price_max || undefined,
      currency: row.currency,
      category: row.category,
      fuel_type: row.fuel_type,
      description_en: row.description_en || undefined,
      description_zh: row.description_zh || undefined,
      pros_en: row.pros_en || undefined,
      pros_zh: row.pros_zh || undefined,
      cons_en: row.cons_en || undefined,
      cons_zh: row.cons_zh || undefined,
      features: row.features || [],
      image_url: row.image_url || undefined,
      reliability_score: row.reliability_score || undefined,
      fuel_economy: row.fuel_economy || undefined,
      safety_rating: row.safety_rating || undefined,
      is_active: row.is_active,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }
}

// 导出接口类型
export interface CarRepository {
  findAll(filters?: CarFilters, pagination?: PaginationParams, sort?: SortParams): Promise<APIListResponse<Car>>;
  findById(id: string, language?: Language): Promise<Car | null>;
  search(query: string, params?: CarSearchParams): Promise<CarSearchResponse>;
  findByCategory(category: string, pagination?: PaginationParams): Promise<APIListResponse<Car>>;
  findSimilar(carId: string, limit?: number): Promise<Car[]>;
  getFilters(): Promise<{
    categories: string[];
    fuel_types: string[];
    makes: string[];
    price_range: { min: number; max: number };
  }>;
  create(data: CreateCarData): Promise<Car>;
  update(id: string, data: UpdateCarData): Promise<Car>;
  updateAvailability(id: string, availability: { in_stock: boolean; estimated_delivery?: string }): Promise<void>;
  getPopularCars(limit?: number): Promise<Car[]>;
  healthCheck(): Promise<boolean>;
}
