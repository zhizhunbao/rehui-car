import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import type { Conversation } from '@/types/chat';

// 请求验证模式
const CreateConversationSchema = z.object({
  userId: z.string().optional(),
  title: z.string().min(1, '标题不能为空').max(200, '标题长度不能超过200字符').optional(),
  language: z.enum(['zh', 'en']).default('zh'),
  summary: z.string().max(500, '摘要长度不能超过500字符').optional()
});

const QueryConversationsSchema = z.object({
  userId: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().optional()
});

/**
 * 会话API
 * GET /api/conversations - 获取会话列表
 * POST /api/conversations - 创建新会话
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      userId: searchParams.get('userId'),
      limit: searchParams.get('limit') || '20',
      offset: searchParams.get('offset') || '0',
      search: searchParams.get('search')
    };

    const validatedParams = QueryConversationsSchema.parse(queryParams);
    const { userId, limit, offset, search } = validatedParams;

    // 构建查询条件
    let query = supabase
      .from('conversations')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 如果指定了用户ID，只返回该用户的会话
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // 如果有搜索关键词，在标题和摘要中搜索
    if (search) {
      query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
    }

    const { data: conversations, error, count } = await query;

    if (error) {
      throw new Error(`获取会话列表失败: ${error.message}`);
    }

    // 转换数据库格式到应用类型
    const formattedConversations: Conversation[] = (conversations || []).map(conv => ({
      id: conv.id,
      user_id: conv.user_id || undefined,
      title: conv.title || undefined,
      summary: conv.summary || undefined,
      language: conv.language as any,
      session_id: conv.session_id,
      created_at: new Date(conv.created_at),
      updated_at: new Date(conv.updated_at)
    }));

    return NextResponse.json({
      conversations: formattedConversations,
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: (count || 0) > offset + limit
      }
    });

  } catch (error) {
    console.error('获取会话列表错误:', error);

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
    const validatedData = CreateConversationSchema.parse(body);

    const { userId, title, language, summary } = validatedData;

    const conversationId = crypto.randomUUID();
    const sessionId = crypto.randomUUID();

    const newConversation = {
      id: conversationId,
      user_id: userId || null,
      title: title || '新对话',
      summary: summary || null,
      language,
      session_id: sessionId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: createdConversation, error } = await supabase
      .from('conversations')
      .insert(newConversation)
      .select()
      .single();

    if (error) {
      throw new Error(`创建会话失败: ${error.message}`);
    }

    // 转换数据库格式到应用类型
    const conversation: Conversation = {
      id: createdConversation.id,
      user_id: createdConversation.user_id || undefined,
      title: createdConversation.title || undefined,
      summary: createdConversation.summary || undefined,
      language: createdConversation.language as any,
      session_id: createdConversation.session_id,
      created_at: new Date(createdConversation.created_at),
      updated_at: new Date(createdConversation.updated_at)
    };

    return NextResponse.json({
      conversation,
      message: '会话创建成功'
    }, { status: 201 });

  } catch (error) {
    console.error('创建会话错误:', error);

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
