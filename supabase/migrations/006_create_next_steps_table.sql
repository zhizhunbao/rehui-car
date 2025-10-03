-- 006_create_next_steps_table.sql
-- 创建下一步建议表，用于存储AI生成的购车建议和行动指南

-- 创建下一步建议表
CREATE TABLE IF NOT EXISTS public.next_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  action_type TEXT NOT NULL CHECK (action_type IN ('research', 'visit', 'contact', 'prepare')),
  url TEXT,
  metadata JSONB DEFAULT '{}',
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_next_steps_conversation_id ON public.next_steps(conversation_id);
CREATE INDEX IF NOT EXISTS idx_next_steps_message_id ON public.next_steps(message_id);
CREATE INDEX IF NOT EXISTS idx_next_steps_priority ON public.next_steps(priority);
CREATE INDEX IF NOT EXISTS idx_next_steps_action_type ON public.next_steps(action_type);
CREATE INDEX IF NOT EXISTS idx_next_steps_created_at ON public.next_steps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_next_steps_completed ON public.next_steps(is_completed);

-- 创建复合索引
CREATE INDEX IF NOT EXISTS idx_next_steps_conversation_message ON public.next_steps(conversation_id, message_id);
CREATE INDEX IF NOT EXISTS idx_next_steps_priority_type ON public.next_steps(priority, action_type);

-- 创建GIN索引用于JSONB元数据搜索
CREATE INDEX IF NOT EXISTS idx_next_steps_metadata ON public.next_steps USING GIN (metadata);

-- 添加表注释
COMMENT ON TABLE public.next_steps IS '下一步建议表，存储AI生成的购车建议和行动指南';
COMMENT ON COLUMN public.next_steps.id IS '建议唯一标识符';
COMMENT ON COLUMN public.next_steps.conversation_id IS '所属对话的ID';
COMMENT ON COLUMN public.next_steps.message_id IS '触发建议的消息ID';
COMMENT ON COLUMN public.next_steps.title_en IS '英文建议标题';
COMMENT ON COLUMN public.next_steps.title_zh IS '中文建议标题';
COMMENT ON COLUMN public.next_steps.description_en IS '英文详细描述';
COMMENT ON COLUMN public.next_steps.description_zh IS '中文详细描述';
COMMENT ON COLUMN public.next_steps.priority IS '优先级：high(高)、medium(中)、low(低)';
COMMENT ON COLUMN public.next_steps.action_type IS '行动类型：research(研究)、visit(访问)、contact(联系)、prepare(准备)';
COMMENT ON COLUMN public.next_steps.url IS '相关链接URL';
COMMENT ON COLUMN public.next_steps.metadata IS '额外元数据，如联系信息、地址等';
COMMENT ON COLUMN public.next_steps.is_completed IS '是否已完成';
COMMENT ON COLUMN public.next_steps.created_at IS '建议生成时间';

-- 启用行级安全策略（RLS）
ALTER TABLE public.next_steps ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略：用户只能访问自己对话中的建议
CREATE POLICY "Users can view own next steps" ON public.next_steps
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE session_id = current_setting('app.current_session_id', true) OR
            user_id IN (SELECT id FROM public.users WHERE session_id = current_setting('app.current_session_id', true))
    )
  );

CREATE POLICY "Users can insert own next steps" ON public.next_steps
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE session_id = current_setting('app.current_session_id', true) OR
            user_id IN (SELECT id FROM public.users WHERE session_id = current_setting('app.current_session_id', true))
    )
  );

CREATE POLICY "Users can update own next steps" ON public.next_steps
  FOR UPDATE USING (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE session_id = current_setting('app.current_session_id', true) OR
            user_id IN (SELECT id FROM public.users WHERE session_id = current_setting('app.current_session_id', true))
    )
  );

-- 创建建议统计视图
CREATE OR REPLACE VIEW public.next_steps_stats AS
SELECT 
  action_type,
  priority,
  COUNT(*) as total_steps,
  COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_steps,
  COUNT(CASE WHEN is_completed = false THEN 1 END) as pending_steps,
  ROUND(
    COUNT(CASE WHEN is_completed = true THEN 1 END) * 100.0 / COUNT(*), 
    2
  ) as completion_rate
FROM public.next_steps
GROUP BY action_type, priority
ORDER BY 
  CASE priority 
    WHEN 'high' THEN 1 
    WHEN 'medium' THEN 2 
    WHEN 'low' THEN 3 
  END,
  action_type;

COMMENT ON VIEW public.next_steps_stats IS '下一步建议统计视图，按行动类型和优先级分组统计';

-- 创建待办事项视图
CREATE OR REPLACE VIEW public.pending_next_steps AS
SELECT 
  ns.*,
  c.title as conversation_title,
  c.language as conversation_language,
  u.name as user_name
