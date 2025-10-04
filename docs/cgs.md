# 🤖 rehui-car - 代码生成规范

## 1. 项目概述

**项目名称**: rehui-car
**技术栈**: Next.js 14 + TypeScript + Supabase + GROQ/Gemini
**目标**: AI驱动的汽车购买顾问系统，中英双语支持

**项目状态**: 🚧 积极开发中 (2024-10-03)
- ✅ 前六阶段完成：基础架构 + 数据层 + AI集成 + API层 + API完善 + 测试基础设施
- 🔄 当前阶段：第七阶段 - UI基础组件开发
- 📊 测试覆盖率：配置文件100% + 工具函数100% + 数据库100% + AI集成100% + API端点100%
- 🔧 MCP配置：Supabase + 文件系统 + 内存管理 + 浏览器 + GitHub + 思维链服务器
- 🤖 AI集成完成：GROQ + Gemini双AI架构，自动降级机制，100%测试通过

## 2. 目录结构规范

### 2.1 绝对路径约束

**项目根目录**: `D:\BaiduSyncdisk\workspace\python_workspace\rehui-car`

所有相对路径均基于此根目录：
- 配置文件路径：`./package.json` → `D:\BaiduSyncdisk\workspace\python_workspace\rehui-car\package.json`
- 源码路径：`./src/` → `D:\BaiduSyncdisk\workspace\python_workspace\rehui-car\src\`
- 测试路径：`./tests/` → `D:\BaiduSyncdisk\workspace\python_workspace\rehui-car\tests\`
- 文档路径：`./docs/` → `D:\BaiduSyncdisk\workspace\python_workspace\rehui-car\docs\`

### 2.2 目录结构树

```
# 项目根目录文件状态
├── package.json                           # 项目配置 ✅
├── package-lock.json                      # 依赖锁定文件 ✅
├── tsconfig.json                          # TypeScript配置 ✅
├── tailwind.config.js                     # Tailwind配置 ✅
├── next.config.js                         # Next.js配置 ✅
├── postcss.config.js                      # PostCSS配置 ✅
├── .eslintrc.json                         # ESLint配置 ✅
├── .eslintignore                          # ESLint忽略文件 ✅
├── .gitignore                             # Git忽略文件 ✅
├── env.example                            # 环境变量示例 ✅
├── .env.local                             # 环境变量配置 ✅
├── scripts/                               # 项目脚本 ✅
│   ├── run-all-tests.js                   # 运行所有测试 ✅
│   └── run-config-tests.js                # 运行配置测试 ✅
├── tests/                                 # 项目测试套件 ✅
│   ├── api.simple.js                      # 简化API测试 ✅
│   ├── config/                            # 配置文件测试 ✅
│   │   ├── test-eslint.js                 # ESLint配置测试 ✅
│   │   ├── test-globals-css.js            # 全局样式测试 ✅
│   │   ├── test-layout.js                 # Layout文件测试 ✅
│   │   ├── test-next-config.js            # Next.js配置测试 ✅
│   │   ├── test-package.js                # package.json测试 ✅
│   │   ├── test-tailwind.js               # Tailwind配置测试 ✅
│   │   └── test-tsconfig.js               # TypeScript配置测试 ✅
│   ├── database/                          # 数据库测试 ✅
│   │   ├── test-connection.js             # 数据库连接测试 ✅
│   │   ├── test-env-config.js             # 环境变量配置测试 ✅
│   │   ├── test-table-creation.js         # 数据库表创建测试 ✅
│   │   ├── test-data-insertion.js         # 数据插入和查询测试 ✅
│   │   ├── test-mcp-connection.js         # MCP数据库连接测试 ✅
│   │   └── test-mcp-comprehensive.js      # MCP数据库综合功能测试 ✅
│   ├── ai/                                # AI集成测试 ✅
│   │   ├── test-groq.js                   # GROQ AI测试 ✅
│   │   ├── test-gemini.js                 # Gemini AI测试 ✅
│   │   ├── test-prompts.js                # AI提示词测试 ✅
│   │   ├── test-ai-utils.js               # AI工具函数测试 ✅
│   │   ├── test-car-resources.js          # 汽车资源配置测试 ✅
│   │   └── test-ai-integration.js         # AI集成综合测试 ✅
│   ├── lib/                               # 工具库测试 ✅
│   │   ├── test-utils.js                  # 工具函数测试 ✅
│   │   ├── test-constants.js              # 常量定义测试 ✅
│   │   ├── test-validations.js            # 数据验证测试 ✅
│   │   └── test-supabase.js               # Supabase客户端测试 ✅
│   ├── api/                               # API端点测试 ✅
│   │   ├── test-health.js                 # 健康检查API测试 ✅
│   │   ├── test-chat.js                   # 聊天API测试 ✅
│   │   ├── test-cars.js                   # 车型列表API测试 ✅
│   │   ├── test-cars-detail.js            # 车型详情API测试 ✅
│   │   ├── test-cars-search.js            # 车型搜索API测试 ✅
│   │   ├── test-conversations.js          # 会话管理API测试 ✅
│   │   ├── test-conversations-detail.js   # 会话详情API测试 ✅
│   │   ├── test-users.js                  # 用户管理API测试 ✅
│   │   └── test-recommendations.js        # 推荐管理API测试 ✅
│   └── types/                             # 类型定义测试 ✅
│       ├── test-api.js                    # API类型测试 ✅
│       ├── test-car.js                    # Car类型测试 ✅
│       ├── test-chat.js                   # Chat类型测试 ✅
│       ├── test-database.js               # Database类型测试 ✅
│       ├── test-index.js                  # 索引类型测试 ✅
│       └── test-ui.js                     # UI类型测试 ✅
└── docs/                                  # 项目文档 ✅
    ├── cgs.md                             # 代码生成规范 ✅
    └── prompt.md                          # 操作手册 ✅

