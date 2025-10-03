# 🤖 rehui-car 代码生成操作手册

## 📋 使用说明
本文档配合 `docs/cgs.md` 规范文档使用，专注于**具体操作步骤**和**验收标准**。

### 🎯 核心原则
- **严格遵循** `docs/cgs.md` 中的所有技术规范和架构设计
- **分步执行** 每个步骤完成后等待确认再继续
- **质量优先** 每个文件都必须通过验收标准检查

## 🚀 项目当前状态 (2024-12-19)

### ✅ 已完成阶段
1. **第一阶段：项目基础架构** - 100% 完成
   - 项目配置文件、核心类型系统、基础工具库
   - 测试覆盖率：100% (已完成部分)

2. **第二阶段：数据层建设** - 100% 完成
   - Supabase CLI配置、数据库迁移、Repository模式
   - 真实数据库连接测试通过 ✅
   - RLS策略配置完成，测试环境权限问题已解决 ✅
   - 数据库测试：10/10测试通过，所有CRUD操作正常 ✅

### 🔄 下一步
**步骤 7: AI 集成** - 集成 Google Gemini AI
- 生成AI客户端、提示词模板、工具函数
- 加拿大汽车资源配置

## 📋 分步骤代码生成流程

### 🎯 总体生成策略
**重要**: 必须按照以下步骤顺序逐步生成，每个步骤完成后等待确认再进行下一步。

### 📊 当前进度总览
- **第一阶段：项目基础架构** - ✅ 100% 完成
- **第二阶段：数据层建设** - ✅ 100% 完成  
- **第三阶段：API 层开发** - 🔄 0% 完成
- **第四阶段：UI 基础组件** - 🔄 0% 完成

**下一步**: 步骤 7 - AI 集成 (Google Gemini)

**最新更新**:
- ✅ 数据库层完全就绪：10/10测试通过
- ✅ RLS策略问题已解决：添加测试用策略
- ✅ 环境变量配置优化：Jest测试环境修复

---

## 第一阶段：项目基础架构 (Foundation)

### ✅ 步骤 1: 项目配置文件 - 已完成
**目标**: 建立可运行的项目基础
```
生成文件：
- ✅ package.json (依赖管理)
- ✅ tsconfig.json (TypeScript配置)
- ✅ tailwind.config.js (样式配置)
- ✅ next.config.js (Next.js配置)
- ✅ postcss.config.js (PostCSS配置)
- ✅ .eslintrc.json (ESLint配置)
- ✅ .eslintignore (ESLint忽略文件)
- ✅ jest.config.js (Jest测试配置)
- ✅ jest.setup.js (Jest设置文件)
- ✅ src/app/layout.tsx (Next.js App Router根布局)
- ✅ src/app/globals.css (全局样式文件)
- ✅ __tests__/config/package.test.js (依赖配置测试)
- ✅ __tests__/config/tsconfig.test.js (TypeScript配置测试)
- ✅ __tests__/config/tailwind.test.js (样式配置测试)
- ✅ __tests__/config/next.test.js (Next.js配置测试)
- ✅ __tests__/config/postcss.test.js (PostCSS配置测试)
- ✅ __tests__/config/eslint.test.js (ESLint配置测试)
- ✅ __tests__/config/jest.test.js (Jest配置测试)
- ✅ __tests__/setup/test-setup.ts (测试环境设置)
```

**验收结果**: 
- ✅ 所有配置文件已生成且符合规范
- ✅ 依赖包完整，包含所有必需组件
- ✅ TypeScript 路径别名配置正确
- ✅ Tailwind CSS 主题系统完备
- ✅ Next.js 生产级优化配置
- ✅ ESLint 和 Prettier 代码规范配置
- ✅ Jest 测试环境完整配置
- ✅ 全局样式和CSS变量系统
- ✅ 配置文件验证测试：package.json依赖完整性、版本兼容性
- ✅ TypeScript配置测试：路径别名解析、编译选项验证
- ✅ Tailwind配置测试：主题变量、插件加载、响应式断点
- ✅ Next.js配置测试：构建优化、环境变量、路由配置
- ✅ PostCSS配置测试：插件配置、Tailwind集成、Autoprefixer设置
- ✅ ESLint配置测试：规则验证、插件加载、TypeScript/React规则
- ✅ Jest配置测试：测试环境、模块解析、覆盖率配置
- ✅ 测试环境设置：Jest配置、Mock设置、测试工具初始化
- ✅ 所有配置测试100%通过：137个测试全部成功，配置文件完全就绪


### ✅ 步骤 2: 核心类型系统 - 已完成
**目标**: 建立类型安全基础
```
生成文件：
- ✅ src/types/index.ts (主要类型导出)
- ✅ src/types/api.ts (API相关类型)
- ✅ src/types/chat.ts (聊天相关类型)
- ✅ src/types/car.ts (车型相关类型)
- ✅ src/types/ui.ts (UI组件类型)
- ✅ src/types/__tests__/index.test.ts (主要类型测试)
- ✅ src/types/__tests__/api.test.ts (API类型测试)
- ✅ src/types/__tests__/chat.test.ts (聊天类型测试)
- ✅ src/types/__tests__/car.test.ts (车型类型测试)
```

