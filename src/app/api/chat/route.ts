import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { genAI } from '@/lib/gemini';
import type { ChatMessage, Conversation, ChatResponse } from '@/types/chat';

// 数据库返回的原始类型
interface DbConversation {
  id: string;
  user_id: string | null;
  title: string | null;
  summary: string | null;
  language: string;
  session_id: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
}

interface DbMessage {
  id: string;
  conversation_id: string;
  type: string;
  content: string;
  metadata: any;
  created_at: string;
}

// 请求验证模式
const ChatRequestSchema = z.object({
  message: z.string().min(1, '消息不能为空').max(2000, '消息长度不能超过2000字符'),
  conversationId: z.string().uuid().optional(),
  userId: z.string().optional(),
  context: z.object({
    userPreferences: z.object({
      budget: z.string().optional(),
      carType: z.string().optional(),
      brand: z.string().optional(),
      features: z.array(z.string()).optional()
    }).optional(),
    currentCar: z.object({
      id: z.string(),
      name: z.string(),
      brand: z.string()
    }).optional()
  }).optional(),
  stream: z.boolean().default(false)
});

/**
 * 聊天API
 * POST /api/chat - 处理用户消息，返回AI回复
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ChatRequestSchema.parse(body);
    
    const { message, conversationId, userId, context, stream } = validatedData;

    // 获取或创建对话
    let conversation: Conversation | null = null;
    
    if (conversationId) {
      // 获取现有对话
      const { data: existingConversation, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`获取对话失败: ${fetchError.message}`);
      }
      
      if (existingConversation) {
        // 转换数据库格式到应用类型
        conversation = {
          id: existingConversation.id,
          user_id: existingConversation.user_id || undefined,
          title: existingConversation.title || undefined,
          summary: existingConversation.summary || undefined,
          language: existingConversation.language as any,
          session_id: existingConversation.session_id,
          created_at: new Date(existingConversation.created_at),
          updated_at: new Date(existingConversation.updated_at)
        };
      }
    }
    
    if (!conversation) {
      // 创建新对话
      const conversationId = crypto.randomUUID();
      const sessionId = crypto.randomUUID();
      
      const newConversation = {
        id: conversationId,
        user_id: userId || null,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        language: 'zh',
        session_id: sessionId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: createdConversation, error: createError } = await supabase
        .from('conversations')
        .insert(newConversation)
        .select()
        .single();
        
      if (createError) {
        throw new Error(`创建对话失败: ${createError.message}`);
      }
      
      if (createdConversation) {
        conversation = {
          id: createdConversation.id,
          user_id: createdConversation.user_id || undefined,
          title: createdConversation.title || undefined,
          summary: createdConversation.summary || undefined,
          language: createdConversation.language as any,
          session_id: createdConversation.session_id,
          created_at: new Date(createdConversation.created_at),
          updated_at: new Date(createdConversation.updated_at)
        };
      }
    }

    if (!conversation) {
      throw new Error('对话创建失败');
    }

    // 获取对话历史
    const { data: messageHistory, error: historyError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(20); // 限制历史消息数量

    if (historyError) {
      console.error('获取消息历史失败:', historyError);
    }

    // 保存用户消息
    const userMessage = {
      conversation_id: conversation.id,
      type: 'user',
      content: message,
      created_at: new Date().toISOString(),
      metadata: context || null
    };

    const { data: savedUserMessage, error: saveUserError } = await supabase
      .from('messages')
      .insert(userMessage)
      .select()
      .single();

    if (saveUserError) {
      throw new Error(`保存用户消息失败: ${saveUserError.message}`);
    }

    // 构建AI提示词
    const systemPrompt = `你是一个专业的汽车推荐助手，名叫"睿慧"。你的任务是帮助用户选择合适的汽车。

你的特点：
- 专业：对各种汽车品牌、型号、性能参数都很了解
- 贴心：会根据用户的预算、需求、使用场景给出个性化建议
- 实用：提供的建议都是实用的，会考虑性价比、维护成本等因素
- 诚实：如果不确定某些信息，会如实说明

当前对话上下文：
${context ? `用户偏好：${JSON.stringify(context.userPreferences || {}, null, 2)}` : ''}
${context?.currentCar ? `当前关注车型：${context.currentCar.brand} ${context.currentCar.name}` : ''}

请根据用户的问题提供专业、有用的回答。如果用户询问具体车型，可以提供详细的参数对比和推荐理由。`;

    // 构建对话历史
    const conversationHistory = [
      { role: 'system', content: systemPrompt },
      ...(messageHistory || []).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // 如果是流式响应
    if (stream) {
      return handleStreamResponse(conversation, conversationHistory, savedUserMessage);
    }

    // 非流式响应
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(
        conversationHistory.map(msg => msg.content).join('\n\n')
      );

      const aiResponse = result.response.text();

      // 保存AI回复
      const assistantMessage = {
        conversation_id: conversation.id,
        type: 'assistant',
        content: aiResponse,
        created_at: new Date().toISOString(),
        metadata: {
          model: 'gemini-2.5-flash',
          tokens: aiResponse.length // 简单的token估算
        }
      };

      const { data: savedAssistantMessage, error: saveAssistantError } = await supabase
        .from('messages')
        .insert(assistantMessage)
        .select()
        .single();

      if (saveAssistantError) {
        console.error('保存AI消息失败:', saveAssistantError);
      }

      // 更新对话
      await supabase
        .from('conversations')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', conversation.id);

      // 获取相关车型推荐（如果AI回复中提到了车型）
      const carRecommendations = await getCarRecommendations(aiResponse);

      const response: ChatResponse = {
        message: aiResponse,
        conversationId: conversation.id,
        messageId: savedAssistantMessage?.id || crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        metadata: {
          model: 'gemini-2.5-flash',
          tokens: aiResponse.length
        },
        recommendations: carRecommendations
      };

      return NextResponse.json(response);

    } catch (aiError) {
      console.error('AI生成回复失败:', aiError);
      
      // 返回错误回复
      const errorResponse: ChatResponse = {
        message: '抱歉，我现在无法处理您的请求。请稍后再试。',
        conversationId: conversation.id,
        messageId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        metadata: {
          error: true
        }
      };

      return NextResponse.json(errorResponse, { status: 500 });
    }

  } catch (error) {
    console.error('聊天API错误:', error);

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
 * 处理流式响应
 */
