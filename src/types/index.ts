// 基础类型
export interface BilingualText {
  en: string;
  zh: string;
}

export type Language = 'en' | 'zh';

// 重新导出聊天相关类型
export type {
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
} from './chat';

// 重新导出车型相关类型
export type {
  Car,
  CarRecommendation,
  NextStep,
  RecommendationFactor,
  CarReview,
  CarAvailability,
  CarFilters,
  CarSearchParams,
  CarSortField,
  CarSearchResult,
  SearchFacets,
  FacetItem,
  PriceRangeFacet,
  YearRangeFacet,
  CarComparison,
  ComparisonField,
  CarStatistics,
  PriceDistribution,
  YearDistribution,
  AverageRatings,
  CarResource,
  CreateCarData,
  UpdateCarData,
  CarImportData,
  ValidationResult
} from './car';

// 用户相关类型
export interface User {
  id: string;
  email?: string;
  name?: string;
  language: Language;
  session_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email?: string;
  name?: string;
  language?: Language;
  session_id: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  language?: Language;
}

// API相关类型
export interface ChatRequest {
  message: string;
  conversation_id?: string;
  language: Language;
  session_id: string;
}

export interface ChatResponse {
  conversation_id: string;
  message_id: string;
  summary: BilingualText;
  recommendations: import('./car').CarRecommendation[];
  next_steps: import('./car').NextStep[];
}

// 数据库创建和更新类型
export interface CreateConversationData {
  user_id?: string;
  title?: string;
  language: Language;
  session_id: string;
}

export interface UpdateConversationData {
  title?: string;
  summary?: string;
}

export interface CreateMessageData {
  conversation_id: string;
  type: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, any>;
}



export interface CreateRecommendationData {
  conversation_id: string;
  message_id: string;
  car_id: string;
  match_score: number;
  reasoning_en?: string;
  reasoning_zh?: string;
}

export interface CreateNextStepData {
  conversation_id: string;
  message_id: string;
  title_en: string;
  title_zh: string;
  description_en?: string;
  description_zh?: string;
  priority: 'high' | 'medium' | 'low';
  action_type: 'research' | 'visit' | 'contact' | 'prepare';
}

 