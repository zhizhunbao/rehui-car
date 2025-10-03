-- 004_create_cars_table.sql
-- 创建车型表，用于存储汽车的详细信息

-- 创建车型表
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year_min INTEGER NOT NULL,
  year_max INTEGER NOT NULL,
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  currency TEXT DEFAULT 'CAD',
  category TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  pros_en TEXT[],
  pros_zh TEXT[],
  cons_en TEXT[],
  cons_zh TEXT[],
  features TEXT[],
  image_url TEXT,
  reliability_score DECIMAL(3,2) CHECK (reliability_score BETWEEN 0 AND 5),
  fuel_economy DECIMAL(4,1),
  safety_rating DECIMAL(3,2) CHECK (safety_rating BETWEEN 0 AND 5),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_cars_make_model ON public.cars(make, model);
CREATE INDEX IF NOT EXISTS idx_cars_category ON public.cars(category);
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON public.cars(fuel_type);
CREATE INDEX IF NOT EXISTS idx_cars_price_range ON public.cars(price_min, price_max);
CREATE INDEX IF NOT EXISTS idx_cars_year_range ON public.cars(year_min, year_max);
CREATE INDEX IF NOT EXISTS idx_cars_active ON public.cars(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_cars_reliability ON public.cars(reliability_score DESC) WHERE reliability_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cars_safety ON public.cars(safety_rating DESC) WHERE safety_rating IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cars_fuel_economy ON public.cars(fuel_economy) WHERE fuel_economy IS NOT NULL;

-- 创建GIN索引用于数组字段搜索
CREATE INDEX IF NOT EXISTS idx_cars_features ON public.cars USING GIN (features);
CREATE INDEX IF NOT EXISTS idx_cars_pros_en ON public.cars USING GIN (pros_en);
CREATE INDEX IF NOT EXISTS idx_cars_pros_zh ON public.cars USING GIN (pros_zh);

-- 创建全文搜索索引
CREATE INDEX IF NOT EXISTS idx_cars_search_en ON public.cars USING GIN (
  to_tsvector('english', COALESCE(make, '') || ' ' || COALESCE(model, '') || ' ' || COALESCE(description_en, ''))
);
CREATE INDEX IF NOT EXISTS idx_cars_search_zh ON public.cars USING GIN (
  to_tsvector('simple', COALESCE(make, '') || ' ' || COALESCE(model, '') || ' ' || COALESCE(description_zh, ''))
);

-- 添加表注释
COMMENT ON TABLE public.cars IS '车型信息表，存储汽车的详细信息和规格';
COMMENT ON COLUMN public.cars.id IS '车型唯一标识符';
COMMENT ON COLUMN public.cars.make IS '汽车品牌';
COMMENT ON COLUMN public.cars.model IS '汽车型号';
COMMENT ON COLUMN public.cars.year_min IS '最小年份';
COMMENT ON COLUMN public.cars.year_max IS '最大年份';
COMMENT ON COLUMN public.cars.price_min IS '最低价格';
COMMENT ON COLUMN public.cars.price_max IS '最高价格';
COMMENT ON COLUMN public.cars.currency IS '价格货币单位';
COMMENT ON COLUMN public.cars.category IS '车型类别（轿车、SUV、卡车等）';
COMMENT ON COLUMN public.cars.fuel_type IS '燃料类型（汽油、混动、电动等）';
COMMENT ON COLUMN public.cars.description_en IS '英文描述';
COMMENT ON COLUMN public.cars.description_zh IS '中文描述';
COMMENT ON COLUMN public.cars.pros_en IS '英文优点列表';
COMMENT ON COLUMN public.cars.pros_zh IS '中文优点列表';
COMMENT ON COLUMN public.cars.cons_en IS '英文缺点列表';
COMMENT ON COLUMN public.cars.cons_zh IS '中文缺点列表';
COMMENT ON COLUMN public.cars.features IS '特性列表';
COMMENT ON COLUMN public.cars.image_url IS '车型图片URL';
COMMENT ON COLUMN public.cars.reliability_score IS '可靠性评分（0-5分）';
COMMENT ON COLUMN public.cars.fuel_economy IS '燃油经济性（升/100公里）';
COMMENT ON COLUMN public.cars.safety_rating IS '安全评级（0-5分）';
COMMENT ON COLUMN public.cars.is_active IS '是否激活状态';
COMMENT ON COLUMN public.cars.created_at IS '创建时间';
COMMENT ON COLUMN public.cars.updated_at IS '最后更新时间';

-- 启用行级安全策略（RLS）
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略：所有用户都可以查看激活的车型
CREATE POLICY "Anyone can view active cars" ON public.cars
  FOR SELECT USING (is_active = true);

-- 创建车型统计视图
CREATE OR REPLACE VIEW public.car_stats AS
SELECT 
  make,
  category,
  fuel_type,
  COUNT(*) as total_models,
  AVG(price_min) as avg_min_price,
  AVG(price_max) as avg_max_price,
  AVG(reliability_score) as avg_reliability,
  AVG(fuel_economy) as avg_fuel_economy,
  AVG(safety_rating) as avg_safety_rating
FROM public.cars 
WHERE is_active = true
GROUP BY make, category, fuel_type
ORDER BY make, category;

COMMENT ON VIEW public.car_stats IS '车型统计信息视图，按品牌、类别、燃料类型分组统计';

-- 创建热门车型视图（暂时注释，等recommendations表创建后再启用）
-- CREATE OR REPLACE VIEW public.popular_cars AS
-- SELECT 
--   c.*,
--   COALESCE(r.recommendation_count, 0) as recommendation_count
-- FROM public.cars c
-- LEFT JOIN (
--   SELECT 
--     car_id, 
--     COUNT(*) as recommendation_count
--   FROM public.recommendations 
--   GROUP BY car_id
-- ) r ON c.id = r.car_id
-- WHERE c.is_active = true
-- ORDER BY COALESCE(r.recommendation_count, 0) DESC, c.reliability_score DESC NULLS LAST
-- LIMIT 20;

-- COMMENT ON VIEW public.popular_cars IS '热门车型视图，按推荐次数和可靠性排序';

-- 创建价格区间统计函数
CREATE OR REPLACE FUNCTION get_price_ranges()
RETURNS TABLE(
  price_range TEXT,
  car_count BIGINT,
  avg_reliability NUMERIC,
  avg_safety NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN price_max <= 15000 THEN 'Under $15K'
      WHEN price_max <= 30000 THEN '$15K - $30K'
      WHEN price_max <= 50000 THEN '$30K - $50K'
      WHEN price_max <= 75000 THEN '$50K - $75K'
      ELSE 'Over $75K'
    END as price_range,
    COUNT(*) as car_count,
    ROUND(AVG(reliability_score), 2) as avg_reliability,
    ROUND(AVG(safety_rating), 2) as avg_safety
  FROM public.cars
  WHERE is_active = true AND price_max IS NOT NULL
  GROUP BY 
    CASE 
      WHEN price_max <= 15000 THEN 'Under $15K'
      WHEN price_max <= 30000 THEN '$15K - $30K'
      WHEN price_max <= 50000 THEN '$30K - $50K'
      WHEN price_max <= 75000 THEN '$50K - $75K'
      ELSE 'Over $75K'
    END
  ORDER BY MIN(price_max);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_price_ranges() IS '获取价格区间统计信息';

-- 创建车型搜索函数
CREATE OR REPLACE FUNCTION search_cars(
  search_query TEXT,
  search_language TEXT DEFAULT 'en',
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE(
  id UUID,
  make TEXT,
  model TEXT,
  year_range TEXT,
  price_range TEXT,
  category TEXT,
  fuel_type TEXT,
  description TEXT,
  search_rank REAL
) AS $$
BEGIN
  IF search_language = 'zh' THEN
    RETURN QUERY
    SELECT 
      c.id,
      c.make,
      c.model,
      CASE 
        WHEN c.year_min = c.year_max THEN c.year_min::TEXT
        ELSE c.year_min::TEXT || '-' || c.year_max::TEXT
      END as year_range,
      CASE 
        WHEN c.price_min IS NOT NULL AND c.price_max IS NOT NULL THEN
          '$' || c.price_min::TEXT || ' - $' || c.price_max::TEXT
        ELSE 'Price varies'
      END as price_range,
      c.category,
      c.fuel_type,
      COALESCE(c.description_zh, c.description_en, '') as description,
      ts_rank(
        to_tsvector('simple', COALESCE(c.make, '') || ' ' || COALESCE(c.model, '') || ' ' || COALESCE(c.description_zh, '')),
        plainto_tsquery('simple', search_query)
      ) as search_rank
    FROM public.cars c
    WHERE c.is_active = true
      AND (
        to_tsvector('simple', COALESCE(c.make, '') || ' ' || COALESCE(c.model, '') || ' ' || COALESCE(c.description_zh, ''))
        @@ plainto_tsquery('simple', search_query)
        OR c.make ILIKE '%' || search_query || '%'
        OR c.model ILIKE '%' || search_query || '%'
      )
    ORDER BY search_rank DESC, c.reliability_score DESC NULLS LAST
    LIMIT limit_count;
  ELSE
    RETURN QUERY
    SELECT 
      c.id,
      c.make,
      c.model,
      CASE 
        WHEN c.year_min = c.year_max THEN c.year_min::TEXT
        ELSE c.year_min::TEXT || '-' || c.year_max::TEXT
      END as year_range,
      CASE 
        WHEN c.price_min IS NOT NULL AND c.price_max IS NOT NULL THEN
          '$' || c.price_min::TEXT || ' - $' || c.price_max::TEXT
        ELSE 'Price varies'
      END as price_range,
      c.category,
      c.fuel_type,
      COALESCE(c.description_en, c.description_zh, '') as description,
      ts_rank(
        to_tsvector('english', COALESCE(c.make, '') || ' ' || COALESCE(c.model, '') || ' ' || COALESCE(c.description_en, '')),
        plainto_tsquery('english', search_query)
      ) as search_rank
    FROM public.cars c
    WHERE c.is_active = true
      AND (
        to_tsvector('english', COALESCE(c.make, '') || ' ' || COALESCE(c.model, '') || ' ' || COALESCE(c.description_en, ''))
        @@ plainto_tsquery('english', search_query)
        OR c.make ILIKE '%' || search_query || '%'
        OR c.model ILIKE '%' || search_query || '%'
      )
    ORDER BY search_rank DESC, c.reliability_score DESC NULLS LAST
    LIMIT limit_count;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION search_cars(TEXT, TEXT, INTEGER) IS '车型搜索函数，支持中英文全文搜索'; 