/**
 * Next.js Layout 布局文件测试
 * 测试根布局文件的正确性和完整性
 */

// 测试框架
const ConfigTestFramework = {
  tests: [],
  passed: 0,
  failed: 0,
  startTime: Date.now(),

  test(name, fn) {
    this.tests.push({ name, fn });
  },

  async run() {
    console.log('\n📄 开始 Next.js Layout 文件测试...\n');

    for (const { name, fn } of this.tests) {
      try {
        await fn();
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        this.failed++;
      }
    }

    const duration = Date.now() - this.startTime;
    console.log(`\n📊 Layout 文件测试结果: ${this.passed} 通过, ${this.failed} 失败 (耗时: ${duration}ms)`);

    if (this.failed === 0) {
      console.log('🎉 所有 Layout 文件测试通过!');
    }

    return this.failed === 0;
  }
};

// 断言函数
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || '断言失败');
  }
}

// 文件系统操作
const fs = require('fs');
const path = require('path');

// 测试用例
ConfigTestFramework.test('Layout 文件存在', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  assert(fs.existsSync(layoutPath), 'src/app/layout.tsx 文件不存在');
});

ConfigTestFramework.test('Layout 文件是有效的 TypeScript/TSX 文件', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf8');

  // 检查基本的 TSX 语法
  assert(content.includes('import'), '必须包含 import 语句');
  assert(content.includes('export default'), '必须包含默认导出');
  assert(content.includes('function RootLayout'), '必须包含 RootLayout 函数组件');
  assert(content.includes('React.ReactNode'), '必须包含正确的类型定义');
});

ConfigTestFramework.test('Next.js 必要导入正确', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf8');

  assert(content.includes("import type { Metadata } from 'next'"), '必须导入 Metadata 类型');
  assert(content.includes("import { Inter } from 'next/font/google'"), '必须导入 Inter 字体');
  assert(content.includes('./globals.css'), '必须导入全局样式文件');
});

ConfigTestFramework.test('字体配置正确', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf8');

  assert(content.includes('const inter = Inter({ subsets: [\'latin\'] })'), '必须正确配置 Inter 字体');
  assert(content.includes('inter.className'), '必须在 body 上应用字体类名');
});

ConfigTestFramework.test('Metadata 配置完整', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf8');

  // 检查基础 metadata
  assert(content.includes('export const metadata: Metadata'), '必须导出 metadata 对象');
  assert(content.includes('title:'), '必须包含标题');
  assert(content.includes('description:'), '必须包含描述');

  // 检查详细的 metadata 配置
  const metadataFields = [
    'title',
    'description',
    'keywords',
    'authors',
    'openGraph',
    'twitter',
    'robots'
  ];

  for (const field of metadataFields) {
    assert(content.includes(`${field}:`), `metadata 应包含 ${field} 字段`);
  }
});

ConfigTestFramework.test('Open Graph 配置正确', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf8');

  const ogFields = [
    'title:',
    'description:',
    'type:',
    'locale:',
    'siteName:'
  ];

  for (const field of ogFields) {
    assert(content.includes(`${field}`), `Open Graph 应包含 ${field} 字段`);
  }
});

ConfigTestFramework.test('Twitter Card 配置正确', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf8');

  assert(content.includes('twitter: {'), '必须包含 Twitter Card 配置');
  assert(content.includes('card:'), '必须指定 Twitter Card 类型');
  assert(content.includes('title:'), 'Twitter Card 必须包含标题');
  assert(content.includes('description:'), 'Twitter Card 必须包含描述');
});

ConfigTestFramework.test('SEO 配置正确', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf8');

  assert(content.includes('robots: {'), '必须包含 robots 配置');
  assert(content.includes('index: true'), '搜索引擎应允许索引');
  assert(content.includes('follow: true'), '搜索引擎应允许跟随链接');
});

ConfigTestFramework.test('根布局组件结构正确', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf8');

  // 检查组件结构
  assert(content.includes('export default function RootLayout'), '必须导出 RootLayout 函数');
  assert(content.includes('children: React.ReactNode'), '必须正确定义 children prop 类型');
  assert(content.includes('<html lang="en"'), '必须设置正确的语言属性');
  assert(content.includes('<body'), '必须包含 body 元素');
  assert(content.includes('{children}'), '必须渲染 children');
});

ConfigTestFramework.test('布局文件语法有效', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf8');

  // 基本的语法检查
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  assert(openBraces === closeBraces, '大括号必须匹配');

  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  assert(openParens === closeParens, '圆括号必须匹配');
});

ConfigTestFramework.test('项目特定配置正确', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf8');

  // 检查项目特定的配置
  assert(content.includes('ReHui Car - AI-Powered Car Buying Advisor'), '标题应包含项目名称');
  assert(content.includes('AI-driven car buying advisor system for Canada'), '描述应包含项目特色');
  assert(content.includes('suppressHydrationWarning'), '应包含水合警告抑制');
});

// 运行测试函数
async function runLayoutTests() {
  return ConfigTestFramework.run();
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  runLayoutTests().catch(error => {
    console.error('测试运行失败:', error);
    process.exit(1);
  });
}

module.exports = { runLayoutTests };
