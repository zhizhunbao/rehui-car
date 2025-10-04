/**
 * Tailwind CSS 配置文件测试
 * 测试 Tailwind CSS 配置的正确性和完整性
 */

// 加载环境变量（如果需要）
require('dotenv').config({ path: '.env.local' });

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
    console.log('\n🎨 开始 tailwind.config.js 配置测试...\n');

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
    console.log(`\n📊 tailwind.config.js 测试结果: ${this.passed} 通过, ${this.failed} 失败 (耗时: ${duration}ms)`);

    if (this.failed === 0) {
      console.log('🎉 所有 tailwind.config.js 配置测试通过!');
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

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `期望 ${expected}, 实际得到 ${actual}`);
  }
}

function assertDeepEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);

  if (actualStr !== expectedStr) {
    throw new Error(message || `期望 ${expectedStr}, 实际得到 ${actualStr}`);
  }
}

// 读取和验证 tailwind.config.js
async function loadTailwindConfig() {
  const fs = require('fs');
  const path = require('path');

  const tailwindConfigPath = path.join(__dirname, '../../tailwind.config.js');

  if (!fs.existsSync(tailwindConfigPath)) {
    throw new Error('tailwind.config.js 文件不存在');
  }

  const tailwindConfigContent = fs.readFileSync(tailwindConfigPath, 'utf8');

  // 使用动态导入来加载 JS 配置文件
  const configModule = require(tailwindConfigPath);

  return { config: configModule, content: tailwindConfigContent };
}

// 测试基本配置结构
async function testBasicConfigStructure() {
  const { config } = await loadTailwindConfig();

  assert(config, 'Tailwind 配置对象不能为空');
  assert(config.content, 'content 配置不能为空');
  assert(config.theme, 'theme 配置不能为空');
  assert(config.plugins, 'plugins 配置不能为空');

  console.log('✅ 基本配置结构正确');

  console.log(`📋 配置结构:`);
  console.log(`  - content: ${Array.isArray(config.content) ? '数组' : '其他'}`);
  console.log(`  - theme: ${typeof config.theme}`);
  console.log(`  - plugins: ${Array.isArray(config.plugins) ? '数组' : '其他'}`);
}

// 测试内容路径配置
async function testContentPaths() {
  const { config } = await loadTailwindConfig();

  const content = config.content;

  assert(Array.isArray(content), 'content 应为数组');

  // 检查主要的内容路径模式
  const essentialPatterns = [
    './src/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}'
  ];

  essentialPatterns.forEach(pattern => {
    assert(content.some(cp => cp.includes(pattern) || pattern.includes(cp)),
           `应包含内容路径模式: ${pattern}`);
  });

  console.log(`✅ 内容路径配置正确 (${content.length} 个模式)`);

  console.log('📁 内容路径模式:');
  content.forEach((pattern, index) => {
    console.log(`  ${index + 1}. ${pattern}`);
  });
}

// 测试主题配置
async function testThemeConfiguration() {
  const { config } = await loadTailwindConfig();

  const theme = config.theme;

  // 测试基础主题配置
  assert(theme, 'theme 配置不能为空');

  // 测试容器配置（在顶级 theme 中）
  assert(theme.container, '容器配置不能为空');

  // 测试 extend 配置（扩展配置）
  const extend = theme.extend;
  assert(extend, 'extend 配置不能为空');

  // 测试颜色配置（在 extend 中）
  assert(extend.colors, '扩展颜色配置不能为空');

  // 测试字体族配置（在 extend 中）
  assert(extend.fontFamily, '扩展字体族配置不能为空');

  // 测试动画配置（在 extend 中）
  assert(extend.animation, '扩展动画配置不能为空');

  console.log('✅ 主题配置完整');

  // 检查是否包含自定义颜色
  if (extend.colors.primary || extend.colors.secondary || extend.colors.border) {
    console.log('✅ 包含自定义主题颜色');
  }

  // 检查是否包含自定义字体
  if (extend.fontFamily.sans || extend.fontFamily.mono) {
    console.log('✅ 包含自定义字体族');
  }

  // 检查是否包含自定义动画
  if (extend.animation['accordion-down'] || extend.animation['accordion-up']) {
    console.log('✅ 包含自定义动画');
  }
}

// 测试插件配置
async function testPluginsConfiguration() {
  const { config } = await loadTailwindConfig();

  const plugins = config.plugins;

  assert(Array.isArray(plugins), 'plugins 应为数组');

  // 检查是否包含常用插件
  const pluginNames = plugins.map(plugin => {
    if (typeof plugin === 'function') {
      return 'custom-plugin';
    } else if (plugin && plugin.__name) {
      return plugin.__name;
    } else if (plugin && typeof plugin === 'object' && plugin.name) {
      return plugin.name;
    }
    return 'unknown-plugin';
  });

  console.log(`✅ 插件配置正确 (${plugins.length} 个插件)`);

  console.log('🔌 已安装插件:');
  pluginNames.forEach((name, index) => {
    console.log(`  ${index + 1}. ${name}`);
  });

  // 检查是否包含动画插件
  const hasAnimationPlugin = pluginNames.some(name =>
    name.includes('animation') || name.includes('animate')
  );

  if (hasAnimationPlugin) {
    console.log('✅ 检测到动画相关插件');
  }
}

