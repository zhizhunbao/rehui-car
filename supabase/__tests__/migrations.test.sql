-- =====================================================
-- 数据库迁移测试文件
-- 测试所有迁移文件的执行和数据完整性
-- =====================================================

-- 开始事务，确保测试不影响实际数据
BEGIN;

-- 设置测试环境
SET client_min_messages TO WARNING;

-- =====================================================
-- 1. 测试所有表是否正确创建
-- =====================================================

-- 测试用户表是否存在
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        RAISE EXCEPTION 'Table public.users does not exist';
    END IF;
    RAISE NOTICE 'PASS: users table exists';
END $$;

-- 测试会话表是否存在
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversations' AND table_schema = 'public') THEN
        RAISE EXCEPTION 'Table public.conversations does not exist';
    END IF;
    RAISE NOTICE 'PASS: conversations table exists';
END $$;

-- 测试消息表是否存在
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages' AND table_schema = 'public') THEN
        RAISE EXCEPTION 'Table public.messages does not exist';
    END IF;
    RAISE NOTICE 'PASS: messages table exists';
END $$;

-- 测试车型表是否存在
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cars' AND table_schema = 'public') THEN
        RAISE EXCEPTION 'Table public.cars does not exist';
    END IF;
    RAISE NOTICE 'PASS: cars table exists';
END $$;

-- 测试推荐表是否存在
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'recommendations' AND table_schema = 'public') THEN
        RAISE EXCEPTION 'Table public.recommendations does not exist';
    END IF;
    RAISE NOTICE 'PASS: recommendations table exists';
END $$;

-- 测试下一步建议表是否存在
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'next_steps' AND table_schema = 'public') THEN
        RAISE EXCEPTION 'Table public.next_steps does not exist';
    END IF;
    RAISE NOTICE 'PASS: next_steps table exists';
END $$;

-- =====================================================
-- 2. 测试外键约束是否正确创建
-- =====================================================

-- 测试conversations表的外键约束
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'conversations' 
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'user_id'
        AND kcu.referenced_table_name = 'users'
    ) THEN
        RAISE EXCEPTION 'Foreign key constraint conversations.user_id -> users.id not found';
    END IF;
    RAISE NOTICE 'PASS: conversations.user_id foreign key exists';
END $$;

-- 测试messages表的外键约束
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'messages' 
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'conversation_id'
        AND kcu.referenced_table_name = 'conversations'
    ) THEN
        RAISE EXCEPTION 'Foreign key constraint messages.conversation_id -> conversations.id not found';
    END IF;
    RAISE NOTICE 'PASS: messages.conversation_id foreign key exists';
END $$;

-- 测试recommendations表的外键约束
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'recommendations' 
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'car_id'
        AND kcu.referenced_table_name = 'cars'
    ) THEN
        RAISE EXCEPTION 'Foreign key constraint recommendations.car_id -> cars.id not found';
    END IF;
    RAISE NOTICE 'PASS: recommendations.car_id foreign key exists';
END $$;

-- =====================================================
-- 3. 测试索引是否正确创建
-- =====================================================

-- 测试用户表索引
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'users' AND indexname = 'idx_users_session_id') THEN
        RAISE EXCEPTION 'Index idx_users_session_id not found';
    END IF;
    RAISE NOTICE 'PASS: idx_users_session_id index exists';
END $$;

-- 测试车型表索引
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'cars' AND indexname = 'idx_cars_make_model') THEN
        RAISE EXCEPTION 'Index idx_cars_make_model not found';
    END IF;
    RAISE NOTICE 'PASS: idx_cars_make_model index exists';
END $$;

-- 测试车型分类索引
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'cars' AND indexname = 'idx_cars_category') THEN
        RAISE EXCEPTION 'Index idx_cars_category not found';
    END IF;
    RAISE NOTICE 'PASS: idx_cars_category index exists';
END $$;

-- =====================================================
-- 4. 测试检查约束是否正确创建
-- =====================================================

-- 测试用户表语言约束
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints cc
        JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name
        WHERE ccu.table_name = 'users' 
        AND ccu.column_name = 'language'
        AND cc.check_clause LIKE '%language%IN%'
    ) THEN
        RAISE EXCEPTION 'Check constraint for users.language not found';
    END IF;
    RAISE NOTICE 'PASS: users.language check constraint exists';
END $$;

-- 测试车型表可靠性评分约束
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints cc
        JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name
        WHERE ccu.table_name = 'cars' 
        AND ccu.column_name = 'reliability_score'
        AND cc.check_clause LIKE '%reliability_score%BETWEEN%'
    ) THEN
        RAISE EXCEPTION 'Check constraint for cars.reliability_score not found';
    END IF;
    RAISE NOTICE 'PASS: cars.reliability_score check constraint exists';
END $$;

-- 测试推荐表匹配分数约束
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints cc
        JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name
        WHERE ccu.table_name = 'recommendations' 
        AND ccu.column_name = 'match_score'
        AND cc.check_clause LIKE '%match_score%BETWEEN%'
    ) THEN
        RAISE EXCEPTION 'Check constraint for recommendations.match_score not found';
    END IF;
    RAISE NOTICE 'PASS: recommendations.match_score check constraint exists';
