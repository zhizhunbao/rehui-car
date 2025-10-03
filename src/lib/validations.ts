import { z } from 'zod';
import { Language } from '@/types';
import { 
  CAR_CATEGORIES, 
  FUEL_TYPES, 
  CAR_MAKES,
  REGEX_PATTERNS 
} from '@/lib/constants';

// 基础验证模式
export const LanguageSchema = z.enum(['en', 'zh']);

export const UUIDSchema = z.string().uuid('Invalid UUID format');

export const SessionIdSchema = z.string()
  .min(1, 'Session ID is required')
  .regex(REGEX_PATTERNS.sessionId, 'Invalid session ID format');

export const EmailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email too long');

export const UrlSchema = z.string()
  .url('Invalid URL format')
  .max(2048, 'URL too long');

// 双语文本验证
export const BilingualTextSchema = z.object({
  en: z.string().min(1, 'English text is required'),
  zh: z.string().min(1, 'Chinese text is required'),
});

// 分页验证
export const PaginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(20),
});

// 排序验证
export const SortSchema = z.object({
  sort_by: z.enum([
    'price_min', 'price_max', 'year_min', 'year_max', 
    'reliability_score', 'fuel_economy', 'safety_rating', 
    'created_at', 'popularity'
  ]).optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// 聊天相关验证
export const ChatMessageSchema = z.object({
  id: UUIDSchema,
  type: z.enum(['user', 'assistant']),
  content: z.string().min(1, 'Message content is required').max(1000, 'Message too long'),
  timestamp: z.date(),
  metadata: z.record(z.any()).optional(),
});

export const ChatRequestSchema = z.object({
  message: z.string()
    .min(1, 'Message is required')
    .max(1000, 'Message cannot exceed 1000 characters')
    .trim(),
  conversation_id: UUIDSchema.optional(),
  language: LanguageSchema,
  session_id: SessionIdSchema,
});

export const CreateConversationSchema = z.object({
  title: z.string().max(200, 'Title too long').optional(),
  language: LanguageSchema,
  session_id: SessionIdSchema,
  user_id: UUIDSchema.optional(),
});

export const UpdateConversationSchema = z.object({
  title: z.string().max(200, 'Title too long').optional(),
  summary: z.string().max(1000, 'Summary too long').optional(),
});

// 车型相关验证
export const CarCategorySchema = z.enum([
  'sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon',
  'pickup', 'van', 'minivan', 'crossover', 'luxury', 'sports',
  'electric', 'hybrid'
]);

export const FuelTypeSchema = z.enum([
  'gasoline', 'diesel', 'hybrid', 'electric', 'plug_in_hybrid',
  'hydrogen', 'cng', 'lpg'
]);

export const CarMakeSchema = z.string()
  .min(1, 'Car make is required')
  .max(50, 'Car make too long')
  .regex(REGEX_PATTERNS.carMake, 'Invalid car make format');

export const CarModelSchema = z.string()
  .min(1, 'Car model is required')
  .max(100, 'Car model too long')
  .regex(REGEX_PATTERNS.carModel, 'Invalid car model format');

export const YearSchema = z.number()
  .int('Year must be an integer')
  .min(1900, 'Year cannot be before 1900')
  .max(new Date().getFullYear() + 2, 'Year cannot be more than 2 years in the future');

export const PriceSchema = z.number()
  .min(0, 'Price cannot be negative')
  .max(1000000, 'Price cannot exceed $1,000,000');

export const RatingSchema = z.number()
  .min(0, 'Rating cannot be negative')
  .max(5, 'Rating cannot exceed 5');

export const FuelEconomySchema = z.number()
  .min(0, 'Fuel economy cannot be negative')
  .max(50, 'Fuel economy cannot exceed 50 L/100km');

export const CreateCarSchema = z.object({
  make: CarMakeSchema,
  model: CarModelSchema,
  year_min: YearSchema,
  year_max: YearSchema,
  price_min: PriceSchema.optional(),
  price_max: PriceSchema.optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').default('CAD'),
  category: CarCategorySchema,
  fuel_type: FuelTypeSchema,
  description_en: z.string().max(1000, 'English description too long').optional(),
  description_zh: z.string().max(1000, 'Chinese description too long').optional(),
  pros_en: z.array(z.string().max(200, 'Pro item too long')).optional(),
  pros_zh: z.array(z.string().max(200, 'Pro item too long')).optional(),
  cons_en: z.array(z.string().max(200, 'Con item too long')).optional(),
  cons_zh: z.array(z.string().max(200, 'Con item too long')).optional(),
  features: z.array(z.string().max(100, 'Feature too long')).default([]),
  image_url: UrlSchema.optional(),
  reliability_score: RatingSchema.optional(),
  fuel_economy: FuelEconomySchema.optional(),
  safety_rating: RatingSchema.optional(),
}).refine(
  (data) => data.year_min <= data.year_max,
  {
    message: 'Minimum year cannot be greater than maximum year',
    path: ['year_max'],
  }
).refine(
  (data) => !data.price_min || !data.price_max || data.price_min <= data.price_max,
  {
    message: 'Minimum price cannot be greater than maximum price',
    path: ['price_max'],
  }
);

export const UpdateCarSchema = z.object({
  make: CarMakeSchema.optional(),
  model: CarModelSchema.optional(),
  year_min: YearSchema.optional(),
  year_max: YearSchema.optional(),
  price_min: PriceSchema.optional(),
  price_max: PriceSchema.optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').optional(),
  category: CarCategorySchema.optional(),
  fuel_type: FuelTypeSchema.optional(),
  description_en: z.string().max(1000, 'English description too long').optional(),
  description_zh: z.string().max(1000, 'Chinese description too long').optional(),
  pros_en: z.array(z.string().max(200, 'Pro item too long')).optional(),
  pros_zh: z.array(z.string().max(200, 'Pro item too long')).optional(),
  cons_en: z.array(z.string().max(200, 'Con item too long')).optional(),
  cons_zh: z.array(z.string().max(200, 'Con item too long')).optional(),
  features: z.array(z.string().max(100, 'Feature too long')).optional(),
  image_url: UrlSchema.optional(),
  reliability_score: RatingSchema.optional(),
  fuel_economy: FuelEconomySchema.optional(),
  safety_rating: RatingSchema.optional(),
  is_active: z.boolean().optional(),
});

export const CarFiltersSchema = z.object({
  category: z.array(CarCategorySchema).optional(),
  fuel_type: z.array(FuelTypeSchema).optional(),
  make: z.array(CarMakeSchema).optional(),
  price_min: PriceSchema.optional(),
  price_max: PriceSchema.optional(),
  year_min: YearSchema.optional(),
  year_max: YearSchema.optional(),
  reliability_min: RatingSchema.optional(),
  fuel_economy_min: FuelEconomySchema.optional(),
  safety_rating_min: RatingSchema.optional(),
  features: z.array(z.string().max(100, 'Feature too long')).optional(),
}).refine(
  (data) => !data.year_min || !data.year_max || data.year_min <= data.year_max,
  {
    message: 'Minimum year cannot be greater than maximum year',
    path: ['year_max'],
  }
).refine(
  (data) => !data.price_min || !data.price_max || data.price_min <= data.price_max,
  {
    message: 'Minimum price cannot be greater than maximum price',
    path: ['price_max'],
  }
);

export const CarSearchSchema = z.object({
  query: z.string().max(200, 'Search query too long').optional(),
  filters: CarFiltersSchema.optional(),
  sort_by: z.enum([
    'price_min', 'price_max', 'year_min', 'year_max',
    'reliability_score', 'fuel_economy', 'safety_rating',
    'created_at', 'popularity'
  ]).optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  language: LanguageSchema.optional(),
});

// 用户相关验证
export const CreateUserSchema = z.object({
  email: EmailSchema.optional(),
  name: z.string().max(100, 'Name too long').optional(),
  language: LanguageSchema.default('zh'),
  session_id: SessionIdSchema,
});

export const UpdateUserSchema = z.object({
  email: EmailSchema.optional(),
  name: z.string().max(100, 'Name too long').optional(),
  language: LanguageSchema.optional(),
});

// 推荐相关验证
export const CreateRecommendationSchema = z.object({
  conversation_id: UUIDSchema,
  message_id: UUIDSchema,
  car_id: UUIDSchema,
  match_score: z.number().min(0, 'Match score cannot be negative').max(1, 'Match score cannot exceed 1'),
  reasoning_en: z.string().max(1000, 'English reasoning too long').optional(),
  reasoning_zh: z.string().max(1000, 'Chinese reasoning too long').optional(),
});

export const CreateNextStepSchema = z.object({
  conversation_id: UUIDSchema,
  message_id: UUIDSchema,
  title_en: z.string().min(1, 'English title is required').max(200, 'English title too long'),
  title_zh: z.string().min(1, 'Chinese title is required').max(200, 'Chinese title too long'),
  description_en: z.string().max(1000, 'English description too long').optional(),
  description_zh: z.string().max(1000, 'Chinese description too long').optional(),
  priority: z.enum(['high', 'medium', 'low']),
  action_type: z.enum(['research', 'visit', 'contact', 'prepare']),
});

// API 查询参数验证
export const ConversationsQuerySchema = z.object({
  user_id: UUIDSchema.optional(),
  session_id: SessionIdSchema.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  language: LanguageSchema.optional(),
});

export const CarsQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  category: CarCategorySchema.optional(),
  fuel_type: FuelTypeSchema.optional(),
  make: CarMakeSchema.optional(),
  price_min: PriceSchema.optional(),
  price_max: PriceSchema.optional(),
  year_min: YearSchema.optional(),
  year_max: YearSchema.optional(),
  sort_by: z.enum([
    'price_min', 'price_max', 'year_min', 'year_max',
    'reliability_score', 'fuel_economy', 'safety_rating',
    'created_at', 'popularity'
  ]).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  language: LanguageSchema.optional(),
});

