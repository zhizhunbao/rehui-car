/**
 * Next.js 配置文件测试
 * 测试 Next.js 配置的正确性和性能设置
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
    console.log('\n⚡ 开始 next.config.js 配置测试...\n');

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
    console.log(`\n📊 next.config.js 测试结果: ${this.passed} 通过, ${this.failed} 失败 (耗时: ${duration}ms)`);

    if (this.failed === 0) {
      console.log('🎉 所有 next.config.js 配置测试通过!');
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

// 读取和验证 next.config.js
async function loadNextConfig() {
  const fs = require('fs');
  const path = require('path');

  const nextConfigPath = path.join(__dirname, '../../next.config.js');

  if (!fs.existsSync(nextConfigPath)) {
    throw new Error('next.config.js 文件不存在');
  }

  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

  // 使用动态导入来加载 JS 配置文件
  const configModule = require(nextConfigPath);

  return { config: configModule, content: nextConfigContent };
}

// 测试基本配置结构
async function testBasicConfigStructure() {
  const { config } = await loadNextConfig();

  assert(config, 'Next.js 配置对象不能为空');

  console.log('✅ 基本配置结构正确');

  // 检查配置类型
  if (typeof config === 'function') {
    console.log('📋 配置类型: 函数形式 (支持环境变量)');
  } else if (typeof config === 'object') {
    console.log('📋 配置类型: 对象形式');
  } else {
    console.log('📋 配置类型: 其他形式');
  }
}

// 测试实验性功能配置
async function testExperimentalFeatures() {
  const { config } = await loadNextConfig();

  // 如果配置是函数形式，需要调用它来获取实际配置
  let actualConfig = config;
  if (typeof config === 'function') {
    try {
      actualConfig = config(process.env.NODE_ENV || 'development', {});
    } catch (error) {
      console.log('⚠️ 无法解析函数形式的配置，将使用原始配置进行测试');
    }
  }

  const experimental = actualConfig.experimental;

  if (experimental) {
    console.log('✅ 启用了实验性功能');

    // 检查常用实验性功能
    if (experimental.appDir !== undefined) {
      console.log(`  - App Router: ${experimental.appDir ? '启用' : '禁用'}`);
    }

    if (experimental.serverComponents !== undefined) {
      console.log(`  - Server Components: ${experimental.serverComponents ? '启用' : '禁用'}`);
    }

    if (experimental.runtime !== undefined) {
      console.log(`  - Runtime: ${experimental.runtime}`);
    }

    if (experimental.serverComponentsExternalPackages) {
      console.log(`  - 外部包: ${experimental.serverComponentsExternalPackages.join(', ')}`);
    }

  } else {
    console.log('ℹ️ 未启用实验性功能（生产环境推荐）');
  }
}

// 测试图片配置
async function testImageConfiguration() {
  const { config } = await loadNextConfig();

  // 如果配置是函数形式，需要调用它来获取实际配置
  let actualConfig = config;
  if (typeof config === 'function') {
    try {
      actualConfig = config(process.env.NODE_ENV || 'development', {});
    } catch (error) {
      console.log('⚠️ 无法解析函数形式的配置，将使用原始配置进行测试');
    }
  }

  const images = actualConfig.images;

  if (images) {
    console.log('✅ 图片配置存在');

    // 检查域名配置
    if (images.domains && images.domains.length > 0) {
      console.log(`📷 允许的图片域名: ${images.domains.join(', ')}`);
    }

    if (images.remotePatterns && images.remotePatterns.length > 0) {
      console.log(`📷 远程图片模式: ${images.remotePatterns.length} 个模式`);
    }

    // 检查图片格式支持
    if (images.formats) {
      console.log(`📷 支持的格式: ${images.formats.join(', ')}`);
    }

    // 检查设备大小配置
    if (images.deviceSizes) {
      console.log(`📷 设备大小: ${images.deviceSizes.join(', ')}px`);
    }

    // 检查图片大小限制
    if (images.imageSizes) {
      console.log(`📷 图片大小: ${images.imageSizes.join(', ')}px`);
    }

  } else {
    console.log('⚠️ 未找到图片配置');
  }
}

// 测试编译和打包配置
async function testBuildConfiguration() {
  const { config } = await loadNextConfig();

  // 如果配置是函数形式，需要调用它来获取实际配置
  let actualConfig = config;
  if (typeof config === 'function') {
    try {
      actualConfig = config(process.env.NODE_ENV || 'development', {});
    } catch (error) {
      console.log('⚠️ 无法解析函数形式的配置，将使用原始配置进行测试');
    }
  }

  // 检查编译配置
  if (actualConfig.compiler) {
    console.log('✅ 存在编译器配置');

    const compiler = actualConfig.compiler;

    if (compiler.removeConsole) {
      console.log(`  - 移除控制台日志: ${compiler.removeConsole}`);
    }

    if (compiler.reactRemoveProperties) {
      console.log(`  - React 属性移除: ${compiler.reactRemoveProperties}`);
    }

    if (compiler.relay) {
      console.log(`  - Relay 支持: ${compiler.relay}`);
    }

  } else {
    console.log('ℹ️ 未配置编译器选项');
  }

  // 检查 Webpack 配置
  if (actualConfig.webpack) {
    console.log('✅ 存在 Webpack 配置');
  } else {
    console.log('ℹ️ 未配置自定义 Webpack');
  }
}

// 测试环境变量配置
async function testEnvironmentVariables() {
  const { config } = await loadNextConfig();

  // 如果配置是函数形式，需要调用它来获取实际配置
  let actualConfig = config;
  if (typeof config === 'function') {
    try {
      actualConfig = config(process.env.NODE_ENV || 'development', {});
    } catch (error) {
      console.log('⚠️ 无法解析函数形式的配置，将使用原始配置进行测试');
    }
  }

  if (actualConfig.env) {
    console.log('✅ 环境变量配置存在');

    const envVars = Object.keys(actualConfig.env);
    console.log(`🔐 配置了 ${envVars.length} 个环境变量`);

    // 检查一些重要的环境变量
    const importantVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];

    importantVars.forEach(varName => {
      if (actualConfig.env[varName]) {
        console.log(`  - ${varName}: 已配置`);
      } else {
        console.log(`  - ${varName}: 未配置`);
      }
    });

  } else {
    console.log('ℹ️ 未配置自定义环境变量');
  }
}

// 测试重定向和重写配置
async function testRedirectsRewrites() {
  const { config } = await loadNextConfig();

  // 如果配置是函数形式，需要调用它来获取实际配置
  let actualConfig = config;
  if (typeof config === 'function') {
    try {
      actualConfig = config(process.env.NODE_ENV || 'development', {});
    } catch (error) {
      console.log('⚠️ 无法解析函数形式的配置，将使用原始配置进行测试');
    }
  }

  // 检查重定向配置
  if (actualConfig.redirects) {
    console.log('✅ 存在重定向配置');

    if (Array.isArray(actualConfig.redirects)) {
      console.log(`  - 重定向规则: ${actualConfig.redirects.length} 条`);
    } else if (typeof actualConfig.redirects === 'function') {
      console.log('  - 重定向规则: 函数形式 (异步)');
    }
  } else {
    console.log('ℹ️ 未配置重定向规则');
  }

  // 检查重写配置
  if (actualConfig.rewrites) {
    console.log('✅ 存在重写配置');

    if (Array.isArray(actualConfig.rewrites)) {
      console.log(`  - 重写规则: ${actualConfig.rewrites.length} 条`);
    } else if (typeof actualConfig.rewrites === 'function') {
      console.log('  - 重写规则: 函数形式 (异步)');
    }
  } else {
    console.log('ℹ️ 未配置重写规则');
  }
}

// 测试头部配置
async function testHeadersConfiguration() {
  const { config } = await loadNextConfig();

  // 如果配置是函数形式，需要调用它来获取实际配置
  let actualConfig = config;
  if (typeof config === 'function') {
    try {
      actualConfig = config(process.env.NODE_ENV || 'development', {});
    } catch (error) {
      console.log('⚠️ 无法解析函数形式的配置，将使用原始配置进行测试');
    }
  }

  if (actualConfig.headers) {
    console.log('✅ 存在头部配置');

    if (Array.isArray(actualConfig.headers)) {
      console.log(`  - 头部规则: ${actualConfig.headers.length} 条`);
    } else if (typeof actualConfig.headers === 'function') {
      console.log('  - 头部规则: 函数形式 (异步)');
    }

    // 检查安全相关头部
    if (Array.isArray(actualConfig.headers)) {
      const securityHeaders = actualConfig.headers.filter(header =>
        header.headers?.some(h => h.key === 'X-Frame-Options' ||
                                 h.key === 'X-Content-Type-Options' ||
                                 h.key === 'Referrer-Policy')
      );

      if (securityHeaders.length > 0) {
        console.log(`🔒 找到 ${securityHeaders.length} 条安全头部规则`);
      }
    }

  } else {
    console.log('ℹ️ 未配置自定义头部');
  }
}

// 测试国际化配置
async function testI18nConfiguration() {
  const { config } = await loadNextConfig();

  // 如果配置是函数形式，需要调用它来获取实际配置
  let actualConfig = config;
  if (typeof config === 'function') {
    try {
      actualConfig = config(process.env.NODE_ENV || 'development', {});
    } catch (error) {
      console.log('⚠️ 无法解析函数形式的配置，将使用原始配置进行测试');
    }
  }

  if (actualConfig.i18n) {
    console.log('✅ 国际化配置存在');

    const i18n = actualConfig.i18n;

    console.log(`🌐 支持语言: ${i18n.locales?.join(', ') || '未配置'}`);
    console.log(`🌐 默认语言: ${i18n.defaultLocale || '未配置'}`);
    console.log(`🌐 多域名: ${i18n.localeDetection !== false ? '启用' : '禁用'}`);

  } else {
    console.log('ℹ️ 未配置国际化');
  }
}

// 测试生产环境优化配置
async function testProductionOptimizations() {
  const { config } = await loadNextConfig();

  // 如果配置是函数形式，需要调用它来获取实际配置
  let actualConfig = config;
  if (typeof config === 'function') {
    try {
      actualConfig = config('production', {});
    } catch (error) {
      console.log('⚠️ 无法解析生产环境配置');
    }
  }

  // 检查生产环境优化设置
  if (actualConfig.productionBrowserSourceMaps !== undefined) {
    console.log(`✅ 生产环境源码映射: ${actualConfig.productionBrowserSourceMaps ? '启用' : '禁用'}`);
  } else {
    console.log('ℹ️ 未配置生产环境源码映射');
  }

  if (actualConfig.optimizeFonts !== undefined) {
    console.log(`✅ 字体优化: ${actualConfig.optimizeFonts ? '启用' : '禁用'}`);
  } else {
    console.log('ℹ️ 未配置字体优化');
  }

  if (actualConfig.optimizeImages !== undefined) {
    console.log(`✅ 图片优化: ${actualConfig.optimizeImages ? '启用' : '禁用'}`);
  } else {
    console.log('ℹ️ 未配置图片优化');
  }
}

// 测试配置文件语法有效性
async function testConfigSyntaxValidity() {
  const { content } = await loadNextConfig();

  try {
    // 尝试解析配置文件的语法
    new Function(content.replace(/module\.exports\s*=\s*/, 'return '));
    console.log('✅ next.config.js 语法有效');
  } catch (error) {
    throw new Error(`next.config.js 语法无效: ${error.message}`);
  }
}

