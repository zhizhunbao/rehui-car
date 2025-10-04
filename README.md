# 🚗 ReHui Car - 智能汽车推荐平台

一个专为加拿大市场设计的智能汽车推荐平台，支持中英双语，提供个性化的汽车推荐服务。

## ✨ 项目特色

- 🌐 **双语支持**: 完整的中英文国际化支持
- 🤖 **智能推荐**: 基于用户需求的个性化汽车推荐
- 💬 **AI聊天**: 智能对话式汽车咨询服务
- 📊 **数据可视化**: 直观的汽车对比和分析图表
- 🔍 **高级搜索**: 多维度汽车筛选和搜索功能
- 📱 **响应式设计**: 完美适配桌面端和移动端

## 🛠️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI组件**: Tailwind CSS + Shadcn/ui
- **状态管理**: Zustand
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **类型安全**: TypeScript
- **测试**: Jest + React Testing Library
- **代码质量**: ESLint + Prettier

## 📦 基础工具库

项目包含了一个完整的基础工具库，提供以下功能：

### 🔧 核心工具函数 (`src/lib/utils.ts`)
- **类名合并**: `cn()` - 条件性CSS类名合并
- **防抖节流**: `debounce()`, `throttle()` - 性能优化
- **深拷贝**: `deepClone()` - 安全的对象复制
- **重试机制**: `retry()` - 网络请求容错
- **格式化函数**: 价格、日期、文件大小等格式化
- **相对时间**: `formatRelativeTime()` - 人性化时间显示

### 📋 常量定义 (`src/lib/constants.ts`)
- **汽车相关**: 品牌、车型、燃料类型等
- **应用配置**: 默认语言、货币、地区设置
- **API端点**: 标准化的RESTful API路径
- **错误代码**: HTTP状态码和自定义错误类型
- **正则表达式**: 常用验证模式

