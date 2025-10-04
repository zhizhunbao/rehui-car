-- 初始化数据库架构
-- 创建必要的扩展和基础设置

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 创建自定义类型
CREATE TYPE message_type AS ENUM ('user', 'assistant', 'system');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE action_type AS ENUM ('search', 'compare', 'contact', 'schedule', 'purchase', 'research');

-- 设置时区
SET timezone = 'UTC';

-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建生成UUID函数
CREATE OR REPLACE FUNCTION generate_uuid()
RETURNS UUID AS $$
BEGIN
    RETURN uuid_generate_v4();
END;
$$ language 'plpgsql';