**验收结果**:
- ✅ 完整的双语文本和语言类型定义
- ✅ 模块化的类型文件组织结构
- ✅ 聊天相关：消息、对话、状态、事件等类型
- ✅ 车型相关：车辆、推荐、筛选、搜索等类型
- ✅ API相关：分页、筛选、排序、响应等类型
- ✅ UI相关：组件属性、状态管理、主题等类型
- ✅ 严格的TypeScript类型安全保障
- ✅ 类型系统测试：60个测试全部通过，覆盖所有核心类型
- ✅ 类型兼容性测试：验证类型间的相互兼容性和继承关系
- ✅ 边界条件测试：验证可选字段、空值、边界值处理
- ✅ 泛型类型测试：验证API响应、分页、筛选等泛型类型
- ✅ 类型导出测试：验证所有类型的正确导出和引用

### ✅ 步骤 3: 基础工具库 - 已完成
**目标**: 提供通用工具函数
```
生成文件：
✅ src/lib/utils.ts (通用工具函数)
✅ src/lib/constants.ts (常量定义)
✅ src/lib/validations.ts (数据验证)
✅ src/lib/__tests__/constants.test.ts (常量测试文件)
✅ src/lib/__tests__/utils.test.ts (工具函数测试)
✅ src/lib/__tests__/validations.test.ts (验证函数测试)
```

**验收结果**:
- ✅ 完整的工具函数库：类名合并、价格格式化、双语文本处理
- ✅ 模块化的常量定义：APP_CONFIG、LANGUAGE_CONFIG、API_ENDPOINTS等
- ✅ 车型相关常量：CAR_CATEGORIES、CAR_CATEGORY_LABELS、FUEL_TYPES、FUEL_TYPE_LABELS
- ✅ 汽车品牌数组：CAR_MAKES包含主流品牌（Toyota、Honda、BMW、Tesla等）
- ✅ 错误处理系统：ERROR_CODES（字符串类型）、ERROR_MESSAGES（双语）
- ✅ API配置：端点定义、动态路由函数（carDetail、conversationDetail）
- ✅ 正则表达式模式：email、uuid、sessionId、carMake等验证
- ✅ 严格的数据验证：Zod模式、自定义验证函数、错误处理
- ✅ 防抖节流、深拷贝、重试机制等实用工具
- ✅ 双语支持的错误消息和成功提示
- ✅ 完整的TypeScript类型安全保障和测试覆盖
- ✅ 工具函数测试：类名合并、价格格式化、双语文本处理等
- ✅ 常量完整性测试：所有配置项、分类、标签、API端点等
- ✅ 数据验证测试：Zod模式验证、自定义验证函数、错误处理
- ✅ 边界条件测试：空值、异常输入、类型错误等
- ✅ 所有测试100%通过：79个测试全部成功，工具库完全就绪
- ✅ 修复问题：SessionId验证、价格格式化、燃油经济性、文件大小、相对时间、文本截断、重试机制
- ✅ 测试覆盖率达到100%：所有工具函数、常量、验证规则完全测试

---

## 第二阶段：数据层建设 (Data Layer)

### ✅ 步骤 4: Supabase CLI 配置 - 已完成
**目标**: 建立 Supabase 开发环境
```
生成文件：
✅ supabase/config.toml (Supabase配置文件)
✅ .vscode/settings.json (Deno扩展配置)
✅ scripts/test-connection.js (连接测试脚本)
✅ env.example (环境变量示例文件)
✅ .env.local (环境变量配置文件)

已完成配置：
✅ Supabase CLI 2.48.3 (通过 npx 使用)
✅ 项目 ID: rehui-car
✅ 线上项目连接模式：
   - 直接连接 Supabase 云端项目
   - 无需本地 Docker 环境
   - 使用 npx supabase link 连接线上项目
   - 通过 npx supabase db push 应用迁移
```

**验收结果**:
- ✅ Supabase CLI 已安装并可用 (版本 2.48.3)
- ✅ 配置文件使用最新格式 (edge_runtime 替代 edge_functions)
- ✅ 项目初始化完成，准备创建数据库迁移
- ✅ VS Code Deno 扩展配置已生成
- ✅ 线上项目连接模式配置完成（推荐模式）
- ✅ 使用 npx 命令，无需全局安装 CLI
- ✅ 环境变量配置完成 (.env.local)
- ✅ Supabase 连接测试通过：成功连接到云端项目
- ✅ 数据库表访问测试通过：cars 表可正常访问
- ✅ 认证系统测试通过：匿名密钥正常工作

### ✅ 步骤 5: 数据库迁移文件 - 已完成
**目标**: 建立完整的数据库结构
```
生成文件：
✅ supabase/migrations/001_create_users_table.sql
✅ supabase/migrations/002_create_conversations_table.sql
✅ supabase/migrations/003_create_messages_table.sql
✅ supabase/migrations/004_create_cars_table.sql
✅ supabase/migrations/005_create_recommendations_table.sql
✅ supabase/migrations/006_create_next_steps_table.sql
✅ supabase/migrations/007_create_functions_triggers.sql
✅ supabase/migrations/008_insert_sample_cars.sql
✅ supabase/__tests__/migrations.test.sql
✅ supabase/__tests__/schema.test.sql
✅ supabase/__tests__/functions.test.sql
✅ supabase/run-tests.sh
✅ supabase/seed.sql
✅ supabase/.temp/ (CLI临时文件目录)
✅ scripts/test-connection.js (数据库连接测试脚本)
✅ scripts/test-database.js (数据库表验证脚本)
```