src/
├── app/                                   # Next.js App Router ✅
│   ├── api/                               # API路由 ✅
│   │   ├── chat/
│   │   │   └── route.ts                   # POST /api/chat ✅
│   │   ├── cars/
│   │   │   ├── route.ts                   # GET /api/cars ✅
│   │   │   ├── [id]/
│   │   │   │   └── route.ts               # GET /api/cars/[id] ✅
│   │   │   └── search/
│   │   │       └── route.ts               # GET /api/cars/search ✅
│   │   ├── conversations/                 # 会话API ✅
│   │   │   ├── route.ts                   # GET/POST /api/conversations ✅
│   │   │   └── [id]/
│   │   │       └── route.ts               # GET/PUT/DELETE /api/conversations/[id] ✅
│   │   ├── health/
│   │   │   └── route.ts                   # GET /api/health ✅
│   │   ├── recommendations/               # 推荐API ✅
│   │   │   └── route.ts                   # GET/POST /api/recommendations ✅
│   │   └── users/                         # 用户API ✅
│   │       └── route.ts                   # GET/POST /api/users ✅
│   ├── globals.css                        # 全局样式 ✅
│   └── layout.tsx                         # 根布局 ✅
├── components/                            # React组件 (待生成)
├── hooks/                                 # 自定义Hooks (待生成)
├── lib/                                   # 工具库 ✅
│   ├── supabase.ts                        # Supabase客户端 ✅
│   ├── constants/                         # 常量定义 ✅
│   │   ├── car-resources.ts               # 加拿大汽车资源配置 ✅
│   │   └── constants.ts                   # 通用常量 ✅
│   ├── groq.ts                            # GROQ AI客户端 ✅
│   ├── gemini.ts                          # Google Gemini客户端 ✅
│   ├── prompts.ts                         # AI提示词模板 ✅
│   ├── ai-utils.ts                        # AI工具函数 ✅
│   ├── utils.ts                           # 通用工具函数 ✅
│   └── validations.ts                     # 数据验证 ✅
├── types/                                 # 类型定义 ✅
│   ├── index.ts                           # 主要类型导出 ✅
│   ├── api.ts                             # API相关类型 ✅
│   ├── chat.ts                            # 聊天相关类型 ✅
│   ├── car.ts                             # 车型相关类型 ✅
│   ├── ui.ts                              # UI组件类型 ✅
│   └── database.ts                        # 数据库类型 ✅
└── styles/                                # 样式文件
    └── globals.css                        # 全局CSS

