import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import type { Conversation } from '@/types/chat';

// 请求验证模式
const UpdateConversationSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题长度不能超过200字符').optional(),
  summary: z.string().max(500, '摘要长度不能超过500字符').optional(),
  language: z.enum(['zh', 'en']).optional(),
  metadata: z.record(z.any()).optional()
});

/**
 * 会话详情API
 * GET /api/conversations/[id] - 获取单个会话详情
 * PUT /api/conversations/[id] - 更新会话信息
 * DELETE /api/conversations/[id] - 删除会话
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 验证UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({
        error: '会话ID格式无效'
      }, { status: 400 });
    }

    // 获取会话详情
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          error: '会话不存在'
        }, { status: 404 });
      }
      throw new Error(`获取会话失败: ${error.message}`);
    }

    // 转换数据库格式到应用类型
    const formattedConversation: Conversation = {
      id: conversation.id,
      user_id: conversation.user_id || undefined,
      title: conversation.title || undefined,
      summary: conversation.summary || undefined,
      language: conversation.language as any,
      session_id: conversation.session_id,
      created_at: new Date(conversation.created_at),
      updated_at: new Date(conversation.updated_at)
    };

    // 获取会话的消息统计
    const { count: messageCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', id);

    return NextResponse.json({
      conversation: formattedConversation,
      statistics: {
        messageCount: messageCount || 0
      }
    });

  } catch (error) {
    console.error('获取会话详情错误:', error);

    return NextResponse.json({
      error: '服务器内部错误',
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = UpdateConversationSchema.parse(body);

    // 验证UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({
        error: '会话ID格式无效'
      }, { status: 400 });
    }

    const { title, summary, language, metadata } = validatedData;

    // 构建更新数据
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (summary !== undefined) updateData.summary = summary;
    if (language !== undefined) updateData.language = language;
    if (metadata !== undefined) updateData.metadata = metadata;

    // 更新会话
    const { data: updatedConversation, error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          error: '会话不存在'
        }, { status: 404 });
      }
      throw new Error(`更新会话失败: ${error.message}`);
    }

    // 转换数据库格式到应用类型
    const conversation: Conversation = {
      id: updatedConversation.id,
      user_id: updatedConversation.user_id || undefined,
      title: updatedConversation.title || undefined,
      summary: updatedConversation.summary || undefined,
      language: updatedConversation.language as any,
      session_id: updatedConversation.session_id,
      created_at: new Date(updatedConversation.created_at),
      updated_at: new Date(updatedConversation.updated_at)
    };

    return NextResponse.json({
      conversation,
      message: '会话更新成功'
    });

  } catch (error) {
    console.error('更新会话错误:', error);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 验证UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({
        error: '会话ID格式无效'
      }, { status: 400 });
    }

    // 先删除相关的消息记录
    const { error: deleteMessagesError } = await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', id);

    if (deleteMessagesError) {
      console.error('删除会话消息失败:', deleteMessagesError);
    }

    // 删除会话
    const { error: deleteConversationError } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);

    if (deleteConversationError) {
      if (deleteConversationError.code === 'PGRST116') {
        return NextResponse.json({
          error: '会话不存在'
        }, { status: 404 });
      }
      throw new Error(`删除会话失败: ${deleteConversationError.message}`);
    }

    return NextResponse.json({
      message: '会话删除成功'
    });

  } catch (error) {
    console.error('删除会话错误:', error);

    return NextResponse.json({
      error: '服务器内部错误',
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
