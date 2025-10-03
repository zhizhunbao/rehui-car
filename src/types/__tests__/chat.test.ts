/**
 * @fileoverview 聊天类型测试
 * 测试聊天相关的类型定义
 */

import {
  ChatMessage,
  Conversation,
  ConversationWithMessages,
  ChatState,
  ChatInputState,
  MessageStatus,
  ChatMessageWithStatus,
  ConversationSummary,
  ChatHistoryParams,
  ChatConfig,
  TypingIndicator,
  ChatEventType,
  ChatEvent,
  MessageTemplate,
  ChatAnalytics
} from '../chat'

describe('聊天类型测试', () => {
  describe('基础聊天类型', () => {
    test('ChatMessage 应该正确定义', () => {
      const userMessage: ChatMessage = {
        id: 'msg-1',
        type: 'user',
        content: 'Hello, I need help finding a car',
        timestamp: new Date()
      }
      
      const assistantMessage: ChatMessage = {
        id: 'msg-2',
        type: 'assistant',
        content: 'I can help you find the perfect car!',
        timestamp: new Date(),
        metadata: {
          model: 'gemini-pro',
          tokens: 25
        }
      }
      
      expect(userMessage.type).toBe('user')
      expect(assistantMessage.type).toBe('assistant')
      expect(assistantMessage.metadata?.model).toBe('gemini-pro')
    })

    test('Conversation 应该正确定义', () => {
      const conversation: Conversation = {
        id: 'conv-1',
        user_id: 'user-123',
        title: 'Car Recommendation Chat',
        summary: 'User looking for a reliable sedan',
        language: 'en',
        session_id: 'session-456',
        created_at: new Date(),
        updated_at: new Date()
      }
      
      expect(conversation.language).toBe('en')
      expect(conversation.title).toBe('Car Recommendation Chat')
      expect(conversation.session_id).toBe('session-456')
    })

    test('ConversationWithMessages 应该正确定义', () => {
      const conversationWithMessages: ConversationWithMessages = {
        id: 'conv-1',
        language: 'en',
        session_id: 'session-456',
        created_at: new Date(),
        updated_at: new Date(),
        messages: [
          {
            id: 'msg-1',
            type: 'user',
            content: 'Hello',
            timestamp: new Date()
          }
        ],
        message_count: 1,
        last_message_at: new Date()
      }
      
      expect(conversationWithMessages.messages).toHaveLength(1)
      expect(conversationWithMessages.message_count).toBe(1)
    })
  })

  describe('聊天状态类型', () => {
    test('ChatState 应该正确定义', () => {
      const chatState: ChatState = {
        messages: [],
        isLoading: false,
        error: null
      }
      
      expect(Array.isArray(chatState.messages)).toBe(true)
      expect(chatState.isLoading).toBe(false)
      expect(chatState.error).toBeNull()
    })

    test('ChatInputState 应该正确定义', () => {
      const inputState: ChatInputState = {
        value: 'I need a car recommendation',
        isSubmitting: false
      }
      
      expect(inputState.value).toBe('I need a car recommendation')
      expect(inputState.isSubmitting).toBe(false)
    })

    test('MessageStatus 应该正确定义', () => {
      const statuses: MessageStatus[] = ['sending', 'sent', 'failed', 'delivered']
      
      statuses.forEach(status => {
        expect(['sending', 'sent', 'failed', 'delivered']).toContain(status)
      })
    })

    test('ChatMessageWithStatus 应该正确定义', () => {
      const messageWithStatus: ChatMessageWithStatus = {
        id: 'msg-1',
        type: 'user',
        content: 'Hello',
        timestamp: new Date(),
        status: 'sent'
      }
      
      expect(messageWithStatus.status).toBe('sent')
    })
  })

  describe('聊天配置和历史', () => {
    test('ConversationSummary 应该正确定义', () => {
      const summary: ConversationSummary = {
        id: 'conv-1',
        title: 'Car Recommendation',
        last_message: 'Thank you for the recommendations!',
        last_message_at: new Date(),
        message_count: 15,
        language: 'en'
      }
      
      expect(summary.title).toBe('Car Recommendation')
      expect(summary.message_count).toBe(15)
      expect(summary.language).toBe('en')
    })

    test('ChatHistoryParams 应该正确定义', () => {
      const historyParams: ChatHistoryParams = {
        user_id: 'user-123',
        session_id: 'session-456',
        limit: 50,
        offset: 0,
        before: new Date('2024-12-31'),
        after: new Date('2024-01-01')
      }
      
      expect(historyParams.user_id).toBe('user-123')
      expect(historyParams.limit).toBe(50)
      expect(historyParams.before).toBeInstanceOf(Date)
    })

    test('ChatConfig 应该正确定义', () => {
      const config: ChatConfig = {
        max_message_length: 2000,
        max_messages_per_conversation: 100,
        auto_save_interval: 30000,
        typing_indicator_timeout: 5000,
        message_retry_attempts: 3
      }
      
      expect(config.max_message_length).toBe(2000)
      expect(config.max_messages_per_conversation).toBe(100)
      expect(config.auto_save_interval).toBe(30000)
      expect(config.message_retry_attempts).toBe(3)
    })

    test('TypingIndicator 应该正确定义', () => {
      const typingIndicator: TypingIndicator = {
        isTyping: true,
        userId: 'user-123',
        timestamp: new Date()
      }
      
      expect(typingIndicator.isTyping).toBe(true)
      expect(typingIndicator.userId).toBe('user-123')
    })
  })

  describe('聊天事件', () => {
    test('ChatEventType 应该正确定义', () => {
      const eventTypes: ChatEventType[] = [
        'message_sent',
        'message_received',
        'typing_start',
        'typing_stop',
        'conversation_created',
        'conversation_updated',
        'error_occurred'
      ]
      
      eventTypes.forEach(eventType => {
        expect([
          'message_sent',
          'message_received',
          'typing_start',
          'typing_stop',
          'conversation_created',
          'conversation_updated',
          'error_occurred'
        ]).toContain(eventType)
      })
    })

    test('ChatEvent 应该正确定义', () => {
      const messageEvent: ChatEvent = {
        type: 'message_sent',
        payload: {
          message_id: 'msg-1',
          content: 'Hello'
        },
        timestamp: new Date(),
        conversation_id: 'conv-1'
      }
      
      expect(messageEvent.type).toBe('message_sent')
      expect(messageEvent.payload.message_id).toBe('msg-1')
    })
  })

  describe('消息模板和分析', () => {
    test('MessageTemplate 应该正确定义', () => {
      const template: MessageTemplate = {
        id: 'template-1',
        name: 'Welcome Message',
        content: {
          en: 'Welcome! How can I help you find the perfect car?',
          zh: '欢迎！我如何帮助您找到完美的汽车？'
        },
        category: 'greeting'
      }
      
      expect(template.name).toBe('Welcome Message')
      expect(template.content.en).toContain('Welcome')
      expect(template.category).toBe('greeting')
    })

    test('ChatAnalytics 应该正确定义', () => {
      const analytics: ChatAnalytics = {
        total_messages: 25,
        total_conversations: 5,
        average_messages_per_conversation: 5.0,
        most_active_hours: [9, 10, 14, 15, 16],
        common_topics: ['sedan', 'budget', 'fuel_efficiency'],
        user_satisfaction_score: 4.5
      }
      
      expect(analytics.total_messages).toBe(25)
      expect(analytics.total_conversations).toBe(5)
      expect(analytics.common_topics).toContain('sedan')
      expect(analytics.user_satisfaction_score).toBe(4.5)
    })
  })

  describe('类型兼容性测试', () => {
    test('ChatMessage 应该兼容 ChatMessageWithStatus', () => {
      const baseMessage: ChatMessage = {
        id: 'msg-1',
        type: 'user',
        content: 'Hello',
        timestamp: new Date()
      }
      
      const messageWithStatus: ChatMessageWithStatus = {
        ...baseMessage,
        status: 'sent'
      }
      
      expect(messageWithStatus.id).toBe(baseMessage.id)
      expect(messageWithStatus.status).toBe('sent')
    })

    test('可选字段应该正确处理', () => {
      const minimalConversation: Conversation = {
        id: 'conv-1',
        language: 'en',
        session_id: 'session-123',
        created_at: new Date(),
        updated_at: new Date()
      }
      
      expect(minimalConversation.user_id).toBeUndefined()
      expect(minimalConversation.title).toBeUndefined()
    })
  })
}) 