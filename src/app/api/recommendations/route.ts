import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// 请求验证模式
const CreateRecommendationSchema = z.object({
  conversation_id: z.string().uuid('会话ID格式无效'),
  message_id: z.string().uuid('消息ID格式无效'),
  car_id: z.string().uuid('车型ID格式无效'),
  match_score: z.number().min(0, '匹配分数不能小于0').max(100, '匹配分数不能大于100'),
  reasoning_en: z.string().max(1000, '英文理由长度不能超过1000字符').optional(),
  reasoning_zh: z.string().max(1000, '中文理由长度不能超过1000字符').optional()
});

const QueryRecommendationsSchema = z.object({
  conversation_id: z.string().uuid('会话ID格式无效').optional(),
  message_id: z.string().uuid('消息ID格式无效').optional(),
  car_id: z.string().uuid('车型ID格式无效').optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  min_score: z.coerce.number().min(0).max(100).optional()
});

// 推荐类型定义
interface Recommendation {
  id: string;
  conversation_id: string;
  message_id: string;
  car_id: string;
  match_score: number;
  reasoning_en: string | null;
  reasoning_zh: string | null;
  created_at: Date;
  // 关联数据（可选）
  car?: {
    id: string;
    make: string;
    model: string;
    year_min: number;
    year_max: number;
    category: string;
    price_min: number | null;
    price_max: number | null;
    currency: string;
    image_url: string | null;
  };
  conversation?: {
    id: string;
    title: string | null;
    language: string;
  };
}

/**
 * 推荐API
 * GET /api/recommendations - 获取推荐列表
 * POST /api/recommendations - 创建新推荐
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      conversation_id: searchParams.get('conversation_id'),
      message_id: searchParams.get('message_id'),
      car_id: searchParams.get('car_id'),
      limit: searchParams.get('limit') || '20',
      offset: searchParams.get('offset') || '0',
      min_score: searchParams.get('min_score')
    };

    const validatedParams = QueryRecommendationsSchema.parse(queryParams);
    const { conversation_id, message_id, car_id, limit, offset, min_score } = validatedParams;

    // 构建查询条件
    let query = supabase
      .from('recommendations')
      .select(`
        *,
        car:cars(id, make, model, year_min, year_max, category, price_min, price_max, currency, image_url),
        conversation:conversations(id, title, language)
      `, { count: 'exact' })
      .order('match_score', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 添加筛选条件
    if (conversation_id) {
      query = query.eq('conversation_id', conversation_id);
    }

    if (message_id) {
      query = query.eq('message_id', message_id);
    }

    if (car_id) {
      query = query.eq('car_id', car_id);
    }

    if (min_score !== undefined) {
      query = query.gte('match_score', min_score);
    }

    const { data: recommendations, error, count } = await query;

    if (error) {
      throw new Error(`获取推荐列表失败: ${error.message}`);
    }

    // 转换数据库格式到应用类型
    const formattedRecommendations: Recommendation[] = (recommendations || []).map(rec => ({
      id: rec.id,
      conversation_id: rec.conversation_id,
      message_id: rec.message_id,
      car_id: rec.car_id,
      match_score: rec.match_score,
      reasoning_en: rec.reasoning_en,
      reasoning_zh: rec.reasoning_zh,
      created_at: new Date(rec.created_at),
      car: rec.car ? {
        id: rec.car.id,
        make: rec.car.make,
        model: rec.car.model,
        year_min: rec.car.year_min,
        year_max: rec.car.year_max,
        category: rec.car.category,
        price_min: rec.car.price_min,
        price_max: rec.car.price_max,
        currency: rec.car.currency,
        image_url: rec.car.image_url
      } : undefined,
      conversation: rec.conversation ? {
        id: rec.conversation.id,
        title: rec.conversation.title,
        language: rec.conversation.language
      } : undefined
    }));

    return NextResponse.json({
      recommendations: formattedRecommendations,
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: (count || 0) > offset + limit
      }
    });

  } catch (error) {
    console.error('获取推荐列表错误:', error);

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateRecommendationSchema.parse(body);

    const { conversation_id, message_id, car_id, match_score, reasoning_en, reasoning_zh } = validatedData;

    // 验证关联的会话和消息是否存在
    const { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversation_id)
      .single();

    if (!conversation) {
      return NextResponse.json({
        error: '关联的会话不存在'
      }, { status: 400 });
    }

    const { data: message } = await supabase
      .from('messages')
      .select('id')
      .eq('id', message_id)
      .single();

    if (!message) {
      return NextResponse.json({
        error: '关联的消息不存在'
      }, { status: 400 });
    }

    // 验证车型是否存在
    const { data: car } = await supabase
      .from('cars')
      .select('id')
      .eq('id', car_id)
      .eq('is_active', true)
      .single();

    if (!car) {
      return NextResponse.json({
        error: '车型不存在或已停用'
      }, { status: 400 });
    }

    // 创建推荐
    const newRecommendation = {
      id: crypto.randomUUID(),
      conversation_id,
      message_id,
      car_id,
      match_score,
      reasoning_en: reasoning_en || null,
      reasoning_zh: reasoning_zh || null,
      created_at: new Date().toISOString()
    };

    const { data: createdRecommendation, error } = await supabase
      .from('recommendations')
      .insert(newRecommendation)
      .select()
      .single();

    if (error) {
      throw new Error(`创建推荐失败: ${error.message}`);
    }

    // 获取完整的推荐信息（包含关联数据）
    const { data: fullRecommendation } = await supabase
      .from('recommendations')
      .select(`
        *,
        car:cars(id, make, model, year_min, year_max, category, price_min, price_max, currency, image_url),
        conversation:conversations(id, title, language)
      `)
      .eq('id', createdRecommendation.id)
      .single();

    // 转换数据库格式到应用类型
    const recommendation: Recommendation = {
      id: fullRecommendation.id,
      conversation_id: fullRecommendation.conversation_id,
      message_id: fullRecommendation.message_id,
      car_id: fullRecommendation.car_id,
      match_score: fullRecommendation.match_score,
      reasoning_en: fullRecommendation.reasoning_en,
      reasoning_zh: fullRecommendation.reasoning_zh,
      created_at: new Date(fullRecommendation.created_at),
      car: fullRecommendation.car ? {
        id: fullRecommendation.car.id,
        make: fullRecommendation.car.make,
        model: fullRecommendation.car.model,
        year_min: fullRecommendation.car.year_min,
        year_max: fullRecommendation.car.year_max,
        category: fullRecommendation.car.category,
        price_min: fullRecommendation.car.price_min,
        price_max: fullRecommendation.car.price_max,
        currency: fullRecommendation.car.currency,
        image_url: fullRecommendation.car.image_url
      } : undefined,
      conversation: fullRecommendation.conversation ? {
        id: fullRecommendation.conversation.id,
        title: fullRecommendation.conversation.title,
        language: fullRecommendation.conversation.language
      } : undefined
    };

    return NextResponse.json({
      recommendation,
      message: '推荐创建成功'
    }, { status: 201 });

  } catch (error) {
    console.error('创建推荐错误:', error);

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
