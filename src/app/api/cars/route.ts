import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// 请求验证模式
const CarsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  make: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  fuelType: z.string().optional(),
  sortBy: z.enum(['price_min', 'make', 'created_at', 'reliability_score']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

/**
 * 获取车型列表
 * GET /api/cars - 获取车型列表，支持分页和筛选
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validatedParams = CarsQuerySchema.parse(queryParams);
    
    const { 
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

    // 构建查询
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
        created_at,
        updated_at
      `, { count: 'exact' });

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

    // 只查询激活的车型
    query = query.eq('is_active', true);

    // 应用排序
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // 应用分页
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: cars, error, count } = await query;

    if (error) {
      throw new Error(`获取车型列表失败: ${error.message}`);
    }

    // 计算分页信息
    const totalPages = count ? Math.ceil(count / limit) : 0;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      cars: cars || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        make,
        category,
        minPrice,
        maxPrice,
        fuelType,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('车型列表API错误:', error);

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
 * 创建新车型（管理员功能）
 * POST /api/cars - 创建新车型
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 车型创建验证模式
    const CreateCarSchema = z.object({
      make: z.string().min(1, '品牌不能为空'),
      model: z.string().min(1, '车型名称不能为空'),
      year_min: z.number().min(1900).max(new Date().getFullYear() + 2),
      year_max: z.number().min(1900).max(new Date().getFullYear() + 2),
      price_min: z.number().min(0).optional(),
      price_max: z.number().min(0).optional(),
      currency: z.string().default('CAD'),
      category: z.string().min(1, '类别不能为空'),
      fuel_type: z.string().min(1, '燃料类型不能为空'),
      description_en: z.string().optional(),
      description_zh: z.string().optional(),
      pros_en: z.array(z.string()).optional(),
      pros_zh: z.array(z.string()).optional(),
      cons_en: z.array(z.string()).optional(),
      cons_zh: z.array(z.string()).optional(),
      features: z.array(z.string()).default([]),
      image_url: z.string().url().optional(),
      reliability_score: z.number().min(0).max(5).optional(),
      fuel_economy: z.number().min(0).optional(),
      safety_rating: z.number().min(0).max(5).optional(),
      is_active: z.boolean().default(true)
    });

    const validatedData = CreateCarSchema.parse(body);

    // 检查车型名称是否已存在
    const { data: existingCar } = await supabase
      .from('cars')
      .select('id')
      .eq('make', validatedData.make)
      .eq('model', validatedData.model)
      .eq('year_min', validatedData.year_min)
      .single();

    if (existingCar) {
      return NextResponse.json({
        error: '该品牌下已存在同名车型'
      }, { status: 409 });
    }

    // 创建车型
    const newCar = {
      ...validatedData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: createdCar, error: createError } = await supabase
      .from('cars')
      .insert(newCar)
      .select()
      .single();

    if (createError) {
      throw new Error(`创建车型失败: ${createError.message}`);
    }

    return NextResponse.json({
      message: '车型创建成功',
      car: createdCar
    }, { status: 201 });

  } catch (error) {
    console.error('创建车型API错误:', error);

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
 * 获取车型筛选选项
 * GET /api/cars/filters - 获取可用的筛选选项
 */
export async function OPTIONS(request: NextRequest) {
  try {
    // 获取所有品牌
    const { data: makes } = await supabase
      .from('cars')
      .select('make')
      .eq('is_active', true)
      .order('make');

    // 获取所有类别
    const { data: categories } = await supabase
      .from('cars')
      .select('category')
      .eq('is_active', true)
      .order('category');

    // 获取所有燃料类型
    const { data: fuelTypes } = await supabase
      .from('cars')
      .select('fuel_type')
      .eq('is_active', true)
      .order('fuel_type');

    // 获取价格范围
    const { data: priceRange } = await supabase
      .from('cars')
      .select('price_min, price_max')
      .eq('is_active', true)
      .order('price_min');

    const uniqueMakes = Array.from(new Set(makes?.map(item => item.make) || []));
    const uniqueCategories = Array.from(new Set(categories?.map(item => item.category) || []));
    const uniqueFuelTypes = Array.from(new Set(fuelTypes?.map(item => item.fuel_type) || []));
    
    const priceMinValues = priceRange?.map(item => item.price_min).filter(p => p !== null) || [];
    const priceMaxValues = priceRange?.map(item => item.price_max).filter(p => p !== null) || [];
    const minPrice = priceMinValues.length > 0 ? Math.min(...priceMinValues as number[]) : 0;
    const maxPrice = priceMaxValues.length > 0 ? Math.max(...priceMaxValues as number[]) : 0;

    return NextResponse.json({
      makes: uniqueMakes,
      categories: uniqueCategories,
      fuelTypes: uniqueFuelTypes,
      priceRange: {
        min: minPrice,
        max: maxPrice
      },
      sortOptions: [
        { value: 'price_min', label: '价格' },
        { value: 'make', label: '品牌' },
        { value: 'created_at', label: '创建时间' },
        { value: 'reliability_score', label: '可靠性' }
      ]
    });

  } catch (error) {
    console.error('获取筛选选项错误:', error);
    
    return NextResponse.json({
      error: '服务器内部错误',
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