export const RecommendationsQuerySchema = z.object({
  conversation_id: UUIDSchema.optional(),
  user_id: UUIDSchema.optional(),
  session_id: SessionIdSchema.optional(),
  limit: z.number().int().min(1).max(100).default(20),
  language: LanguageSchema.optional(),
});

// 文件上传验证
export const FileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  type: z.enum(['image', 'document']),
}).refine(
  (data) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedDocumentTypes = ['application/pdf', 'text/plain', 'application/msword'];
    
    if (data.type === 'image') {
      return allowedImageTypes.includes(data.file.type);
    } else if (data.type === 'document') {
      return allowedDocumentTypes.includes(data.file.type);
    }
    return false;
  },
  {
    message: 'Invalid file type',
    path: ['file'],
  }
).refine(
  (data) => data.file.size <= 5 * 1024 * 1024, // 5MB
  {
    message: 'File size cannot exceed 5MB',
    path: ['file'],
  }
);

// 通用验证工具函数
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError('Validation failed', errors);
  }
  return result.data;
}

export function validateQuery<T>(schema: z.ZodSchema<T>, searchParams: URLSearchParams): T {
  const data: Record<string, any> = {};
  
  searchParams.forEach((value, key) => {
    // 处理数组参数
    if (data[key]) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      // 尝试转换数字类型
      if (/^\d+$/.test(value)) {
        data[key] = parseInt(value, 10);
      } else if (/^\d+\.\d+$/.test(value)) {
        data[key] = parseFloat(value);
      } else if (value === 'true') {
        data[key] = true;
      } else if (value === 'false') {
        data[key] = false;
      } else {
        data[key] = value;
      }
    }
  });
  
  return validateRequest(schema, data);
}

