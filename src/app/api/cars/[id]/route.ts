import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

/**
 * 获取车型详情
 * GET /api/cars/[id] - 获取指定车型的详细信息
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 验证ID格式
    if (!id || typeof id !== 'string') {
      return NextResponse.json({
        error: '车型ID无效'
      }, { status: 400 });
    }

    // 获取车型详情
    const { data: car, error } = await supabase
      .from('cars')
      .select(`
        id,
        name,
        brand,
        category,
        price,
        fuel_type,
        engine,
        transmission,
        seats,
        year,
        image_url,
        rating,
        review_count,
        features,
        specifications,
        description,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          error: '车型不存在'
        }, { status: 404 });
      }
      throw new Error(`获取车型详情失败: ${error.message}`);
    }

    // 获取相似车型推荐（同品牌或同类别）
    const { data: similarCars } = await supabase
      .from('cars')
      .select(`
        id,
        name,
        brand,
        category,
        price,
        image_url,
        rating
      `)
      .or(`brand.eq.${car.brand},category.eq.${car.category}`)
      .neq('id', id)
      .limit(6);

    // 获取车型评价（如果有评价表的话）
    const { data: reviews } = await supabase
      .from('reviews')
      .select(`
        id,
        user_id,
        rating,
        comment,
        created_at
      `)
      .eq('car_id', id)
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      car,
      similarCars: similarCars || [],
      reviews: reviews || [],
      metadata: {
        hasReviews: (reviews?.length || 0) > 0,
        similarCount: similarCars?.length || 0
      }
    });

  } catch (error) {
    console.error('车型详情API错误:', error);
    
    return NextResponse.json({
      error: '服务器内部错误',
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

/**
 * 更新车型信息（管理员功能）
 * PUT /api/cars/[id] - 更新指定车型的信息
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // 验证ID格式
    if (!id || typeof id !== 'string') {
      return NextResponse.json({
        error: '车型ID无效'
      }, { status: 400 });
    }

    // 车型更新验证模式
    const UpdateCarSchema = z.object({
      name: z.string().min(1).optional(),
      brand: z.string().min(1).optional(),
      category: z.string().min(1).optional(),
      price: z.number().min(0).optional(),
      fuel_type: z.string().min(1).optional(),
      engine: z.string().optional(),
      transmission: z.string().optional(),
      seats: z.number().min(1).max(50).optional(),
      year: z.number().min(1900).max(new Date().getFullYear() + 2).optional(),
      image_url: z.string().url().optional(),
      features: z.array(z.string()).optional(),
      specifications: z.record(z.any()).optional(),
      description: z.string().optional()
    });

    const validatedData = UpdateCarSchema.parse(body);

    // 检查车型是否存在
    const { data: existingCar, error: checkError } = await supabase
      .from('cars')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({
          error: '车型不存在'
        }, { status: 404 });
      }
      throw new Error(`检查车型失败: ${checkError.message}`);
    }

    // 如果更新名称和品牌，检查是否重复
    if (validatedData.name && validatedData.brand) {
      const { data: duplicateCar } = await supabase
        .from('cars')
        .select('id')
        .eq('name', validatedData.name)
        .eq('brand', validatedData.brand)
        .neq('id', id)
        .single();

      if (duplicateCar) {
        return NextResponse.json({
          error: '该品牌下已存在同名车型'
        }, { status: 409 });
      }
    }

    // 更新车型
    const updateData = {
      ...validatedData,
      updated_at: new Date().toISOString()
    };

    const { data: updatedCar, error: updateError } = await supabase
      .from('cars')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`更新车型失败: ${updateError.message}`);
    }

    return NextResponse.json({
      message: '车型更新成功',
      car: updatedCar
    });

  } catch (error) {
    console.error('更新车型API错误:', error);

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
 * 删除车型（管理员功能）
 * DELETE /api/cars/[id] - 删除指定车型
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 验证ID格式
    if (!id || typeof id !== 'string') {
      return NextResponse.json({
        error: '车型ID无效'
      }, { status: 400 });
    }

    // 检查车型是否存在
    const { data: existingCar, error: checkError } = await supabase
      .from('cars')
      .select('id, name, brand')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({
          error: '车型不存在'
        }, { status: 404 });
      }
      throw new Error(`检查车型失败: ${checkError.message}`);
    }

    // 检查是否有相关的对话或消息引用此车型
    const { data: relatedMessages } = await supabase
      .from('messages')
      .select('id')
      .like('metadata', `%${id}%`)
      .limit(1);

    if (relatedMessages && relatedMessages.length > 0) {
      return NextResponse.json({
        error: '该车型已被用户讨论过，无法删除',
        suggestion: '可以考虑将其标记为停产或不可用'
      }, { status: 409 });
    }

    // 删除相关评价
    await supabase
      .from('reviews')
      .delete()
      .eq('car_id', id);

    // 删除车型
    const { error: deleteError } = await supabase
      .from('cars')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw new Error(`删除车型失败: ${deleteError.message}`);
    }

    return NextResponse.json({
      message: '车型删除成功',
      deletedCar: {
        id: existingCar.id,
        name: existingCar.name,
        brand: existingCar.brand
      }
    });

  } catch (error) {
    console.error('删除车型API错误:', error);
    
    return NextResponse.json({
      error: '服务器内部错误',
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

/**
 * 添加车型评价
 * POST /api/cars/[id]/review - 为指定车型添加评价
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // 验证ID格式
    if (!id || typeof id !== 'string') {
      return NextResponse.json({
        error: '车型ID无效'
      }, { status: 400 });
    }

    // 评价验证模式
    const ReviewSchema = z.object({
      user_id: z.string().min(1, '用户ID不能为空'),
      rating: z.number().min(1).max(5, '评分必须在1-5之间'),
      comment: z.string().min(1, '评价内容不能为空').max(1000, '评价内容不能超过1000字符')
    });

    const validatedData = ReviewSchema.parse(body);

    // 检查车型是否存在
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('id, rating, review_count')
      .eq('id', id)
      .single();

    if (carError) {
      if (carError.code === 'PGRST116') {
        return NextResponse.json({
          error: '车型不存在'
        }, { status: 404 });
      }
      throw new Error(`检查车型失败: ${carError.message}`);
    }

    // 检查用户是否已经评价过
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('car_id', id)
      .eq('user_id', validatedData.user_id)
      .single();

    if (existingReview) {
      return NextResponse.json({
        error: '您已经评价过这款车型'
      }, { status: 409 });
    }

    // 添加评价
    const newReview = {
      id: crypto.randomUUID(),
      car_id: id,
      user_id: validatedData.user_id,
      rating: validatedData.rating,
      comment: validatedData.comment,
      created_at: new Date().toISOString()
    };

    const { data: createdReview, error: reviewError } = await supabase
      .from('reviews')
      .insert(newReview)
      .select()
      .single();

    if (reviewError) {
      throw new Error(`添加评价失败: ${reviewError.message}`);
    }

    // 更新车型的平均评分和评价数量
    const newReviewCount = (car.review_count || 0) + 1;
    const currentTotalRating = (car.rating || 0) * (car.review_count || 0);
    const newAverageRating = (currentTotalRating + validatedData.rating) / newReviewCount;

    await supabase
      .from('cars')
      .update({
        rating: Math.round(newAverageRating * 10) / 10, // 保留一位小数
        review_count: newReviewCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    return NextResponse.json({
      message: '评价添加成功',
      review: createdReview,
      carStats: {
        newRating: Math.round(newAverageRating * 10) / 10,
        newReviewCount
      }
    }, { status: 201 });

  } catch (error) {
    console.error('添加评价API错误:', error);

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
