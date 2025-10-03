import { Language } from "@/types";

// 应用基础配置
export const APP_CONFIG = {
  name: 'ReHui Car',
  version: '1.0.0',
  description: 'AI-powered car buying advisor for Canada',
  author: 'ReHui Team',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
} as const;

// 语言配置
export const LANGUAGE_CONFIG = {
  default: 'zh' as Language,
  supported: ['en', 'zh'] as Language[],
  fallback: 'en' as Language,
} as const;

// API 配置
export const API_CONFIG = {
  baseUrl: '/api',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

// API 端点
export const API_ENDPOINTS = {
  // 聊天相关
  chat: '/api/chat',
  
  // 车型相关
  cars: '/api/cars',
  carDetail: (id: string) => `/api/cars/${id}`,
  carSearch: '/api/cars/search',
  
  // 对话相关
  conversations: '/api/conversations',
  conversationDetail: (id: string) => `/api/conversations/${id}`,
  
  // 用户相关
  users: '/api/users',
  
  // 推荐相关
  recommendations: '/api/recommendations',
  
  // 健康检查
  health: '/api/health',
} as const;

// 分页配置
export const PAGINATION_CONFIG = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

// 车型分类
export const CAR_CATEGORIES = {
  SEDAN: 'sedan',
  SUV: 'suv',
  HATCHBACK: 'hatchback',
  COUPE: 'coupe',
  CONVERTIBLE: 'convertible',
  WAGON: 'wagon',
  PICKUP: 'pickup',
  VAN: 'van',
  MINIVAN: 'minivan',
  CROSSOVER: 'crossover',
  LUXURY: 'luxury',
  SPORTS: 'sports',
  ELECTRIC: 'electric',
  HYBRID: 'hybrid',
} as const;

// 车型分类标签 (双语)
export const CAR_CATEGORY_LABELS = {
  [CAR_CATEGORIES.SEDAN]: { en: 'Sedan', zh: '轿车' },
  [CAR_CATEGORIES.SUV]: { en: 'SUV', zh: 'SUV' },
  [CAR_CATEGORIES.HATCHBACK]: { en: 'Hatchback', zh: '掀背车' },
  [CAR_CATEGORIES.COUPE]: { en: 'Coupe', zh: '双门轿跑' },
  [CAR_CATEGORIES.CONVERTIBLE]: { en: 'Convertible', zh: '敞篷车' },
  [CAR_CATEGORIES.WAGON]: { en: 'Wagon', zh: '旅行车' },
  [CAR_CATEGORIES.PICKUP]: { en: 'Pickup Truck', zh: '皮卡' },
  [CAR_CATEGORIES.VAN]: { en: 'Van', zh: '厢式车' },
  [CAR_CATEGORIES.MINIVAN]: { en: 'Minivan', zh: '小型货车' },
  [CAR_CATEGORIES.CROSSOVER]: { en: 'Crossover', zh: '跨界车' },
  [CAR_CATEGORIES.LUXURY]: { en: 'Luxury', zh: '豪华车' },
  [CAR_CATEGORIES.SPORTS]: { en: 'Sports Car', zh: '跑车' },
  [CAR_CATEGORIES.ELECTRIC]: { en: 'Electric', zh: '电动车' },
  [CAR_CATEGORIES.HYBRID]: { en: 'Hybrid', zh: '混合动力' },
} as const;

// 燃料类型
export const FUEL_TYPES = {
  GASOLINE: 'gasoline',
  DIESEL: 'diesel',
  HYBRID: 'hybrid',
  ELECTRIC: 'electric',
  PLUG_IN_HYBRID: 'plug_in_hybrid',
  HYDROGEN: 'hydrogen',
  CNG: 'cng', // Compressed Natural Gas
  LPG: 'lpg', // Liquefied Petroleum Gas
} as const;

// 燃料类型标签 (双语)
export const FUEL_TYPE_LABELS = {
  [FUEL_TYPES.GASOLINE]: { en: 'Gasoline', zh: '汽油' },
  [FUEL_TYPES.DIESEL]: { en: 'Diesel', zh: '柴油' },
  [FUEL_TYPES.HYBRID]: { en: 'Hybrid', zh: '混合动力' },
  [FUEL_TYPES.ELECTRIC]: { en: 'Electric', zh: '纯电动' },
  [FUEL_TYPES.PLUG_IN_HYBRID]: { en: 'Plug-in Hybrid', zh: '插电混动' },
  [FUEL_TYPES.HYDROGEN]: { en: 'Hydrogen', zh: '氢燃料' },
  [FUEL_TYPES.CNG]: { en: 'CNG', zh: '压缩天然气' },
  [FUEL_TYPES.LPG]: { en: 'LPG', zh: '液化石油气' },
} as const;

// 汽车品牌
export const CAR_MAKES = [
  'Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi',
  'Ford', 'Chevrolet', 'GMC', 'Buick', 'Cadillac', 'Chrysler', 'Dodge', 'Jeep', 'Ram',
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche',
  'Lexus', 'Infiniti', 'Acura',
  'Hyundai', 'Kia', 'Genesis',
  'Volvo', 'Saab',
  'Jaguar', 'Land Rover', 'Mini',
  'Tesla',
  'Fiat', 'Alfa Romeo',
  'Other'
] as const;

// 价格范围
export const PRICE_RANGES = {
  UNDER_15K: { min: 0, max: 15000, label: { en: 'Under $15,000', zh: '15,000加元以下' } },
  '15K_30K': { min: 15000, max: 30000, label: { en: '$15,000 - $30,000', zh: '15,000 - 30,000加元' } },
  '30K_50K': { min: 30000, max: 50000, label: { en: '$30,000 - $50,000', zh: '30,000 - 50,000加元' } },
  '50K_75K': { min: 50000, max: 75000, label: { en: '$50,000 - $75,000', zh: '50,000 - 75,000加元' } },
  OVER_75K: { min: 75000, max: Infinity, label: { en: 'Over $75,000', zh: '75,000加元以上' } },
} as const;

// 年份范围
export const YEAR_RANGES = {
  '2020_PLUS': { min: 2020, max: new Date().getFullYear() + 1, label: '2020年及以后' },
  '2015_2019': { min: 2015, max: 2019, label: '2015-2019年' },
  '2010_2014': { min: 2010, max: 2014, label: '2010-2014年' },
  '2005_2009': { min: 2005, max: 2009, label: '2005-2009年' },
  BEFORE_2005: { min: 1900, max: 2004, label: '2005年以前' },
} as const;

// 排序选项
export const SORT_OPTIONS = {
  PRICE_LOW_TO_HIGH: { field: 'price_min', order: 'asc', label: { en: 'Price: Low to High', zh: '价格：从低到高' } },
  PRICE_HIGH_TO_LOW: { field: 'price_max', order: 'desc', label: { en: 'Price: High to Low', zh: '价格：从高到低' } },
  YEAR_NEWEST: { field: 'year_max', order: 'desc', label: { en: 'Year: Newest First', zh: '年份：最新优先' } },
  YEAR_OLDEST: { field: 'year_min', order: 'asc', label: { en: 'Year: Oldest First', zh: '年份：最旧优先' } },
  RELIABILITY_HIGH: { field: 'reliability_score', order: 'desc', label: { en: 'Reliability: High to Low', zh: '可靠性：从高到低' } },
  FUEL_ECONOMY_BEST: { field: 'fuel_economy', order: 'asc', label: { en: 'Fuel Economy: Best First', zh: '燃油经济性：最佳优先' } },
  SAFETY_HIGH: { field: 'safety_rating', order: 'desc', label: { en: 'Safety: High to Low', zh: '安全性：从高到低' } },
  CREATED_NEWEST: { field: 'created_at', order: 'desc', label: { en: 'Recently Added', zh: '最近添加' } },
} as const;

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// 错误代码
export const ERROR_CODES = {
  // 通用错误
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // 认证错误
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // 资源错误
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  CONVERSATION_NOT_FOUND: 'CONVERSATION_NOT_FOUND',
  CAR_NOT_FOUND: 'CAR_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  
  // 业务逻辑错误
  INVALID_REQUEST: 'INVALID_REQUEST',
  INVALID_PARAMETERS: 'INVALID_PARAMETERS',
  MISSING_REQUIRED_FIELDS: 'MISSING_REQUIRED_FIELDS',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  
  // 服务错误
  DATABASE_ERROR: 'DATABASE_ERROR',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // 文件处理错误
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
} as const;

// 错误消息 (双语)
export const ERROR_MESSAGES = {
  [ERROR_CODES.UNKNOWN_ERROR]: { en: 'An unknown error occurred', zh: '发生未知错误' },
  [ERROR_CODES.VALIDATION_ERROR]: { en: 'Validation failed', zh: '验证失败' },
  [ERROR_CODES.NETWORK_ERROR]: { en: 'Network error', zh: '网络错误' },
  [ERROR_CODES.TIMEOUT_ERROR]: { en: 'Request timeout', zh: '请求超时' },
  
  [ERROR_CODES.UNAUTHORIZED]: { en: 'Unauthorized access', zh: '未授权访问' },
  [ERROR_CODES.FORBIDDEN]: { en: 'Access forbidden', zh: '访问被禁止' },
  [ERROR_CODES.TOKEN_EXPIRED]: { en: 'Token expired', zh: '令牌已过期' },
  [ERROR_CODES.INVALID_CREDENTIALS]: { en: 'Invalid credentials', zh: '无效的凭据' },
  
  [ERROR_CODES.NOT_FOUND]: { en: 'Resource not found', zh: '资源未找到' },
  [ERROR_CODES.RESOURCE_NOT_FOUND]: { en: 'Resource not found', zh: '资源未找到' },
  [ERROR_CODES.CONVERSATION_NOT_FOUND]: { en: 'Conversation not found', zh: '对话未找到' },
  [ERROR_CODES.CAR_NOT_FOUND]: { en: 'Car not found', zh: '车型未找到' },
  [ERROR_CODES.USER_NOT_FOUND]: { en: 'User not found', zh: '用户未找到' },
  
  [ERROR_CODES.INVALID_REQUEST]: { en: 'Invalid request', zh: '无效请求' },
  [ERROR_CODES.INVALID_PARAMETERS]: { en: 'Invalid parameters', zh: '无效参数' },
  [ERROR_CODES.MISSING_REQUIRED_FIELDS]: { en: 'Missing required fields', zh: '缺少必填字段' },
  [ERROR_CODES.DUPLICATE_RESOURCE]: { en: 'Resource already exists', zh: '资源已存在' },
  
  [ERROR_CODES.DATABASE_ERROR]: { en: 'Database error', zh: '数据库错误' },
  [ERROR_CODES.AI_SERVICE_ERROR]: { en: 'AI service error', zh: 'AI服务错误' },
  [ERROR_CODES.EXTERNAL_API_ERROR]: { en: 'External API error', zh: '外部API错误' },
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: { en: 'Rate limit exceeded', zh: '请求频率超限' },
  [ERROR_CODES.SERVICE_UNAVAILABLE]: { en: 'Service unavailable', zh: '服务不可用' },
  
  [ERROR_CODES.FILE_TOO_LARGE]: { en: 'File too large', zh: '文件过大' },
  [ERROR_CODES.INVALID_FILE_TYPE]: { en: 'Invalid file type', zh: '无效的文件类型' },
  [ERROR_CODES.FILE_UPLOAD_FAILED]: { en: 'File upload failed', zh: '文件上传失败' },
} as const;

// 成功消息 (双语)
export const SUCCESS_MESSAGES = {
  CREATED: { en: 'Created successfully', zh: '创建成功' },
  UPDATED: { en: 'Updated successfully', zh: '更新成功' },
  DELETED: { en: 'Deleted successfully', zh: '删除成功' },
  SAVED: { en: 'Saved successfully', zh: '保存成功' },
  SENT: { en: 'Sent successfully', zh: '发送成功' },
  UPLOADED: { en: 'Uploaded successfully', zh: '上传成功' },
} as const;

// 加载状态消息 (双语)
export const LOADING_MESSAGES = {
  LOADING: { en: 'Loading...', zh: '加载中...' },
  SAVING: { en: 'Saving...', zh: '保存中...' },
  SENDING: { en: 'Sending...', zh: '发送中...' },
  UPLOADING: { en: 'Uploading...', zh: '上传中...' },
  PROCESSING: { en: 'Processing...', zh: '处理中...' },
  THINKING: { en: 'Thinking...', zh: '思考中...' },
  SEARCHING: { en: 'Searching...', zh: '搜索中...' },
} as const;

// 聊天配置
export const CHAT_CONFIG = {
  maxMessageLength: 1000,
  maxMessagesPerConversation: 100,
  typingIndicatorDelay: 1000, // 1 second
  messageRetryAttempts: 3,
  messageRetryDelay: 2000, // 2 seconds
} as const;

// AI 配置
export const AI_CONFIG = {
  provider: 'gemini',
  model: 'gemini-pro',
  maxTokens: 2048,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 2000, // 2 seconds
} as const;

// 文件上传配置
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedDocumentTypes: ['application/pdf', 'text/plain', 'application/msword'],
  maxFiles: 10,
} as const;