supabase/                                  # Supabase配置 ✅
├── migrations/                            # 数据库迁移文件 ✅
│   ├── 001_init_schema.sql                # 初始化架构 ✅
│   ├── 002_create_users.sql               # 用户表 ✅
│   ├── 003_create_cars.sql                # 车型表 ✅
│   ├── 004_create_conversations.sql       # 会话表 ✅
│   ├── 005_create_messages.sql            # 消息表 ✅
│   ├── 006_create_recommendations.sql      # 推荐表 ✅
│   ├── 007_create_next_steps.sql          # 下一步建议表 ✅
│   ├── 008_create_indexes.sql             # 索引优化 ✅
│   ├── 009_create_functions.sql           # 函数和触发器 ✅
│   └── 010_insert_sample_data.sql         # 示例数据 ✅
├── .temp/                                 # CLI临时文件 ✅
├── seed.sql                               # 初始数据 ✅
└── config.toml                            # Supabase配置 ✅

public/                                    # 静态资源 (待生成)
├── images/                                # 图片资源
│   ├── logo.svg                           # Logo
│   ├── hero-bg.jpg                        # 首页背景图
│   └── cars/                              # 车型图片
│       └── placeholder.jpg                # 占位图
├── icons/                                 # 图标资源
│   ├── favicon.ico                        # 网站图标
│   ├── icon-192.png                       # PWA图标 192x192
│   └── icon-512.png                       # PWA图标 512x512
├── fonts/                                 # 字体文件（如需要）
└── manifest.json                          # PWA manifest文件
```

## 3. 数据库设计规范

### 3.1 迁移文件命名规范

迁移文件采用三位数字编号格式：`NNN_description.sql`
- 格式：`001_init_schema.sql`
- 编号确保迁移顺序，避免冲突
- 描述部分简洁明了，体现迁移内容
- 这些迁移文件专为 rehui-car 项目的 Supabase 数据库设计

### 3.2 核心表结构

#### users (用户表)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  language TEXT DEFAULT 'zh' CHECK (language IN ('en', 'zh')),
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### conversations (对话表)
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  summary TEXT,
  language TEXT DEFAULT 'zh' CHECK (language IN ('en', 'zh')),
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### messages (消息表)
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### cars (车型表)
```sql
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year_min INTEGER NOT NULL,
  year_max INTEGER NOT NULL,
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  currency TEXT DEFAULT 'CAD',
  category TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  pros_en TEXT[],
  pros_zh TEXT[],
  cons_en TEXT[],
  cons_zh TEXT[],
  features TEXT[],
  image_url TEXT,
  reliability_score DECIMAL(3,2),
  fuel_economy DECIMAL(4,1),
  safety_rating DECIMAL(3,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### recommendations (推荐表)
```sql
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  match_score DECIMAL(3,2) CHECK (match_score BETWEEN 0 AND 1),
  reasoning_en TEXT,
  reasoning_zh TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### next_steps (下一步建议表)
```sql
CREATE TABLE next_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  action_type TEXT CHECK (action_type IN ('research', 'visit', 'contact', 'prepare')),
  url TEXT,
  metadata JSONB DEFAULT '{}',
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 索引优化

```sql
-- 用户表索引
CREATE INDEX idx_users_session_id ON users(session_id);
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;

-- 对话表索引
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_session_id ON conversations(session_id);

-- 消息表索引
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- 车型表索引
CREATE INDEX idx_cars_make_model ON cars(make, model);
CREATE INDEX idx_cars_category ON cars(category);
CREATE INDEX idx_cars_price_range ON cars(price_min, price_max);
CREATE INDEX idx_cars_active ON cars(is_active) WHERE is_active = true;

-- 推荐表索引
CREATE INDEX idx_recommendations_conversation_id ON recommendations(conversation_id);
CREATE INDEX idx_recommendations_car_id ON recommendations(car_id);

-- 下一步表索引
CREATE INDEX idx_next_steps_conversation_id ON next_steps(conversation_id);
CREATE INDEX idx_next_steps_message_id ON next_steps(message_id);
CREATE INDEX idx_next_steps_priority ON next_steps(priority);
```

### 3.4 RLS策略

```sql
-- 启用RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_steps ENABLE ROW LEVEL SECURITY;

-- 车型表：允许所有人查看激活的车型
CREATE POLICY "Anyone can view active cars" ON cars
  FOR SELECT USING (is_active = true);

-- 测试环境：宽松策略
CREATE POLICY "Test users can insert any data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Test users can view any data" ON users FOR SELECT USING (true);
-- ... 其他表类似
```

## 4. AI集成规范

### 4.1 双AI提供商架构

**主提供商**: GROQ (llama-3.1-8b-instant) - 超快响应  
**备用提供商**: Google Gemini (gemini-2.5-flash) - 稳定可靠  
**降级策略**: GROQ失败时自动切换到Gemini

#### GROQ客户端 (`src/lib/groq.ts`)
```typescript
export async function generateChatResponse(
  messages: ChatMessage[],
  language: Language
): Promise<string>

export async function generateCarRecommendation(
  userMessage: string,
  language: Language
): Promise<AIRecommendationResponse>

export async function healthCheck(): Promise<boolean>
```

#### Gemini客户端 (`src/lib/gemini.ts`)
```typescript
// 同GROQ客户端接口
```

### 4.2 AI提示词模板 (`src/lib/prompts.ts`)

```typescript
export const CAR_RECOMMENDATION_PROMPT = (
  userMessage: string,
  language: 'en' | 'zh'
) => `
你是专业的加拿大汽车购买顾问。
用户需求: ${userMessage}
回复语言: ${language === 'zh' ? '中文' : '英文'}

返回JSON格式:
{
  "summary": { "en": "...", "zh": "..." },
  "recommendations": [...],
  "next_steps": [...]
}
`;
```

## 5. API路由规范

### 5.1 健康检查 (`/api/health`)

```typescript
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'up',
      ai: 'up'
    }
  });
}
```

### 5.2 聊天API (`/api/chat`)

```typescript
// POST /api/chat
interface ChatRequest {
  message: string;
  conversation_id?: string;
  language: 'en' | 'zh';
  session_id: string;
}

interface ChatResponse {
  conversation_id: string;
  message_id: string;
  summary: BilingualText;
  recommendations: CarRecommendation[];
  next_steps: NextStep[];
}
```

### 5.3 车型API

```typescript
// GET /api/cars - 列表
interface CarsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  fuel_type?: string;
  price_min?: number;
  price_max?: number;
  make?: string;
  sort_by?: 'price' | 'reliability' | 'fuel_economy';
  sort_order?: 'asc' | 'desc';
}

// GET /api/cars/[id] - 详情
// GET /api/cars/search - 搜索
interface CarSearchParams {
  q: string;
  language?: 'en' | 'zh';
  limit?: number;
}
```

### 5.4 会话API (`/api/conversations`)

```typescript
// GET /api/conversations - 会话列表
interface ConversationsQueryParams {
  page?: number;
  limit?: number;
  user_id?: string;
  session_id?: string;
  language?: 'en' | 'zh';
  sort_by?: 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

// POST /api/conversations - 创建会话
interface CreateConversationRequest {
  user_id?: string;
  title?: string;
  language: 'en' | 'zh';
  session_id: string;
}

interface ConversationResponse {
  id: string;
  user_id: string;
  title?: string;
  summary?: string;
  language: 'en' | 'zh';
  session_id: string;
  created_at: string;
  updated_at: string;
}
```

### 5.5 会话详情API (`/api/conversations/[id]`)

```typescript
// GET /api/conversations/[id] - 获取会话详情及统计
interface ConversationDetailResponse {
  conversation: ConversationResponse;
  message_count: number;
  recommendation_count: number;
  next_step_count: number;
  last_message_at?: string;
}

// PUT /api/conversations/[id] - 更新会话信息
interface UpdateConversationRequest {
  title?: string;
  summary?: string;
}

// DELETE /api/conversations/[id] - 删除会话及相关消息
```

### 5.6 用户API (`/api/users`)

```typescript
// GET /api/users - 用户列表
interface UsersQueryParams {
  page?: number;
  limit?: number;
  session_id?: string;
  language?: 'en' | 'zh';
  sort_by?: 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

// POST /api/users - 创建用户（支持session_id去重）
interface CreateUserRequest {
  email?: string;
  name?: string;
  language: 'en' | 'zh';
  session_id: string;
}

interface UserResponse {
  id: string;
  email?: string;
  name?: string;
  language: 'en' | 'zh';
  session_id: string;
  created_at: string;
  updated_at: string;
}
```

### 5.7 推荐API (`/api/recommendations`)

```typescript
// GET /api/recommendations - 推荐列表
interface RecommendationsQueryParams {
  page?: number;
  limit?: number;
  conversation_id?: string;
  message_id?: string;
  car_id?: string;
  min_score?: number;
  max_score?: number;
  sort_by?: 'created_at' | 'match_score';
  sort_order?: 'asc' | 'desc';
}

// POST /api/recommendations - 创建推荐
interface CreateRecommendationRequest {
  conversation_id: string;
  message_id?: string;
  car_id: string;
  match_score: number;
  reasoning_en?: string;
  reasoning_zh?: string;
}

interface RecommendationResponse {
  id: string;
  conversation_id: string;
  message_id?: string;
  car_id: string;
  match_score: number;
  reasoning_en?: string;
  reasoning_zh?: string;
  created_at: string;
}
```

## 6. 类型系统规范

### 6.1 核心类型 (`src/types/index.ts`)

```typescript
export interface BilingualText {
  en: string;
  zh: string;
}

export type Language = 'en' | 'zh';

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  language: Language;
  createdAt: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year_min: number;
  year_max: number;
  price_min?: number;
  price_max?: number;
  currency: string;
  category: string;
  fuel_type: string;
  description_en?: string;
  description_zh?: string;
  pros_en?: string[];
  pros_zh?: string[];
  cons_en?: string[];
  cons_zh?: string[];
  features: string[];
  image_url?: string;
  reliability_score?: number;
  fuel_economy?: number;
  safety_rating?: number;
  is_active: boolean;
}

export interface CarRecommendation {
  id: string;
  car_id: string;
  match_score: number;
  reasoning_en?: string;
  reasoning_zh?: string;
  created_at?: string;
}

export interface NextStep {
  id: string;
  conversation_id: string;
  message_id: string;
  title_en: string;
  title_zh: string;
  description_en?: string;
  description_zh?: string;
  priority: 'high' | 'medium' | 'low';
  action_type: 'research' | 'visit' | 'contact' | 'prepare';
  url?: string;
  metadata?: Record<string, any>;
  is_completed?: boolean;
  created_at?: string;
}
```

### 6.2 API类型 (`src/types/api.ts`)

```typescript
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface CarFilters {
  category?: string;
  fuel_type?: string;
  make?: string;
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  reliability_min?: number;
  fuel_economy_min?: number;
  safety_rating_min?: number;
}

export interface SortParams {
  sort_by: 'price' | 'reliability' | 'fuel_economy' | 'safety' | 'created_at';
  sort_order: 'asc' | 'desc';
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface APIListResponse<T> extends APIResponse<T[]> {
  pagination: PaginationResponse;
  filters?: any;
}
```

## 7. 组件规范

### 7.1 聊天组件

```typescript
// ChatArea.tsx
interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  language: Language;
}

// ChatInput.tsx
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder: string;
}
```

### 7.2 车型组件

```typescript
// CarCard.tsx
interface CarCardProps {
  car: Car;
  language: Language;
  onClick?: (carId: string) => void;
}

// CarFilter.tsx
interface CarFilterProps {
  filters: CarFilters;
  onChange: (filters: CarFilters) => void;
  language: Language;
}
```

## 8. 开发约定

### 8.1 命名规范

```typescript
// 文件名: kebab-case
chat-input.tsx
car-resources.ts

// 组件名: PascalCase
ChatInput
CarRecommendation

// 函数名: camelCase
sendMessage
generateSearchLinks

// 常量: UPPER_SNAKE_CASE
API_BASE_URL
USED_CAR_PLATFORMS
```

### 8.2 严格编码约束

**核心原则**: 🚫 禁止使用fallback默认值

```typescript
// ❌ 错误 - 禁止使用fallback
const apiKey = process.env.GEMINI_API_KEY || 'default-key';
const email = data.email || 'default@example.com';

// ✅ 正确 - 直接抛出异常
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('Missing required: GEMINI_API_KEY');
}

const email = data.email;
if (!email) {
  throw new Error('Email is required');
}

// 工具函数
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env: ${key}`);
  return value;
}
```

### 8.3 绝对路径约束

**核心原则**: 🎯 所有文件路径必须使用绝对路径，严格禁止相对路径

**项目根目录**: `D:\BaiduSyncdisk\workspace\python_workspace\rehui-car`

```typescript
// ❌ 错误 - 严格禁止相对路径
import { Car } from './types/car';
import { supabase } from '../lib/supabase';
import { utils } from './utils';
import { constants } from '../constants';
const config = require('./config.json');
const data = require('../data/sample.json');