async function handleStreamResponse(
  conversation: Conversation,
  conversationHistory: Array<{ role: string; content: string }>,
  userMessage: any
) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 这里应该使用支持流式的AI客户端
        // 由于Gemini客户端可能不支持流式，我们模拟流式响应
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(
          conversationHistory.map(msg => msg.content).join('\n\n')
        );

        const fullResponse = result.response.text();
        
        // 模拟流式发送
        const words = fullResponse.split(' ');
        let currentResponse = '';
        
        for (let i = 0; i < words.length; i++) {
          currentResponse += (i > 0 ? ' ' : '') + words[i];
          
          const chunk = {
            type: 'content',
            content: words[i] + (i < words.length - 1 ? ' ' : ''),
            conversationId: conversation.id,
            timestamp: new Date().toISOString()
          };
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
          
          // 添加延迟以模拟真实的流式响应
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // 发送完成信号
        const completeChunk = {
          type: 'complete',
          conversationId: conversation.id,
          messageId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          fullContent: fullResponse
        };
        
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(completeChunk)}\n\n`));
        
        // 保存完整的AI回复
        const assistantMessage = {
          conversation_id: conversation.id,
          type: 'assistant',
          content: fullResponse,
          created_at: new Date().toISOString(),
          metadata: {
            model: 'gemini-2.5-flash',
            tokens: fullResponse.length,
            stream: true
          }
        };

        await supabase
          .from('messages')
          .insert(assistantMessage);

        controller.close();
        
      } catch (error) {
        console.error('流式响应错误:', error);
        
        const errorChunk = {
          type: 'error',
          error: '生成回复时发生错误',
          conversationId: conversation.id,
          timestamp: new Date().toISOString()
        };
        
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorChunk)}\n\n`));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