**验收结果**:
- ✅ 用户表：完整的用户信息字段、UUID主键、时间戳、RLS策略
- ✅ 对话表：会话管理、用户关联、状态跟踪
- ✅ 消息表：聊天记录、角色区分、内容存储
- ✅ 车型表：完整车辆信息、价格、规格、图片
- ✅ 推荐表：AI推荐结果、评分、理由
- ✅ 下一步表：建议操作、优先级、链接
- ✅ 函数触发器：自动更新时间戳、数据验证
- ✅ 示例数据：测试用车型数据、用户数据
- ✅ 迁移文件语法检查：所有SQL文件语法正确
- ✅ 表结构定义：CREATE TABLE语句格式正确
- ✅ 索引创建：所有索引定义完整
- ✅ 函数定义：触发器函数语法正确
- ✅ 迁移脚本执行测试：成功推送到云端数据库
- ✅ 表结构验证：所有表结构正确创建
- ✅ 关系完整性：外键约束、级联删除正确设置
- ✅ 函数触发器测试：触发器函数成功创建
- ✅ 示例数据插入：13条车型数据成功插入
- ✅ 视图创建：popular_cars视图正常工作
- ✅ 数据库连接测试：所有表可正常访问

### ✅ 步骤 6: 数据库客户端 - 已完成
**目标**: 建立数据访问层
```
生成文件：
✅ src/lib/supabase.ts (Supabase客户端)
✅ src/lib/database/index.ts (数据库客户端入口)
✅ src/lib/database/repositories/user.ts
✅ src/lib/database/repositories/conversation.ts
✅ src/lib/database/repositories/message.ts
✅ src/lib/database/repositories/car.ts
✅ src/lib/database/repositories/recommendation.ts
✅ src/lib/database/repositories/next-step.ts
✅ src/lib/database/repositories/index.ts (仓库导出索引)
✅ src/lib/database/__tests__/real-database.test.ts (真实数据库测试)
✅ src/types/database.ts (数据库类型定义)
✅ scripts/test-real-database.js (Node.js数据库测试脚本)
✅ supabase/migrations/009_add_test_rls_policies.sql (测试用RLS策略)
```

**验收结果**:
- ✅ Supabase客户端：连接配置、认证、错误处理完成
- ✅ 仓库模式：统一的CRUD接口、类型安全实现
- ✅ 用户仓库：用户创建、查询、更新、删除功能
- ✅ 对话仓库：会话管理、历史记录、状态更新
- ✅ 消息仓库：消息存储、检索、分页查询
- ✅ 车型仓库：车辆数据、筛选、搜索、排序
- ✅ 推荐仓库：推荐记录、评分、关联查询
- ✅ 下一步仓库：建议管理、优先级排序
- ✅ 真实数据库连接测试：成功连接Supabase云端数据库
- ✅ 车型数据查询测试：成功查询到13条车型记录
- ✅ 车型搜索测试：成功搜索Toyota车型
- ✅ 数据库健康检查：所有6个表都可正常访问
- ✅ 类型安全：完整的TypeScript类型定义和验证
- ✅ 错误处理：RLS策略限制处理、网络异常处理
- ✅ 测试脚本：Node.js独立测试脚本验证数据库功能
- ✅ RLS策略配置：添加测试用策略，解决权限问题
- ✅ 数据库测试：10/10测试通过，所有CRUD操作正常

### 🔄 步骤 7: AI 集成 - 进行中
**目标**: 集成 Google Gemini AI
```
待生成文件：
- src/lib/gemini.ts (Google Gemini客户端)
- src/lib/prompts.ts (AI提示词模板)
- src/lib/ai-utils.ts (AI工具函数)
- src/lib/constants/car-resources.ts (加拿大汽车资源配置)
- src/lib/__tests__/gemini.test.ts (AI客户端测试)
- src/lib/__tests__/ai-utils.test.ts (AI工具函数测试)
- src/lib/__tests__/prompts.test.ts (提示词测试)
```

**验收结果**:
- [ ] Gemini客户端：API连接、认证、配置管理
- [ ] 提示词模板：车型推荐、对话生成、摘要提取
- [ ] AI工具函数：响应解析、数据转换、错误处理
- [ ] 汽车资源配置：加拿大经销商、二手车平台、金融服务
- [ ] 流式响应：实时对话、进度反馈、中断处理
- [ ] 重试机制：API限流、网络异常、服务降级
- [ ] AI客户端连接测试：Gemini API调用、错误处理、重试机制
- [ ] 提示词生成测试：模板渲染、参数替换、格式验证
- [ ] 响应解析测试：JSON解析、数据提取、类型转换
- [ ] 模拟AI响应测试：Mock API、边界条件、异常处理
- [ ] 集成测试：完整对话流程、推荐生成、资源链接

**当前状态**: 数据库层已完成，准备开始AI集成开发

---

## 第三阶段：API 层开发 (API Layer)

### 步骤 8: 核心 API 路由
**目标**: 实现主要业务逻辑 API
```
生成文件：
- src/app/api/health/route.ts (健康检查)
- src/app/api/chat/route.ts (聊天API)
- src/app/api/cars/route.ts (车型列表API)
- src/app/api/cars/[id]/route.ts (车型详情API)
- src/app/api/cars/search/route.ts (车型搜索API)
- __tests__/api/health.test.ts (健康检查API测试)
- __tests__/api/chat.test.ts (聊天API测试)
- __tests__/api/cars.test.ts (车型API测试)
- __tests__/setup/api.ts (API测试设置)
```