// ❌ 错误 - 禁止所有相对路径符号
const path = './src/components';
const path = '../lib/utils';
const path = './data/sample.json';
const path = '../output/result.txt';

// ✅ 正确 - 使用绝对路径
import { Car } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/types/car';
import { supabase } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/lib/supabase';
import { utils } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/lib/utils';
import { constants } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/lib/constants';
const config = require('D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/config.json');
const data = require('D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/data/sample.json');

// ✅ 正确 - 绝对路径变量
const PROJECT_ROOT = 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car';
const componentPath = `${PROJECT_ROOT}/src/components/ChatInput.tsx`;
const utilsPath = `${PROJECT_ROOT}/src/lib/utils.ts`;

// 工具函数示例
function getAbsolutePath(relativePath: string): string {
  return `${PROJECT_ROOT}/${relativePath}`;
}

// 使用示例
const carTypesPath = getAbsolutePath('src/types/car.ts');
const supabasePath = getAbsolutePath('src/lib/supabase.ts');
```

**严格禁止的路径模式**:
- `./` - 当前目录相对路径
- `../` - 上级目录相对路径  
- `../../` - 多级上级目录相对路径
- 任何包含相对路径符号的路径

**路径映射规则**:
- 配置文件: `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/package.json`
- 源码目录: `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/`
- 测试目录: `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/tests/`
- 文档目录: `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/docs/`
- API路由: `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/app/api/`
- 组件目录: `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/components/`
- 工具库: `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/lib/`
- 类型定义: `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/types/`

### 8.4 错误处理规范

```typescript
// API路由错误处理
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = ChatRequestSchema.parse(body);
    // ... 业务逻辑
    return Response.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 9. 代码生成规范

