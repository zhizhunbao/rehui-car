-- =====================================================
-- 数据库表结构测试文件
-- 详细验证每个表的字段、类型、约束、默认值等
-- =====================================================

-- 开始事务，确保测试不影响实际数据
BEGIN;

-- 设置测试环境
SET client_min_messages TO WARNING;

-- =====================================================
-- 1. 用户表 (public.users) 结构测试
-- =====================================================

-- 测试用户表字段是否完整
DO $$
DECLARE
    expected_columns TEXT[] := ARRAY['id', 'email', 'name', 'language', 'session_id', 'created_at', 'updated_at'];
    actual_columns TEXT[];
    missing_columns TEXT[];
    col TEXT;
BEGIN
    -- 获取实际字段列表
    SELECT ARRAY_AGG(column_name ORDER BY ordinal_position) INTO actual_columns
    FROM information_schema.columns 
    WHERE table_name = 'users' AND table_schema = 'public';
    
    -- 检查缺失字段
    FOREACH col IN ARRAY expected_columns LOOP
        IF NOT (col = ANY(actual_columns)) THEN
            missing_columns := array_append(missing_columns, col);
        END IF;
    END LOOP;
    
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE EXCEPTION 'Missing columns in users table: %', array_to_string(missing_columns, ', ');
    END IF;
    
    RAISE NOTICE 'PASS: users table has all required columns';
END $$;

-- 测试用户表字段类型
DO $$
BEGIN
    -- 测试id字段类型
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'id' 
        AND data_type = 'uuid'
    ) THEN
        RAISE EXCEPTION 'users.id should be UUID type';
    END IF;
    
    -- 测试email字段类型和约束
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'email' 
        AND data_type = 'text' AND is_nullable = 'YES'
    ) THEN
        RAISE EXCEPTION 'users.email should be TEXT and nullable';
    END IF;
    
    -- 测试session_id字段约束
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'session_id' 
        AND data_type = 'text' AND is_nullable = 'NO'
    ) THEN
        RAISE EXCEPTION 'users.session_id should be TEXT and NOT NULL';
    END IF;
    
    -- 测试language字段默认值
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'language' 
        AND column_default LIKE '%zh%'
    ) THEN
        RAISE EXCEPTION 'users.language should have default value zh';
    END IF;
    
    RAISE NOTICE 'PASS: users table field types are correct';
END $$;

-- 测试用户表唯一约束
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'users' AND constraint_type = 'UNIQUE' 
        AND constraint_name LIKE '%email%'
    ) THEN
        RAISE EXCEPTION 'users.email should have UNIQUE constraint';
    END IF;
    
    RAISE NOTICE 'PASS: users table unique constraints are correct';
END $$;

-- =====================================================
-- 2. 会话表 (public.conversations) 结构测试
-- =====================================================

-- 测试会话表字段完整性
DO $$
DECLARE
    expected_columns TEXT[] := ARRAY['id', 'user_id', 'title', 'summary', 'language', 'session_id', 'created_at', 'updated_at'];
    actual_columns TEXT[];
    missing_columns TEXT[];
    col TEXT;
BEGIN
    SELECT ARRAY_AGG(column_name ORDER BY ordinal_position) INTO actual_columns
    FROM information_schema.columns 
    WHERE table_name = 'conversations' AND table_schema = 'public';
    
    FOREACH col IN ARRAY expected_columns LOOP
        IF NOT (col = ANY(actual_columns)) THEN
            missing_columns := array_append(missing_columns, col);
        END IF;
    END LOOP;
    
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE EXCEPTION 'Missing columns in conversations table: %', array_to_string(missing_columns, ', ');
    END IF;
    
    RAISE NOTICE 'PASS: conversations table has all required columns';
END $$;

-- 测试会话表外键约束
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.referential_constraints rc
        JOIN information_schema.key_column_usage kcu ON rc.constraint_name = kcu.constraint_name
        WHERE kcu.table_name = 'conversations' AND kcu.column_name = 'user_id'
        AND rc.delete_rule = 'CASCADE'
    ) THEN
        RAISE EXCEPTION 'conversations.user_id should have CASCADE delete rule';
    END IF;
    
    RAISE NOTICE 'PASS: conversations table foreign key constraints are correct';
END $$;

-- =====================================================
-- 3. 消息表 (public.messages) 结构测试
-- =====================================================

-- 测试消息表字段完整性
DO $$
DECLARE
    expected_columns TEXT[] := ARRAY['id', 'conversation_id', 'type', 'content', 'metadata', 'created_at'];
    actual_columns TEXT[];
    missing_columns TEXT[];
    col TEXT;
BEGIN
    SELECT ARRAY_AGG(column_name ORDER BY ordinal_position) INTO actual_columns
    FROM information_schema.columns 
    WHERE table_name = 'messages' AND table_schema = 'public';
    
    FOREACH col IN ARRAY expected_columns LOOP
        IF NOT (col = ANY(actual_columns)) THEN
            missing_columns := array_append(missing_columns, col);
        END IF;
    END LOOP;
    
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE EXCEPTION 'Missing columns in messages table: %', array_to_string(missing_columns, ', ');
    END IF;
    
    RAISE NOTICE 'PASS: messages table has all required columns';
