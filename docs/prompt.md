# 🤖 rehui-car 操作手册

## 📋 使用说明

**本文档专注于操作步骤和进度追踪**  
**技术规范请参考 `docs/cgs.md`**

### 🎯 核心原则
- 严格遵循 `cgs.md` 规范
- 分步执行，完成后确认
- 质量优先，真实测试
- 禁止Mock测试
- **每个源文件必须有对应的测试脚本**
- **所有测试脚本统一放在 tests/ 目录**
- **代码生成后必须进行质量检查**
- **测试脚本生成后必须进行质量检查**

### 🔧 代码生成与测试质量约束

#### 📋 代码生成约束
- ✅ **路径规范**：严格使用绝对路径（`@/` 或完整绝对路径），禁止相对路径（`./`, `../`）
- ✅ **类型安全**：所有TypeScript文件必须有完整类型定义，禁止使用 `any` 类型
- ✅ **错误处理**：所有API路由和函数必须有完整的错误处理机制
- ✅ **国际化支持**：所有UI组件必须支持中英文双语切换
- ✅ **代码规范**：符合ESLint和TypeScript严格模式要求
- ✅ **文档注释**：关键函数和类必须有JSDoc注释

#### 🧪 测试质量约束
- ✅ **真实环境**：所有测试必须使用真实API和数据库，禁止Mock测试
- ✅ **测试覆盖**：每个源文件必须有对应的测试脚本，测试覆盖率100%
- ✅ **独立测试**：每个测试脚本必须独立可运行，不依赖其他测试
- ✅ **环境变量**：测试必须使用 `.env.local` 环境变量配置
- ✅ **测试命名**：测试文件命名规范 `test-[文件名].js`
- ✅ **测试通过率**：所有测试必须100%通过，不允许失败

#### 🔍 质量检查流程
- ✅ **代码生成后**：立即运行语法检查、类型检查、代码质量检查
- ✅ **测试生成后**：立即运行测试脚本，确保100%通过
- ✅ **集成验证**：检查新代码是否影响现有功能
- ✅ **文档更新**：完成质量检查后立即更新项目文档

### 🚀 快速开发命令

```bash
# 检查环境配置
npm run check-env

# 测试所有API
npm run quick-test

# 启动开发环境
npm run quick-dev

# 运行完整测试套件（推荐）
node scripts/run-all-tests.js

# 运行配置文件测试
node scripts/run-config-tests.js

# 验证API路由文件生成状态
node scripts/test-api-routes.js

# 运行特定测试
node tests/[category]/test-[name].js

# 代码质量检查
npm run lint
npm run type-check

# 代码质量检查（详细）
node scripts/check-code-quality.js

# 自动质量检查（推荐）
npm run check:auto
```

## 🔍 代码质量检查流程

### 📋 代码生成后质量检查步骤

**每次生成代码后必须执行以下检查：**

#### 方法一：自动质量检查（推荐）
```bash
# 一键运行所有质量检查
npm run check:auto
```

#### 方法二：手动质量检查
1. **语法检查**
   ```bash
   npm run lint
   npm run type-check
   ```

2. **功能验证**
   ```bash
   # 检查导入导出是否正确
   node scripts/check-imports.js
   
   # 检查类型定义是否完整
   node scripts/check-types.js
   ```

3. **测试脚本验证**
   ```bash
   # 运行对应的测试脚本
   node tests/[category]/test-[name].js
   ```

4. **集成测试**
   ```bash
   # 检查新代码是否影响现有功能
   npm run test:integration
   ```

### 🚨 强制质量约束

#### 代码生成约束
- 🚫 **禁止相对路径**：严格禁止使用 `./`, `../`, `../../` 等相对路径
- ✅ **强制绝对路径**：必须使用 `@/` 路径映射或完整绝对路径
- ✅ **类型安全**：所有TypeScript文件必须有完整类型定义，禁止 `any` 类型
- ✅ **错误处理**：所有API路由必须有完整的try-catch错误处理
- ✅ **国际化支持**：所有UI组件必须支持中英文双语
- ✅ **代码规范**：必须通过ESLint和TypeScript严格检查

