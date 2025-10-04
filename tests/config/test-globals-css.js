/**
 * 全局样式文件测试
 * 测试 globals.css 的正确性和完整性
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
    console.log('\n🎨 开始全局样式文件测试...\n');

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
    console.log(`\n📊 全局样式文件测试结果: ${this.passed} 通过, ${this.failed} 失败 (耗时: ${duration}ms)`);

    if (this.failed === 0) {
      console.log('🎉 所有全局样式文件测试通过!');
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
ConfigTestFramework.test('全局样式文件存在', () => {
  const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
  assert(fs.existsSync(globalsPath), 'src/app/globals.css 文件不存在');
});

ConfigTestFramework.test('Tailwind CSS 指令正确', () => {
  const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
  const content = fs.readFileSync(globalsPath, 'utf8');

  assert(content.includes('@tailwind base;'), '必须包含 @tailwind base 指令');
  assert(content.includes('@tailwind components;'), '必须包含 @tailwind components 指令');
  assert(content.includes('@tailwind utilities;'), '必须包含 @tailwind utilities 指令');
});

ConfigTestFramework.test('CSS 变量系统完整', () => {
  const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
  const content = fs.readFileSync(globalsPath, 'utf8');

  // 检查根变量定义
  assert(content.includes(':root {'), '必须定义根 CSS 变量');
  assert(content.includes('--background:'), '必须定义背景色变量');
  assert(content.includes('--foreground:'), '必须定义前景色变量');
  assert(content.includes('--primary:'), '必须定义主色调变量');
  assert(content.includes('--secondary:'), '必须定义次要色调变量');
  assert(content.includes('--card:'), '必须定义卡片颜色变量');
  assert(content.includes('--popover:'), '必须定义弹出层颜色变量');
  assert(content.includes('--muted:'), '必须定义柔和色调变量');
  assert(content.includes('--accent:'), '必须定义强调色变量');
  assert(content.includes('--destructive:'), '必须定义危险色变量');
  assert(content.includes('--border:'), '必须定义边框色变量');
  assert(content.includes('--input:'), '必须定义输入框色变量');
  assert(content.includes('--ring:'), '必须定义环形元素色变量');
  assert(content.includes('--radius:'), '必须定义圆角半径变量');
});

ConfigTestFramework.test('暗黑模式支持完整', () => {
  const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
  const content = fs.readFileSync(globalsPath, 'utf8');

  assert(content.includes('.dark {'), '必须支持暗黑模式');
  assert(content.includes('--background: 222.2 84% 4.9%;'), '暗黑模式必须重新定义背景色');
  assert(content.includes('--foreground: 210 40% 98%;'), '暗黑模式必须重新定义前景色');
  assert(content.includes('--primary: 217.2 91.2% 59.8%;'), '暗黑模式必须重新定义主色调');
  assert(content.includes('--secondary: 217.2 32.6% 17.5%;'), '暗黑模式必须重新定义次要色调');
});

ConfigTestFramework.test('基础层样式正确', () => {
  const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
  const content = fs.readFileSync(globalsPath, 'utf8');

  // 检查 @layer base 指令
  const baseLayerMatch = content.match(/@layer base\s*{([^}]*)}/s);
  assert(baseLayerMatch, '必须定义基础层样式');

  const baseLayerContent = baseLayerMatch[1];
  assert(baseLayerContent.includes('* {'), '基础层必须包含通用选择器');
  assert(baseLayerContent.includes('border-border'), '必须应用边框样式');
  assert(baseLayerContent.includes('body {'), '基础层必须包含 body 样式');
  assert(baseLayerContent.includes('bg-background text-foreground'), 'body 必须应用背景和文字颜色');
});

ConfigTestFramework.test('颜色变量格式正确', () => {
  const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
  const content = fs.readFileSync(globalsPath, 'utf8');

  // 检查 HSL 颜色格式
  const hslPattern = /--\w+: \d+\.?\d* \d+\.?\d* \d+\.?\d*%/g;
  const hslMatches = content.match(hslPattern);

  assert(hslMatches && hslMatches.length >= 10, '颜色变量应使用 HSL 格式且数量充足');

  // 检查每种模式下的变量数量
  const rootMatches = content.match(/:root\s*{([^}]*)}/s);
  const darkMatches = content.match(/\.dark\s*{([^}]*)}/s);

  if (rootMatches) {
    const rootVars = rootMatches[1].match(/--\w+: /g);
    assert(rootVars && rootVars.length >= 10, '根模式应定义足够的颜色变量');
  }

  if (darkMatches) {
    const darkVars = darkMatches[1].match(/--\w+: /g);
    assert(darkVars && darkVars.length >= 10, '暗黑模式应定义足够的颜色变量');
  }
});

ConfigTestFramework.test('响应式设计支持', () => {
  const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
  const content = fs.readFileSync(globalsPath, 'utf8');

  // 检查是否包含响应式相关的 Tailwind 指令或媒体查询
  // 这里主要检查基础的响应式准备
  assert(content.includes('@tailwind'), '必须包含 Tailwind 指令以支持响应式');
});

ConfigTestFramework.test('可访问性考虑', () => {
  const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
  const content = fs.readFileSync(globalsPath, 'utf8');

  // 检查是否有足够的对比度变量定义
  assert(content.includes('--foreground:'), '必须定义前景色以确保对比度');
  assert(content.includes('--background:'), '必须定义背景色以确保对比度');
  assert(content.includes('--muted-foreground:'), '必须定义柔和前景色');
});

ConfigTestFramework.test('样式文件结构清晰', () => {
  const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
  const content = fs.readFileSync(globalsPath, 'utf8');

  // 检查文件结构是否清晰
  const sections = content.split('@layer');
  assert(sections.length >= 2, '应包含多个层定义');

  // 检查注释和组织
  assert(content.length < 1000 || content.includes('/*') || content.includes('/*'), '大型样式文件应包含注释说明');
});

ConfigTestFramework.test('与项目主题一致', () => {
  const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
  const content = fs.readFileSync(globalsPath, 'utf8');

  // 检查是否与项目主题色调一致（蓝色系）
  assert(content.includes('221.2 83.2% 53.3%'), '主色调应与项目蓝色主题一致');
  assert(content.includes('217.2 91.2% 59.8%'), '暗黑模式主色调应调整为更亮的蓝色');
});

ConfigTestFramework.test('CSS 语法有效', () => {
  const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
  const content = fs.readFileSync(globalsPath, 'utf8');

  // 基本的语法检查
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  assert(openBraces === closeBraces, 'CSS 大括号必须匹配');

  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  assert(openParens === closeParens, 'CSS 圆括号必须匹配');

  // 检查分号
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('@') && !line.startsWith('/*') && !line.endsWith('{') && !line.endsWith(',') && !line.startsWith('--') && !line.endsWith('*/') && line !== '*/' && line !== '*/' && line !== '*/') {
      if (line.includes(':') && !line.endsWith(';') && !line.endsWith('{')) {
        assert(false, `第 ${i + 1} 行缺少分号: ${line}`);
      }
    }
  }
});

// 运行测试函数
async function runGlobalsCssTests() {
  return ConfigTestFramework.run();
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  runGlobalsCssTests().catch(error => {
    console.error('测试运行失败:', error);
    process.exit(1);
  });
}

module.exports = { runGlobalsCssTests };