END $$;

-- 测试消息表字段类型
DO $$
BEGIN
    -- 测试metadata字段类型
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'metadata' 
        AND data_type = 'jsonb'
    ) THEN
        RAISE EXCEPTION 'messages.metadata should be JSONB type';
    END IF;
    
    -- 测试content字段约束
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'content' 
        AND is_nullable = 'NO'
    ) THEN
        RAISE EXCEPTION 'messages.content should be NOT NULL';
    END IF;
    
    RAISE NOTICE 'PASS: messages table field types are correct';
END $$;

-- =====================================================
-- 4. 车型表 (public.cars) 结构测试
-- =====================================================

-- 测试车型表字段完整性
DO $$
DECLARE
    expected_columns TEXT[] := ARRAY[
        'id', 'make', 'model', 'year_min', 'year_max', 'price_min', 'price_max', 
        'currency', 'category', 'fuel_type', 'description_en', 'description_zh',
        'pros_en', 'pros_zh', 'cons_en', 'cons_zh', 'features', 'image_url',
        'reliability_score', 'fuel_economy', 'safety_rating', 'is_active',
        'created_at', 'updated_at'
    ];
    actual_columns TEXT[];
    missing_columns TEXT[];
    col TEXT;
BEGIN
    SELECT ARRAY_AGG(column_name ORDER BY ordinal_position) INTO actual_columns
    FROM information_schema.columns 
    WHERE table_name = 'cars' AND table_schema = 'public';
    
    FOREACH col IN ARRAY expected_columns LOOP
        IF NOT (col = ANY(actual_columns)) THEN
            missing_columns := array_append(missing_columns, col);
        END IF;
    END LOOP;
    
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE EXCEPTION 'Missing columns in cars table: %', array_to_string(missing_columns, ', ');
    END IF;
    
    RAISE NOTICE 'PASS: cars table has all required columns';
END $$;

-- 测试车型表数组字段类型
DO $$
BEGIN
    -- 测试pros_en字段类型
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cars' AND column_name = 'pros_en' 
        AND data_type = 'ARRAY'
    ) THEN
        RAISE EXCEPTION 'cars.pros_en should be TEXT[] type';
    END IF;
    
    -- 测试features字段类型
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cars' AND column_name = 'features' 
        AND data_type = 'ARRAY'
    ) THEN
        RAISE EXCEPTION 'cars.features should be TEXT[] type';
    END IF;
    
    RAISE NOTICE 'PASS: cars table array field types are correct';
END $$;

-- 测试车型表数值字段精度
DO $$
BEGIN
    -- 测试price_min字段精度
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cars' AND column_name = 'price_min' 
        AND numeric_precision = 10 AND numeric_scale = 2
    ) THEN
        RAISE EXCEPTION 'cars.price_min should be DECIMAL(10,2)';
    END IF;
    
    -- 测试reliability_score字段精度
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cars' AND column_name = 'reliability_score' 
        AND numeric_precision = 3 AND numeric_scale = 2
    ) THEN
        RAISE EXCEPTION 'cars.reliability_score should be DECIMAL(3,2)';
    END IF;
    
    RAISE NOTICE 'PASS: cars table numeric field precision is correct';
END $$;

-- =====================================================
-- 5. 推荐表 (public.recommendations) 结构测试
-- =====================================================

-- 测试推荐表字段完整性
DO $$
DECLARE
    expected_columns TEXT[] := ARRAY[
        'id', 'conversation_id', 'message_id', 'car_id', 'match_score',
        'reasoning_en', 'reasoning_zh', 'created_at'
    ];
    actual_columns TEXT[];
    missing_columns TEXT[];
    col TEXT;
BEGIN
    SELECT ARRAY_AGG(column_name ORDER BY ordinal_position) INTO actual_columns
    FROM information_schema.columns 
    WHERE table_name = 'recommendations' AND table_schema = 'public';
    
    FOREACH col IN ARRAY expected_columns LOOP
        IF NOT (col = ANY(actual_columns)) THEN
            missing_columns := array_append(missing_columns, col);
        END IF;
    END LOOP;
    
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE EXCEPTION 'Missing columns in recommendations table: %', array_to_string(missing_columns, ', ');
    END IF;
    
    RAISE NOTICE 'PASS: recommendations table has all required columns';
END $$;

-- 测试推荐表多重外键约束
DO $$
DECLARE
    fk_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO fk_count
    FROM information_schema.table_constraints 
    WHERE table_name = 'recommendations' AND constraint_type = 'FOREIGN KEY';
    
    IF fk_count < 3 THEN
        RAISE EXCEPTION 'recommendations table should have at least 3 foreign key constraints';
    END IF;
    
    RAISE NOTICE 'PASS: recommendations table has correct number of foreign keys';
END $$;

-- =====================================================
-- 6. 下一步建议表 (public.next_steps) 结构测试
-- =====================================================