#### 测试质量约束
- 🚫 **禁止Mock测试**：严格禁止使用Mock，必须使用真实API和数据库
- ✅ **真实环境**：所有测试必须使用 `.env.local` 环境变量
- ✅ **测试覆盖**：每个源文件必须有对应的测试脚本
- ✅ **独立测试**：每个测试脚本必须独立可运行
- ✅ **测试通过率**：所有测试必须100%通过
- ✅ **测试命名**：测试文件必须按 `test-[文件名].js` 命名

### 📋 测试脚本生成后质量检查步骤

**每次生成测试脚本后必须执行以下检查：**

#### 方法一：自动质量检查（推荐）
```bash
# 一键运行所有质量检查
npm run check:auto
```

#### 方法二：手动质量检查
1. **测试脚本语法检查**
   ```bash
   node scripts/check-test-syntax.js
   ```

2. **测试覆盖率检查**
   ```bash
   node scripts/check-test-coverage.js
   ```

3. **测试脚本执行验证**
   ```bash
   # 运行新生成的测试脚本
   node tests/[category]/test-[name].js
   ```

4. **测试结果验证**
   ```bash
   # 确保测试通过且输出正确
   node scripts/validate-test-results.js
   ```

### 🔄 自动化质量检查

#### 持续集成检查
```bash
# 在 CI/CD 中运行
npm run check:auto
```

### 🚨 质量检查失败处理

**如果质量检查失败：**
1. 立即停止后续开发
2. 修复发现的问题
3. 重新运行质量检查
4. 确认所有检查通过后再继续


## 📊 项目当前状态 (2024-10-03)

### ✅ 已完成阶段

**第一阶段：项目基础架构** - 100% ✅
- 项目配置文件 ✅
- 核心类型系统 ✅
- 基础工具库 ✅
- 完整测试套件 ✅

**第二阶段：数据层建设** - 100% ✅
- Supabase CLI配置 ✅
- 数据库迁移文件 ✅
- Repository模式实现 ✅
- 真实数据库测试通过 ✅

**第三阶段：AI集成** - 100% ✅
- GROQ AI客户端 ✅ (主要提供商)
- Gemini AI客户端 ✅ (备用提供商)
- 双AI架构和自动降级机制 ✅
- AI提示词模板系统 ✅
- AI工具函数库 ✅
- 加拿大汽车资源配置 ✅
- 真实API测试通过 ✅
- 综合测试覆盖率100% ✅

**第四阶段：API层开发** - 100% ✅
- 健康检查API ✅
- 聊天API ✅
- 车型列表/详情/搜索API ✅
- 真实数据测试通过 ✅

**第五阶段：API层完善** - 100% ✅
- 核心API路由 ✅ (健康检查、聊天、车型)
- 辅助API路由 ✅ (会话、用户、推荐管理)
- API端点总数：9个 ✅
- 真实数据测试通过 ✅

**第六阶段：测试基础设施** - 100% ✅
- 配置文件测试套件 ✅
- API端点测试套件 ✅ (9个端点完整覆盖)
- 数据库操作测试套件 ✅ (完成重构优化)
- 数据库迁移文件测试套件 ✅ (新增：迁移文件语法和结构测试)
- AI集成测试套件 ✅
- 工具函数测试套件 ✅
- 共享测试工具库 ✅ (新增)
- MCP数据库测试套件 ✅ (新增：MCP连接和综合功能测试)
- 测试通过率: 100% ✅
- 测试代码优化: 数据库测试从1424行精简至282行，减少80%冗余代码
- 迁移文件测试: 10个迁移文件全部通过语法和结构验证

### 🔄 进行中

**第七阶段：UI基础组件** - 0%
- shadcn/ui基础组件
- 全局样式和国际化
- 语言切换Hook
- 主题系统

### 📈 项目统计

- **总文件数**: 100+ 个
- **辅助脚本**: 3个项目工具脚本（测试套件、配置测试、API验证）
- **数据库表**: 6个表 + 1个视图 + 完整索引和触发器
- **示例数据**: 13条车型记录
- **API端点**: 9个端点（核心5个 + 辅助4个）
- **AI提供商**: 2个（GROQ + Gemini，双架构自动降级）
- **测试文件数**: 25+ 个测试脚本 + 3个辅助脚本工具 + 共享测试工具库
- **测试覆盖率**: 配置文件100% + 工具函数100% + 数据库100% + AI集成100% + API端点100% + MCP工具100%
- **测试优化**: 数据库测试完成重构优化，从1424行精简至282行，减少80%冗余代码
- **测试工具**: 完整测试套件（综合报告）+ 配置专项测试 + API路由验证工具 + MCP数据库测试
- **AI集成**: GROQ + Gemini双AI架构，自动降级机制，6个AI测试脚本，100%测试通过