### 9.1 绝对路径强制约束

**生成代码时必须遵循的路径规范**:

1. **所有import语句必须使用绝对路径**
   ```typescript
   // ✅ 正确 - 使用路径映射（推荐）
   import { Car } from '@/types/car';
   import { supabase } from '@/lib/supabase';
   import { ChatInput } from '@/components/ChatInput';
   import { useChat } from '@/hooks/useChat';
   
   // ✅ 正确 - 完整绝对路径
   import { Car } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/types/car';
   import { supabase } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/lib/supabase';
   
   // ❌ 错误 - 禁止相对路径
   import { Car } from './types/car';
   import { supabase } from '../lib/supabase';
   import { utils } from './utils';
   import { constants } from '../constants';
   ```

2. **所有文件操作必须使用绝对路径**
   ```typescript
   // ✅ 正确
   const configPath = 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/config.json';
   const readmePath = 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/README.md';
   
   // ❌ 错误 - 禁止相对路径
   const configPath = './config.json';
   const readmePath = '../README.md';
   const dataPath = './data/sample.json';
   const outputPath = '../output/result.txt';
   ```

3. **禁止所有相对路径符号**
   ```typescript
   // ❌ 严格禁止的路径模式
   import { something } from './file';           // 禁止 ./
   import { something } from '../file';          // 禁止 ../
   import { something } from '../../file';      // 禁止 ../../
   const path = './relative/path';              // 禁止 ./
   const path = '../relative/path';             // 禁止 ../
   const path = './src/components';             // 禁止 ./
   const path = '../lib/utils';                 // 禁止 ../
   
   // ✅ 正确的绝对路径模式
   import { something } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/file';
   import { something } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/lib/utils';
   const path = 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/components';
   const path = 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/lib/utils';
   ```

