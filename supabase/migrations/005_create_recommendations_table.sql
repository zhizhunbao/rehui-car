-- 005_create_recommendations_table.sql
-- 创建推荐表，用于存储AI生成的汽车推荐结果

-- 创建推荐表
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  match_score DECIMAL(3,2) NOT NULL CHECK (match_score BETWEEN 0 AND 1),
  reasoning_en TEXT,
  reasoning_zh TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_recommendations_conversation_id ON public.recommendations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_message_id ON public.recommendations(message_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_car_id ON public.recommendations(car_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_match_score ON public.recommendations(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_created_at ON public.recommendations(created_at DESC);

-- 创建复合索引
CREATE INDEX IF NOT EXISTS idx_recommendations_conversation_message ON public.recommendations(conversation_id, message_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_car_score ON public.recommendations(car_id, match_score DESC);

-- 添加表注释
COMMENT ON TABLE public.recommendations IS '推荐表，存储AI生成的汽车推荐结果';
COMMENT ON COLUMN public.recommendations.id IS '推荐记录唯一标识符';
COMMENT ON COLUMN public.recommendations.conversation_id IS '所属对话的ID';
COMMENT ON COLUMN public.recommendations.message_id IS '触发推荐的消息ID';
COMMENT ON COLUMN public.recommendations.car_id IS '被推荐的车型ID';
COMMENT ON COLUMN public.recommendations.match_score IS '匹配度评分（0-1之间）';
COMMENT ON COLUMN public.recommendations.reasoning_en IS '英文推荐理由';
COMMENT ON COLUMN public.recommendations.reasoning_zh IS '中文推荐理由';
COMMENT ON COLUMN public.recommendations.created_at IS '推荐生成时间';

-- 启用行级安全策略（RLS）
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略：用户只能访问自己对话中的推荐
CREATE POLICY "Users can view own recommendations" ON public.recommendations
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE session_id = current_setting('app.current_session_id', true) OR
            user_id IN (SELECT id FROM public.users WHERE session_id = current_setting('app.current_session_id', true))
    )
  );

CREATE POLICY "Users can insert own recommendations" ON public.recommendations
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE session_id = current_setting('app.current_session_id', true) OR
            user_id IN (SELECT id FROM public.users WHERE session_id = current_setting('app.current_session_id', true))
    )
  );

-- 创建推荐统计视图
CREATE OR REPLACE VIEW public.recommendation_stats AS
SELECT 
  c.make,
  c.model,
  c.category,
  COUNT(*) as recommendation_count,
  AVG(r.match_score) as avg_match_score,
  MAX(r.match_score) as max_match_score,
  COUNT(DISTINCT r.conversation_id) as unique_conversations
FROM public.recommendations r
JOIN public.cars c ON r.car_id = c.id
WHERE c.is_active = true
GROUP BY c.make, c.model, c.category
ORDER BY recommendation_count DESC, avg_match_score DESC;

COMMENT ON VIEW public.recommendation_stats IS '推荐统计视图，按车型统计推荐次数和评分';

-- 创建高质量推荐视图
CREATE OR REPLACE VIEW public.high_quality_recommendations AS
SELECT 
  r.*,
  c.make,
  c.model,
  c.category,
  c.fuel_type,
  c.price_min,
  c.price_max,
  conv.language as conversation_language
FROM public.recommendations r
JOIN public.cars c ON r.car_id = c.id
JOIN public.conversations conv ON r.conversation_id = conv.id
WHERE r.match_score >= 0.8
  AND c.is_active = true
ORDER BY r.match_score DESC, r.created_at DESC;

COMMENT ON VIEW public.high_quality_recommendations IS '高质量推荐视图，显示匹配度>=0.8的推荐';

-- 创建推荐趋势视图
CREATE OR REPLACE VIEW public.recommendation_trends AS
SELECT 
  DATE_TRUNC('day', r.created_at) as recommendation_date,
  c.category,
  c.fuel_type,
  COUNT(*) as daily_recommendations,
  AVG(r.match_score) as avg_daily_score
FROM public.recommendations r
JOIN public.cars c ON r.car_id = c.id
WHERE r.created_at >= NOW() - INTERVAL '30 days'
  AND c.is_active = true
GROUP BY DATE_TRUNC('day', r.created_at), c.category, c.fuel_type
ORDER BY recommendation_date DESC, daily_recommendations DESC;

COMMENT ON VIEW public.recommendation_trends IS '推荐趋势视图，显示最近30天的推荐趋势';