**验收结果**:
- [ ] 健康检查API：系统状态、数据库连接、AI服务状态
- [ ] 聊天API：消息处理、AI对话、流式响应、会话管理
- [ ] 车型列表API：分页查询、筛选条件、排序选项
- [ ] 车型详情API：完整信息、相关推荐、资源链接
- [ ] 车型搜索API：关键词搜索、模糊匹配、结果排序
- [ ] 统一错误处理：状态码、错误消息、日志记录
- [ ] 请求验证：Zod模式、参数校验、类型安全
- [ ] HTTP方法测试：GET、POST、PUT、DELETE等
- [ ] 请求验证测试：参数校验、权限检查、数据格式验证
- [ ] 响应格式测试：状态码、数据结构、错误消息
- [ ] 边界条件测试：无效输入、权限不足、服务异常
- [ ] 性能测试：响应时间、并发处理、内存使用

### 步骤 9: 辅助 API 路由
**目标**: 完善 API 功能
```
生成文件：
- src/app/api/conversations/route.ts (对话管理)
- src/app/api/conversations/[id]/route.ts (对话详情)
- src/app/api/users/route.ts (用户管理)
- src/app/api/recommendations/route.ts (推荐历史)
- __tests__/api/conversations.test.ts (对话API测试)
- __tests__/api/users.test.ts (用户API测试)
- __tests__/api/recommendations.test.ts (推荐API测试)
```

**验收结果**:
- [ ] 对话管理API：会话创建、列表查询、状态更新、删除
- [ ] 对话详情API：消息历史、推荐记录、下一步建议
- [ ] 用户管理API：用户信息、偏好设置、历史记录
- [ ] 推荐历史API：推荐查询、评分统计、趋势分析
- [ ] 权限控制：用户认证、数据隔离、访问控制
- [ ] 数据完整性：关联查询、事务处理、一致性保证
- [ ] 对话管理测试：CRUD操作、状态转换、权限验证
- [ ] 用户管理测试：信息更新、偏好保存、数据验证
- [ ] 推荐历史测试：查询筛选、统计分析、数据导出
- [ ] 集成测试：API与数据库、AI服务的完整交互
- [ ] 安全测试：SQL注入、XSS防护、权限绕过

---

## 第四阶段：UI 基础组件 (UI Foundation)

### 步骤 10: shadcn/ui 基础组件
**目标**: 建立 UI 组件库基础
```
生成文件：
- src/components/ui/button.tsx
- src/components/ui/card.tsx
- src/components/ui/input.tsx
- src/components/ui/textarea.tsx
- src/components/ui/badge.tsx
- src/components/ui/dialog.tsx
- src/components/ui/toast.tsx
- src/components/ui/skeleton.tsx
- src/components/ui/select.tsx
- src/components/ui/switch.tsx
- src/components/ui/tabs.tsx
- src/components/ui/radio-group.tsx
- src/components/ui/label.tsx
- src/components/ui/dropdown-menu.tsx
- src/components/ui/__tests__/button.test.tsx
- src/components/ui/__tests__/card.test.tsx
- src/components/ui/__tests__/input.test.tsx
- src/components/ui/__tests__/dialog.test.tsx
- __tests__/setup/ui.tsx (UI测试设置)
```

**验收结果**:
- [ ] 按钮组件：多种变体、尺寸、状态、图标支持
- [ ] 卡片组件：标题、内容、操作区域、响应式布局
- [ ] 输入组件：文本、数字、密码、验证状态、错误提示
- [ ] 文本域组件：多行输入、字符计数、自动调整高度
- [ ] 徽章组件：状态标识、颜色变体、尺寸选项
- [ ] 对话框组件：模态窗口、确认对话、自定义内容
- [ ] 提示组件：成功、错误、警告、信息提示
- [ ] 骨架屏组件：加载状态、占位符、动画效果
- [ ] 选择组件：下拉选择、多选、搜索、分组
- [ ] 开关组件：切换状态、标签、禁用状态
- [ ] 标签页组件：水平、垂直、可关闭、懒加载
- [ ] 单选组组件：选项组、布局、验证

- [ ] 组件渲染测试：所有变体、状态、属性组合
- [ ] 交互功能测试：点击、输入、选择、切换等操作
- [ ] 可访问性测试：键盘导航、屏幕阅读器、ARIA属性
- [ ] 响应式测试：不同屏幕尺寸下的布局适配
- [ ] 主题测试：明暗主题切换、自定义颜色

### 步骤 11: 全局样式和国际化
**目标**: 建立样式系统和多语言支持
```
生成文件：
- src/app/globals.css (全局样式)
- src/lib/i18n.ts (国际化配置)
- src/hooks/useLanguage.ts (语言切换Hook)
- src/hooks/useLocalStorage.ts (本地存储Hook)
- src/hooks/__tests__/useLanguage.test.ts (语言Hook测试)
- src/hooks/__tests__/useLocalStorage.test.ts (本地存储Hook测试)
- __tests__/i18n/translations.test.ts (翻译测试)
```

**验收结果**:
- [ ] 全局样式：CSS变量、主题系统、响应式断点
- [ ] 国际化配置：中英文支持、动态加载、类型安全
- [ ] 语言切换Hook：状态管理、持久化、上下文集成
- [ ] 本地存储Hook：类型安全、序列化、错误处理
- [ ] 主题系统：明暗模式、颜色变量、动画过渡
- [ ] 字体系统：中英文字体、权重、行高优化
- [ ] 语言切换测试：状态更新、持久化、组件重渲染
- [ ] 本地存储测试：数据保存、读取、类型转换、错误处理
- [ ] 翻译完整性测试：所有文本键值、参数替换、复数形式
- [ ] 样式系统测试：主题切换、CSS变量、响应式布局
- [ ] 国际化集成测试：组件内文本、格式化、本地化

