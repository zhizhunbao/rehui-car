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
  url?: string;
  metadata?: Record<string, any>;
  is_completed?: boolean;
}

// 对话详情响应类型
export interface ConversationDetailResponse {
  conversation: import('./chat').Conversation;
  messages: import('./chat').ChatMessage[];
  recommendations: import('./car').CarRecommendation[];
  next_steps: import('./car').NextStep[];
}

// 分页参数类型
export interface PaginationParams {
  page: number;
  limit: number;
}

// API列表响应类型
export interface APIListResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// 车型搜索参数类型（已在car.ts中定义，这里重新导出）

// 车型搜索响应类型
export interface CarSearchResponse {
  cars: import('./car').Car[];
  total: number;
  search_query: string;
  suggestions?: string[];
}

// 排序参数类型
export interface SortParams {
  sort_by: 'price' | 'reliability' | 'fuel_economy' | 'safety' | 'created_at';
  sort_order: 'asc' | 'desc';
}

 