import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// 数据库返回的车型类型
interface DbCar {
  id: string;
  make: string;
  model: string;
  year_min: number;
  year_max: number;
  price_min?: number | null;
  price_max?: number | null;
  currency: string;
  category: string;
  fuel_type: string;
  description_en?: string | null;
  description_zh?: string | null;
  pros_en?: string[] | null;
  pros_zh?: string[] | null;
  cons_en?: string[] | null;
  cons_zh?: string[] | null;
  features?: string[] | null;
  image_url?: string | null;
  reliability_score?: number | null;
  fuel_economy?: number | null;
  safety_rating?: number | null;
  is_active: boolean;
  created_at: string;
}

// 带相关性得分的车型类型
interface CarWithScore extends DbCar {
  relevanceScore: number;
}

// 搜索请求验证模式
const SearchQuerySchema = z.object({
  q: z.string().min(1, '搜索关键词不能为空').max(100, '搜索关键词不能超过100字符'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  make: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  fuelType: z.string().optional(),
  sortBy: z.enum(['relevance', 'price_min', 'make', 'reliability_score']).default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

/**
 * 车型搜索API
 * GET /api/cars/search - 根据关键词搜索车型
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validatedParams = SearchQuerySchema.parse(queryParams);
    
    const { 
      q: searchQuery, 
      page, 
      limit, 
      make, 
      category, 
      minPrice, 
      maxPrice, 
      fuelType, 
      sortBy, 
      sortOrder 
    } = validatedParams;

    // 构建基础查询
    let query = supabase
      .from('cars')
      .select(`
        id,
        make,
        model,
        year_min,
        year_max,
        price_min,
        price_max,
        currency,
        category,
        fuel_type,
        description_en,
        description_zh,
        pros_en,
        pros_zh,
        cons_en,
        cons_zh,
        features,
        image_url,
        reliability_score,
        fuel_economy,
        safety_rating,
        is_active,
        created_at
      `, { count: 'exact' });

    // 只查询激活的车型
    query = query.eq('is_active', true);

    // 应用文本搜索
    // 使用 PostgreSQL 的全文搜索或 LIKE 查询
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
    
    if (searchTerms.length > 0) {
      // 构建搜索条件：在品牌、型号、描述、特性中搜索
      const searchConditions = searchTerms.map(term => {
        return [
          `make.ilike.%${term}%`,
          `model.ilike.%${term}%`,
          `description_en.ilike.%${term}%`,
          `description_zh.ilike.%${term}%`,
          `category.ilike.%${term}%`,
          `fuel_type.ilike.%${term}%`
        ].join(',');
      });
      
      // 使用 OR 条件组合所有搜索词
      query = query.or(searchConditions.join(','));
    }

    // 应用筛选条件
    if (make) {
      query = query.eq('make', make);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (minPrice !== undefined) {
      query = query.gte('price_min', minPrice);
    }
    
    if (maxPrice !== undefined) {
      query = query.lte('price_max', maxPrice);
    }
    
    if (fuelType) {
      query = query.eq('fuel_type', fuelType);
    }

    // 应用排序
    if (sortBy === 'relevance') {
      // 相关性排序：优先显示品牌匹配的结果
      query = query.order('make', { ascending: false });
    } else {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    }

    // 应用分页
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: cars, error, count } = await query as { data: DbCar[] | null; error: any; count: number | null };

    if (error) {
      throw new Error(`搜索车型失败: ${error.message}`);
    }

    // 计算相关性得分并重新排序（如果是相关性排序）
    let processedCars = cars || [];
    
    if (sortBy === 'relevance' && searchTerms.length > 0) {
      const carsWithScore: CarWithScore[] = processedCars.map(car => {
        let relevanceScore = 0;
        
        searchTerms.forEach(term => {
          const termLower = term.toLowerCase();
          
          // 品牌完全匹配得分最高
          if (car.make && car.make.toLowerCase().includes(termLower)) {
            relevanceScore += car.make.toLowerCase() === termLower ? 100 : 50;
          }
          
          // 型号匹配
          if (car.model && car.model.toLowerCase().includes(termLower)) {
            relevanceScore += car.model.toLowerCase() === termLower ? 80 : 30;
          }
          
          // 类别匹配
          if (car.category && car.category.toLowerCase().includes(termLower)) {
            relevanceScore += 20;
          }
          
          // 描述匹配
          if (car.description_en && car.description_en.toLowerCase().includes(termLower)) {
            relevanceScore += 10;
          }
          
          if (car.description_zh && car.description_zh.toLowerCase().includes(termLower)) {
            relevanceScore += 10;
          }
          
          // 特性匹配
          if (car.features && Array.isArray(car.features) && car.features.some((feature: string) => 
            feature.toLowerCase().includes(termLower))) {
            relevanceScore += 15;
          }
        });
        
        return { ...car, relevanceScore } as CarWithScore;
      }).sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      processedCars = carsWithScore;
    }

    // 计算分页信息
    const totalPages = count ? Math.ceil(count / limit) : 0;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // 获取搜索建议（如果结果较少）
    let suggestions: string[] = [];
    if ((count || 0) < 5 && searchTerms.length > 0) {
      suggestions = await getSearchSuggestions(searchQuery);
    }

    return NextResponse.json({
      cars: processedCars.map(car => {
        // 移除相关性得分，不返回给客户端
        if ('relevanceScore' in car) {
          const { relevanceScore, ...carWithoutScore } = car as any;
          return carWithoutScore;
        }
        return car;
      }),
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      searchInfo: {
        query: searchQuery,
        terms: searchTerms,
        suggestions,
        filters: {
          make,
          category,
          minPrice,
          maxPrice,
          fuelType,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error('车型搜索API错误:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: '请求参数无效',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      error: '服务器内部错误',
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

/**
 * 获取搜索建议
 */
async function getSearchSuggestions(query: string): Promise<string[]> {
  try {
    const suggestions: string[] = [];
    
    // 获取相似的品牌名称
    const { data: makes } = await supabase
      .from('cars')
      .select('make')
      .eq('is_active', true)
      .ilike('make', `%${query}%`)
      .limit(3) as { data: { make: string }[] | null };
    
    if (makes) {
      suggestions.push(...makes.map(b => b.make).filter(Boolean));
    }
    
    // 获取相似的车型名称
    const { data: models } = await supabase
      .from('cars')
      .select('model')
      .eq('is_active', true)
      .ilike('model', `%${query}%`)
      .limit(3) as { data: { model: string }[] | null };
    
    if (models) {
      suggestions.push(...models.map(c => c.model).filter(Boolean));
    }
    
    // 获取相似的类别
    const { data: categories } = await supabase
      .from('cars')
      .select('category')
      .eq('is_active', true)
      .ilike('category', `%${query}%`)
      .limit(2) as { data: { category: string }[] | null };
    
    if (categories) {
      suggestions.push(...categories.map(c => c.category).filter(Boolean));
    }
    
    // 去重并返回
    return Array.from(new Set(suggestions)).slice(0, 5);
    
  } catch (error) {
    console.error('获取搜索建议失败:', error);
    return [];
  }
}

/**
 * 热门搜索关键词
 * POST /api/cars/search - 获取热门搜索关键词
 */
export async function POST(request: NextRequest) {
  try {
    // 这里可以从搜索日志表获取热门关键词
    // 目前返回一些预设的热门关键词
    const trendingKeywords = [
      'Toyota',
      'Honda',
      'Ford',
      'Tesla',
      'BMW',
      'SUV',
      'Sedan',
      'Electric',
      'Hybrid',
      'Luxury'
    ];

    // 获取每个关键词的搜索结果数量
    const keywordsWithCount = await Promise.all(
      trendingKeywords.map(async (keyword) => {
        const { count } = await supabase
          .from('cars')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true)
          .or(`make.ilike.%${keyword}%,model.ilike.%${keyword}%,category.ilike.%${keyword}%`);
        
        return {
          keyword,
          count: count || 0
        };
      })
    );

    // 按结果数量排序
    const sortedKeywords = keywordsWithCount
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      trending: sortedKeywords
    });

  } catch (error) {
    console.error('获取热门搜索错误:', error);
    
    return NextResponse.json({
      error: '服务器内部错误',
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
