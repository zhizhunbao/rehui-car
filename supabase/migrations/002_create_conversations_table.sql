-- 002_create_conversations_table.sql
-- 创建对话表，用于存储用户与AI的对话会话信息

-- 创建对话表
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  summary TEXT,
  language TEXT DEFAULT 'zh' CHECK (language IN ('en', 'zh')),
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON public.conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_language ON public.conversations(language);

-- 添加表注释
COMMENT ON TABLE public.conversations IS '对话会话表，存储用户与AI的对话信息';
COMMENT ON COLUMN public.conversations.id IS '对话唯一标识符';
COMMENT ON COLUMN public.conversations.user_id IS '关联的用户ID，可为空（匿名用户）';
COMMENT ON COLUMN public.conversations.title IS '对话标题，通常由AI生成或用户设置';
COMMENT ON COLUMN public.conversations.summary IS '对话摘要，用于快速了解对话内容';
COMMENT ON COLUMN public.conversations.language IS '对话使用的语言';
COMMENT ON COLUMN public.conversations.session_id IS '会话标识符，用于关联匿名用户的对话';
COMMENT ON COLUMN public.conversations.created_at IS '对话创建时间';
COMMENT ON COLUMN public.conversations.updated_at IS '对话最后更新时间';

-- 启用行级安全策略（RLS）
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略：用户只能访问自己的对话
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (
    session_id = current_setting('app.current_session_id', true) OR
    user_id IN (SELECT id FROM public.users WHERE session_id = current_setting('app.current_session_id', true))
  );

CREATE POLICY "Users can insert own conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    session_id = current_setting('app.current_session_id', true) OR
    user_id IN (SELECT id FROM public.users WHERE session_id = current_setting('app.current_session_id', true))
  );

CREATE POLICY "Users can update own conversations" ON public.conversations
  FOR UPDATE USING (
    session_id = current_setting('app.current_session_id', true) OR
    user_id IN (SELECT id FROM public.users WHERE session_id = current_setting('app.current_session_id', true))
  );

CREATE POLICY "Users can delete own conversations" ON public.conversations
  FOR DELETE USING (
    session_id = current_setting('app.current_session_id', true) OR
    user_id IN (SELECT id FROM public.users WHERE session_id = current_setting('app.current_session_id', true))
  );

-- 创建对话统计视图
CREATE OR REPLACE VIEW public.conversation_stats AS
SELECT 
  language,
  COUNT(*) as total_conversations,
  COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as registered_user_conversations,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as anonymous_conversations,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/60) as avg_duration_minutes
FROM public.conversations 
GROUP BY language;

COMMENT ON VIEW public.conversation_stats IS '对话统计信息视图，按语言分组统计对话数量和平均时长';

-- 创建活跃对话视图（最近7天）
CREATE OR REPLACE VIEW public.active_conversations AS
SELECT 
  c.*,
  u.name as user_name,
  u.email as user_email
FROM public.conversations c
LEFT JOIN public.users u ON c.user_id = u.id
WHERE c.updated_at >= NOW() - INTERVAL '7 days'
ORDER BY c.updated_at DESC;

COMMENT ON VIEW public.active_conversations IS '活跃对话视图，显示最近7天的对话及关联用户信息'; 