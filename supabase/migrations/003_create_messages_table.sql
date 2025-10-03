-- 003_create_messages_table.sql
-- 创建消息表，用于存储对话中的具体消息内容

-- 创建消息表
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_type ON public.messages(type);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at);

-- 创建GIN索引用于JSONB元数据搜索
CREATE INDEX IF NOT EXISTS idx_messages_metadata ON public.messages USING GIN (metadata);

-- 添加表注释
COMMENT ON TABLE public.messages IS '消息表，存储对话中的具体消息内容';
COMMENT ON COLUMN public.messages.id IS '消息唯一标识符';
COMMENT ON COLUMN public.messages.conversation_id IS '所属对话的ID';
COMMENT ON COLUMN public.messages.type IS '消息类型：user(用户消息)或assistant(AI助手消息)';
COMMENT ON COLUMN public.messages.content IS '消息内容文本';
COMMENT ON COLUMN public.messages.metadata IS '消息元数据，存储额外信息如推荐结果、处理时间等';
COMMENT ON COLUMN public.messages.created_at IS '消息创建时间';

-- 启用行级安全策略（RLS）
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略：用户只能访问自己对话中的消息
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE session_id = current_setting('app.current_session_id', true) OR
            user_id IN (SELECT id FROM public.users WHERE session_id = current_setting('app.current_session_id', true))
    )
  );

CREATE POLICY "Users can insert own messages" ON public.messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE session_id = current_setting('app.current_session_id', true) OR
            user_id IN (SELECT id FROM public.users WHERE session_id = current_setting('app.current_session_id', true))
    )
  );

CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE session_id = current_setting('app.current_session_id', true) OR
            user_id IN (SELECT id FROM public.users WHERE session_id = current_setting('app.current_session_id', true))
    )
  );

CREATE POLICY "Users can delete own messages" ON public.messages
  FOR DELETE USING (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE session_id = current_setting('app.current_session_id', true) OR
            user_id IN (SELECT id FROM public.users WHERE session_id = current_setting('app.current_session_id', true))
    )
  );

-- 创建消息统计视图
CREATE OR REPLACE VIEW public.message_stats AS
SELECT 
  type,
  COUNT(*) as total_messages,
  AVG(LENGTH(content)) as avg_content_length,
  COUNT(DISTINCT conversation_id) as conversations_with_messages
FROM public.messages 
GROUP BY type;

COMMENT ON VIEW public.message_stats IS '消息统计信息视图，按消息类型分组统计';

-- 创建最近消息视图
CREATE OR REPLACE VIEW public.recent_messages AS
SELECT 
  m.*,
  c.title as conversation_title,
  c.language as conversation_language,
  u.name as user_name
FROM public.messages m
JOIN public.conversations c ON m.conversation_id = c.id
LEFT JOIN public.users u ON c.user_id = u.id
WHERE m.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY m.created_at DESC;

COMMENT ON VIEW public.recent_messages IS '最近消息视图，显示最近24小时的消息及关联信息';

-- 创建对话消息计数函数
CREATE OR REPLACE FUNCTION get_conversation_message_count(conversation_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER 
    FROM public.messages 
    WHERE conversation_id = conversation_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_conversation_message_count(UUID) IS '获取指定对话的消息数量';

-- 创建获取对话最后消息函数
CREATE OR REPLACE FUNCTION get_last_message(conversation_uuid UUID)
RETURNS TABLE(
  id UUID,
  type TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT m.id, m.type, m.content, m.created_at
  FROM public.messages m
  WHERE m.conversation_id = conversation_uuid
  ORDER BY m.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_last_message(UUID) IS '获取指定对话的最后一条消息'; 