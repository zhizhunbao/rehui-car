import { BilingualText, Language } from './index';

// 车型基础类型
export interface Car {
  id: string;
  make: string;
  model: string;
  year_min: number;
  year_max: number;
  price_min?: number;
  price_max?: number;
  currency: string;
  category: string;
  fuel_type: string;
  description_en?: string;
  description_zh?: string;
  pros_en?: string[];
  pros_zh?: string[];
  cons_en?: string[];
  cons_zh?: string[];
  features: string[];
  image_url?: string;
  reliability_score?: number;
  fuel_economy?: number;
  safety_rating?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// 车型推荐类型
export interface CarRecommendation {
  id: string;
  car: Car;
  match_score: number;
  reasoning: BilingualText;
  recommendation_factors?: RecommendationFactor[];
}

// 推荐因子
export interface RecommendationFactor {
  factor: string;
  weight: number;
  score: number;
  description: BilingualText;
}

// 下一步建议类型
export interface NextStep {
  id: string;
  title: BilingualText;
  description: BilingualText;
  priority: 'high' | 'medium' | 'low';
  action_type: 'research' | 'visit' | 'contact' | 'prepare';
  estimated_time?: string;
  resources?: CarResource[];
}

// 车辆评价类型
export interface CarReview {
  id: string;
  car_id: string;
  rating: number;
  comment: BilingualText;
  author: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: Date;
  pros?: string[];
  cons?: string[];
}

// 车辆可用性类型
export interface CarAvailability {
  in_stock: boolean;
  estimated_delivery: string;
  available_colors?: string[];
  available_trims?: string[];
  dealer_count?: number;
  last_updated: Date;
}

// 车型筛选器类型
export interface CarFilters {
  category?: string[];
  fuel_type?: string[];
  make?: string[];
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  reliability_min?: number;
  fuel_economy_min?: number;
  safety_rating_min?: number;
  features?: string[];
}

// 车型搜索参数
export interface CarSearchParams {
  query?: string;
  filters?: CarFilters;
  sort_by?: CarSortField;
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  language?: Language;
}

// 车型排序字段
export type CarSortField = 
  | 'price_min'
  | 'price_max' 
  | 'year_min'
  | 'year_max'
  | 'reliability_score'
  | 'fuel_economy'
  | 'safety_rating'
  | 'created_at'
  | 'popularity';

// 车型搜索结果
export interface CarSearchResult {
  cars: Car[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  search_query?: string;
  applied_filters?: CarFilters;
  suggestions?: string[];
  facets?: SearchFacets;
}

// 搜索分面
export interface SearchFacets {
  categories: FacetItem[];
  fuel_types: FacetItem[];
  makes: FacetItem[];
  price_ranges: PriceRangeFacet[];
  year_ranges: YearRangeFacet[];
}

// 分面项
export interface FacetItem {
  value: string;
  label: BilingualText;
  count: number;
}

// 价格范围分面
export interface PriceRangeFacet {
  min: number;
  max: number;
  label: BilingualText;
  count: number;
}

// 年份范围分面
export interface YearRangeFacet {
  min: number;
  max: number;
  label: string;
  count: number;
}

// 车型比较
export interface CarComparison {
  cars: Car[];
  comparison_fields: ComparisonField[];
  winner_by_field: Record<string, string>; // field -> car_id
}

// 比较字段
export interface ComparisonField {
  key: keyof Car;
  label: BilingualText;
  type: 'number' | 'string' | 'array' | 'boolean';
  format?: 'currency' | 'percentage' | 'rating';
  higher_is_better?: boolean;
}

// 车型统计
export interface CarStatistics {
  total_cars: number;
  categories: Record<string, number>;
  fuel_types: Record<string, number>;
  makes: Record<string, number>;
  price_distribution: PriceDistribution;
  year_distribution: YearDistribution;
  average_ratings: AverageRatings;
}

// 价格分布
export interface PriceDistribution {
  under_15k: number;
  '15k_30k': number;
  '30k_50k': number;
  '50k_75k': number;
  over_75k: number;
}

// 年份分布
export interface YearDistribution {
  '2020_plus': number;
  '2015_2019': number;
  '2010_2014': number;
  '2005_2009': number;
  before_2005: number;
}

// 平均评分
export interface AverageRatings {
  overall: number;
  reliability: number;
  fuel_economy: number;
  safety: number;
  value_for_money: number;
}

// 车型资源（购买渠道等）
export interface CarResource {
  name: string;
  url: string;
  description: BilingualText;
  type: 'marketplace' | 'dealer' | 'review' | 'financing' | 'insurance';
  rating?: number;
  is_recommended?: boolean;
}

// 车型创建数据
export interface CreateCarData {
  make: string;
  model: string;
  year_min: number;
  year_max: number;
  price_min?: number;
  price_max?: number;
  currency?: string;
  category: string;
  fuel_type: string;
  description_en?: string;
  description_zh?: string;
  pros_en?: string[];
  pros_zh?: string[];
  cons_en?: string[];
  cons_zh?: string[];
  features?: string[];
  image_url?: string;
  reliability_score?: number;
  fuel_economy?: number;
  safety_rating?: number;
}

// 车型更新数据
export interface UpdateCarData extends Partial<CreateCarData> {
  is_active?: boolean;
}

// 车型导入数据
export interface CarImportData {
  cars: CreateCarData[];
  source: string;
  import_date: Date;
  validation_results?: ValidationResult[];
}

// 验证结果
export interface ValidationResult {
  row: number;
  field: string;
  error: string;
  severity: 'error' | 'warning';
} 