---

## 第五阶段：布局和导航 (Layout & Navigation)

### 步骤 12: 根布局和通用组件
**目标**: 建立应用框架
```
生成文件：
- src/app/layout.tsx (根布局)
- src/components/custom/layout/Header.tsx (页头)
- src/components/custom/layout/Footer.tsx (页脚)
- src/components/custom/layout/Sidebar.tsx (侧边栏)
- src/components/custom/layout/MobileNav.tsx (移动端导航)
- src/components/custom/common/LanguageToggle.tsx (语言切换)
- src/components/custom/common/LoadingSpinner.tsx (加载动画)
- src/components/custom/common/ErrorBoundary.tsx (错误边界)
- src/components/custom/layout/__tests__/Header.test.tsx
- src/components/custom/layout/__tests__/Footer.test.tsx
- src/components/custom/layout/__tests__/Sidebar.test.tsx
- src/components/custom/layout/__tests__/MobileNav.test.tsx
- src/components/custom/common/__tests__/LanguageToggle.test.tsx
- src/components/custom/common/__tests__/ErrorBoundary.test.tsx
```

**验收结果**:
- [ ] 根布局：元数据、字体、提供者、全局样式
- [ ] 页头组件：导航菜单、Logo、用户操作、响应式设计
- [ ] 页脚组件：版权信息、链接、社交媒体、多语言
- [ ] 侧边栏：导航菜单、折叠展开、状态持久化
- [ ] 移动端导航：汉堡菜单、滑动抽屉、触摸优化
- [ ] 语言切换：下拉选择、状态同步、图标指示
- [ ] 加载动画：多种样式、尺寸、颜色主题
- [ ] 错误边界：错误捕获、用户友好提示、重试机制
- [ ] 布局组件测试：页头、页脚、侧边栏正确渲染和交互
- [ ] 导航功能测试：路由跳转、菜单展开、移动端适配
- [ ] 响应式测试：不同屏幕尺寸下的布局适配
- [ ] 错误处理测试：错误边界捕获、优雅降级
- [ ] 可访问性测试：键盘导航、屏幕阅读器支持

---

## 第六阶段：核心功能组件 (Core Features)

### 步骤 13: 聊天功能
**目标**: 实现 AI 聊天核心功能
```
生成文件：
- src/hooks/useChat.ts (聊天逻辑Hook)
- src/components/custom/chat/ChatArea.tsx (聊天区域)
- src/components/custom/chat/ChatMessage.tsx (聊天消息)
- src/components/custom/chat/ChatInput.tsx (聊天输入框)
- src/components/custom/chat/MessageBubble.tsx (消息气泡)
- src/components/custom/chat/__tests__/ChatArea.test.tsx
- src/components/custom/chat/__tests__/ChatMessage.test.tsx
- src/components/custom/chat/__tests__/ChatInput.test.tsx
- src/hooks/__tests__/useChat.test.ts
```

**验收结果**:
- [ ] 聊天Hook：消息状态管理、发送接收、错误处理、重试机制
- [ ] 聊天区域：消息列表、自动滚动、加载状态、空状态
- [ ] 聊天消息：用户/AI消息、时间戳、状态指示、操作按钮
- [ ] 聊天输入：文本输入、发送按钮、字符限制、快捷键
- [ ] 消息气泡：样式变体、头像、对齐方式、动画效果
- [ ] 流式响应：实时显示、打字效果、中断处理
- [ ] 会话管理：新建会话、历史记录、会话切换
- [ ] 聊天功能测试：消息发送、接收、显示、状态管理
- [ ] 用户交互测试：输入验证、按钮点击、键盘事件
- [ ] 流式响应测试：实时更新、中断处理、错误恢复
- [ ] 会话管理测试：创建、切换、删除、持久化
- [ ] 可访问性测试：屏幕阅读器、键盘导航、焦点管理

### 步骤 14: 推荐功能
**目标**: 实现汽车推荐展示
```
生成文件：
- src/components/custom/recommendation/RecommendationCard.tsx (推荐卡片)
- src/components/custom/recommendation/SummarySection.tsx (摘要区域)
- src/components/custom/recommendation/NextSteps.tsx (下一步建议)
- src/components/custom/recommendation/ResourceLinks.tsx (资源链接)
- src/components/custom/recommendation/__tests__/RecommendationCard.test.tsx
- src/components/custom/recommendation/__tests__/SummarySection.test.tsx
- src/components/custom/recommendation/__tests__/NextSteps.test.tsx
- src/components/custom/recommendation/__tests__/ResourceLinks.test.tsx
```

**验收结果**:
- [ ] 推荐卡片：车型信息、图片、价格、评分、操作按钮
- [ ] 摘要区域：推荐理由、关键特点、优缺点分析
- [ ] 下一步建议：操作列表、优先级、链接、进度跟踪
- [ ] 资源链接：经销商、二手车平台、金融服务、保险
- [ ] 响应式设计：移动端适配、卡片布局、图片优化
- [ ] 交互功能：收藏、分享、比较、详情查看
- [ ] 推荐功能测试：推荐卡片、摘要、下一步建议显示
- [ ] 数据展示测试：车型信息、价格格式化、图片加载
- [ ] 交互功能测试：按钮点击、链接跳转、状态更新
- [ ] 响应式测试：不同屏幕尺寸下的布局适配
- [ ] 可访问性测试：图片alt文本、链接描述、键盘导航