---

## 📋 分步骤代码生成流程

### 第一阶段：项目基础架构 ✅

#### 步骤 1: 项目配置文件 ✅
```
生成文件：
- package.json
- package-lock.json
- tsconfig.json
- tailwind.config.js
- next.config.js
- .eslintrc.json
- .gitignore
- src/app/layout.tsx
- src/app/globals.css

测试脚本：
- tests/config/test-package.js ✅
- tests/config/test-tsconfig.js ✅
- tests/config/test-tailwind.js ✅
- tests/config/test-next-config.js ✅
- tests/config/test-eslint.js ✅
- tests/config/test-layout.js ✅
- tests/config/test-globals-css.js ✅
```

#### 步骤 2: 核心类型系统 ✅
```
生成文件：
- src/types/index.ts
- src/types/api.ts
- src/types/chat.ts
- src/types/car.ts
- src/types/ui.ts
- src/types/database.ts

测试脚本：
- tests/types/test-index.js ✅
- tests/types/test-api.js ✅
- tests/types/test-chat.js ✅
- tests/types/test-car.js ✅
- tests/types/test-ui.js ✅
- tests/types/test-database.js ✅ 
```

#### 步骤 3: 基础工具库 ✅
```
生成文件：
- src/lib/utils.ts
- src/lib/constants.ts
- src/lib/validations.ts

测试脚本：
- tests/lib/test-utils.js ✅
- tests/lib/test-constants.js ✅
- tests/lib/test-validations.js ✅
```

---

### 第二阶段：数据层建设 ✅

#### 步骤 4: 数据库层建设 ✅
```
配置完成：
- Supabase CLI 2.48.3 (npx)
- 线上项目连接模式
- .env.local环境变量
- MCP Supabase服务器配置 ✅

生成文件：
- src/lib/supabase.ts ✅ (简化的数据库客户端)
- supabase/migrations/001_init_schema.sql ✅ (基础架构和扩展)
- supabase/migrations/002_create_users.sql ✅ (用户表)
- supabase/migrations/003_create_cars.sql ✅ (汽车表)
- supabase/migrations/004_create_conversations.sql ✅ (对话表)
- supabase/migrations/005_create_messages.sql ✅ (消息表)
- supabase/migrations/006_create_recommendations.sql ✅ (推荐表)
- supabase/migrations/007_create_next_steps.sql ✅ (下一步行动表)
- supabase/migrations/008_create_indexes.sql ✅ (性能优化索引)
- supabase/migrations/009_create_functions.sql ✅ (数据库函数)
- supabase/migrations/010_insert_sample_data.sql ✅ (示例数据)

MCP配置：
- .cursor/mcp.json ✅ (项目级MCP服务器配置)
- Supabase MCP服务器 ✅ (数据库操作工具)
- 文件系统MCP服务器 ✅ (文件操作工具)
- 内存管理MCP服务器 ✅ (知识图谱工具)
- 浏览器MCP服务器 ✅ (网页自动化工具)
- GitHub MCP服务器 ✅ (代码仓库工具)
- 思维链MCP服务器 ✅ (推理工具)

测试脚本：
- tests/database/test-connection.js ✅ (数据库连接测试)
- tests/database/test-env-config.js ✅ (环境变量配置测试)
- tests/database/test-table-creation.js ✅ (数据库表创建测试)
- tests/database/test-data-insertion.js ✅ (数据插入和查询测试)
- tests/lib/test-supabase.js ✅ (Supabase客户端测试)
- tests/database/test-mcp-connection.js ✅ (MCP数据库连接测试)
- tests/database/test-mcp-comprehensive.js ✅ (MCP数据库综合功能测试) 
```

