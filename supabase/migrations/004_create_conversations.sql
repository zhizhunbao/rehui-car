-- 创建对话表
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title TEXT,
    summary TEXT,
    language TEXT NOT NULL DEFAULT 'zh',
    session_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_session_id ON conversations(session_id);
CREATE INDEX idx_conversations_language ON conversations(language);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);

-- 创建复合索引
CREATE INDEX idx_conversations_user_session ON conversations(user_id, session_id);

-- 创建更新时间戳触发器
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 添加行级安全策略
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户可以查看和更新自己的对话
CREATE POLICY "Users can view own conversations" ON conversations
    FOR SELECT USING (
        user_id IS NULL OR 
        auth.uid()::text = user_id::text
    );

CREATE POLICY "Users can update own conversations" ON conversations
    FOR UPDATE USING (
        user_id IS NULL OR 
        auth.uid()::text = user_id::text
    );

CREATE POLICY "Users can insert own conversations" ON conversations
    FOR INSERT WITH CHECK (
        user_id IS NULL OR 
        auth.uid()::text = user_id::text
    );

CREATE POLICY "Users can delete own conversations" ON conversations
    FOR DELETE USING (
        user_id IS NULL OR 
        auth.uid()::text = user_id::text
    );
