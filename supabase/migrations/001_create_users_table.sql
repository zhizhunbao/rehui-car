-- 001_create_users_table.sql
-- 创建用户表，用于存储用户基本信息和会话标识

-- 创建用户表
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  language TEXT DEFAULT 'zh' CHECK (language IN ('en', 'zh')),
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_users_session_id ON public.users(session_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- 添加表注释
COMMENT ON TABLE public.users IS '用户信息表，存储用户基本信息和会话标识';
COMMENT ON COLUMN public.users.id IS '用户唯一标识符';
COMMENT ON COLUMN public.users.email IS '用户邮箱地址（可选）';
COMMENT ON COLUMN public.users.name IS '用户姓名（可选）';
COMMENT ON COLUMN public.users.language IS '用户偏好语言，支持中文(zh)和英文(en)';
COMMENT ON COLUMN public.users.session_id IS '会话标识符，用于匿名用户跟踪';
COMMENT ON COLUMN public.users.created_at IS '创建时间';
COMMENT ON COLUMN public.users.updated_at IS '最后更新时间';

-- 启用行级安全策略（RLS）
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略：用户只能访问自己的数据
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (session_id = current_setting('app.current_session_id', true));

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (session_id = current_setting('app.current_session_id', true));

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (session_id = current_setting('app.current_session_id', true));

-- 创建用户统计视图（可选）
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
  language,
  COUNT(*) as user_count,
  COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as registered_users,
  COUNT(CASE WHEN email IS NULL THEN 1 END) as anonymous_users
FROM public.users 
GROUP BY language;

COMMENT ON VIEW public.user_stats IS '用户统计信息视图，按语言分组统计用户数量'; 