#### 步骤 5: AI集成 ✅
```
生成文件：
- src/lib/groq.ts ✅
- src/lib/gemini.ts ✅
- src/lib/prompts.ts ✅
- src/lib/ai-utils.ts ✅
- src/lib/constants/car-resources.ts ✅

测试脚本：
- tests/ai/test-groq.js ✅
- tests/ai/test-gemini.js ✅
- tests/ai/test-prompts.js ✅
- tests/ai/test-ai-utils.js ✅
- tests/ai/test-car-resources.js ✅
- tests/ai/test-ai-integration.js ✅

测试结果：所有AI集成测试100%通过 ✅
技术特性：双AI架构 + 自动降级 + 中英双语 + 加拿大汽车资源 ✅
```

---

### 第三阶段：API层开发

#### 步骤 6: 核心API路由
```
生成文件：
- src/app/api/health/route.ts
- src/app/api/chat/route.ts
- src/app/api/cars/route.ts
- src/app/api/cars/[id]/route.ts
- src/app/api/cars/search/route.ts

测试脚本：
- tests/api/test-health.js (待创建)
- tests/api/test-chat.js (待创建)
- tests/api/test-cars.js (待创建)
- tests/api/test-cars-detail.js (待创建)
- tests/api/test-cars-search.js (待创建)
```



#### 步骤 7: 辅助API路由
```
生成文件：
- src/app/api/conversations/route.ts
- src/app/api/conversations/[id]/route.ts
- src/app/api/users/route.ts
- src/app/api/recommendations/route.ts

测试脚本：
- tests/api/test-conversations.js 
- tests/api/test-conversations-detail.js
- tests/api/test-users.js
- tests/api/test-recommendations.js 

```

---

### 第七阶段：UI基础组件 (当前阶段)

#### 步骤 8: shadcn/ui基础组件 (待完成)
```
待生成文件：
- src/components/ui/button.tsx
- src/components/ui/card.tsx
- src/components/ui/input.tsx
- src/components/ui/textarea.tsx
- src/components/ui/badge.tsx
- src/components/ui/dialog.tsx
- src/components/ui/select.tsx
- src/components/ui/tabs.tsx
- src/components/ui/avatar.tsx
- src/components/ui/separator.tsx
- src/components/ui/skeleton.tsx
- src/components/ui/scroll-area.tsx

测试脚本：
- tests/components/ui/test-button.js (待创建)
- tests/components/ui/test-card.js (待创建)
- tests/components/ui/test-input.js (待创建)
- tests/components/ui/test-textarea.js (待创建)
- tests/components/ui/test-badge.js (待创建)
- tests/components/ui/test-dialog.js (待创建)
- tests/components/ui/test-select.js (待创建)
- tests/components/ui/test-tabs.js (待创建)
- tests/components/ui/test-avatar.js (待创建)
- tests/components/ui/test-separator.js (待创建)
- tests/components/ui/test-skeleton.js (待创建)
- tests/components/ui/test-scroll-area.js (待创建)
```

#### 步骤 9: 全局样式和国际化 (待完成)
```
待生成文件：
- src/app/globals.css
- src/lib/i18n.ts
- src/hooks/useLanguage.ts
- src/hooks/useLocalStorage.ts

测试脚本：
- tests/lib/test-i18n.js (待创建)
- tests/hooks/test-useLanguage.js (待创建)
- tests/hooks/test-useLocalStorage.js (待创建)
```

---

### 第八阶段：布局和导航 (未开始)

#### 步骤 10: 根布局和通用组件
```
待生成文件：
- src/components/custom/layout/Header.tsx
- src/components/custom/layout/Footer.tsx
- src/components/custom/layout/Sidebar.tsx
- src/components/custom/common/LanguageToggle.tsx
- src/components/custom/common/LoadingSpinner.tsx

测试脚本：
- tests/components/layout/test-Header.js (待创建)
- tests/components/layout/test-Footer.js (待创建)
- tests/components/layout/test-Sidebar.js (待创建)
- tests/components/common/test-LanguageToggle.js (待创建)
- tests/components/common/test-LoadingSpinner.js (待创建)
```

---

### 第九阶段：核心功能组件 (未开始)

#### 步骤 11: 聊天功能
```
待生成文件：
- src/hooks/useChat.ts
- src/components/custom/chat/ChatArea.tsx
- src/components/custom/chat/ChatMessage.tsx
- src/components/custom/chat/ChatInput.tsx

测试脚本：
- tests/hooks/test-useChat.js (待创建)
- tests/components/chat/test-ChatArea.js (待创建)
- tests/components/chat/test-ChatMessage.js (待创建)
- tests/components/chat/test-ChatInput.js (待创建)
```