### 步骤 15: 车型功能
**目标**: 实现车型浏览和搜索
```
生成文件：
- src/hooks/useCars.ts (车型数据Hook)
- src/components/custom/car/CarCard.tsx (车型卡片)
- src/components/custom/car/CarGrid.tsx (车型网格)
- src/components/custom/car/CarDetails.tsx (车型详情)
- src/components/custom/car/CarFilter.tsx (车型筛选)
- src/components/custom/car/__tests__/CarCard.test.tsx
- src/components/custom/car/__tests__/CarGrid.test.tsx
- src/components/custom/car/__tests__/CarDetails.test.tsx
- src/components/custom/car/__tests__/CarFilter.test.tsx
- src/hooks/__tests__/useCars.test.ts
```

**验收结果**:
- [ ] 车型Hook：数据获取、筛选、搜索、分页、缓存
- [ ] 车型卡片：图片、基本信息、价格、操作按钮
- [ ] 车型网格：响应式布局、加载状态、空状态、分页
- [ ] 车型详情：完整信息、规格参数、图片轮播、相关推荐
- [ ] 车型筛选：品牌、价格、燃料类型、年份、排序
- [ ] 搜索功能：关键词搜索、自动完成、搜索历史
- [ ] 性能优化：虚拟滚动、图片懒加载、数据缓存
- [ ] 车型功能测试：车型列表、详情、筛选、搜索
- [ ] Hook功能测试：数据获取、状态更新、错误处理
- [ ] 筛选功能测试：多条件筛选、重置、URL同步
- [ ] 搜索功能测试：关键词匹配、结果排序、历史记录
- [ ] 性能测试：大数据量渲染、内存使用、响应时间

---

## 第七阶段：页面组件 (Pages)

### 步骤 16: 主要页面
**目标**: 实现核心页面功能
```
生成文件：
- src/app/page.tsx (首页)
- src/app/chat/page.tsx (聊天页面)
- src/app/cars/page.tsx (车型列表页面)
- src/app/cars/[id]/page.tsx (车型详情页面)
- __tests__/pages/home.test.tsx
- __tests__/pages/chat.test.tsx
- __tests__/pages/cars.test.tsx
- __tests__/pages/car-detail.test.tsx
```

**验收结果**:
- [ ] 首页：欢迎信息、功能介绍、快速入口、最新推荐
- [ ] 聊天页面：聊天界面、会话列表、设置选项、历史记录
- [ ] 车型列表页面：车型网格、筛选器、搜索框、分页导航
- [ ] 车型详情页面：详细信息、图片轮播、相关推荐、操作按钮
- [ ] SEO优化：元数据、结构化数据、Open Graph、Twitter Cards
- [ ] 性能优化：代码分割、预加载、图片优化、缓存策略
- [ ] 页面渲染测试：所有页面正确加载和显示
- [ ] 路由测试：页面间导航、参数传递、深层链接
- [ ] SEO测试：元数据正确性、结构化数据验证
- [ ] 性能测试：首屏加载时间、资源大小、Core Web Vitals
- [ ] 用户体验测试：交互响应、错误处理、加载状态

### 步骤 17: 辅助页面和错误处理
**目标**: 完善用户体验
```
生成文件：
- src/app/loading.tsx (全局加载页面)
- src/app/error.tsx (全局错误页面)
- src/app/not-found.tsx (404页面)
- src/app/chat/loading.tsx (聊天加载页面)
- src/app/chat/error.tsx (聊天错误页面)
- src/app/cars/loading.tsx (车型加载页面)
- src/app/cars/error.tsx (车型错误页面)
- __tests__/pages/error-pages.test.tsx (错误页面测试)
- __tests__/pages/loading-pages.test.tsx (加载页面测试)
- __tests__/e2e/user-journey.test.ts (用户流程端到端测试)
```

**验收结果**:
- [ ] 全局加载页面：品牌一致的加载动画、进度指示
- [ ] 全局错误页面：友好的错误提示、重试按钮、导航链接
- [ ] 404页面：自定义设计、搜索建议、返回导航
- [ ] 聊天加载页面：聊天界面骨架屏、消息加载动画
- [ ] 聊天错误页面：连接失败提示、重连机制、降级方案
- [ ] 车型加载页面：车型卡片骨架屏、筛选器占位符
- [ ] 车型错误页面：数据获取失败提示、刷新按钮
- [ ] 统一设计语言：一致的视觉风格、交互模式
- [ ] 加载状态测试：骨架屏、加载动画、数据获取
- [ ] 错误处理测试：404页面、错误边界、网络异常
- [ ] 端到端测试：完整用户流程、关键业务场景
- [ ] 用户体验测试：页面切换、状态转换、错误恢复
- [ ] 可访问性测试：错误信息朗读、键盘导航、焦点管理

---

## 第八阶段：高级功能 (Advanced Features)

### 步骤 18: 用户偏好和会话管理
**目标**: 增强用户体验
```
生成文件：
- src/components/custom/common/UserPreferences.tsx (用户偏好设置)
- src/components/custom/common/SearchBox.tsx (搜索框)
- src/components/custom/common/BackButton.tsx (返回按钮)
- src/hooks/useSession.ts (会话管理Hook)
- src/hooks/useDebounce.ts (防抖Hook)
- src/hooks/useApi.ts (API调用Hook)
- src/components/custom/common/__tests__/UserPreferences.test.tsx
- src/components/custom/common/__tests__/SearchBox.test.tsx
- src/components/custom/common/__tests__/BackButton.test.tsx
- src/hooks/__tests__/useSession.test.ts
- src/hooks/__tests__/useDebounce.test.ts
- src/hooks/__tests__/useApi.test.ts
```

