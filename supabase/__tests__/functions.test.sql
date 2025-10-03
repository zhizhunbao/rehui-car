-- =====================================================
-- 数据库函数和触发器测试文件
-- 测试所有数据库函数和触发器的功能正确性
-- =====================================================

-- 开始事务，确保测试不影响实际数据
BEGIN;

-- 设置测试环境
SET client_min_messages TO WARNING;

-- =====================================================
-- 1. 测试更新时间戳函数
-- =====================================================

-- 测试函数是否存在
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        RAISE EXCEPTION 'Function update_updated_at_column does not exist';
    END IF;
    RAISE NOTICE 'PASS: update_updated_at_column function exists';
END $$;

-- 测试函数返回类型
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'update_updated_at_column' 
        AND prorettype = (SELECT oid FROM pg_type WHERE typname = 'trigger')
    ) THEN
        RAISE EXCEPTION 'Function update_updated_at_column should return TRIGGER type';
    END IF;
    RAISE NOTICE 'PASS: update_updated_at_column function has correct return type';
END $$;

-- 测试函数语言
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'update_updated_at_column' 
        AND prolang = (SELECT oid FROM pg_language WHERE lanname = 'plpgsql')
    ) THEN
        RAISE EXCEPTION 'Function update_updated_at_column should be written in plpgsql';
    END IF;
    RAISE NOTICE 'PASS: update_updated_at_column function uses correct language';
END $$;

-- =====================================================
-- 2. 测试用户表更新触发器
-- =====================================================

-- 测试触发器是否存在
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_users_updated_at'
        AND tgrelid = (SELECT oid FROM pg_class WHERE relname = 'users')
    ) THEN
        RAISE EXCEPTION 'Trigger update_users_updated_at does not exist on users table';
    END IF;
    RAISE NOTICE 'PASS: update_users_updated_at trigger exists';
END $$;

-- 测试触发器时机
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_users_updated_at'
        AND tgtype & 2 = 2  -- BEFORE trigger
        AND tgtype & 4 = 4  -- UPDATE trigger
    ) THEN
        RAISE EXCEPTION 'Trigger update_users_updated_at should be BEFORE UPDATE';
    END IF;
    RAISE NOTICE 'PASS: update_users_updated_at trigger has correct timing';
END $$;

-- 测试用户表触发器功能
DO $$
DECLARE
    test_user_id UUID;
    initial_updated_at TIMESTAMP WITH TIME ZONE;
    final_updated_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- 创建测试用户
    INSERT INTO public.users (session_id, language, name) 
    VALUES ('trigger_test_user', 'en', 'Test User') 
    RETURNING id, updated_at INTO test_user_id, initial_updated_at;
    
    -- 等待一小段时间确保时间戳不同
    PERFORM pg_sleep(0.1);
    
    -- 更新用户信息
    UPDATE public.users 
    SET name = 'Updated Test User' 
    WHERE id = test_user_id
    RETURNING updated_at INTO final_updated_at;
    
    -- 验证updated_at是否被自动更新
    IF final_updated_at <= initial_updated_at THEN
        RAISE EXCEPTION 'updated_at was not automatically updated by trigger';
    END IF;
    
    -- 清理测试数据
    DELETE FROM public.users WHERE id = test_user_id;
    
    RAISE NOTICE 'PASS: users table trigger updates updated_at correctly';
END $$;

-- =====================================================
-- 3. 测试会话表更新触发器
-- =====================================================

-- 测试触发器是否存在
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_conversations_updated_at'
        AND tgrelid = (SELECT oid FROM pg_class WHERE relname = 'conversations')
    ) THEN
        RAISE EXCEPTION 'Trigger update_conversations_updated_at does not exist on conversations table';
    END IF;
    RAISE NOTICE 'PASS: update_conversations_updated_at trigger exists';
END $$;

-- 测试会话表触发器功能
DO $$
DECLARE
    test_user_id UUID;
    test_conversation_id UUID;
    initial_updated_at TIMESTAMP WITH TIME ZONE;
    final_updated_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- 创建测试用户
    INSERT INTO public.users (session_id, language) 
    VALUES ('trigger_test_conv_user', 'zh') 
    RETURNING id INTO test_user_id;
    
    -- 创建测试会话
    INSERT INTO public.conversations (user_id, session_id, title) 
    VALUES (test_user_id, 'trigger_test_conv', 'Test Conversation') 
    RETURNING id, updated_at INTO test_conversation_id, initial_updated_at;
    
    -- 等待一小段时间
    PERFORM pg_sleep(0.1);
    
    -- 更新会话信息
    UPDATE public.conversations 
    SET title = 'Updated Test Conversation' 
    WHERE id = test_conversation_id
    RETURNING updated_at INTO final_updated_at;
    
    -- 验证updated_at是否被自动更新
    IF final_updated_at <= initial_updated_at THEN
        RAISE EXCEPTION 'conversations updated_at was not automatically updated by trigger';
    END IF;
    
    -- 清理测试数据
    DELETE FROM public.users WHERE id = test_user_id;
    
    RAISE NOTICE 'PASS: conversations table trigger updates updated_at correctly';
