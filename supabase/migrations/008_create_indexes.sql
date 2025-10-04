-- 创建额外的性能优化索引

-- 启用必要的扩展以支持模糊搜索
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 为搜索功能创建全文搜索索引
CREATE INDEX idx_cars_search_text_en ON cars USING GIN(to_tsvector('english', make || ' ' || model || ' ' || COALESCE(description_en, '')));
CREATE INDEX idx_cars_search_text_zh ON cars USING GIN(to_tsvector('simple', make || ' ' || model || ' ' || COALESCE(description_zh, '')));

-- 为价格范围查询创建复合索引
CREATE INDEX idx_cars_price_year ON cars(price_min, price_max, year_min, year_max, is_active);

-- 为推荐系统创建复合索引
CREATE INDEX idx_recommendations_score_conversation ON recommendations(conversation_id, match_score DESC, created_at DESC);

-- 为消息历史查询创建复合索引
CREATE INDEX idx_messages_conversation_type_created ON messages(conversation_id, type, created_at DESC);

-- 为下一步行动查询创建复合索引
CREATE INDEX idx_next_steps_conversation_completed ON next_steps(conversation_id, is_completed, priority, created_at DESC);

-- 为用户会话查询创建复合索引
CREATE INDEX idx_conversations_user_created ON conversations(user_id, created_at DESC);

-- 为统计查询创建部分索引
CREATE INDEX idx_cars_active_stats ON cars(make, category, fuel_type) WHERE is_active = true;
-- 创建部分索引（移除动态时间条件）
CREATE INDEX idx_recommendations_recent ON recommendations(conversation_id, created_at DESC);

-- 为JSON字段创建GIN索引以支持复杂查询
CREATE INDEX idx_messages_metadata_gin ON messages USING GIN(metadata);
CREATE INDEX idx_next_steps_metadata_gin ON next_steps USING GIN(metadata);

-- 创建函数索引用于模糊搜索
CREATE INDEX idx_cars_make_model_gin ON cars USING GIN(make gin_trgm_ops, model gin_trgm_ops);

-- 启用必要的扩展以支持模糊搜索
CREATE EXTENSION IF NOT EXISTS pg_trgm;