/**
 * 根据AI回复获取相关车型推荐
 */
async function getCarRecommendations(aiResponse: string): Promise<any[]> {
  try {
    // 提取AI回复中提到的车型关键词
    const carKeywords = extractCarKeywords(aiResponse);
    
    if (carKeywords.length === 0) {
      return [];
    }

    // 搜索相关车型
    const searchConditions = carKeywords.map(keyword => 
      `make.ilike.%${keyword}%,model.ilike.%${keyword}%,category.ilike.%${keyword}%`
    ).join(',');

    const { data: cars, error } = await supabase
      .from('cars')
      .select('*')
      .eq('is_active', true)
      .or(searchConditions)
      .limit(5);

    if (error) {
      console.error('获取车型推荐失败:', error);
      return [];
    }

    return cars || [];
    
  } catch (error) {
    console.error('处理车型推荐时出错:', error);
    return [];
  }
}

/**
 * 从AI回复中提取车型关键词
 */
function extractCarKeywords(text: string): string[] {
  const commonCarBrands = [
    // 英文品牌
    'Toyota', 'Honda', 'Nissan', 'Mazda', 'Ford', 'Chevrolet', 'GMC', 
    'Dodge', 'RAM', 'Jeep', 'Chrysler', 'BMW', 'Mercedes', 'Benz', 
    'Audi', 'Volkswagen', 'VW', 'Volvo', 'Lexus', 'Acura', 'Infiniti',
    'Porsche', 'Ferrari', 'Lamborghini', 'Tesla', 'Hyundai', 'Kia',
    'Subaru', 'Mitsubishi', 'Genesis', 'Buick', 'Cadillac', 'Lincoln',
    // 中文品牌
    '丰田', '本田', '日产', '马自达', '福特', '雪佛兰', '别克', '凯迪拉克',
    '奔驰', '宝马', '奥迪', '大众', '沃尔沃', '捷豹', '路虎', '保时捷',
    '特斯拉', '比亚迪', '吉利', '长城', '奇瑞', '长安', '红旗', '蔚来', 
    '小鹏', '理想'
  ];

  const commonCarTypes = [
    // 英文类型
    'SUV', 'Sedan', 'Truck', 'Pickup', 'Van', 'Minivan', 'Coupe', 'Convertible',
    'Hatchback', 'Wagon', 'Crossover', 'Electric', 'Hybrid', 'Luxury', 'Sports',
    // 中文类型
    '轿车', '跑车', '越野车', '商务车', '新能源', '电动车', '混动',
    '紧凑型', '中型车', '大型车', '小型车', 'MPV', '皮卡'
  ];

  const keywords: string[] = [];
  
  // 提取品牌关键词
  commonCarBrands.forEach(brand => {
    if (text.toLowerCase().includes(brand.toLowerCase())) {
      keywords.push(brand);
    }
  });
  
  // 提取车型关键词
  commonCarTypes.forEach(type => {
    if (text.toLowerCase().includes(type.toLowerCase())) {
      keywords.push(type);
    }
  });

  return Array.from(new Set(keywords)); // 去重
}

/**
 * 获取对话历史
 * GET /api/chat?conversationId=xxx - 获取指定对话的消息历史
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!conversationId) {
      return NextResponse.json({
        error: '缺少conversationId参数'
      }, { status: 400 });
    }

    // 验证UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(conversationId)) {
      return NextResponse.json({
        error: 'conversationId格式无效'
      }, { status: 400 });
    }

    // 获取对话信息
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (conversationError) {
      return NextResponse.json({
        error: '对话不存在'
      }, { status: 404 });
    }

    // 获取消息历史
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (messagesError) {
      throw new Error(`获取消息失败: ${messagesError.message}`);
    }

    return NextResponse.json({
      conversation,
      messages: messages || [],
      pagination: {
        limit,
        offset,
        total: messages?.length || 0
      }
    });

  } catch (error) {
    console.error('获取对话历史错误:', error);
    
    return NextResponse.json({
      error: '服务器内部错误',
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
