# MCP 服务器配置指南

这个目录包含了所有 MCP (Model Context Protocol) 服务器的配置和文档。

## 📋 目录结构

```
mcp/
├── README.md          # 本文档
├── package.json       # NPM 依赖配置
└── data/             # 数据存储目录

.cursor/
└── mcp.json          # MCP 服务器配置文件
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 进入 MCP 目录
cd mcp

# 安装所有 MCP 服务器包
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件并设置必要的环境变量：

```bash
# GitHub 集成
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here


# 文件系统访问权限
ALLOWED_DIRECTORIES=.
```

### 3. 配置 Cursor

在 Cursor 中，MCP 服务器会自动通过 `.cursor/mcp.json` 配置启动，无需手动启动。

## 📦 已配置的 MCP 服务器

### 🔧 基础开发工具

| 服务器 | 包名 | 功能描述 | 环境变量 | 版本 |
|--------|------|----------|----------|------|
| **文件系统** | `@modelcontextprotocol/server-filesystem` | 文件和目录操作 | `ALLOWED_DIRECTORIES` | 2025.8.21 |
| **GitHub** | `@modelcontextprotocol/server-github` | GitHub 仓库和问题管理 | `GITHUB_PERSONAL_ACCESS_TOKEN` | 2025.4.8 |

### 🗄️ 数据库和存储

| 服务器 | 包名 | 功能描述 | 环境变量 | 版本 |
|--------|------|----------|----------|------|
| **Supabase** | 云服务 | Supabase 云数据库集成 | 通过 URL 配置 | 云服务 |
| **内存存储** | `@modelcontextprotocol/server-memory` | 内存数据存储和管理 | - | 2025.9.25 |

### 🔍 搜索和网络

| 服务器 | 包名 | 功能描述 | 环境变量 | 版本 |
|--------|------|----------|----------|------|
| **浏览器自动化** | `@modelcontextprotocol/server-puppeteer` | Puppeteer 浏览器自动化 | - | 2025.5.12 |

### 🤖 AI 和思维

| 服务器 | 包名 | 功能描述 | 环境变量 | 版本 |
|--------|------|----------|----------|------|
| **顺序思维** | `@modelcontextprotocol/server-sequential-thinking` | 顺序思维处理 | - | 2025.7.1 |

## ⚙️ 配置说明

### Cursor 集成

MCP 服务器配置位于 `.cursor/mcp.json`，包含以下已配置的服务器：

- **文件系统** - 文件和目录操作 (v2025.8.21)
- **Supabase** - 云数据库集成 (云服务)
- **GitHub** - 仓库和问题管理 (v2025.4.8)
- **Puppeteer** - 浏览器自动化 (v2025.5.12)
- **内存存储** - 临时数据存储 (v2025.9.25)
- **顺序思维** - AI 思维处理 (v2025.7.1)

### 环境变量获取

#### GitHub Token
1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 生成新的 token，选择所需权限
3. 复制 token 到环境变量

#### Brave API Key
1. 访问 [Brave Search API](https://brave.com/search/api/)
2. 注册并获取 API key
3. 复制 key 到环境变量


## 🔄 使用方法

### 1. 安装依赖
```bash
cd mcp
npm install
```

### 2. 配置环境变量
在项目根目录创建 `.env.local` 文件，设置必要的环境变量。

### 3. 重启 Cursor
重启 Cursor 以加载新的 MCP 配置。

### 4. 验证安装
在 Cursor 中，MCP 服务器会自动启动。您可以在 Cursor 的 MCP 面板中查看服务器状态。

## 🛠️ 故障排除

### 常见问题

1. **包安装失败**
   ```bash
   # 清理缓存重新安装
   npm cache clean --force
   npm install
   ```

2. **环境变量未生效**
   - 确保 `.env.local` 文件在项目根目录
   - 重启 Cursor 以重新加载环境变量
   - 检查环境变量名称和格式

3. **MCP 服务器未启动**
   - 检查 `.cursor/mcp.json` 配置是否正确
   - 确保已运行 `npm install`
   - 重启 Cursor

## 📚 扩展功能

### 添加新的 MCP 服务器

1. 在 `package.json` 中添加依赖：
```json
{
  "dependencies": {
    "@modelcontextprotocol/server-new": "latest"
  }
}
```

2. 在 `.cursor/mcp.json` 中添加配置：
```json
{
  "mcpServers": {
    "new-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-new"]
    }
  }
}
```

3. 重新安装依赖：
```bash
npm install
```

## 🔗 相关链接

- [MCP 官方文档](https://modelcontextprotocol.io/)
- [MCP 服务器开发指南](https://modelcontextprotocol.io/docs/servers)
- [Cursor MCP 集成](https://cursor.sh/docs/mcp)
- [GitHub MCP 服务器](https://github.com/modelcontextprotocol)

## 📝 更新日志

- **v1.0.0** (2025) - 初始配置，包含基础开发工具和数据库支持
- **v1.1.0** (2025) - 添加搜索和网络功能
- **v1.2.0** (2025) - 集成 AI 和思维处理服务器
- **v1.3.0** (2025) - 简化配置，移除过时文件，优化安装流程
- **v1.4.0** (2025) - 修复不存在的包，确保配置一致性

---

**注意**: 请确保在使用前正确配置所有必要的环境变量，并定期更新服务器包以获得最新功能和安全修复。
