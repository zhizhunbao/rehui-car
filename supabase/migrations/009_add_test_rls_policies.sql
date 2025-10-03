-- 009_add_test_rls_policies.sql
-- 添加测试用的 RLS 策略，允许匿名用户进行测试操作

-- =============================================
-- 测试环境 RLS 策略
-- =============================================

-- 为测试环境添加更宽松的 RLS 策略
-- 这些策略只在测试时使用，生产环境应该使用更严格的策略

-- 用户表测试策略
CREATE POLICY "Test users can insert any data" ON public.users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Test users can view any data" ON public.users
  FOR SELECT
  USING (true);

CREATE POLICY "Test users can update any data" ON public.users
  FOR UPDATE
  USING (true);

-- 对话表测试策略
CREATE POLICY "Test users can insert any conversations" ON public.conversations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Test users can view any conversations" ON public.conversations
  FOR SELECT
  USING (true);

CREATE POLICY "Test users can update any conversations" ON public.conversations
  FOR UPDATE
  USING (true);

CREATE POLICY "Test users can delete any conversations" ON public.conversations
  FOR DELETE
  USING (true);

-- 消息表测试策略
CREATE POLICY "Test users can insert any messages" ON public.messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Test users can view any messages" ON public.messages
  FOR SELECT
  USING (true);

CREATE POLICY "Test users can update any messages" ON public.messages
  FOR UPDATE
  USING (true);

CREATE POLICY "Test users can delete any messages" ON public.messages
  FOR DELETE
  USING (true);

-- 推荐表测试策略
CREATE POLICY "Test users can insert any recommendations" ON public.recommendations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Test users can view any recommendations" ON public.recommendations
  FOR SELECT
  USING (true);

CREATE POLICY "Test users can update any recommendations" ON public.recommendations
  FOR UPDATE
  USING (true);

-- 下一步表测试策略
CREATE POLICY "Test users can insert any next steps" ON public.next_steps
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Test users can view any next steps" ON public.next_steps
  FOR SELECT
  USING (true);

CREATE POLICY "Test users can update any next steps" ON public.next_steps
  FOR UPDATE
  USING (true);

-- =============================================
-- 生产环境 RLS 策略（更严格）
-- =============================================

-- 注意：在生产环境中，应该删除上述测试策略，使用以下更严格的策略

-- 用户表生产策略（基于 session_id）
-- DROP POLICY IF EXISTS "Test users can insert any data" ON public.users;
-- DROP POLICY IF EXISTS "Test users can view any data" ON public.users;
-- DROP POLICY IF EXISTS "Test users can update any data" ON public.users;

-- 对话表生产策略（基于 session_id）
-- DROP POLICY IF EXISTS "Test users can insert any conversations" ON public.conversations;
-- DROP POLICY IF EXISTS "Test users can view any conversations" ON public.conversations;
-- DROP POLICY IF EXISTS "Test users can update any conversations" ON public.conversations;
-- DROP POLICY IF EXISTS "Test users can delete any conversations" ON public.conversations;

-- 消息表生产策略（基于 session_id）
-- DROP POLICY IF EXISTS "Test users can insert any messages" ON public.messages;
-- DROP POLICY IF EXISTS "Test users can view any messages" ON public.messages;
-- DROP POLICY IF EXISTS "Test users can update any messages" ON public.messages;
-- DROP POLICY IF EXISTS "Test users can delete any messages" ON public.messages;

-- 推荐表生产策略（基于 session_id）
-- DROP POLICY IF EXISTS "Test users can insert any recommendations" ON public.recommendations;
-- DROP POLICY IF EXISTS "Test users can view any recommendations" ON public.recommendations;
-- DROP POLICY IF EXISTS "Test users can update any recommendations" ON public.recommendations;

-- 下一步表生产策略（基于 session_id）
-- DROP POLICY IF EXISTS "Test users can insert any next steps" ON public.next_steps;
-- DROP POLICY IF EXISTS "Test users can view any next steps" ON public.next_steps;
-- DROP POLICY IF EXISTS "Test users can update any next steps" ON public.next_steps;

COMMENT ON TABLE public.users IS '用户表 - 已添加测试用RLS策略';
COMMENT ON TABLE public.conversations IS '对话表 - 已添加测试用RLS策略';
COMMENT ON TABLE public.messages IS '消息表 - 已添加测试用RLS策略';
COMMENT ON TABLE public.recommendations IS '推荐表 - 已添加测试用RLS策略';
COMMENT ON TABLE public.next_steps IS '下一步表 - 已添加测试用RLS策略';
