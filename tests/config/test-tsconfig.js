/**
 * TypeScript 配置文件测试
 * 测试 TypeScript 配置的正确性和兼容性
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
    console.log('\n🔷 开始 tsconfig.json 配置测试...\n');

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
    console.log(`\n📊 tsconfig.json 测试结果: ${this.passed} 通过, ${this.failed} 失败 (耗时: ${duration}ms)`);

    if (this.failed === 0) {
      console.log('🎉 所有 tsconfig.json 配置测试通过!');
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

// 读取和验证 tsconfig.json
async function loadTsConfig() {
  const fs = require('fs');
  const path = require('path');

  const tsconfigPath = path.join(__dirname, '../../tsconfig.json');

  if (!fs.existsSync(tsconfigPath)) {
    throw new Error('tsconfig.json 文件不存在');
  }

  const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
  const tsconfig = JSON.parse(tsconfigContent);

  return { tsconfig, tsconfigContent };
}

// 测试编译器选项
async function testCompilerOptions() {
  const { tsconfig } = await loadTsConfig();

  const compilerOptions = tsconfig.compilerOptions;

  assert(compilerOptions, 'compilerOptions 配置不能为空');

  // 基本编译选项
  assertEqual(compilerOptions.target, 'es5', '目标版本应为 es5');
  assertEqual(compilerOptions.lib?.includes('dom'), true, '应包含 DOM 库');
  assertEqual(compilerOptions.lib?.includes('dom.iterable'), true, '应包含 DOM.Iterable 库');
  assertEqual(compilerOptions.lib?.includes('es6'), true, '应包含 ES6 库');
  assertEqual(compilerOptions.allowJs, true, '应允许 JavaScript 文件');
  assertEqual(compilerOptions.skipLibCheck, true, '应跳过库文件类型检查');
  assertEqual(compilerOptions.esModuleInterop, true, '应启用 ES 模块互操作');
  assertEqual(compilerOptions.allowSyntheticDefaultImports, true, '应允许合成默认导入');
  assertEqual(compilerOptions.strict, true, '应启用严格模式');
  assertEqual(compilerOptions.forceConsistentCasingInFileNames, true, '应强制文件名大小写一致');

  // 检查是否启用了 noFallthroughCasesInSwitch（可选配置）
  if (compilerOptions.noFallthroughCasesInSwitch !== undefined) {
    console.log('✅ 已启用 switch 语句 fallthrough 检查');
  } else {
    console.log('ℹ️ 未配置 switch 语句 fallthrough 检查');
  }

  console.log('✅ 编译器选项配置正确');

  // JSX配置
  assertEqual(compilerOptions.jsx, 'preserve', 'JSX 模式应为 preserve');

  // 模块解析
  assertEqual(compilerOptions.module, 'esnext', '模块系统应为 esnext');
  assertEqual(compilerOptions.moduleResolution, 'bundler', '模块解析应为 bundler');

  console.log('📋 编译器配置验证完成');
}

// 测试路径映射
async function testPathMapping() {
  const { tsconfig } = await loadTsConfig();

  const paths = tsconfig.compilerOptions?.paths;

  assert(paths, '路径映射配置不能为空');

  const expectedPaths = {
    '@/*': ['./src/*'],
    '@/components/*': ['./src/components/*'],
    '@/lib/*': ['./src/lib/*'],
    '@/types/*': ['./src/types/*'],
    '@/hooks/*': ['./src/hooks/*'],
    '@/app/*': ['./src/app/*']
  };

  for (const [alias, expectedPath] of Object.entries(expectedPaths)) {
    assertEqual(JSON.stringify(paths[alias]), JSON.stringify(expectedPath), `路径别名 ${alias} 配置错误`);
  }

  console.log(`✅ 路径映射配置正确 (${Object.keys(expectedPaths).length} 个别名)`);

  console.log('📁 路径别名:');
  Object.entries(expectedPaths).forEach(([alias, path]) => {
    console.log(`  - ${alias} -> ${path[0]}`);
  });
}

// 测试包含和排除文件
async function testIncludeExclude() {
  const { tsconfig } = await loadTsConfig();

  const include = tsconfig.include || [];
  const exclude = tsconfig.exclude || [];

  // 应包含的文件类型
  const expectedIncludes = [
    'next-env.d.ts',
    '**/*.ts',
    '**/*.tsx',
    '.next/types/**/*.ts'
  ];

  expectedIncludes.forEach(pattern => {
    assert(include.some(inc => inc.includes(pattern) || pattern.includes(inc)),
           `应包含文件模式: ${pattern}`);
  });

  // 检查实际的排除模式
  if (exclude.length > 0) {
    console.log(`📋 实际排除模式: ${exclude.join(', ')}`);

    // 应至少排除 node_modules
    assert(exclude.includes('node_modules'), '应排除 node_modules 目录');

    // 检查其他常见的排除模式（可选）
    const optionalExcludes = ['dist', 'build', '.next'];
    const foundOptionalExcludes = optionalExcludes.filter(pattern => exclude.includes(pattern));

    if (foundOptionalExcludes.length > 0) {
      console.log(`✅ 额外排除模式: ${foundOptionalExcludes.join(', ')}`);
    }
  } else {
    throw new Error('应至少排除 node_modules 目录');
  }

  console.log('✅ 包含/排除文件配置正确');
  console.log(`📋 包含模式: ${include.length} 个`);
  console.log(`📋 排除模式: ${exclude.length} 个`);
}

