import { BilingualText, Language } from './index';

// 聊天消息类型
export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  language: Language;
  createdAt: string;
}

// 对话类型
export interface Conversation {
  id: string;
  user_id?: string;
  title?: string;
  summary?: string;
  language: Language;
  session_id: string;
  created_at: Date;
  updated_at: Date;
}

// 扩展的会话类型，包含关联数据
export interface ConversationWithMessages extends Conversation {
  messages: ChatMessage[];
  message_count: number;
  last_message_at?: Date;
}

// 聊天状态类型
export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentConversation?: Conversation;
}

// 聊天输入状态
export interface ChatInputState {
  value: string;
  isSubmitting: boolean;
  error?: string;
}

// 消息发送状态
export type MessageStatus = 'sending' | 'sent' | 'failed' | 'delivered';

// 扩展的聊天消息（包含状态）
export interface ChatMessageWithStatus extends ChatMessage {
  status: MessageStatus;
  retryCount?: number;
}

// 聊天会话摘要
export interface ConversationSummary {
  id: string;
  title: string;
  last_message: string;
  last_message_at: Date;
  message_count: number;
  language: Language;
}

// 聊天历史查询参数
export interface ChatHistoryParams {
  conversation_id?: string;
  user_id?: string;
  session_id?: string;
  limit?: number;
  offset?: number;
  before?: Date;
  after?: Date;
}

// 聊天配置
export interface ChatConfig {
  max_message_length: number;
  max_messages_per_conversation: number;
  auto_save_interval: number;
  typing_indicator_timeout: number;
  message_retry_attempts: number;
}

// 打字指示器状态
export interface TypingIndicator {
  isTyping: boolean;
  userId?: string;
  timestamp: Date;
}

// 聊天事件类型
export type ChatEventType = 
  | 'message_sent'
  | 'message_received'
  | 'typing_start'
  | 'typing_stop'
  | 'conversation_created'
  | 'conversation_updated'
  | 'error_occurred';

// 聊天事件
export interface ChatEvent {
  type: ChatEventType;
  payload: any;
  timestamp: Date;
  conversation_id?: string;
}

// 消息模板类型
export interface MessageTemplate {
  id: string;
  name: string;
  content: BilingualText;
  category: 'greeting' | 'help' | 'error' | 'suggestion';
  variables?: string[];
}

// 聊天分析数据
export interface ChatAnalytics {
  total_messages: number;
  total_conversations: number;
  average_messages_per_conversation: number;
  most_active_hours: number[];
  common_topics: string[];
  user_satisfaction_score?: number;
}

// API响应类型
export interface ChatResponse {
  message: string;
  conversationId: string;
  messageId: string;
  timestamp: string;
  metadata?: {
    model?: string;
    tokens?: number;
    context?: any;
    error?: boolean;
  };
  recommendations?: any[];
} 