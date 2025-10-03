-- 007_create_functions_triggers.sql
-- 创建数据库函数和触发器，用于自动更新时间戳、数据验证等

-- =============================================
-- 通用函数
-- =============================================

-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS '自动更新updated_at字段为当前时间';

-- 创建生成友好ID函数
CREATE OR REPLACE FUNCTION generate_friendly_id(prefix TEXT DEFAULT '')
RETURNS TEXT AS $$
BEGIN
  RETURN prefix || LOWER(
    SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8) || 
    SUBSTRING(gen_random_uuid()::TEXT FROM 10 FOR 4)
  );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_friendly_id(TEXT) IS '生成友好的短ID，可选前缀';

-- =============================================
-- 自动更新触发器
-- =============================================

-- 用户表更新触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 对话表更新触发器
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 车型表更新触发器
DROP TRIGGER IF EXISTS update_cars_updated_at ON public.cars;
CREATE TRIGGER update_cars_updated_at 
  BEFORE UPDATE ON public.cars
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 对话相关函数
-- =============================================

-- 自动生成对话标题函数
CREATE OR REPLACE FUNCTION auto_generate_conversation_title()
RETURNS TRIGGER AS $$
DECLARE
  first_message TEXT;
  generated_title TEXT;
BEGIN
  -- 如果标题为空，根据第一条用户消息生成标题
  IF NEW.title IS NULL OR NEW.title = '' THEN
    SELECT content INTO first_message
    FROM public.messages 
    WHERE conversation_id = NEW.id 
      AND type = 'user' 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    IF first_message IS NOT NULL THEN
      -- 截取前50个字符作为标题
      generated_title := SUBSTRING(first_message FROM 1 FOR 50);
      IF LENGTH(first_message) > 50 THEN
        generated_title := generated_title || '...';
      END IF;
      NEW.title := generated_title;
    ELSE
      -- 默认标题
      NEW.title := CASE 
        WHEN NEW.language = 'zh' THEN '新对话'
        ELSE 'New Conversation'
      END;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auto_generate_conversation_title() IS '自动生成对话标题';

-- 对话标题自动生成触发器
DROP TRIGGER IF EXISTS auto_title_conversations ON public.conversations;
CREATE TRIGGER auto_title_conversations
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  WHEN (NEW.title IS NULL OR NEW.title = '')
  EXECUTE FUNCTION auto_generate_conversation_title();

-- =============================================
-- 消息相关函数
-- =============================================

-- 更新对话最后活动时间函数
CREATE OR REPLACE FUNCTION update_conversation_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新对话的updated_at时间
  UPDATE public.conversations 
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_conversation_activity() IS '当有新消息时更新对话的活动时间';

-- 消息插入触发器
DROP TRIGGER IF EXISTS update_conversation_on_message ON public.messages;
CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_activity();

-- =============================================
-- 数据验证函数
-- =============================================

-- 验证车型数据完整性函数
CREATE OR REPLACE FUNCTION validate_car_data()
RETURNS TRIGGER AS $$
BEGIN
  -- 验证年份范围
  IF NEW.year_min > NEW.year_max THEN
    RAISE EXCEPTION 'year_min cannot be greater than year_max';
  END IF;
  
  -- 验证价格范围
  IF NEW.price_min IS NOT NULL AND NEW.price_max IS NOT NULL THEN
    IF NEW.price_min > NEW.price_max THEN
      RAISE EXCEPTION 'price_min cannot be greater than price_max';
    END IF;
  END IF;
  
  -- 验证评分范围
  IF NEW.reliability_score IS NOT NULL THEN
    IF NEW.reliability_score < 0 OR NEW.reliability_score > 5 THEN
      RAISE EXCEPTION 'reliability_score must be between 0 and 5';
    END IF;
  END IF;
  
  IF NEW.safety_rating IS NOT NULL THEN
    IF NEW.safety_rating < 0 OR NEW.safety_rating > 5 THEN
      RAISE EXCEPTION 'safety_rating must be between 0 and 5';
    END IF;
  END IF;
  
  -- 确保至少有一种语言的描述
  IF (NEW.description_en IS NULL OR NEW.description_en = '') AND 
     (NEW.description_zh IS NULL OR NEW.description_zh = '') THEN
    RAISE EXCEPTION 'At least one description (English or Chinese) is required';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION validate_car_data() IS '验证车型数据的完整性和有效性';

-- 车型数据验证触发器
DROP TRIGGER IF EXISTS validate_car_data_trigger ON public.cars;
CREATE TRIGGER validate_car_data_trigger
  BEFORE INSERT OR UPDATE ON public.cars
  FOR EACH ROW
  EXECUTE FUNCTION validate_car_data();

-- =============================================
-- 统计和分析函数
-- =============================================

