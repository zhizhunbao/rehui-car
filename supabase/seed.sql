-- ============================================================================
-- Supabase Seed Data
-- 初始化数据文件
-- ============================================================================

-- 清理现有数据（开发环境使用）
-- TRUNCATE TABLE next_steps CASCADE;
-- TRUNCATE TABLE recommendations CASCADE;
-- TRUNCATE TABLE messages CASCADE;
-- TRUNCATE TABLE conversations CASCADE;
-- TRUNCATE TABLE cars CASCADE;
-- TRUNCATE TABLE users CASCADE;

-- 插入测试用户
INSERT INTO users (id, email, full_name, avatar_url, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', '测试用户', null, now(), now()),
('550e8400-e29b-41d4-a716-446655440001', 'demo@example.com', '演示用户', null, now(), now())
ON CONFLICT (id) DO NOTHING;

-- 插入示例对话
INSERT INTO conversations (id, user_id, title, status, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '购车咨询', 'active', now(), now()),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '车型对比', 'completed', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 插入示例消息
INSERT INTO messages (id, conversation_id, content, sender_type, metadata, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', '你好，我想了解一下20万左右的SUV', 'user', '{}', now()),
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', '您好！20万左右的SUV有很多不错的选择。请问您更看重什么方面？比如空间、油耗、品牌等？', 'assistant', '{}', now()),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '帮我对比一下本田CR-V和丰田RAV4', 'user', '{}', now())
ON CONFLICT (id) DO NOTHING;

-- 插入示例推荐记录
INSERT INTO recommendations (id, conversation_id, car_id, score, reasoning, pros, cons, created_at) VALUES
('880e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 1, 85, '综合性价比较高，适合家用', ARRAY['空间宽敞', '油耗经济', '保值率高'], ARRAY['动力一般', '内饰质感一般'], now()),
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 2, 88, '品质可靠，安全性能出色', ARRAY['质量可靠', '安全配置丰富', '保养便宜'], ARRAY['价格偏高', '后排空间一般'], now())
ON CONFLICT (id) DO NOTHING;

-- 插入示例下一步建议
INSERT INTO next_steps (id, conversation_id, step_type, title, description, priority, completed, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'test_drive', '预约试驾', '建议您预约试驾本田CR-V，亲身体验驾驶感受', 1, false, now()),
('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 'price_inquiry', '询问价格', '联系经销商了解最新优惠政策和价格信息', 2, false, now()),
('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'comparison', '详细对比', '建议您到店详细对比两款车型的配置和价格', 1, true, now())
ON CONFLICT (id) DO NOTHING;

-- 验证数据插入
SELECT 'Users count: ' || count(*) FROM users;
SELECT 'Conversations count: ' || count(*) FROM conversations;
SELECT 'Messages count: ' || count(*) FROM messages;
SELECT 'Cars count: ' || count(*) FROM cars;
SELECT 'Recommendations count: ' || count(*) FROM recommendations;
SELECT 'Next steps count: ' || count(*) FROM next_steps; 