#### 步骤 12: 推荐功能
```
待生成文件：
- src/components/custom/recommendation/RecommendationCard.tsx
- src/components/custom/recommendation/SummarySection.tsx
- src/components/custom/recommendation/NextSteps.tsx

测试脚本：
- tests/components/recommendation/test-RecommendationCard.js
- tests/components/recommendation/test-SummarySection.js
- tests/components/recommendation/test-NextSteps.js
```

#### 步骤 13: 车型功能
```
待生成文件：
- src/hooks/useCars.ts
- src/components/custom/car/CarCard.tsx
- src/components/custom/car/CarGrid.tsx
- src/components/custom/car/CarDetails.tsx
- src/components/custom/car/CarFilter.tsx

测试脚本：
- tests/hooks/test-useCars.js
- tests/components/car/test-CarCard.js
- tests/components/car/test-CarGrid.js
- tests/components/car/test-CarDetails.js
- tests/components/car/test-CarFilter.js
```

---

### 第十阶段：页面组件 (未开始)

#### 步骤 14: 主要页面
```
待生成文件：
- src/app/page.tsx
- src/app/chat/page.tsx
- src/app/cars/page.tsx
- src/app/cars/[id]/page.tsx

测试脚本：
- tests/app/test-home-page.js (待创建)
- tests/app/test-chat-page.js (待创建)
- tests/app/test-cars-page.js (待创建)
- tests/app/test-car-detail-page.js (待创建)
```

#### 步骤 15: 辅助页面
```
待生成文件：
- src/app/loading.tsx
- src/app/error.tsx
- src/app/not-found.tsx
- src/app/chat/loading.tsx
- src/app/cars/loading.tsx

测试脚本：
- tests/app/test-loading.js
- tests/app/test-error.js
- tests/app/test-not-found.js
```

---

## 🔧 执行格式

### 步骤执行完整流程

**每个步骤必须严格按照以下顺序执行**：

#### 1. 步骤声明格式
```
=== 第X阶段 - 步骤Y: [步骤名称] ===
基于 docs/cgs.md 规范，我将生成以下文件：
- [文件1]
- [文件2]

对应的测试脚本：
- tests/[category]/test-[name1].js
- tests/[category]/test-[name2].js

这些文件符合规范中的 [章节X] 要求
```

#### 2. 代码生成阶段
- ✅ 生成所有源文件
- ✅ 确保所有文件使用绝对路径（`@/` 或完整绝对路径）
- ✅ 严格禁止相对路径（`./`, `../`）
- ✅ 符合 `cgs.md` 中的类型定义和接口规范
- ✅ 包含完整的错误处理和类型安全

#### 3. 测试脚本生成阶段
- ✅ 生成对应的测试脚本
- ✅ 测试脚本放在 `tests/` 目录下
- ✅ 使用真实环境测试，禁止Mock
- ✅ 每个源文件对应一个测试脚本
- ✅ 测试文件命名：`test-[文件名].js`

#### 4. 测试执行阶段
- ✅ 运行所有新生成的测试脚本
- ✅ 确保测试通过率100%
- ✅ 验证真实API/数据库连接
- ✅ 输出清晰的测试结果

#### 5. 文档更新阶段
- ✅ 更新 `docs/cgs.md` 文档
  - 添加新生成文件的路径映射
  - 更新目录结构树
  - 更新技术统计信息
  - 记录新增功能特性
- ✅ 更新 `docs/prompt.md` 文档
  - 标记步骤完成状态
  - 更新项目进度统计
  - 更新文件生成列表
  - 记录测试通过情况

#### 6. 完成确认格式
```
✅ 步骤Y完成！

生成的文件：[文件列表]
测试脚本：[测试文件列表]
测试结果：[通过/失败状态]

文档更新：
- docs/cgs.md 已更新：[具体更新内容]
- docs/prompt.md 已更新：[具体更新内容]

请确认这些文件是否符合要求，然后继续下一步。
```

### 强制约束条件

#### 代码生成约束
- 🚫 **严格禁止相对路径**：`./`, `../`, `../../` 等所有相对路径符号
- ✅ **强制使用绝对路径**：`@/` 路径映射或完整绝对路径
- ✅ **类型安全**：所有TypeScript文件必须有完整类型定义，禁止 `any` 类型
- ✅ **错误处理**：所有API路由必须有完整的错误处理机制（try-catch）
- ✅ **国际化支持**：所有UI组件必须支持中英文双语
- ✅ **代码规范**：必须通过ESLint和TypeScript严格检查
- ✅ **文档注释**：关键函数和类必须有JSDoc注释