FROM public.next_steps ns
JOIN public.conversations c ON ns.conversation_id = c.id
LEFT JOIN public.users u ON c.user_id = u.id
WHERE ns.is_completed = false
ORDER BY 
  CASE ns.priority 
    WHEN 'high' THEN 1 
    WHEN 'medium' THEN 2 
    WHEN 'low' THEN 3 
  END,
  ns.created_at DESC;

COMMENT ON VIEW public.pending_next_steps IS '待办事项视图，显示未完成的建议按优先级排序';

-- 创建最近建议视图
CREATE OR REPLACE VIEW public.recent_next_steps AS
SELECT 
  ns.*,
  c.title as conversation_title,
  c.language as conversation_language
FROM public.next_steps ns
JOIN public.conversations c ON ns.conversation_id = c.id
WHERE ns.created_at >= NOW() - INTERVAL '7 days'
ORDER BY ns.created_at DESC;

COMMENT ON VIEW public.recent_next_steps IS '最近建议视图，显示最近7天的建议';

-- 创建获取用户待办事项函数
CREATE OR REPLACE FUNCTION get_user_pending_steps(
  user_session_id TEXT,
  priority_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE(
  step_id UUID,
  title TEXT,
  description TEXT,
  priority TEXT,
  action_type TEXT,
  url TEXT,
  conversation_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ns.id as step_id,
    CASE 
      WHEN c.language = 'zh' THEN ns.title_zh
      ELSE ns.title_en
    END as title,
    CASE 
      WHEN c.language = 'zh' THEN COALESCE(ns.description_zh, ns.description_en, '')
      ELSE COALESCE(ns.description_en, ns.description_zh, '')
    END as description,
    ns.priority,
    ns.action_type,
    ns.url,
    c.title as conversation_title,
    ns.created_at
  FROM public.next_steps ns
  JOIN public.conversations c ON ns.conversation_id = c.id
  WHERE c.session_id = user_session_id
    AND ns.is_completed = false
    AND (priority_filter IS NULL OR ns.priority = priority_filter)
  ORDER BY 
    CASE ns.priority 
      WHEN 'high' THEN 1 
      WHEN 'medium' THEN 2 
      WHEN 'low' THEN 3 
    END,
    ns.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_pending_steps(TEXT, TEXT, INTEGER) IS '获取用户的待办事项列表';

-- 创建标记建议完成函数
CREATE OR REPLACE FUNCTION mark_step_completed(
  step_id UUID,
  user_session_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  step_exists BOOLEAN;
BEGIN
  -- 检查建议是否存在且属于当前用户
  SELECT EXISTS(
    SELECT 1 FROM public.next_steps ns
    JOIN public.conversations c ON ns.conversation_id = c.id
    WHERE ns.id = step_id 
      AND c.session_id = user_session_id
  ) INTO step_exists;
  
  IF NOT step_exists THEN
    RETURN FALSE;
  END IF;
  
  -- 更新完成状态
  UPDATE public.next_steps 
  SET is_completed = true
  WHERE id = step_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION mark_step_completed(UUID, TEXT) IS '标记指定建议为已完成';

-- 创建获取建议完成率函数
CREATE OR REPLACE FUNCTION get_completion_rate(
  user_session_id TEXT,
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
  total_steps BIGINT,
  completed_steps BIGINT,
  completion_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_steps,
    COUNT(CASE WHEN ns.is_completed = true THEN 1 END) as completed_steps,
    CASE 
      WHEN COUNT(*) > 0 THEN
        ROUND(COUNT(CASE WHEN ns.is_completed = true THEN 1 END) * 100.0 / COUNT(*), 2)
      ELSE 0
    END::DECIMAL(5,2) as completion_rate
  FROM public.next_steps ns
  JOIN public.conversations c ON ns.conversation_id = c.id
  WHERE c.session_id = user_session_id
    AND ns.created_at >= NOW() - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_completion_rate(TEXT, INTEGER) IS '获取用户指定时间段内的建议完成率';

-- 创建建议类型分布函数
CREATE OR REPLACE FUNCTION get_action_type_distribution()
RETURNS TABLE(
  action_type TEXT,
  total_count BIGINT,
  completed_count BIGINT,
  pending_count BIGINT,
  avg_completion_time_hours DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ns.action_type,
    COUNT(*) as total_count,
    COUNT(CASE WHEN ns.is_completed = true THEN 1 END) as completed_count,
    COUNT(CASE WHEN ns.is_completed = false THEN 1 END) as pending_count,
    -- 计算平均完成时间（假设完成时间为更新时间）
    AVG(
      CASE 
        WHEN ns.is_completed = true THEN 
          EXTRACT(EPOCH FROM (NOW() - ns.created_at)) / 3600.0
        ELSE NULL 
      END
    )::DECIMAL(10,2) as avg_completion_time_hours
  FROM public.next_steps ns
  WHERE ns.created_at >= NOW() - INTERVAL '90 days'
  GROUP BY ns.action_type
  ORDER BY total_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_action_type_distribution() IS '获取建议类型分布统计（最近90天）'; 