// API 分页类型
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// API 筛选类型
export interface CarFilters {
  category?: string;
  fuel_type?: string;
  make?: string;
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  reliability_min?: number;
  fuel_economy_min?: number;
  safety_rating_min?: number;
}

// API 排序类型
export interface SortParams {
  sort_by: 'price' | 'reliability' | 'fuel_economy' | 'safety' | 'created_at';
  sort_order: 'asc' | 'desc';
}

// 通用 API 响应类型
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface APIListResponse<T> extends APIResponse<T[]> {
  pagination: PaginationResponse;
  filters?: any;
}

// 车型查询参数接口
export interface CarsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  fuel_type?: string;
  price_min?: number;
  price_max?: number;
  make?: string;
  sort_by?: 'price' | 'reliability' | 'fuel_economy' | 'safety';
  sort_order?: 'asc' | 'desc';
  language?: 'en' | 'zh';
}

// 车型响应接口
export interface CarsResponse {
  cars: import('./index').Car[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  filters: {
    categories: string[];
    fuel_types: string[];
    makes: string[];
    price_range: { min: number; max: number };
  };
}

// 搜索参数接口
export interface CarSearchParams {
  q: string;
  language?: 'en' | 'zh';
  limit?: number;
  category?: string;
  price_range?: [number, number];
}

// 搜索响应接口
export interface CarSearchResponse {
  cars: import('./index').Car[];
  total: number;
  search_query: string;
  suggestions?: string[];
}

// 车型详情响应接口
export interface CarDetailResponse {
  car: import('./index').Car;
  similar_cars: import('./index').Car[];
  reviews?: import('./index').CarReview[];
  availability?: import('./index').CarAvailability;
}

// 对话查询参数接口
export interface ConversationsQueryParams {
  user_id?: string;
  session_id?: string;
  page?: number;
  limit?: number;
  language?: 'en' | 'zh';
}

// 对话响应接口
export interface ConversationsResponse {
  conversations: import('./index').Conversation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// 创建对话请求接口
export interface CreateConversationRequest {
  title?: string;
  language: 'en' | 'zh';
  session_id: string;
  user_id?: string;
}

// 创建对话响应接口
export interface CreateConversationResponse {
  conversation: import('./index').Conversation;
  message: string;
}

// 对话详情响应接口
export interface ConversationDetailResponse {
  conversation: import('./index').Conversation;
  messages: import('./index').ChatMessage[];
  recommendations: import('./index').CarRecommendation[];
  next_steps: import('./index').NextStep[];
}

// 健康检查响应接口
export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    ai: 'up' | 'down';
    cache?: 'up' | 'down';
  };
  version: string;
}

// 用户信息请求接口
export interface UserRequest {
  email?: string;
  name?: string;
  language?: 'en' | 'zh';
  session_id: string;
}

// 用户信息响应接口
export interface UserResponse {
  user: import('./index').User;
  message: string;
}

// 推荐历史查询参数
export interface RecommendationsQueryParams {
  conversation_id?: string;
  user_id?: string;
  session_id?: string;
  limit?: number;
  language?: 'en' | 'zh';
}

// 推荐历史响应接口
export interface RecommendationsResponse {
  recommendations: import('./index').CarRecommendation[];
  total: number;
}

// 统一错误响应格式
export interface APIError {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

// HTTP 状态码使用规范
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

// 错误代码定义
export const ERROR_CODES = {
  INVALID_REQUEST: 'INVALID_REQUEST',
  CONVERSATION_NOT_FOUND: 'CONVERSATION_NOT_FOUND',
  CAR_NOT_FOUND: 'CAR_NOT_FOUND',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
} as const; 