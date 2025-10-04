-- 创建消息表
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    type message_type NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_type ON messages(type);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_metadata ON messages USING GIN(metadata);

-- 创建复合索引
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at);

-- 添加行级安全策略
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户可以查看和插入自己对话的消息
CREATE POLICY "Users can view messages in own conversations" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.user_id IS NULL OR auth.uid()::text = conversations.user_id::text)
        )
    );

CREATE POLICY "Users can insert messages in own conversations" ON messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.user_id IS NULL OR auth.uid()::text = conversations.user_id::text)
        )
    );

CREATE POLICY "Users can update messages in own conversations" ON messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.user_id IS NULL OR auth.uid()::text = conversations.user_id::text)
        )
    );

CREATE POLICY "Users can delete messages in own conversations" ON messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.user_id IS NULL OR auth.uid()::text = conversations.user_id::text)
        )
    );