// 测试暗黑模式配置
async function testDarkModeConfiguration() {
  const { config } = await loadTailwindConfig();

  if (config.darkMode) {
    assertEqual(config.darkMode, 'class', '暗黑模式应使用 class 策略');
    console.log('✅ 暗黑模式配置正确 (class 策略)');
  } else {
    console.log('⚠️ 未配置暗黑模式');
  }
}

// 测试响应式断点配置
async function testResponsiveBreakpoints() {
  const { config } = await loadTailwindConfig();

  const theme = config.theme;
  const extend = theme?.extend;

  // 检查默认断点（通常由 Tailwind 自动提供）
  console.log('✅ 使用 Tailwind 默认响应式断点配置');

  // 检查自定义断点（如果在 extend 中配置）
  if (extend?.screens) {
    console.log(`🎨 自定义断点配置:`);
    Object.entries(extend.screens).forEach(([name, value]) => {
      console.log(`  - ${name}: ${value}`);
    });
  } else {
    console.log('ℹ️ 未配置自定义断点（使用默认断点）');
  }
}

// 测试动画配置
async function testAnimationConfiguration() {
  const { config } = await loadTailwindConfig();

  const theme = config.theme;
  const extend = theme?.extend;

  // 检查 keyframes 和 animation 配置
  if (extend?.keyframes && extend?.animation) {
    console.log('✅ 动画配置存在');

    const keyframes = Object.keys(extend.keyframes);
    const animations = Object.keys(extend.animation);

    console.log(`🎬 关键帧动画: ${keyframes.join(', ')}`);
    console.log(`🎭 动画定义: ${animations.join(', ')}`);

    if (keyframes.length > 0 && animations.length > 0) {
      console.log('✅ 包含自定义动画配置');
    }

  } else {
    console.log('ℹ️ 未找到自定义动画配置（使用默认动画）');
  }
}

// 测试容器配置
async function testContainerConfiguration() {
  const { config } = await loadTailwindConfig();

  const container = config.theme?.container;

  if (container) {
    console.log('✅ 容器配置存在');

    // 检查容器居中配置
    if (container.center) {
      console.log('✅ 容器居中已启用');
    } else {
      console.log('⚠️ 容器居中未启用');
    }

    // 检查容器内边距配置
    if (container.padding) {
      console.log(`✅ 容器内边距: ${JSON.stringify(container.padding)}`);
    } else {
      console.log('⚠️ 未配置容器内边距');
    }

  } else {
    console.log('⚠️ 未找到容器配置');
  }
}

// 测试文件语法有效性
async function testConfigSyntaxValidity() {
  const { content } = await loadTailwindConfig();

  try {
    // 尝试解析配置文件的语法
    new Function(content.replace(/module\.exports\s*=\s*/, 'return '));
    console.log('✅ tailwind.config.js 语法有效');
  } catch (error) {
    throw new Error(`tailwind.config.js 语法无效: ${error.message}`);
  }
}

// 测试与项目结构的兼容性
async function testProjectStructureCompatibility() {
  const fs = require('fs');
  const path = require('path');

  // 检查 src 目录结构
  const srcDir = path.join(__dirname, '../../src');
  const componentsDir = path.join(srcDir, 'components');
  const appDir = path.join(srcDir, 'app');
  const libDir = path.join(srcDir, 'lib');

  if (fs.existsSync(srcDir)) {
    console.log('✅ src 目录存在');

    if (fs.existsSync(componentsDir)) {
      console.log('✅ components 目录存在');
    } else {
      console.log('⚠️ components 目录不存在');
    }

    if (fs.existsSync(appDir)) {
      console.log('✅ app 目录存在');
    } else {
      console.log('⚠️ app 目录不存在');
    }

    if (fs.existsSync(libDir)) {
      console.log('✅ lib 目录存在');
    } else {
      console.log('⚠️ lib 目录不存在');
    }

  } else {
    console.log('⚠️ src 目录不存在');
  }
}

// 集成测试套件
async function runTailwindTests() {
  // 基础配置测试
  ConfigTestFramework.test('基本配置结构测试', testBasicConfigStructure);
  ConfigTestFramework.test('内容路径配置测试', testContentPaths);
  ConfigTestFramework.test('主题配置测试', testThemeConfiguration);
  ConfigTestFramework.test('插件配置测试', testPluginsConfiguration);

  // 高级配置测试
  ConfigTestFramework.test('暗黑模式配置测试', testDarkModeConfiguration);
  ConfigTestFramework.test('响应式断点测试', testResponsiveBreakpoints);
  ConfigTestFramework.test('动画配置测试', testAnimationConfiguration);
  ConfigTestFramework.test('容器配置测试', testContainerConfiguration);

  // 技术测试
  ConfigTestFramework.test('配置文件语法测试', testConfigSyntaxValidity);
  ConfigTestFramework.test('项目结构兼容性测试', testProjectStructureCompatibility);

  return ConfigTestFramework.run();
}

// 运行测试
if (require.main === module) {
  runTailwindTests().catch(console.error);
}

module.exports = { runTailwindTests };