// 测试与 TypeScript 的兼容性
async function testTypeScriptCompatibility() {
  const fs = require('fs');
  const path = require('path');

  // 检查是否存在 next-env.d.ts 文件
  const nextEnvTypesPath = path.join(__dirname, '../../next-env.d.ts');
  if (fs.existsSync(nextEnvTypesPath)) {
    console.log('✅ next-env.d.ts 类型定义文件存在');
  } else {
    console.log('⚠️ next-env.d.ts 类型定义文件不存在');
  }

  // 检查 tsconfig.json 中的 Next.js 类型配置
  const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    try {
      const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
      const tsconfig = JSON.parse(tsconfigContent);

      if (tsconfig.include?.includes('next-env.d.ts')) {
        console.log('✅ TypeScript 配置包含 Next.js 类型定义');
      } else {
        console.log('⚠️ TypeScript 配置可能缺少 Next.js 类型定义');
      }
    } catch (error) {
      console.log('⚠️ 无法解析 tsconfig.json 文件');
    }
  }
}

// 集成测试套件
async function runNextConfigTests() {
  // 基础配置测试
  ConfigTestFramework.test('基本配置结构测试', testBasicConfigStructure);
  ConfigTestFramework.test('实验性功能测试', testExperimentalFeatures);
  ConfigTestFramework.test('图片配置测试', testImageConfiguration);
  ConfigTestFramework.test('编译打包配置测试', testBuildConfiguration);

  // 高级配置测试
  ConfigTestFramework.test('环境变量配置测试', testEnvironmentVariables);
  ConfigTestFramework.test('重定向重写配置测试', testRedirectsRewrites);
  ConfigTestFramework.test('头部配置测试', testHeadersConfiguration);
  ConfigTestFramework.test('国际化配置测试', testI18nConfiguration);
  ConfigTestFramework.test('生产环境优化测试', testProductionOptimizations);

  // 技术测试
  ConfigTestFramework.test('配置文件语法测试', testConfigSyntaxValidity);
  ConfigTestFramework.test('TypeScript兼容性测试', testTypeScriptCompatibility);

  return ConfigTestFramework.run();
}

// 运行测试
if (require.main === module) {
  runNextConfigTests().catch(console.error);
}

module.exports = { runNextConfigTests };