### ✅ 数据验证 (`src/lib/validations.ts`)
- **基础验证**: 邮箱、UUID、语言代码等
- **业务验证**: 聊天请求、车型数据等
- **双语错误**: 中英文错误消息
- **类型安全**: 完整的TypeScript类型定义

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 环境配置
复制环境变量模板并配置：
```bash
cp .env.example .env.local
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 验证基础工具库
运行演示脚本验证所有基础功能：
```bash
npm run demo:utils
```

## 🧪 测试

### 运行所有测试
```bash
npm test
```

### 监听模式测试
```bash
npm run test:watch
```

### 测试覆盖率
```bash
npm run test:coverage
```

### 基础工具库演示
```bash
npm run demo:utils
```

## 📁 项目结构

```
rehui-car/
├── src/
│   ├── app/                 # Next.js App Router页面
│   ├── components/          # React组件
│   │   ├── ui/             # 基础UI组件 (Shadcn/ui)
│   │   └── features/       # 业务功能组件
│   ├── lib/                # 基础工具库
│   │   ├── utils.ts        # 核心工具函数
│   │   ├── constants.ts    # 常量定义
│   │   ├── validations.ts  # 数据验证
│   │   └── __tests__/      # 测试文件
│   ├── hooks/              # 自定义React Hooks
│   ├── store/              # Zustand状态管理
│   ├── types/              # TypeScript类型定义
│   └── styles/             # 样式文件
├── public/                 # 静态资源
├── docs/                   # 项目文档
├── scripts/                # 工具脚本
└── supabase/              # 数据库配置
```

## 🌐 国际化支持

项目完整支持中英双语：

- **界面语言**: 所有UI文本支持中英文切换
- **错误消息**: 双语错误提示
- **数据验证**: 本地化验证消息
- **内容管理**: 多语言内容存储和展示

## 📊 功能模块

### 🏠 首页
- 汽车推荐轮播
- 热门品牌展示
- 快速搜索入口

### 🔍 搜索页面
- 高级筛选器
- 实时搜索结果
- 排序和分页

### 🚗 汽车详情
- 详细规格参数
- 高清图片展示
- 用户评价和评分

### 💬 AI聊天
- 智能对话推荐
- 多轮对话支持
- 个性化建议

### 👤 用户中心
- 个人资料管理
- 收藏和历史记录
- 推荐偏好设置

## 🔧 开发工具

### 代码质量
```bash
npm run lint          # 检查代码规范
npm run lint:fix      # 自动修复代码问题
npm run type-check    # TypeScript类型检查
npm run format        # 代码格式化
```

### 数据库管理
```bash
npm run db:generate   # 生成数据库类型
npm run db:migrate    # 运行数据库迁移
npm run db:reset      # 重置数据库
npm run db:seed       # 填充测试数据
```

## 🔗 MCP (Model Context Protocol) 配置

MCP 是一个开放标准，允许 AI 助手安全地连接到外部数据源和工具。通过配置 MCP，您可以让 AI 助手直接访问您的 Supabase 数据库、文件系统和 Git 仓库。

### 🚀 已配置的 MCP 服务器

#### 1. Supabase MCP
- **用途**: 直接访问 Supabase 数据库
- **配置**: 连接到项目 `nbbeiyfukqelsroqssnz`
- **功能**: 
  - 查询数据库表
  - 执行 SQL 语句
  - 管理数据

#### 2. 文件系统 MCP
- **用途**: 访问项目文件
- **功能**:
  - 读取文件内容
  - 搜索文件
  - 管理项目结构

#### 3. 内存管理 MCP
- **用途**: 知识图谱和实体关系管理
- **功能**:
  - 创建和管理实体
  - 建立实体关系
  - 知识图谱查询

#### 4. 浏览器 MCP
- **用途**: 网页自动化和截图
- **功能**:
  - 网页导航
  - 元素交互
  - 截图功能

#### 5. GitHub MCP
- **用途**: 代码仓库管理
- **功能**:
  - 仓库操作
  - 代码搜索
  - 版本控制

#### 6. 思维链 MCP
- **用途**: 复杂推理和问题解决
- **功能**:
  - 多步骤推理
  - 问题分析
  - 解决方案生成


### 📁 配置文件位置

```
.cursor/mcp.json
```

### 🔒 安全注意事项

**重要**: `.cursor/mcp.json` 文件包含敏感的 API 密钥和访问令牌，已被添加到 `.gitignore` 中，不会上传到 Git 仓库。

如果您需要配置 MCP，请：

1. **使用便捷脚本** (推荐):
   ```bash
   npm run mcp:setup
   ```

2. **或手动复制配置文件**:
   ```bash
   cp .cursor/mcp.json.example .cursor/mcp.json
   ```

3. **填入您的真实 API 密钥**:
   - GitHub Personal Access Token
   - Supabase Access Token
   - Supabase URL 和密钥

4. **重启 Cursor** 使配置生效

### 🔧 配置内容

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

### ✅ 验证配置

配置完成后，您应该能够：

1. **在 Cursor 中看到 MCP 连接状态**
2. **使用 AI 助手直接查询 Supabase 数据库**
3. **通过 AI 助手管理项目文件**
4. **使用 AI 助手进行知识图谱管理**
5. **通过 AI 助手进行网页自动化操作**
6. **使用 AI 助手管理 GitHub 仓库**
7. **利用 AI 助手进行复杂推理和问题解决**

### 🔄 重启 Cursor

配置 MCP 后，需要重启 Cursor 以使配置生效：

1. 关闭 Cursor
2. 重新打开 Cursor
3. 检查 MCP 连接状态

### 🛠️ 故障排除

#### 如果 MCP 连接失败：

1. **检查网络连接**
2. **验证 Supabase 项目 ID**
3. **确保 Cursor 版本支持 MCP**

#### 常见问题：

- **权限问题**: 确保 Supabase 项目有正确的访问权限
- **网络问题**: 检查防火墙设置
- **版本问题**: 确保使用最新版本的 Cursor

### 📚 相关链接

- [MCP 官方文档](https://modelcontextprotocol.io/)
- [Supabase MCP 文档](https://supabase.com/docs/guides/mcp)
- [Cursor MCP 指南](https://cursor.sh/docs/mcp)

### 🎯 MCP 使用场景

配置完成后，您可以：

1. **直接通过 AI 助手查询数据库**
2. **让 AI 助手帮您管理数据**
3. **使用 AI 助手进行代码开发**
4. **通过 AI 助手进行知识图谱构建**
5. **使用 AI 助手进行网页自动化测试**
6. **让 AI 助手帮您管理 GitHub 仓库**
7. **利用 AI 助手进行复杂问题分析和解决**

## 📈 性能优化

- **代码分割**: 自动路由级别代码分割
- **图片优化**: Next.js Image组件优化
- **缓存策略**: 智能缓存和预取
- **防抖节流**: 用户交互性能优化
- **懒加载**: 组件和数据懒加载

## 🔒 安全特性

- **类型安全**: 完整的TypeScript类型系统
- **数据验证**: 严格的输入验证和清理
- **认证授权**: Supabase安全认证
- **CSRF保护**: 跨站请求伪造防护
- **XSS防护**: 跨站脚本攻击防护

## 🚀 部署

项目支持多种部署方式：

- **Vercel**: 推荐的部署平台
- **Netlify**: 静态站点部署
- **Docker**: 容器化部署
- **传统服务器**: Node.js服务器部署

## 📝 贡献指南

1. Fork项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 支持

如果您在使用过程中遇到问题，请：

1. 查看 [文档](docs/)
2. 搜索 [Issues](../../issues)
3. 创建新的 [Issue](../../issues/new)

---

**ReHui Car** - 让汽车选择更智能 🚗✨ 