-- 获取系统统计信息函数
CREATE OR REPLACE FUNCTION get_system_stats()
RETURNS TABLE(
  total_users BIGINT,
  total_conversations BIGINT,
  total_messages BIGINT,
  total_cars BIGINT,
  total_recommendations BIGINT,
  active_conversations_24h BIGINT,
  avg_messages_per_conversation DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.users) as total_users,
    (SELECT COUNT(*) FROM public.conversations) as total_conversations,
    (SELECT COUNT(*) FROM public.messages) as total_messages,
    (SELECT COUNT(*) FROM public.cars WHERE is_active = true) as total_cars,
    (SELECT COUNT(*) FROM public.recommendations) as total_recommendations,
    (SELECT COUNT(*) FROM public.conversations WHERE updated_at >= NOW() - INTERVAL '24 hours') as active_conversations_24h,
    (SELECT 
      CASE 
        WHEN COUNT(DISTINCT conversation_id) > 0 THEN
          COUNT(*)::DECIMAL / COUNT(DISTINCT conversation_id)
        ELSE 0
      END
      FROM public.messages
    ) as avg_messages_per_conversation;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_system_stats() IS '获取系统整体统计信息';

-- 清理旧数据函数
CREATE OR REPLACE FUNCTION cleanup_old_data(
  days_to_keep INTEGER DEFAULT 90
)
RETURNS TABLE(
  deleted_conversations BIGINT,
  deleted_messages BIGINT,
  deleted_recommendations BIGINT,
  deleted_next_steps BIGINT
) AS $$
DECLARE
  cutoff_date TIMESTAMP WITH TIME ZONE;
  conv_count BIGINT;
  msg_count BIGINT;
  rec_count BIGINT;
  step_count BIGINT;
BEGIN
  cutoff_date := NOW() - INTERVAL '1 day' * days_to_keep;
  
  -- 计算要删除的记录数
  SELECT COUNT(*) INTO conv_count
  FROM public.conversations 
  WHERE updated_at < cutoff_date;
  
  SELECT COUNT(*) INTO msg_count
  FROM public.messages m
  JOIN public.conversations c ON m.conversation_id = c.id
  WHERE c.updated_at < cutoff_date;
  
  SELECT COUNT(*) INTO rec_count
  FROM public.recommendations r
  JOIN public.conversations c ON r.conversation_id = c.id
  WHERE c.updated_at < cutoff_date;
  
  SELECT COUNT(*) INTO step_count
  FROM public.next_steps ns
  JOIN public.conversations c ON ns.conversation_id = c.id
  WHERE c.updated_at < cutoff_date;
  
  -- 删除旧对话（级联删除相关数据）
  DELETE FROM public.conversations 
  WHERE updated_at < cutoff_date;
  
  RETURN QUERY SELECT conv_count, msg_count, rec_count, step_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_data(INTEGER) IS '清理指定天数之前的旧数据';

-- =============================================
-- 搜索和推荐函数
-- =============================================