#### 测试约束
- 🚫 **禁止Mock测试**：必须使用真实API和数据库
- ✅ **真实环境**：使用 `.env.local` 环境变量
- ✅ **测试覆盖**：每个源文件必须有对应测试脚本
- ✅ **测试通过率**：必须达到100%通过率
- ✅ **独立测试**：每个测试脚本必须独立可运行
- ✅ **测试命名**：测试文件必须按 `test-[文件名].js` 命名
- ✅ **测试质量**：测试脚本语法正确，输出清晰

#### 文档更新约束
- ✅ **实时更新**：每完成一个步骤立即更新两个文档
- ✅ **路径映射**：在 `cgs.md` 中更新所有新文件的绝对路径
- ✅ **进度追踪**：在 `prompt.md` 中更新完成状态和统计信息
- ✅ **版本记录**：记录每次更新的具体内容和时间

---

## ✅ 验收标准检查清单

### TypeScript文件
- [ ] 所有导入路径正确（使用 `@/` 别名）
- [ ] 完整类型定义，无 `any` 类型
- [ ] 符合 `cgs.md` 接口定义
- [ ] 包含适当的JSDoc注释
- [ ] 通过ESLint和TypeScript检查
- [ ] 有完整的错误处理机制

### 组件文件
- [ ] 使用正确的shadcn/ui组件
- [ ] 支持中英文双语
- [ ] 响应式设计
- [ ] loading和error状态处理
- [ ] 包含测试文件
- [ ] 通过代码质量检查

### API路由
- [ ] 使用Zod验证输入
- [ ] 完整的错误处理（try-catch）
- [ ] 符合 `cgs.md` API定义
- [ ] 包含日志记录
- [ ] 包含API测试
- [ ] 通过类型检查

### 数据库文件
- [ ] SQL语法正确
- [ ] 包含索引和约束
- [ ] 符合表结构定义
- [ ] 包含触发器函数
- [ ] 通过数据库语法检查

### 测试脚本 (Node.js)
- [ ] **禁止Mock测试 - 使用真实API/数据库**
- [ ] 使用真实环境变量 (.env.local)
- [ ] **所有测试脚本必须放在 tests/ 目录下**
- [ ] **每个源文件对应一个测试脚本**
- [ ] 测试文件命名: `test-[文件名].js`
- [ ] 覆盖正常和边界条件
- [ ] 输出清晰的测试结果
- [ ] 每个测试独立可运行
- [ ] 测试通过率100%
- [ ] 测试脚本语法正确

---

## 🚨 步骤执行检查清单

### 每个步骤必须完成的6个阶段

#### ✅ 阶段1: 步骤声明
- [ ] 明确步骤名称和阶段
- [ ] 列出所有要生成的文件
- [ ] 列出所有对应的测试脚本
- [ ] 确认符合 `cgs.md` 规范要求

#### ✅ 阶段2: 代码生成
- [ ] 生成所有源文件
- [ ] 验证所有文件使用绝对路径（`@/` 或完整绝对路径）
- [ ] 确认没有使用相对路径（`./`, `../`）
- [ ] 验证类型定义完整，禁止使用 `any` 类型
- [ ] 确认错误处理机制完整（try-catch）
- [ ] 验证国际化支持（UI组件）
- [ ] 运行代码质量检查（ESLint + TypeScript）
- [ ] 确认所有导入导出正确

#### ✅ 阶段3: 测试脚本生成
- [ ] 生成所有对应的测试脚本
- [ ] 测试脚本放在 `tests/` 目录下
- [ ] 确认测试使用真实环境（非Mock）
- [ ] 验证每个源文件都有对应测试脚本
- [ ] 确认测试文件命名规范：`test-[文件名].js`
- [ ] 验证测试脚本语法正确
- [ ] 确认测试使用 `.env.local` 环境变量

#### ✅ 阶段4: 测试执行
- [ ] 运行所有新生成的测试脚本
- [ ] 确认测试通过率100%
- [ ] 验证真实API/数据库连接正常
- [ ] 确认测试结果输出清晰
- [ ] 验证每个测试脚本独立可运行
- [ ] 确认测试覆盖所有新生成文件

