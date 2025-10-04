-- 创建推荐表
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    match_score DECIMAL(3,2) NOT NULL CHECK (match_score >= 0 AND match_score <= 1),
    reasoning_en TEXT,
    reasoning_zh TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_recommendations_conversation_id ON recommendations(conversation_id);
CREATE INDEX idx_recommendations_message_id ON recommendations(message_id);
CREATE INDEX idx_recommendations_car_id ON recommendations(car_id);
CREATE INDEX idx_recommendations_match_score ON recommendations(match_score);
CREATE INDEX idx_recommendations_created_at ON recommendations(created_at);

-- 创建复合索引
CREATE INDEX idx_recommendations_conversation_score ON recommendations(conversation_id, match_score DESC);
CREATE INDEX idx_recommendations_message_score ON recommendations(message_id, match_score DESC);

-- 添加行级安全策略
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户可以查看自己对话的推荐
CREATE POLICY "Users can view recommendations in own conversations" ON recommendations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = recommendations.conversation_id 
            AND (conversations.user_id IS NULL OR auth.uid()::text = conversations.user_id::text)
        )
    );

CREATE POLICY "Users can insert recommendations in own conversations" ON recommendations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = recommendations.conversation_id 
            AND (conversations.user_id IS NULL OR auth.uid()::text = conversations.user_id::text)
        )
    );

CREATE POLICY "Users can update recommendations in own conversations" ON recommendations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = recommendations.conversation_id 
            AND (conversations.user_id IS NULL OR auth.uid()::text = conversations.user_id::text)
        )
    );

CREATE POLICY "Users can delete recommendations in own conversations" ON recommendations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = recommendations.conversation_id 
            AND (conversations.user_id IS NULL OR auth.uid()::text = conversations.user_id::text)
        )
    );