-- 测试下一步建议表字段完整性
DO $$
DECLARE
    expected_columns TEXT[] := ARRAY[
        'id', 'conversation_id', 'message_id', 'title_en', 'title_zh',
        'description_en', 'description_zh', 'priority', 'action_type', 'created_at'
    ];
    actual_columns TEXT[];
    missing_columns TEXT[];
    col TEXT;
BEGIN
    SELECT ARRAY_AGG(column_name ORDER BY ordinal_position) INTO actual_columns
    FROM information_schema.columns 
    WHERE table_name = 'next_steps' AND table_schema = 'public';
    
    FOREACH col IN ARRAY expected_columns LOOP
        IF NOT (col = ANY(actual_columns)) THEN
            missing_columns := array_append(missing_columns, col);
        END IF;
    END LOOP;
    
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE EXCEPTION 'Missing columns in next_steps table: %', array_to_string(missing_columns, ', ');
    END IF;
    
    RAISE NOTICE 'PASS: next_steps table has all required columns';
END $$;

-- 测试下一步建议表枚举约束
DO $$
BEGIN
    -- 测试priority字段约束
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints cc
        JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name
        WHERE ccu.table_name = 'next_steps' AND ccu.column_name = 'priority'
        AND cc.check_clause LIKE '%high%medium%low%'
    ) THEN
        RAISE EXCEPTION 'next_steps.priority should have enum constraint (high, medium, low)';
    END IF;
    
    -- 测试action_type字段约束
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints cc
        JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name
        WHERE ccu.table_name = 'next_steps' AND ccu.column_name = 'action_type'
        AND cc.check_clause LIKE '%research%visit%contact%prepare%'
    ) THEN
        RAISE EXCEPTION 'next_steps.action_type should have enum constraint (research, visit, contact, prepare)';
    END IF;
    
    RAISE NOTICE 'PASS: next_steps table enum constraints are correct';
END $$;

-- =====================================================
-- 7. 测试所有表的通用字段
-- =====================================================

-- 测试所有表的主键都是UUID类型
DO $$
DECLARE
    table_name TEXT;
    tables_with_uuid_pk TEXT[] := ARRAY['users', 'conversations', 'messages', 'cars', 'recommendations', 'next_steps'];
BEGIN
    FOREACH table_name IN ARRAY tables_with_uuid_pk LOOP
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = table_name AND column_name = 'id' 
            AND data_type = 'uuid' AND is_nullable = 'NO'
        ) THEN
            RAISE EXCEPTION 'Table % should have UUID primary key', table_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'PASS: All tables have UUID primary keys';
END $$;

-- 测试所有表的created_at字段
DO $$
DECLARE
    table_name TEXT;
    tables_with_timestamps TEXT[] := ARRAY['users', 'conversations', 'messages', 'cars', 'recommendations', 'next_steps'];
BEGIN
    FOREACH table_name IN ARRAY tables_with_timestamps LOOP
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = table_name AND column_name = 'created_at' 
            AND data_type = 'timestamp with time zone'
            AND column_default LIKE '%now()%'
        ) THEN
            RAISE EXCEPTION 'Table % should have created_at with default NOW()', table_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'PASS: All tables have correct created_at fields';
END $$;

-- =====================================================
-- 8. 测试索引覆盖情况
-- =====================================================

-- 测试关键查询字段的索引
DO $$
DECLARE
    critical_indexes TEXT[] := ARRAY[
        'idx_users_session_id',
        'idx_users_email',
        'idx_conversations_user_id',
        'idx_conversations_session_id',
        'idx_messages_conversation_id',
        'idx_cars_make_model',
        'idx_cars_category',
        'idx_cars_fuel_type',
        'idx_recommendations_conversation_id',
        'idx_recommendations_car_id',
        'idx_next_steps_conversation_id'
    ];
    index_name TEXT;
    missing_indexes TEXT[];
BEGIN
    FOREACH index_name IN ARRAY critical_indexes LOOP
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = index_name) THEN
            missing_indexes := array_append(missing_indexes, index_name);
        END IF;
    END LOOP;
    
    IF array_length(missing_indexes, 1) > 0 THEN
        RAISE EXCEPTION 'Missing critical indexes: %', array_to_string(missing_indexes, ', ');
    END IF;
    
    RAISE NOTICE 'PASS: All critical indexes exist';
END $$;

-- =====================================================
-- 9. 测试数据完整性约束
-- =====================================================

-- 测试NOT NULL约束的关键字段
DO $$
BEGIN
    -- 测试关键字段的NOT NULL约束
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name IN ('users', 'conversations', 'messages', 'cars', 'recommendations', 'next_steps')
        AND column_name IN ('id', 'created_at')
        AND is_nullable = 'YES'
    ) THEN
        RAISE EXCEPTION 'Critical fields (id, created_at) should be NOT NULL';
    END IF;
    
    RAISE NOTICE 'PASS: Critical fields have NOT NULL constraints';
END $$;

-- =====================================================
-- 测试完成
-- =====================================================

RAISE NOTICE '==============================================';
RAISE NOTICE 'ALL SCHEMA TESTS PASSED SUCCESSFULLY!';
RAISE NOTICE '==============================================';

-- 回滚事务，不保留测试数据
ROLLBACK; 