4. **工具函数路径处理**
   ```typescript
   const PROJECT_ROOT = 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car';
   
   function getAbsolutePath(relativePath: string): string {
     return `${PROJECT_ROOT}/${relativePath}`;
   }
   
   // 使用示例
   const apiPath = getAbsolutePath('src/app/api/chat/route.ts');
   const componentPath = getAbsolutePath('src/components/ChatInput.tsx');
   ```

### 9.2 路径映射表

#### 9.2.1 TypeScript 路径映射（推荐使用）

| 路径映射 | 实际路径 | 使用示例 |
|----------|----------|----------|
| `@/*` | `./src/*` | `import { Car } from '@/types/car';` |
| `@/components/*` | `./src/components/*` | `import { ChatInput } from '@/components/ChatInput';` |
| `@/lib/*` | `./src/lib/*` | `import { supabase } from '@/lib/supabase';` |
| `@/types/*` | `./src/types/*` | `import { Car } from '@/types/car';` |
| `@/hooks/*` | `./src/hooks/*` | `import { useChat } from '@/hooks/useChat';` |
| `@/app/*` | `./src/app/*` | `import { layout } from '@/app/layout';` |

#### 9.2.2 完整绝对路径映射

| 用途 | 绝对路径 |
|------|----------|
| 项目根目录 | `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/` |
| 配置文件 | `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/package.json` |
| 源码目录 | `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/` |
| API路由 | `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/app/api/` |
| 组件目录 | `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/components/` |
| 工具库 | `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/lib/` |
| 类型定义 | `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/types/` |
| 测试目录 | `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/tests/` |
| 文档目录 | `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/docs/` |
| 静态资源 | `D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/public/` |