#### ✅ 阶段5: 文档更新 - cgs.md
- [ ] 更新目录结构树，添加新文件路径
- [ ] 更新路径映射表，记录新文件的绝对路径
- [ ] 更新技术统计信息（文件数、API端点等）
- [ ] 记录新增功能特性
- [ ] 更新版本日志，记录本次更新内容

#### ✅ 阶段6: 文档更新 - prompt.md
- [ ] 标记当前步骤完成状态
- [ ] 更新项目进度统计
- [ ] 更新文件生成列表
- [ ] 记录测试通过情况
- [ ] 更新下一步骤准备状态

### 强制验证点

#### 路径验证
- [ ] 所有import语句使用 `@/` 或完整绝对路径
- [ ] 没有使用 `./`, `../`, `../../` 等相对路径符号
- [ ] 所有文件路径在 `cgs.md` 中正确记录

#### 代码质量验证
- [ ] 所有TypeScript文件通过类型检查
- [ ] 所有文件通过ESLint检查
- [ ] 没有使用 `any` 类型
- [ ] 所有API路由有完整错误处理
- [ ] 所有UI组件支持国际化

#### 测试验证
- [ ] 所有测试脚本独立可运行
- [ ] 测试使用真实环境变量（`.env.local`）
- [ ] 测试覆盖所有新生成的文件
- [ ] 测试通过率100%
- [ ] 没有使用Mock测试
- [ ] 测试文件命名规范正确

#### 文档验证
- [ ] `cgs.md` 已更新新文件路径和功能
- [ ] `prompt.md` 已更新进度和状态
- [ ] 两个文档保持同步更新

## 🚨 常见问题解决

### 问题0: 测试脚本目录结构
```
tests/
├── config/              # 配置文件测试
│   ├── test-package.js
│   ├── test-tsconfig.js
│   └── test-tailwind.js
├── types/               # 类型定义测试
│   ├── test-api.js
│   └── test-chat.js
├── lib/                 # 工具库测试
│   ├── test-utils.js
│   └── test-i18n.js (待创建)
├── hooks/               # Hooks测试
│   ├── test-useChat.js (待创建)
│   └── test-useLanguage.js (待创建)
├── database/            # 数据库测试
│   ├── test-connection.js (待创建)
│   ├── test-migrations.js (待创建)
│   └── repositories/
│       ├── test-car.js (待创建)
│       └── test-user.js (待创建)
├── ai/                  # AI集成测试
│   ├── test-groq.js (待创建)
│   └── test-gemini.js (待创建)
├── api/                 # API端点测试
│   ├── test-health.js (待创建)
│   ├── test-chat.js (待创建)
│   └── test-cars.js (待创建)
├── components/          # 组件测试
│   ├── ui/
│   │   ├── test-button.js (待创建)
│   │   └── test-card.js (待创建)
│   ├── layout/
│   │   └── test-Header.js (待创建)
│   └── chat/
│       └── test-ChatArea.js (待创建)
└── app/                 # 页面测试
    ├── test-home-page.js (待创建)
    └── test-chat-page.js (待创建)
```

### 问题1: 使用真实测试而非Mock
```javascript
// ❌ 错误 - 禁止Mock测试
jest.mock('../gemini');

// ✅ 正确 - 使用 Node.js 脚本进行真实测试
// tests/api/test-chat.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testChatAPI() {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [...], language: 'zh' })
  });
  const data = await response.json();
  console.log('✅ 测试通过:', data);
}

testChatAPI();
```

### 问题2: 缺少国际化
```typescript
// ❌ 错误
<Button>Save</Button>

// ✅ 正确
const { t } = useLanguage();
<Button>{t('common.save')}</Button>
```

### 问题3: API缺少错误处理
```typescript
// ✅ 正确示例 (参考 cgs.md 第8.3节)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = ChatRequestSchema.parse(body);
    return Response.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation error' },
        { status: 400 }
      );
    }
    return Response.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}
```

---

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

### 继续当前进度
```
请继续 rehui-car 项目开发。
当前进度：第五阶段 - 测试基础设施 ✅
下一步：第六阶段 - UI基础组件
```