-- 创建获取用户推荐历史函数
CREATE OR REPLACE FUNCTION get_user_recommendation_history(
  user_session_id TEXT,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE(
  recommendation_id UUID,
  car_make TEXT,
  car_model TEXT,
  match_score DECIMAL(3,2),
  reasoning TEXT,
  conversation_title TEXT,
  recommended_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as recommendation_id,
    c.make as car_make,
    c.model as car_model,
    r.match_score,
    CASE 
      WHEN conv.language = 'zh' THEN COALESCE(r.reasoning_zh, r.reasoning_en, '')
      ELSE COALESCE(r.reasoning_en, r.reasoning_zh, '')
    END as reasoning,
    conv.title as conversation_title,
    r.created_at as recommended_at
  FROM public.recommendations r
  JOIN public.cars c ON r.car_id = c.id
  JOIN public.conversations conv ON r.conversation_id = conv.id
  WHERE conv.session_id = user_session_id
    AND c.is_active = true
  ORDER BY r.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_recommendation_history(TEXT, INTEGER) IS '获取用户的推荐历史记录';

-- 创建获取相似推荐函数
CREATE OR REPLACE FUNCTION get_similar_recommendations(
  target_car_id UUID,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(
  car_id UUID,
  make TEXT,
  model TEXT,
  category TEXT,
  fuel_type TEXT,
  avg_match_score DECIMAL(5,3),
  recommendation_count BIGINT,
  similarity_score DECIMAL(5,3)
) AS $$
BEGIN
  RETURN QUERY
  WITH target_car AS (
    SELECT c.category, c.fuel_type, c.price_min, c.price_max
    FROM public.cars c
    WHERE c.id = target_car_id
  ),
  similar_recommendations AS (
    SELECT 
      r.car_id,
      AVG(r.match_score) as avg_match_score,
      COUNT(*) as recommendation_count
    FROM public.recommendations r
    JOIN public.cars c ON r.car_id = c.id
    JOIN target_car tc ON (
      c.category = tc.category 
      OR c.fuel_type = tc.fuel_type
      OR (c.price_min <= tc.price_max AND c.price_max >= tc.price_min)
    )
    WHERE c.id != target_car_id
      AND c.is_active = true
    GROUP BY r.car_id
  )
  SELECT 
    c.id as car_id,
    c.make,
    c.model,
    c.category,
    c.fuel_type,
    sr.avg_match_score,
    sr.recommendation_count,
    -- 计算相似度评分
    (
      CASE WHEN c.category = tc.category THEN 0.4 ELSE 0 END +
      CASE WHEN c.fuel_type = tc.fuel_type THEN 0.3 ELSE 0 END +
      CASE 
        WHEN c.price_min <= tc.price_max AND c.price_max >= tc.price_min THEN 0.3
        ELSE 0 
      END
    )::DECIMAL(5,3) as similarity_score
  FROM similar_recommendations sr
  JOIN public.cars c ON sr.car_id = c.id
  CROSS JOIN target_car tc
  ORDER BY similarity_score DESC, sr.avg_match_score DESC, sr.recommendation_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_similar_recommendations(UUID, INTEGER) IS '获取与指定车型相似的推荐车型';

-- 创建推荐质量评估函数
CREATE OR REPLACE FUNCTION evaluate_recommendation_quality()
RETURNS TABLE(
  quality_tier TEXT,
  recommendation_count BIGINT,
  avg_score DECIMAL(5,3),
  percentage DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  WITH quality_tiers AS (
    SELECT 
      CASE 
        WHEN match_score >= 0.9 THEN 'Excellent (0.9+)'
        WHEN match_score >= 0.8 THEN 'Very Good (0.8-0.89)'
        WHEN match_score >= 0.7 THEN 'Good (0.7-0.79)'
        WHEN match_score >= 0.6 THEN 'Fair (0.6-0.69)'
        ELSE 'Poor (<0.6)'
      END as quality_tier,
      match_score
    FROM public.recommendations
    WHERE created_at >= NOW() - INTERVAL '30 days'
  ),
  total_count AS (
    SELECT COUNT(*) as total FROM quality_tiers
  )
  SELECT 
    qt.quality_tier,
    COUNT(*)::BIGINT as recommendation_count,
    AVG(qt.match_score)::DECIMAL(5,3) as avg_score,
    (COUNT(*) * 100.0 / tc.total)::DECIMAL(5,2) as percentage
  FROM quality_tiers qt
  CROSS JOIN total_count tc
  GROUP BY qt.quality_tier, tc.total
  ORDER BY AVG(qt.match_score) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION evaluate_recommendation_quality() IS '评估推荐质量分布（最近30天）';

-- 创建热门车型视图（现在可以安全创建，因为recommendations表已存在）
CREATE OR REPLACE VIEW public.popular_cars AS
SELECT 
  c.*,
  COALESCE(r.recommendation_count, 0) as recommendation_count
FROM public.cars c
LEFT JOIN (
  SELECT 
    car_id, 
    COUNT(*) as recommendation_count
  FROM public.recommendations 
  GROUP BY car_id
) r ON c.id = r.car_id
WHERE c.is_active = true
ORDER BY COALESCE(r.recommendation_count, 0) DESC, c.reliability_score DESC NULLS LAST
LIMIT 20;

COMMENT ON VIEW public.popular_cars IS '热门车型视图，按推荐次数和可靠性排序'; 