**验收结果**:
- [ ] 用户偏好设置：语言选择、主题切换、通知设置、数据同步
- [ ] 搜索框：实时搜索、自动完成、历史记录、快捷键
- [ ] 返回按钮：智能导航、历史记录、状态保持
- [ ] 会话管理Hook：会话创建、持久化、清理、状态同步
- [ ] 防抖Hook：输入优化、API调用控制、性能提升
- [ ] API调用Hook：统一接口、错误处理、加载状态、重试机制
- [ ] 数据持久化：本地存储、会话存储、状态恢复
- [ ] 用户偏好测试：设置保存、恢复、同步功能
- [ ] 搜索功能测试：实时搜索、自动完成、历史记录
- [ ] 导航测试：返回按钮、路由历史、状态保持
- [ ] 会话管理测试：会话创建、维护、清理、持久化
- [ ] 性能测试：防抖效果、API调用优化、内存使用

### 步骤 19: 上下文提供者
**目标**: 全局状态管理
```
生成文件：
- src/components/custom/providers/LanguageProvider.tsx (语言上下文)
- src/components/custom/providers/ThemeProvider.tsx (主题上下文)
- src/components/custom/providers/ChatProvider.tsx (聊天上下文)
- src/components/custom/providers/__tests__/LanguageProvider.test.tsx
- src/components/custom/providers/__tests__/ThemeProvider.test.tsx
- src/components/custom/providers/__tests__/ChatProvider.test.tsx
- __tests__/integration/providers.test.tsx (上下文集成测试)
```

**验收结果**:
- [ ] 语言上下文：多语言状态管理、切换逻辑、持久化
- [ ] 主题上下文：明暗主题切换、系统主题检测、动画过渡
- [ ] 聊天上下文：全局聊天状态、消息管理、会话同步
- [ ] 状态共享：跨组件数据共享、实时更新、性能优化
- [ ] 错误处理：上下文错误边界、降级方案、用户提示
- [ ] 类型安全：TypeScript支持、严格类型检查、智能提示
- [ ] 上下文提供者测试：状态共享、更新通知、错误处理
- [ ] 语言切换测试：状态同步、组件重渲染、持久化
- [ ] 主题切换测试：样式更新、动画效果、系统同步
- [ ] 聊天状态测试：消息管理、会话同步、错误恢复
- [ ] 集成测试：多个上下文协同工作、状态一致性

---

## 第九阶段：工具和配置 (Tools & Config)

### 步骤 20: 开发工具配置
**目标**: 完善开发环境
```
生成文件：
- .eslintrc.json (ESLint配置)
- .prettierrc (Prettier配置)
- .gitignore (Git忽略文件)
- vercel.json (Vercel部署配置)
- __tests__/config/eslint.test.js (ESLint配置测试)
- __tests__/config/prettier.test.js (Prettier配置测试)
- scripts/validate-config.js (配置验证脚本)
```

**验收结果**:
- [ ] ESLint配置：TypeScript规则、React规则、自定义规则、错误级别
- [ ] Prettier配置：代码格式化、一致性规则、编辑器集成
- [ ] Git忽略文件：构建产物、依赖、环境变量、临时文件
- [ ] Vercel部署配置：构建设置、环境变量、重写规则、性能优化
- [ ] 开发工作流：代码检查、自动格式化、预提交钩子
- [ ] 团队协作：统一代码风格、质量标准、最佳实践
- [ ] 代码质量测试：ESLint规则验证、格式化检查
- [ ] 构建测试：生产构建、部署配置、环境变量
- [ ] 工具集成测试：编辑器配置、Git钩子、CI/CD流程
- [ ] 性能测试：构建时间、包大小、运行时性能
- [ ] 兼容性测试：不同环境、浏览器、Node版本

### 步骤 21: 文档和脚本
**目标**: 项目文档和自动化
```
生成文件：
- README.md (项目说明文档)
- supabase/seed.sql (数据库种子数据)
- supabase/config.toml (Supabase配置)
- __tests__/integration/full-app.test.ts (完整应用集成测试)
- __tests__/performance/load.test.ts (性能测试)
- __tests__/accessibility/a11y.test.ts (可访问性测试)
- __tests__/security/security.test.ts (安全性测试)
- scripts/test-coverage.js (测试覆盖率脚本)
- scripts/quality-check.js (代码质量检查脚本)
```

**验收结果**:
- [ ] README文档：项目介绍、安装指南、使用说明、API文档
- [ ] 数据库种子数据：测试用户、示例车型、推荐数据、配置数据
- [ ] Supabase配置：数据库连接、认证设置、存储配置、边缘函数
- [ ] 部署指南：环境配置、构建流程、部署步骤、故障排除
- [ ] 开发文档：架构说明、代码规范、贡献指南、更新日志
- [ ] API文档：接口说明、参数定义、响应格式、错误码
- [ ] 完整集成测试：所有功能模块协同工作验证
- [ ] 性能测试：页面加载时间、API响应时间、内存使用
- [ ] 可访问性测试：WCAG标准合规、屏幕阅读器支持
- [ ] 安全性测试：XSS防护、CSRF防护、输入验证
- [ ] 代码质量：测试覆盖率>90%、ESLint无错误、TypeScript严格模式
- [ ] 部署就绪：所有配置正确、环境变量完整、构建成功

---

## 🔧 每个步骤的执行格式

### 当生成任何代码时，你必须：