### 9.3 相对路径禁止约束

**严格禁止的路径模式**:

```typescript
// ❌ 绝对禁止 - 相对路径符号
import { something } from './file';           // 禁止 ./
import { something } from '../file';          // 禁止 ../
import { something } from '../../file';      // 禁止 ../../
import { something } from '../../../file';   // 禁止 ../../../

// ❌ 绝对禁止 - 相对路径变量
const relativePath = './src/components';
const relativePath = '../lib/utils';
const relativePath = './data/sample.json';

// ❌ 绝对禁止 - 相对路径字符串
const path = './config.json';
const path = '../README.md';
const path = './src/types/car.ts';
const path = '../lib/supabase.ts';

// ❌ 绝对禁止 - 相对路径模板
const path = `./${folder}/${file}`;
const path = `../${relativePath}`;
const path = `./src/${component}`;
```

**正确的绝对路径模式**:

```typescript
// ✅ 正确 - 使用路径映射（推荐）
import { Car } from '@/types/car';
import { supabase } from '@/lib/supabase';
import { ChatInput } from '@/components/ChatInput';
import { useChat } from '@/hooks/useChat';

// ✅ 正确 - 完整绝对路径
import { Car } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/types/car';
import { supabase } from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/lib/supabase';

// ✅ 正确 - 绝对路径变量
const PROJECT_ROOT = 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car';
const configPath = `${PROJECT_ROOT}/config.json`;
const componentPath = `${PROJECT_ROOT}/src/components/ChatInput.tsx`;

// ✅ 正确 - 绝对路径模板
const path = `${PROJECT_ROOT}/src/${component}`;
const path = `${PROJECT_ROOT}/lib/${utility}`;
```

### 9.4 代码生成检查清单

生成任何代码文件时，必须验证：

