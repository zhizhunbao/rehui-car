-- 创建下一步行动表
CREATE TABLE next_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    title_en TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    description_en TEXT,
    description_zh TEXT,
    priority priority_level NOT NULL DEFAULT 'medium',
    action_type action_type NOT NULL,
    url TEXT,
    metadata JSONB,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_next_steps_conversation_id ON next_steps(conversation_id);
CREATE INDEX idx_next_steps_message_id ON next_steps(message_id);
CREATE INDEX idx_next_steps_priority ON next_steps(priority);
CREATE INDEX idx_next_steps_action_type ON next_steps(action_type);
CREATE INDEX idx_next_steps_is_completed ON next_steps(is_completed);
CREATE INDEX idx_next_steps_created_at ON next_steps(created_at);
CREATE INDEX idx_next_steps_metadata ON next_steps USING GIN(metadata);

-- 创建复合索引
CREATE INDEX idx_next_steps_conversation_priority ON next_steps(conversation_id, priority, is_completed);
CREATE INDEX idx_next_steps_message_priority ON next_steps(message_id, priority, is_completed);

-- 添加行级安全策略
ALTER TABLE next_steps ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户可以查看和更新自己对话的下一步行动
CREATE POLICY "Users can view next steps in own conversations" ON next_steps
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = next_steps.conversation_id 
            AND (conversations.user_id IS NULL OR auth.uid()::text = conversations.user_id::text)
        )
    );

CREATE POLICY "Users can insert next steps in own conversations" ON next_steps
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = next_steps.conversation_id 
            AND (conversations.user_id IS NULL OR auth.uid()::text = conversations.user_id::text)
        )
    );

CREATE POLICY "Users can update next steps in own conversations" ON next_steps
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = next_steps.conversation_id 
            AND (conversations.user_id IS NULL OR auth.uid()::text = conversations.user_id::text)
        )
    );

CREATE POLICY "Users can delete next steps in own conversations" ON next_steps
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = next_steps.conversation_id 
            AND (conversations.user_id IS NULL OR auth.uid()::text = conversations.user_id::text)
        )
    );