1. **声明当前步骤**
   ```
   === 第X阶段 - 步骤Y: [步骤名称] ===
   基于 docs/cgs.md 规范，我将生成以下文件：
   - [文件1路径]
   - [文件2路径]
   ```

2. **说明文件用途**
   ```
   这些文件的作用是：[具体功能描述]
   符合规范中的 [具体章节] 要求
   ```

3. **逐个生成文件**
   - 一次只生成一个文件
   - 包含完整的实现代码
   - 添加适当的注释和文档
   - 包含错误处理逻辑

4. **步骤完成确认**
   ```
   ✅ 步骤Y完成！
   生成的文件：[文件列表]
   
   请确认这些文件是否符合要求，然后我将继续下一步。
   ```

## 🔧 命名规范要求

### 严格遵循的命名规范
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

// 接口名: PascalCase + Interface后缀
ChatInputProps
CarRepository
```

## 📝 具体生成示例

### 示例 1: 步骤执行格式
```
=== 第一阶段 - 步骤 1: 项目配置文件 ===
基于 docs/cgs.md 规范，我将生成以下文件：
- package.json (依赖管理)
- tsconfig.json (TypeScript配置)

这些文件的作用是：建立可运行的项目基础架构
符合规范中的 第12章 环境配置规范 要求

[生成具体文件内容...]

✅ 步骤1完成！
生成的文件：package.json, tsconfig.json

请确认这些文件是否符合要求，然后我将继续步骤2。
```

### 示例 2: 用户请求格式
```
请开始 rehui-car 项目的代码生成。

从第一阶段 - 步骤1开始：项目配置文件
```

### 示例 3: 继续下一步格式
```
步骤1的文件看起来很好，请继续步骤2：核心类型系统
```

## ✅ 验收标准检查清单

### 每个文件生成后必须检查：

#### 📁 配置文件验收标准
- [ ] 包含所有必需的依赖项和版本号
- [ ] 配置项与 `cgs.md` 规范完全一致
- [ ] 可以直接运行 `npm install` 无错误

#### 🔧 TypeScript 文件验收标准
- [ ] 所有导入路径正确且可解析
- [ ] 完整的类型定义，无 `any` 类型
- [ ] 符合 `cgs.md` 中的接口定义
- [ ] 包含适当的 JSDoc 注释

#### 🎨 组件文件验收标准
- [ ] 使用正确的 shadcn/ui 组件
- [ ] 支持中英文双语 (使用 `useLanguage` Hook)
- [ ] 响应式设计 (移动端适配)
- [ ] 包含 loading 和 error 状态处理
- [ ] 遵循可访问性标准 (aria-labels 等)
- [ ] 包含对应的测试文件 (*.test.tsx)

#### 🌐 API 路由验收标准
- [ ] 使用 zod 进行输入验证
- [ ] 完整的错误处理和状态码
- [ ] 符合 `cgs.md` 中的 API 接口定义
- [ ] 包含适当的日志记录
- [ ] 包含对应的API测试文件 (__tests__/api/*.test.ts)

#### 🗄️ 数据库文件验收标准
- [ ] SQL 语法正确无误
- [ ] 包含所有必要的索引和约束
- [ ] 符合 `cgs.md` 中的表结构定义
- [ ] 包含适当的触发器和函数
- [ ] 包含数据库操作测试文件 (repositories.test.ts)

#### 🧪 测试文件验收标准
- [ ] 测试覆盖率达到90%以上
- [ ] 包含单元测试、集成测试、端到端测试
- [ ] 测试用例覆盖正常流程和边界条件
- [ ] Mock外部依赖 (API、数据库等)
- [ ] 测试文件命名规范 (*.test.ts, *.test.tsx)
- [ ] 包含测试设置文件 (__tests__/setup/)

## 🚨 常见问题和解决方案

### 问题 1: 类型导入错误
```typescript
// ❌ 错误示例
import { Car } from '../types'

// ✅ 正确示例
import { Car } from '@/types'
```

### 问题 2: 组件缺少国际化
```typescript
// ❌ 错误示例
<Button>Save</Button>

// ✅ 正确示例
const { t } = useLanguage();
<Button>{t('common.save')}</Button>
```

### 问题 3: API 缺少错误处理
```typescript
// ❌ 错误示例
export async function POST(request: Request) {
  const data = await request.json();
  return Response.json(data);
}

// ✅ 正确示例
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ChatRequestSchema.parse(body);
    // ... 处理逻辑
    return Response.json(result);
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 🎯 快速启动命令

### 开始新项目生成
```
请开始 rehui-car 项目代码生成。
从第一阶段 - 步骤1开始：项目配置文件
```

### 继续下一步
```
步骤X完成，请继续步骤Y：[步骤名称]
```

### 修复问题
```
步骤X的 [文件名] 有问题，请重新生成并修复：[具体问题描述]
```

### 跳过到特定步骤
```
请跳过到第X阶段 - 步骤Y：[步骤名称]
```

### 运行测试验证
```
请运行步骤X.1的测试：[测试类型]
```

### 生成测试文件
```
请为步骤X生成对应的测试文件
```

### 当前项目状态
```
当前已完成：第一阶段和第二阶段
下一步：步骤 7 - AI 集成
请继续步骤 7：AI 集成
```

---

## 📖 文档关系说明

- **`docs/cgs.md`** - 完整的技术规范和架构设计 (WHAT & WHY)
- **`docs/prompt.md`** - 具体的操作步骤和验收标准 (HOW)

两个文档配合使用，确保代码生成的**规范性**和**可操作性**！🎯 