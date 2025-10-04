-- 创建数据库函数

-- 函数：获取用户的对话统计
CREATE OR REPLACE FUNCTION get_user_conversation_stats(user_uuid UUID)
RETURNS TABLE (
    total_conversations BIGINT,
    total_messages BIGINT,
    total_recommendations BIGINT,
    total_next_steps BIGINT,
    completed_next_steps BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT c.id) as total_conversations,
        COUNT(DISTINCT m.id) as total_messages,
        COUNT(DISTINCT r.id) as total_recommendations,
        COUNT(DISTINCT ns.id) as total_next_steps,
        COUNT(DISTINCT CASE WHEN ns.is_completed = true THEN ns.id END) as completed_next_steps
    FROM conversations c
    LEFT JOIN messages m ON c.id = m.conversation_id
    LEFT JOIN recommendations r ON c.id = r.conversation_id
    LEFT JOIN next_steps ns ON c.id = ns.conversation_id
    WHERE c.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 函数：搜索汽车
CREATE OR REPLACE FUNCTION search_cars(
    search_query TEXT DEFAULT '',
    car_category TEXT DEFAULT NULL,
    fuel_type_filter TEXT DEFAULT NULL,
    min_price DECIMAL DEFAULT NULL,
    max_price DECIMAL DEFAULT NULL,
    min_year INTEGER DEFAULT NULL,
    max_year INTEGER DEFAULT NULL,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    make TEXT,
    model TEXT,
    year_min INTEGER,
    year_max INTEGER,
    price_min DECIMAL,
    price_max DECIMAL,
    currency TEXT,
    category TEXT,
    fuel_type TEXT,
    description_en TEXT,
    description_zh TEXT,
    pros_en TEXT[],
    pros_zh TEXT[],
    cons_en TEXT[],
    cons_zh TEXT[],
    features TEXT[],
    image_url TEXT,
    reliability_score DECIMAL,
    fuel_economy DECIMAL,
    safety_rating DECIMAL,
    match_score DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.*,
        CASE 
            WHEN search_query = '' THEN 1.0
            ELSE ts_rank(
                to_tsvector('english', c.make || ' ' || c.model || ' ' || COALESCE(c.description_en, '')),
                plainto_tsquery('english', search_query)
            ) + ts_rank(
                to_tsvector('simple', c.make || ' ' || c.model || ' ' || COALESCE(c.description_zh, '')),
                plainto_tsquery('simple', search_query)
            )
        END as match_score
    FROM cars c
    WHERE c.is_active = true
        AND (search_query = '' OR (
            to_tsvector('english', c.make || ' ' || c.model || ' ' || COALESCE(c.description_en, '')) @@ plainto_tsquery('english', search_query)
            OR to_tsvector('simple', c.make || ' ' || c.model || ' ' || COALESCE(c.description_zh, '')) @@ plainto_tsquery('simple', search_query)
        ))
        AND (car_category IS NULL OR c.category = car_category)
        AND (fuel_type_filter IS NULL OR c.fuel_type = fuel_type_filter)
        AND (min_price IS NULL OR c.price_max >= min_price)
        AND (max_price IS NULL OR c.price_min <= max_price)
        AND (min_year IS NULL OR c.year_max >= min_year)
        AND (max_year IS NULL OR c.year_min <= max_year)
    ORDER BY match_score DESC, c.reliability_score DESC NULLS LAST
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 函数：获取对话的推荐摘要
CREATE OR REPLACE FUNCTION get_conversation_recommendations_summary(conversation_uuid UUID)
RETURNS TABLE (
    car_id UUID,
    make TEXT,
    model TEXT,
    match_score DECIMAL,
    reasoning_en TEXT,
    reasoning_zh TEXT,
    recommendation_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.car_id,
        c.make,
        c.model,
        AVG(r.match_score) as match_score,
        STRING_AGG(DISTINCT r.reasoning_en, '; ') as reasoning_en,
        STRING_AGG(DISTINCT r.reasoning_zh, '; ') as reasoning_zh,
        COUNT(r.id) as recommendation_count
    FROM recommendations r
    JOIN cars c ON r.car_id = c.id
    WHERE r.conversation_id = conversation_uuid
    GROUP BY r.car_id, c.make, c.model
    ORDER BY AVG(r.match_score) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 函数：清理旧数据
CREATE OR REPLACE FUNCTION cleanup_old_data(days_to_keep INTEGER DEFAULT 90)
RETURNS TABLE (
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
    ns_count BIGINT;
BEGIN
    cutoff_date := NOW() - (days_to_keep || ' days')::INTERVAL;
    
    -- 删除旧的对话（级联删除相关数据）
    DELETE FROM conversations 
    WHERE created_at < cutoff_date AND user_id IS NULL;
    
    GET DIAGNOSTICS conv_count = ROW_COUNT;
    
    -- 统计被删除的相关数据
    SELECT 
        COUNT(DISTINCT m.id),
        COUNT(DISTINCT r.id),
        COUNT(DISTINCT ns.id)
    INTO msg_count, rec_count, ns_count
    FROM messages m
    LEFT JOIN recommendations r ON m.conversation_id = r.conversation_id
    LEFT JOIN next_steps ns ON m.conversation_id = ns.conversation_id
    WHERE m.created_at < cutoff_date;
    
    RETURN QUERY SELECT conv_count, msg_count, rec_count, ns_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