export function validateJson<T>(schema: z.ZodSchema<T>, json: string): T {
  try {
    const data = JSON.parse(json);
    return validateRequest(schema, data);
  } catch (error) {
    throw new ValidationError('Invalid JSON format', []);
  }
}

// 自定义验证错误类
export class ValidationError extends Error {
  public readonly errors: Array<{ path: string; message: string }>;
  
  constructor(message: string, errors: Array<{ path: string; message: string }>) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// 验证中间件辅助函数
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    return validateRequest(schema, data);
  };
}

// 批量验证
export function validateBatch<T>(
  schema: z.ZodSchema<T>, 
  items: unknown[]
): { valid: T[]; invalid: Array<{ index: number; errors: Array<{ path: string; message: string }> }> } {
  const valid: T[] = [];
  const invalid: Array<{ index: number; errors: Array<{ path: string; message: string }> }> = [];
  
  items.forEach((item, index) => {
    try {
      const validItem = validateRequest(schema, item);
      valid.push(validItem);
    } catch (error) {
      if (error instanceof ValidationError) {
        invalid.push({ index, errors: error.errors });
      } else {
        invalid.push({ 
          index, 
          errors: [{ path: 'root', message: 'Unknown validation error' }] 
        });
      }
    }
  });
  
  return { valid, invalid };
}

// 条件验证
export function validateIf<T>(
  condition: boolean,
  schema: z.ZodSchema<T>,
  data: unknown
): T | null {
  if (!condition) {
    return null;
  }
  return validateRequest(schema, data);
}

// 部分验证 (只验证存在的字段)
export function validatePartial<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  data: unknown
): Partial<z.infer<z.ZodObject<T>>> {
  const partialSchema = schema.partial();
  return validateRequest(partialSchema, data);
}

// 类型导出
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type CreateConversation = z.infer<typeof CreateConversationSchema>;
export type UpdateConversation = z.infer<typeof UpdateConversationSchema>;
export type CreateCar = z.infer<typeof CreateCarSchema>;
export type UpdateCar = z.infer<typeof UpdateCarSchema>;
export type CarFilters = z.infer<typeof CarFiltersSchema>;
export type CarSearch = z.infer<typeof CarSearchSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type CreateRecommendation = z.infer<typeof CreateRecommendationSchema>;
export type CreateNextStep = z.infer<typeof CreateNextStepSchema>;
export type ConversationsQuery = z.infer<typeof ConversationsQuerySchema>;
export type CarsQuery = z.infer<typeof CarsQuerySchema>;
export type RecommendationsQuery = z.infer<typeof RecommendationsQuerySchema>;
export type FileUpload = z.infer<typeof FileUploadSchema>; 