END $$;

-- =====================================================
-- 4. 测试车型表更新触发器
-- =====================================================

-- 测试触发器是否存在
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_cars_updated_at'
        AND tgrelid = (SELECT oid FROM pg_class WHERE relname = 'cars')
    ) THEN
        RAISE EXCEPTION 'Trigger update_cars_updated_at does not exist on cars table';
    END IF;
    RAISE NOTICE 'PASS: update_cars_updated_at trigger exists';
END $$;

-- 测试车型表触发器功能
DO $$
DECLARE
    test_car_id UUID;
    initial_updated_at TIMESTAMP WITH TIME ZONE;
    final_updated_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- 创建测试车型
    INSERT INTO public.cars (make, model, year_min, year_max, category, fuel_type) 
    VALUES ('TestMake', 'TestModel', 2020, 2023, 'sedan', 'gasoline') 
    RETURNING id, updated_at INTO test_car_id, initial_updated_at;
    
    -- 等待一小段时间
    PERFORM pg_sleep(0.1);
    
    -- 更新车型信息
    UPDATE public.cars 
    SET model = 'Updated TestModel' 
    WHERE id = test_car_id
    RETURNING updated_at INTO final_updated_at;
    
    -- 验证updated_at是否被自动更新
    IF final_updated_at <= initial_updated_at THEN
        RAISE EXCEPTION 'cars updated_at was not automatically updated by trigger';
    END IF;
    
    -- 清理测试数据
    DELETE FROM public.cars WHERE id = test_car_id;
    
    RAISE NOTICE 'PASS: cars table trigger updates updated_at correctly';
END $$;

-- =====================================================
-- 5. 测试触发器在批量更新中的表现
-- =====================================================

-- 测试批量更新时触发器是否正常工作
DO $$
DECLARE
    test_user_ids UUID[];
    updated_count INTEGER;
    user_id UUID;
BEGIN
    -- 创建多个测试用户
    FOR i IN 1..3 LOOP
        INSERT INTO public.users (session_id, language, name) 
        VALUES ('batch_test_' || i, 'en', 'Batch User ' || i);
    END LOOP;
    
    -- 获取测试用户ID
    SELECT ARRAY_AGG(id) INTO test_user_ids
    FROM public.users 
    WHERE session_id LIKE 'batch_test_%';
    
    -- 等待一小段时间
    PERFORM pg_sleep(0.1);
    
    -- 批量更新
    UPDATE public.users 
    SET name = 'Batch Updated User'
    WHERE session_id LIKE 'batch_test_%';
    
    -- 验证所有记录的updated_at都被更新
    SELECT COUNT(*) INTO updated_count
    FROM public.users 
    WHERE session_id LIKE 'batch_test_%'
    AND updated_at > created_at + INTERVAL '0.05 seconds';
    
    IF updated_count != 3 THEN
        RAISE EXCEPTION 'Batch update trigger failed: expected 3 updated records, got %', updated_count;
    END IF;
    
    -- 清理测试数据
    DELETE FROM public.users WHERE session_id LIKE 'batch_test_%';
    
    RAISE NOTICE 'PASS: triggers work correctly with batch updates';
END $$;

-- =====================================================
-- 6. 测试触发器不会影响INSERT操作
-- =====================================================

-- 测试INSERT操作时updated_at应该等于created_at
DO $$
DECLARE
    test_user_id UUID;
    created_time TIMESTAMP WITH TIME ZONE;
    updated_time TIMESTAMP WITH TIME ZONE;
BEGIN
    -- 插入新用户
    INSERT INTO public.users (session_id, language, name) 
    VALUES ('insert_test_user', 'zh', 'Insert Test User') 
    RETURNING id, created_at, updated_at INTO test_user_id, created_time, updated_time;
    
    -- 验证INSERT时created_at和updated_at应该相等或非常接近
    IF ABS(EXTRACT(EPOCH FROM (updated_time - created_time))) > 1 THEN
        RAISE EXCEPTION 'INSERT operation: updated_at should be equal to created_at';
    END IF;
    
    -- 清理测试数据
    DELETE FROM public.users WHERE id = test_user_id;
    
    RAISE NOTICE 'PASS: triggers do not interfere with INSERT operations';
END $$;

-- =====================================================
-- 7. 测试触发器错误处理
-- =====================================================

-- 测试触发器在异常情况下的表现
DO $$
DECLARE
    test_user_id UUID;
    error_occurred BOOLEAN := FALSE;