END $$;

-- =====================================================
-- 5. 测试函数是否正确创建
-- =====================================================

-- 测试更新时间戳函数
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        RAISE EXCEPTION 'Function update_updated_at_column does not exist';
    END IF;
    RAISE NOTICE 'PASS: update_updated_at_column function exists';
END $$;

-- =====================================================
-- 6. 测试触发器是否正确创建
-- =====================================================

-- 测试用户表更新触发器
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        RAISE EXCEPTION 'Trigger update_users_updated_at does not exist';
    END IF;
    RAISE NOTICE 'PASS: update_users_updated_at trigger exists';
END $$;

-- 测试会话表更新触发器
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_conversations_updated_at') THEN
        RAISE EXCEPTION 'Trigger update_conversations_updated_at does not exist';
    END IF;
    RAISE NOTICE 'PASS: update_conversations_updated_at trigger exists';
END $$;

-- 测试车型表更新触发器
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cars_updated_at') THEN
        RAISE EXCEPTION 'Trigger update_cars_updated_at does not exist';
    END IF;
    RAISE NOTICE 'PASS: update_cars_updated_at trigger exists';
END $$;

-- =====================================================
-- 7. 测试示例数据是否正确插入
-- =====================================================

-- 测试车型示例数据
DO $$
DECLARE
    car_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO car_count FROM public.cars;
    IF car_count = 0 THEN
        RAISE EXCEPTION 'No sample cars found in database';
    END IF;
    RAISE NOTICE 'PASS: Found % sample cars in database', car_count;
END $$;

-- 测试车型数据完整性
DO $$
DECLARE
    invalid_cars INTEGER;
BEGIN
    SELECT COUNT(*) INTO invalid_cars 
    FROM public.cars 
    WHERE make IS NULL OR model IS NULL OR category IS NULL OR fuel_type IS NULL;
    
    IF invalid_cars > 0 THEN
        RAISE EXCEPTION 'Found % cars with missing required fields', invalid_cars;
    END IF;
    RAISE NOTICE 'PASS: All cars have required fields';
END $$;

-- =====================================================
-- 8. 测试数据类型和默认值
-- =====================================================

-- 测试UUID主键默认值
DO $$
BEGIN
    -- 插入测试用户验证UUID自动生成
    INSERT INTO public.users (session_id, language) VALUES ('test_session_123', 'en');
    
    -- 验证ID是否为有效UUID
    IF NOT EXISTS (
        SELECT 1 FROM public.users 
        WHERE session_id = 'test_session_123' 
        AND id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    ) THEN
        RAISE EXCEPTION 'UUID primary key not generated correctly';
    END IF;
    
    -- 清理测试数据
    DELETE FROM public.users WHERE session_id = 'test_session_123';
    
    RAISE NOTICE 'PASS: UUID primary key generation works';
END $$;

-- 测试时间戳默认值
DO $$
DECLARE
    test_user_id UUID;
    created_time TIMESTAMP WITH TIME ZONE;
BEGIN
    -- 插入测试用户
    INSERT INTO public.users (session_id, language) 
    VALUES ('test_timestamp_456', 'zh') 
    RETURNING id, created_at INTO test_user_id, created_time;
    
    -- 验证时间戳是否在合理范围内（最近1分钟）
    IF created_time < NOW() - INTERVAL '1 minute' OR created_time > NOW() + INTERVAL '1 minute' THEN
        RAISE EXCEPTION 'Timestamp default value not working correctly';
    END IF;
    
    -- 清理测试数据
    DELETE FROM public.users WHERE id = test_user_id;
    
    RAISE NOTICE 'PASS: Timestamp default values work correctly';
END $$;

-- =====================================================
-- 9. 测试级联删除
-- =====================================================

DO $$
DECLARE
    test_user_id UUID;
    test_conversation_id UUID;
    test_message_id UUID;
    remaining_messages INTEGER;
BEGIN
    -- 创建测试数据链
    INSERT INTO public.users (session_id, language) 
    VALUES ('cascade_test_789', 'en') 
    RETURNING id INTO test_user_id;
    
    INSERT INTO public.conversations (user_id, session_id, title) 
    VALUES (test_user_id, 'cascade_test_789', 'Test Conversation') 
    RETURNING id INTO test_conversation_id;
    
    INSERT INTO public.messages (conversation_id, type, content) 
    VALUES (test_conversation_id, 'user', 'Test message') 
    RETURNING id INTO test_message_id;
    
    -- 删除用户，测试级联删除
    DELETE FROM public.users WHERE id = test_user_id;
    
    -- 验证相关数据是否被级联删除
    SELECT COUNT(*) INTO remaining_messages 
    FROM public.messages WHERE id = test_message_id;
    
    IF remaining_messages > 0 THEN
        RAISE EXCEPTION 'Cascade delete not working correctly';
    END IF;
    
    RAISE NOTICE 'PASS: Cascade delete works correctly';
END $$;

-- =====================================================
-- 测试完成
-- =====================================================

RAISE NOTICE '==============================================';
RAISE NOTICE 'ALL MIGRATION TESTS PASSED SUCCESSFULLY!';
RAISE NOTICE '==============================================';

-- 回滚事务，不保留测试数据
ROLLBACK; 