/**
 * Package.json 配置文件测试
 * 测试项目依赖、脚本和配置的正确性
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
    console.log('\n📦 开始 package.json 配置测试...\n');

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
    console.log(`\n📊 package.json 测试结果: ${this.passed} 通过, ${this.failed} 失败 (耗时: ${duration}ms)`);

    if (this.failed === 0) {
      console.log('🎉 所有 package.json 配置测试通过!');
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

// 读取和验证 package.json
async function loadPackageJson() {
  const fs = require('fs');
  const path = require('path');

  const packagePath = path.join(__dirname, '../../package.json');

  if (!fs.existsSync(packagePath)) {
    throw new Error('package.json 文件不存在');
  }

  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(packageContent);

  return { packageJson, packageContent };
}

// 测试基本信息
async function testBasicInfo() {
  const { packageJson } = await loadPackageJson();

  assert(packageJson.name, '项目名称不能为空');
  assert(packageJson.name === 'rehui-car', '项目名称应为 rehui-car');
  assert(packageJson.version, '项目版本不能为空');
  assert(packageJson.description, '项目描述不能为空');
  assert(packageJson.author, '项目作者不能为空');
  assert(packageJson.license, '项目许可证不能为空');

  console.log(`📋 项目信息:`);
  console.log(`  - 名称: ${packageJson.name}`);
  console.log(`  - 版本: ${packageJson.version}`);
  console.log(`  - 描述: ${packageJson.description}`);
  console.log(`  - 作者: ${packageJson.author}`);
  console.log(`  - 许可证: ${packageJson.license}`);
}

// 测试依赖项
async function testDependencies() {
  const { packageJson } = await loadPackageJson();

  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    'typescript',
    '@types/react',
    '@types/node',
    'tailwindcss',
    'clsx',
    'tailwind-merge',
    'zod',
    '@supabase/supabase-js',
    'groq-sdk',
    'dotenv'
  ];

  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);

  // 检查 Tailwind 相关依赖（可能在 devDependencies 中）
  const tailwindDeps = ['autoprefixer', 'postcss'];
  const missingTailwindDeps = tailwindDeps.filter(dep =>
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  );

  if (missingTailwindDeps.length > 0) {
    missingDeps.push(...missingTailwindDeps.map(dep => `${dep} (应在 dependencies 或 devDependencies 中)`));
  }

  if (missingDeps.length > 0) {
    throw new Error(`缺少必需依赖: ${missingDeps.join(', ')}`);
  }

  console.log(`✅ 所有必需依赖都已正确安装 (${requiredDeps.length} 个依赖)`);

  // 检查版本约束
  const nextVersion = packageJson.dependencies.next;
  const reactVersion = packageJson.dependencies.react;

  assert(nextVersion.startsWith('14.') || nextVersion.startsWith('^14.'), 'Next.js 版本应为 14.x');
  assert(reactVersion.startsWith('18.') || reactVersion.startsWith('^18.'), 'React 版本应为 18.x');

  console.log(`📦 关键依赖版本:`);
  console.log(`  - Next.js: ${nextVersion}`);
  console.log(`  - React: ${reactVersion}`);
  console.log(`  - TypeScript: ${packageJson.dependencies.typescript}`);
}

// 测试开发依赖
async function testDevDependencies() {
  const { packageJson } = await loadPackageJson();

  const requiredDevDeps = [
    'eslint',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'prettier',
    'prettier-plugin-tailwindcss'
  ];

  const missingDevDeps = requiredDevDeps.filter(dep => !packageJson.devDependencies[dep]);

  if (missingDevDeps.length > 0) {
    throw new Error(`缺少必需的开发依赖: ${missingDevDeps.join(', ')}`);
  }

  console.log(`✅ 所有必需的开发依赖都已正确安装 (${requiredDevDeps.length} 个依赖)`);
}

// 测试脚本配置
async function testScripts() {
  const { packageJson } = await loadPackageJson();

  const requiredScripts = [
    'dev',
    'build',
    'start',
    'lint',
    'type-check'
  ];

  const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);

  if (missingScripts.length > 0) {
    throw new Error(`缺少必需的脚本: ${missingScripts.join(', ')}`);
  }

  console.log(`✅ 所有必需的脚本都已正确配置 (${requiredScripts.length} 个脚本)`);

  // 验证脚本命令格式
  assert(packageJson.scripts.dev.includes('next dev'), 'dev 脚本应使用 next dev');
  assert(packageJson.scripts.build.includes('next build'), 'build 脚本应使用 next build');
  assert(packageJson.scripts.start.includes('next start'), 'start 脚本应使用 next start');
  assert(packageJson.scripts.lint.includes('next lint'), 'lint 脚本应使用 next lint');

  console.log(`🔧 脚本配置:`);
  console.log(`  - dev: ${packageJson.scripts.dev}`);
  console.log(`  - build: ${packageJson.scripts.build}`);
  console.log(`  - start: ${packageJson.scripts.start}`);
  console.log(`  - lint: ${packageJson.scripts.lint}`);
}

// 测试项目结构要求
async function testProjectStructure() {
  const fs = require('fs');
  const path = require('path');

  const requiredFiles = [
    'src/app/layout.tsx',
    'src/app/globals.css',
    'src/lib/utils.ts',
    'src/lib/constants.ts',
    'src/types/index.ts',
    'tsconfig.json',
    'tailwind.config.js',
    'next.config.js',
    '.eslintrc.json'
  ];

  const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, '../../', file)));

  if (missingFiles.length > 0) {
    throw new Error(`缺少必需的项目文件: ${missingFiles.join(', ')}`);
  }

  console.log(`✅ 项目结构完整，所有必需文件都存在 (${requiredFiles.length} 个文件)`);
}

// 测试JSON格式有效性
async function testJsonValidity() {
  const { packageContent } = await loadPackageJson();

  try {
    JSON.parse(packageContent);
    console.log('✅ package.json JSON格式有效');
  } catch (error) {
    throw new Error(`package.json JSON格式无效: ${error.message}`);
  }
}

// 测试Node版本兼容性
async function testNodeVersion() {
  const { packageJson } = await loadPackageJson();

  const engines = packageJson.engines;
  if (engines && engines.node) {
    console.log(`✅ 已配置 Node.js 版本要求: ${engines.node}`);
  } else {
    console.log('⚠️ 未配置 Node.js 版本要求');
  }
}

// 测试运行时环境
async function testRuntimeEnvironment() {
  const fs = require('fs');
  const path = require('path');

  // 检查是否存在 .env.local 文件
  const envLocalPath = path.join(__dirname, '../../.env.local');
  if (fs.existsSync(envLocalPath)) {
    console.log('✅ 存在 .env.local 环境配置文件');
  } else {
    console.log('⚠️ 未找到 .env.local 文件');
  }

  // 检查是否存在 .env.example 文件
  const envExamplePath = path.join(__dirname, '../../.env.example');
  if (fs.existsSync(envExamplePath)) {
    console.log('✅ 存在 .env.example 模板文件');
  } else {
    console.log('⚠️ 未找到 .env.example 文件');
  }
}

// 集成测试套件
async function runPackageTests() {
  // 基础配置测试
  ConfigTestFramework.test('基本信息测试', testBasicInfo);
  ConfigTestFramework.test('依赖项测试', testDependencies);
  ConfigTestFramework.test('开发依赖测试', testDevDependencies);
  ConfigTestFramework.test('脚本配置测试', testScripts);
  ConfigTestFramework.test('项目结构测试', testProjectStructure);

  // 高级配置测试
  ConfigTestFramework.test('JSON格式有效性测试', testJsonValidity);
  ConfigTestFramework.test('Node版本兼容性测试', testNodeVersion);
  ConfigTestFramework.test('运行时环境测试', testRuntimeEnvironment);

  return ConfigTestFramework.run();
}

// 运行测试
if (require.main === module) {
  runPackageTests().catch(console.error);
}

module.exports = { runPackageTests };