BEGIN
    -- 创建测试用户
    INSERT INTO public.users (session_id, language) 
    VALUES ('error_test_user', 'en') 
    RETURNING id INTO test_user_id;
    
    -- 尝试更新为无效的语言值（应该被CHECK约束阻止）
    BEGIN
        UPDATE public.users 
        SET language = 'invalid_language' 
        WHERE id = test_user_id;
    EXCEPTION WHEN check_violation THEN
        error_occurred := TRUE;
    END;
    
    -- 验证错误确实发生了
    IF NOT error_occurred THEN
        RAISE EXCEPTION 'Expected check constraint violation did not occur';
    END IF;
    
    -- 验证用户仍然存在且未被修改
    IF NOT EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = test_user_id AND language = 'en'
    ) THEN
        RAISE EXCEPTION 'User should still exist with original language value';
    END IF;
    
    -- 清理测试数据
    DELETE FROM public.users WHERE id = test_user_id;
    
    RAISE NOTICE 'PASS: triggers handle errors correctly';
END $$;

-- =====================================================
-- 8. 测试触发器性能（简单测试）
-- =====================================================

-- 测试触发器不会显著影响性能
DO $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    duration_ms NUMERIC;
    test_user_ids UUID[];
BEGIN
    -- 记录开始时间
    start_time := clock_timestamp();
    
    -- 执行100次插入和更新操作
    FOR i IN 1..100 LOOP
        INSERT INTO public.users (session_id, language, name) 
        VALUES ('perf_test_' || i, 'en', 'Performance Test User ' || i);
    END LOOP;
    
    -- 获取所有测试用户ID
    SELECT ARRAY_AGG(id) INTO test_user_ids
    FROM public.users 
    WHERE session_id LIKE 'perf_test_%';
    
    -- 执行批量更新
    UPDATE public.users 
    SET name = 'Updated Performance Test User'
    WHERE session_id LIKE 'perf_test_%';
    
    -- 记录结束时间
    end_time := clock_timestamp();
    duration_ms := EXTRACT(MILLISECONDS FROM (end_time - start_time));
    
    -- 清理测试数据
    DELETE FROM public.users WHERE session_id LIKE 'perf_test_%';
    
    -- 验证性能（应该在合理时间内完成）
    IF duration_ms > 5000 THEN  -- 5秒
        RAISE EXCEPTION 'Trigger performance test took too long: % ms', duration_ms;
    END IF;
    
    RAISE NOTICE 'PASS: trigger performance test completed in % ms', duration_ms;
END $$;

-- =====================================================
-- 9. 测试触发器与事务的交互
-- =====================================================

-- 测试触发器在事务回滚时的行为
DO $$
DECLARE
    test_user_id UUID;
    user_exists BOOLEAN;
BEGIN
    -- 开始嵌套事务
    SAVEPOINT trigger_transaction_test;
    
    -- 插入测试用户
    INSERT INTO public.users (session_id, language, name) 
    VALUES ('transaction_test_user', 'en', 'Transaction Test User') 
    RETURNING id INTO test_user_id;
    
    -- 更新用户（触发器会更新updated_at）
    UPDATE public.users 
    SET name = 'Updated Transaction Test User' 
    WHERE id = test_user_id;
    
    -- 回滚事务
    ROLLBACK TO SAVEPOINT trigger_transaction_test;
    
    -- 验证用户不存在（事务已回滚）
    SELECT EXISTS(SELECT 1 FROM public.users WHERE id = test_user_id) INTO user_exists;
    
    IF user_exists THEN
        RAISE EXCEPTION 'User should not exist after transaction rollback';
    END IF;
    
    RAISE NOTICE 'PASS: triggers work correctly with transaction rollbacks';
END $$;

-- =====================================================
-- 10. 测试所有触发器的完整性
-- =====================================================

-- 验证所有预期的触发器都存在
DO $$
DECLARE
    expected_triggers TEXT[] := ARRAY[
        'update_users_updated_at',
        'update_conversations_updated_at', 
        'update_cars_updated_at'
    ];
    trigger_name TEXT;
    missing_triggers TEXT[];
BEGIN
    FOREACH trigger_name IN ARRAY expected_triggers LOOP
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
            missing_triggers := array_append(missing_triggers, trigger_name);
        END IF;
    END LOOP;
    
    IF array_length(missing_triggers, 1) > 0 THEN
        RAISE EXCEPTION 'Missing triggers: %', array_to_string(missing_triggers, ', ');
    END IF;
    
    RAISE NOTICE 'PASS: All expected triggers exist';
END $$;

-- 验证触发器函数的权限
DO $$
BEGIN
    -- 检查函数是否可以被public角色执行
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'update_updated_at_column'
        AND n.nspname = 'public'
        AND has_function_privilege('public', p.oid, 'execute')
    ) THEN
        RAISE EXCEPTION 'Function update_updated_at_column should be executable by public';
    END IF;
    
    RAISE NOTICE 'PASS: Trigger function has correct permissions';
END $$;

-- =====================================================
-- 测试完成
-- =====================================================

RAISE NOTICE '==============================================';
RAISE NOTICE 'ALL FUNCTION AND TRIGGER TESTS PASSED SUCCESSFULLY!';
RAISE NOTICE '==============================================';

-- 回滚事务，不保留测试数据
ROLLBACK; 