-- 智能车型推荐函数
CREATE OR REPLACE FUNCTION get_smart_car_recommendations(
  user_preferences JSONB DEFAULT '{}',
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(
  car_id UUID,
  make TEXT,
  model TEXT,
  category TEXT,
  fuel_type TEXT,
  price_range TEXT,
  match_score DECIMAL(5,3),
  recommendation_reason TEXT
) AS $$
DECLARE
  budget_min DECIMAL := COALESCE((user_preferences->>'budget_min')::DECIMAL, 0);
  budget_max DECIMAL := COALESCE((user_preferences->>'budget_max')::DECIMAL, 999999);
  preferred_category TEXT := user_preferences->>'category';
  preferred_fuel_type TEXT := user_preferences->>'fuel_type';
  min_reliability DECIMAL := COALESCE((user_preferences->>'min_reliability')::DECIMAL, 0);
  min_safety DECIMAL := COALESCE((user_preferences->>'min_safety')::DECIMAL, 0);
BEGIN
  RETURN QUERY
  SELECT 
    c.id as car_id,
    c.make,
    c.model,
    c.category,
    c.fuel_type,
    CASE 
      WHEN c.price_min IS NOT NULL AND c.price_max IS NOT NULL THEN
        '$' || c.price_min::TEXT || ' - $' || c.price_max::TEXT
      ELSE 'Price varies'
    END as price_range,
    -- 计算匹配分数
    (
      -- 价格匹配 (30%)
      CASE 
        WHEN c.price_min IS NULL OR c.price_max IS NULL THEN 0.15
        WHEN c.price_min <= budget_max AND c.price_max >= budget_min THEN 0.3
        ELSE 0
      END +
      -- 类别匹配 (25%)
      CASE 
        WHEN preferred_category IS NULL OR c.category = preferred_category THEN 0.25
        ELSE 0
      END +
      -- 燃料类型匹配 (20%)
      CASE 
        WHEN preferred_fuel_type IS NULL OR c.fuel_type = preferred_fuel_type THEN 0.2
        ELSE 0
      END +
      -- 可靠性评分 (15%)
      CASE 
        WHEN c.reliability_score IS NULL THEN 0.075
        WHEN c.reliability_score >= min_reliability THEN (c.reliability_score / 5.0) * 0.15
        ELSE 0
      END +
      -- 安全评分 (10%)
      CASE 
        WHEN c.safety_rating IS NULL THEN 0.05
        WHEN c.safety_rating >= min_safety THEN (c.safety_rating / 5.0) * 0.1
        ELSE 0
      END
    )::DECIMAL(5,3) as match_score,
    -- 推荐理由
    CONCAT(
      CASE 
        WHEN c.price_min <= budget_max AND c.price_max >= budget_min THEN 'Within budget. '
        ELSE ''
      END,
      CASE 
        WHEN c.category = preferred_category THEN 'Matches preferred category. '
        ELSE ''
      END,
      CASE 
        WHEN c.fuel_type = preferred_fuel_type THEN 'Matches fuel preference. '
        ELSE ''
      END,
      CASE 
        WHEN c.reliability_score >= 4.0 THEN 'High reliability. '
        ELSE ''
      END,
      CASE 
        WHEN c.safety_rating >= 4.0 THEN 'Excellent safety rating.'
        ELSE ''
      END
    ) as recommendation_reason
  FROM public.cars c
  WHERE c.is_active = true
    AND (c.price_min IS NULL OR c.price_min <= budget_max)
    AND (c.price_max IS NULL OR c.price_max >= budget_min)
    AND (preferred_category IS NULL OR c.category = preferred_category)
    AND (c.reliability_score IS NULL OR c.reliability_score >= min_reliability)
    AND (c.safety_rating IS NULL OR c.safety_rating >= min_safety)
  ORDER BY match_score DESC, c.reliability_score DESC NULLS LAST
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_smart_car_recommendations(JSONB, INTEGER) IS '基于用户偏好的智能车型推荐';

-- =============================================
-- 性能优化函数
-- =============================================

-- 重建索引函数
CREATE OR REPLACE FUNCTION rebuild_indexes()
RETURNS TEXT AS $$
DECLARE
  result TEXT := 'Indexes rebuilt successfully';
BEGIN
  -- 重建主要表的索引
  REINDEX TABLE public.users;
  REINDEX TABLE public.conversations;
  REINDEX TABLE public.messages;
  REINDEX TABLE public.cars;
  REINDEX TABLE public.recommendations;
  REINDEX TABLE public.next_steps;
  
  -- 更新表统计信息
  ANALYZE public.users;
  ANALYZE public.conversations;
  ANALYZE public.messages;
  ANALYZE public.cars;
  ANALYZE public.recommendations;
  ANALYZE public.next_steps;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION rebuild_indexes() IS '重建所有表的索引并更新统计信息';

-- =============================================
-- 数据导出函数
-- =============================================

-- 导出用户数据函数
CREATE OR REPLACE FUNCTION export_user_data(user_session_id TEXT)
RETURNS JSONB AS $$
DECLARE
  user_data JSONB;
  conversations_data JSONB;
  messages_data JSONB;
  recommendations_data JSONB;
  next_steps_data JSONB;
BEGIN
  -- 获取用户基本信息
  SELECT to_jsonb(u.*) INTO user_data
  FROM public.users u
  WHERE u.session_id = user_session_id;
  
  -- 获取对话数据
  SELECT jsonb_agg(to_jsonb(c.*)) INTO conversations_data
  FROM public.conversations c
  WHERE c.session_id = user_session_id;
  
  -- 获取消息数据
  SELECT jsonb_agg(to_jsonb(m.*)) INTO messages_data
  FROM public.messages m
  JOIN public.conversations c ON m.conversation_id = c.id
  WHERE c.session_id = user_session_id;
  
  -- 获取推荐数据
  SELECT jsonb_agg(to_jsonb(r.*)) INTO recommendations_data
  FROM public.recommendations r
  JOIN public.conversations c ON r.conversation_id = c.id
  WHERE c.session_id = user_session_id;
  
  -- 获取下一步建议数据
  SELECT jsonb_agg(to_jsonb(ns.*)) INTO next_steps_data
  FROM public.next_steps ns
  JOIN public.conversations c ON ns.conversation_id = c.id
  WHERE c.session_id = user_session_id;
  
  -- 组合所有数据
  RETURN jsonb_build_object(
    'user', user_data,
    'conversations', COALESCE(conversations_data, '[]'::jsonb),
    'messages', COALESCE(messages_data, '[]'::jsonb),
    'recommendations', COALESCE(recommendations_data, '[]'::jsonb),
    'next_steps', COALESCE(next_steps_data, '[]'::jsonb),
    'exported_at', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION export_user_data(TEXT) IS '导出指定用户的所有数据为JSON格式'; 