- [ ] 所有import语句使用绝对路径
- [ ] 所有文件操作使用绝对路径  
- [ ] 所有require/import路径不包含相对路径符号 (`./`, `../`)
- [ ] 路径分隔符使用正斜杠 (`/`) 而非反斜杠 (`\`)
- [ ] 项目根目录路径正确：`D:/BaiduSyncdisk/workspace/python_workspace/rehui-car`
- [ ] 没有使用 `./` 开头的路径
- [ ] 没有使用 `../` 开头的路径
- [ ] 没有使用 `../../` 开头的路径
- [ ] 所有路径都基于项目根目录：`D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/`

## 10. 加拿大汽车资源配置

### 10.1 二手车平台 (`D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/lib/constants/car-resources.ts`)

```typescript
export const USED_CAR_PLATFORMS = {
  AUTOTRADER: {
    name: 'AutoTrader.ca',
    url: 'https://www.autotrader.ca/',
    description: '加拿大最大二手车平台',
    type: 'marketplace',
    search_template: 'https://www.autotrader.ca/cars/{make}/{model}/'
  },
  CARGURUS: {
    name: 'CarGurus Canada',
    url: 'https://www.cargurus.ca/',
    description: '价格评估实用',
    type: 'marketplace'
  },
  KIJIJI: {
    name: 'Kijiji Autos',
    url: 'https://www.kijiji.ca/b-cars-vehicles/canada/c27l0',
    description: '个人卖家常用',
    type: 'classified'
  }
} as const;
```

### 10.2 车辆信息工具

```typescript
export const VEHICLE_INFO_TOOLS = {
  CARFAX_CANADA: {
    name: 'CARFAX Canada',
    url: 'https://www.carfax.ca/',
    description: '车辆历史报告',
    type: 'history_report',
    cost_per_report: 39.99
  },
  KBB_CANADA: {
    name: 'Kelley Blue Book Canada',
    url: 'https://www.kbb.ca/',
    description: '车辆估值工具',
    type: 'valuation',
    free_tier: true
  }
} as const;
```

## 11. MCP (Model Context Protocol) 配置

### 11.1 MCP 服务器配置 (`D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=nbbeiyfukqelsroqssnz"
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/"],
      "env": {
        "ALLOWED_DIRECTORIES": "."
      }
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "browser": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-browser"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

### 11.2 MCP 功能说明

- **Supabase MCP**: 直接访问 Supabase 数据库，执行 SQL 查询和管理数据
- **文件系统 MCP**: 访问项目文件，读取和搜索文件内容
- **内存管理 MCP**: 知识图谱和实体关系管理
- **浏览器 MCP**: 网页自动化和截图功能
- **GitHub MCP**: 代码仓库管理和版本控制
- **思维链 MCP**: 复杂推理和问题解决

## 12. 环境配置

### 12.1 环境变量 (`D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/.env.local`)

```bash
# AI服务
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
```

### 12.2 TypeScript配置 (`D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 12.3 Tailwind配置 (`D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/tailwind.config.js`)

```javascript
module.exports = {
  darkMode: ["class"],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        }
      }
    }
  }
}
```

## 13. 部署配置

### 13.1 Vercel配置 (`D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/vercel.json`)

```json
{
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### 13.2 Next.js配置 (`D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/next.config.js`)

```javascript
module.exports = {
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}
```

---

## 📚 文档说明

本规范文档定义了 rehui-car 项目的技术标准和架构设计。

配合使用：
- **cgs.md** (本文档) - 技术规范和架构设计 (WHAT & WHY)
- **prompt.md** - 操作步骤和进度追踪 (HOW)

---

## 📝 更新日志 (2024-10-03)

### v1.2.0 更新内容

**新增功能**：
- ✅ 添加绝对路径约束规范到代码生成规范
- ✅ 新增第9节"代码生成规范"，包含绝对路径强制约束
- ✅ 更新所有章节中的文件路径为绝对路径
- ✅ 新增代码生成检查清单，确保路径规范执行
- ✅ 强化相对路径禁止约束，严格禁止所有相对路径符号

**技术改进**：
- 🎯 强制使用绝对路径：`D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/`
- 🚫 严格禁止相对路径：`./`, `../`, `../../` 等所有相对路径符号
- 📋 新增路径映射表和检查清单
- 🔧 更新所有配置示例使用绝对路径
- 📚 完善代码生成规范文档
- ⚠️ 新增相对路径禁止约束章节，提供详细错误示例

### v1.1.0 更新内容

**新增功能**：
- ✅ 完成辅助API路由开发（会话、用户、推荐管理）
- ✅ 新增4个辅助API端点及其完整测试覆盖
- ✅ 更新API路由规范文档，新增5.4-5.7节
- ✅ 完成MCP (Model Context Protocol) 配置
- ✅ 新增MCP数据库测试脚本

**项目进度**：
- ✅ 前六阶段完成：基础架构 + 数据层 + AI集成 + API层 + API完善 + 测试基础设施
- 🔄 当前阶段：第七阶段 - UI基础组件开发
- 📊 测试覆盖率：配置文件100% + 工具函数100% + 数据库100% + AI集成100% + API端点100%
- 🔧 MCP配置：Supabase + 文件系统 + 内存管理 + 浏览器 + GitHub + 思维链服务器

**技术统计**：
- 总文件数：100+ 个
- API端点：9个（核心5个 + 辅助4个）
- 测试文件：20+ 个测试脚本 + 共享测试工具库
- 数据库表：6个核心表 + 完整索引和触发器
- MCP服务器：6个配置服务器