// 测试类型根目录
async function testTypeRoots() {
  const fs = require('fs');
  const path = require('path');

  // 检查 @types 目录是否存在
  const typesDir = path.join(__dirname, '../../node_modules/@types');
  if (fs.existsSync(typesDir)) {
    console.log('✅ @types 目录存在');
  } else {
    console.log('⚠️ @types 目录不存在（可能通过其他方式安装）');
  }

  // 检查是否存在 next-env.d.ts 文件
  const nextEnvTypesPath = path.join(__dirname, '../../next-env.d.ts');
  if (fs.existsSync(nextEnvTypesPath)) {
    console.log('✅ next-env.d.ts 类型定义文件存在');
  } else {
    console.log('⚠️ next-env.d.ts 类型定义文件不存在');
  }
}

// 测试JSON格式有效性
async function testJsonValidity() {
  const { tsconfigContent } = await loadTsConfig();

  try {
    JSON.parse(tsconfigContent);
    console.log('✅ tsconfig.json JSON格式有效');
  } catch (error) {
    throw new Error(`tsconfig.json JSON格式无效: ${error.message}`);
  }
}

// 测试与Next.js的兼容性
async function testNextJsCompatibility() {
  const { tsconfig } = await loadTsConfig();

  // Next.js 特定的配置检查
  const compilerOptions = tsconfig.compilerOptions;

  assert(compilerOptions.incremental, '应启用增量编译');
  assert(compilerOptions.plugins, '应配置插件');
  assert(Array.isArray(compilerOptions.plugins), '插件配置应为数组');

  // 检查是否包含 Next.js 推荐的插件
  const hasNextPlugin = compilerOptions.plugins.some(plugin =>
    typeof plugin === 'string' ? plugin.includes('next') : plugin.name?.includes('next')
  );

  if (hasNextPlugin) {
    console.log('✅ 检测到 Next.js 相关插件配置');
  } else {
    console.log('⚠️ 未检测到 Next.js 相关插件配置');
  }
}

// 测试TypeScript版本兼容性
async function testTypeScriptCompatibility() {
  const fs = require('fs');
  const path = require('path');

  // 检查 package.json 中的 TypeScript 版本
  const packagePath = path.join(__dirname, '../../package.json');

  if (fs.existsSync(packagePath)) {
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);

    const tsVersion = packageJson.devDependencies?.typescript;

    if (tsVersion) {
      console.log(`✅ TypeScript 版本: ${tsVersion}`);

      // 检查版本兼容性
      const versionMatch = tsVersion.match(/(\d+)\.(\d+)\.(\d+)/);
      if (versionMatch) {
        const major = parseInt(versionMatch[1]);
        const minor = parseInt(versionMatch[2]);

        if (major >= 5 || (major === 4 && minor >= 9)) {
          console.log('✅ TypeScript 版本与配置兼容');
        } else {
          console.log('⚠️ TypeScript 版本可能与配置不完全兼容');
        }
      }
    } else {
      console.log('⚠️ 未找到 TypeScript 版本信息');
    }
  }
}

// 测试项目引用配置（如果有的话）
async function testProjectReferences() {
  const { tsconfig } = await loadTsConfig();

  if (tsconfig.references) {
    console.log(`✅ 配置了项目引用 (${tsconfig.references.length} 个引用)`);

    tsconfig.references.forEach((ref, index) => {
      console.log(`  - 引用 ${index + 1}: ${ref.path}`);
    });
  } else {
    console.log('ℹ️ 未配置项目引用（单体项目）');
  }
}

// 集成测试套件
async function runTsConfigTests() {
  // 基础配置测试
  ConfigTestFramework.test('编译器选项测试', testCompilerOptions);
  ConfigTestFramework.test('路径映射测试', testPathMapping);
  ConfigTestFramework.test('包含排除文件测试', testIncludeExclude);
  ConfigTestFramework.test('类型根目录测试', testTypeRoots);

  // 高级配置测试
  ConfigTestFramework.test('JSON格式有效性测试', testJsonValidity);
  ConfigTestFramework.test('Next.js兼容性测试', testNextJsCompatibility);
  ConfigTestFramework.test('TypeScript兼容性测试', testTypeScriptCompatibility);
  ConfigTestFramework.test('项目引用测试', testProjectReferences);

  return ConfigTestFramework.run();
}

// 运行测试
if (require.main === module) {
  runTsConfigTests().catch(console.error);
}

module.exports = { runTsConfigTests };