// 缓存配置
export const CACHE_CONFIG = {
  defaultTTL: 300, // 5 minutes
  longTTL: 3600, // 1 hour
  shortTTL: 60, // 1 minute
  keys: {
    cars: 'cars',
    carDetail: (id: string) => `car:${id}`,
    carSearch: (query: string) => `search:${query}`,
    conversations: (userId: string) => `conversations:${userId}`,
    user: (id: string) => `user:${id}`,
  },
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  language: 'rehui-car-language',
  theme: 'rehui-car-theme',
  sessionId: 'rehui-car-session-id',
  userPreferences: 'rehui-car-user-preferences',
  conversationHistory: 'rehui-car-conversation-history',
  searchHistory: 'rehui-car-search-history',
} as const;

// 主题配置
export const THEME_CONFIG = {
  default: 'light',
  options: ['light', 'dark', 'system'],
} as const;

// 动画配置
export const ANIMATION_CONFIG = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// 断点配置 (与 Tailwind CSS 保持一致)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// 正则表达式
export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  sessionId: /^[a-zA-Z0-9_-]+$/,
  carMake: /^[a-zA-Z\s\-\.]+$/,
  carModel: /^[a-zA-Z0-9\s\-\.]+$/,
  year: /^(19|20)\d{2}$/,
  price: /^\d+(\.\d{1,2})?$/,
} as const; 