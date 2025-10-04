import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// 请求验证模式
const CreateUserSchema = z.object({
  email: z.string().email('邮箱格式无效').optional(),
  name: z.string().min(1, '姓名不能为空').max(100, '姓名长度不能超过100字符').optional(),
  language: z.enum(['zh', 'en']).default('zh'),
  session_id: z.string().min(1, '会话ID不能为空')
});

const QueryUsersSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().optional(),
  language: z.enum(['zh', 'en']).optional()
});

// 用户类型定义
interface User {
  id: string;
  email: string | null;
  name: string | null;
  language: 'zh' | 'en';
  session_id: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * 用户API
 * GET /api/users - 获取用户列表
 * POST /api/users - 创建新用户
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      limit: searchParams.get('limit') || '20',
      offset: searchParams.get('offset') || '0',
      search: searchParams.get('search'),
      language: searchParams.get('language')
    };

    const validatedParams = QueryUsersSchema.parse(queryParams);
    const { limit, offset, search, language } = validatedParams;

    // 构建查询条件
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 如果有搜索关键词，在姓名和邮箱中搜索
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // 如果指定了语言
    if (language) {
      query = query.eq('language', language);
    }

    const { data: users, error, count } = await query;

    if (error) {
      throw new Error(`获取用户列表失败: ${error.message}`);
    }

    // 转换数据库格式到应用类型
    const formattedUsers: User[] = (users || []).map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      language: user.language as 'zh' | 'en',
      session_id: user.session_id,
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at)
    }));

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: (count || 0) > offset + limit
      }
    });

  } catch (error) {
    console.error('获取用户列表错误:', error);

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
    const validatedData = CreateUserSchema.parse(body);

    const { email, name, language, session_id } = validatedData;

    // 检查是否已存在相同的session_id
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('session_id', session_id)
      .single();

    if (existingUser) {
      // 如果用户已存在，返回现有用户信息
      const user: User = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        language: existingUser.language as 'zh' | 'en',
        session_id: existingUser.session_id,
        created_at: new Date(existingUser.created_at),
        updated_at: new Date(existingUser.updated_at)
      };

      return NextResponse.json({
        user,
        message: '用户已存在，返回现有用户信息'
      });
    }

    // 创建新用户
    const newUser = {
      id: crypto.randomUUID(),
      email: email || null,
      name: name || null,
      language,
      session_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: createdUser, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (error) {
      throw new Error(`创建用户失败: ${error.message}`);
    }

    // 转换数据库格式到应用类型
    const user: User = {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      language: createdUser.language as 'zh' | 'en',
      session_id: createdUser.session_id,
      created_at: new Date(createdUser.created_at),
      updated_at: new Date(createdUser.updated_at)
    };

    return NextResponse.json({
      user,
      message: '用户创建成功'
    }, { status: 201 });

  } catch (error) {
    console.error('创建用户错误:', error);

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