### 修复问题
```
步骤X的 [文件名] 有问题，请重新生成：[具体问题]
```

### 运行测试

#### 辅助脚本工具
```bash
# 完整测试套件（推荐）- 运行所有测试并生成综合报告
node scripts/run-all-tests.js

# 配置文件专项测试 - 快速验证项目配置
node scripts/run-config-tests.js

# API路由验证工具 - 检查API文件生成状态
node scripts/test-api-routes.js
```

#### 环境和连接测试
```bash
# 环境检查
node tests/database/test-env-config.js (待创建)
node tests/database/test-connection.js (待创建)
```

#### AI集成测试
```bash
# AI服务测试（GROQ + Gemini 双架构）
node tests/ai/test-groq.js (待创建)
node tests/ai/test-gemini.js (待创建)
node tests/ai/test-ai-integration.js
```

#### API端点测试（9个端点完整覆盖）
```bash
# 核心API测试
node tests/api/test-health.js (待创建) # 健康检查
node tests/api/test-chat.js (待创建)   # 聊天API
node tests/api/test-cars.js (待创建)   # 车型列表
node tests/api/test-cars-detail.js (待创建) # 车型详情
node tests/api/test-cars-search.js (待创建) # 车型搜索

# 辅助API测试
node tests/api/test-conversations.js     # 会话管理
node tests/api/test-conversations-detail.js # 会话详情
node tests/api/test-users.js             # 用户管理
node tests/api/test-recommendations.js   # 推荐管理
```

#### 数据库测试
```bash
# Repository层测试（6个Repository完整覆盖）
node tests/database/repositories/test-car.js
node tests/database/repositories/test-conversation.js
node tests/database/repositories/test-message.js
node tests/database/repositories/test-recommendation.js
node tests/database/repositories/test-user.js
node tests/database/repositories/test-next-step.js
```

#### 工具库和配置测试
```bash
# 核心工具库测试
node tests/lib/test-utils.js
node tests/lib/test-constants.js
node tests/lib/test-validations.js

# 配置文件测试
node tests/config/test-package.js
node tests/config/test-tsconfig.js
node tests/config/test-tailwind.js
node tests/config/test-next-config.js
node tests/config/test-eslint.js
node tests/config/test-layout.js
node tests/config/test-globals-css.js
```

---

## 📖 文档关系说明

- **`cgs.md`** - 完整技术规范和架构设计 (WHAT & WHY)
- **`prompt.md`** (本文档) - 操作步骤和进度追踪 (HOW)

两个文档配合使用，确保代码生成的**规范性**和**可操作性**！

---

## 🚀 下一步

**当前任务**: 第六阶段 - 测试基础设施 ✅
**任务名称**: 测试基础设施建设完成 (含数据库测试重构优化)
**下一步**: 第七阶段 - UI基础组件

**开始命令**:
```
请开始第七阶段 - 步骤8：生成shadcn/ui基础组件及对应的测试脚本
```

**执行约束提醒**:
- ✅ 严格按照6个阶段执行：声明 → 代码生成 → 测试脚本生成 → 测试执行 → 更新cgs.md → 更新prompt.md
- 🚫 严格禁止相对路径，强制使用绝对路径（`@/` 或完整绝对路径）
- ✅ 每个源文件必须有对应测试脚本，使用真实环境测试
- ✅ 完成每个步骤后立即更新两个文档

**项目里程碑**:
- ✅ 前六阶段完成：基础架构 + 数据层 + AI集成 + API层 + API完善 + 测试基础设施
- 📊 项目进度：60% 完成 (6/10阶段)
- 🔢 技术指标：
  - 文件总数：100+ 个
  - API端点：9个完整端点
  - 测试覆盖：100% (所有核心模块)
  - 数据库：6表 + 完整索引和触发器

**重要提醒**:
- ✅ 每个源文件必须有对应的测试脚本
- ✅ 测试脚本统一放在 tests/ 目录下
- ✅ 测试使用真实环境，禁止Mock
- ✅ 项目测试覆盖率已达：配置文件100% + 工具函数100% + 数据库100% + AI集成100% + API端点100%
- ✅ 数据库测试完成重构优化：从1424行精简至282行，减少80%冗余代码，新增共享测试工具库
- 🚀 API层完整就绪：9个端点全部生成并测试通过

准备好后，输入上述命令即可开始UI组件开发！✨
