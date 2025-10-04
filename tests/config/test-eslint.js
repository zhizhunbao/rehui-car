/**
 * ESLint 配置文件测试
 * 测试 ESLint 配置的正确性和完整性
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
    console.log('\n🔧 开始 ESLint 配置文件测试...\n');

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
    console.log(`\n📊 ESLint 配置测试结果: ${this.passed} 通过, ${this.failed} 失败 (耗时: ${duration}ms)`);

    if (this.failed === 0) {
      console.log('🎉 所有 ESLint 配置测试通过!');
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
ConfigTestFramework.test('ESLint 配置文件存在', () => {
  const eslintConfigPath = path.join(process.cwd(), '.eslintrc.json');
  assert(fs.existsSync(eslintConfigPath), '.eslintrc.json 文件不存在');
});

ConfigTestFramework.test('ESLint 配置文件格式有效', () => {
  const eslintConfigPath = path.join(process.cwd(), '.eslintrc.json');
  const configContent = fs.readFileSync(eslintConfigPath, 'utf8');

  let config;
  try {
    config = JSON.parse(configContent);
  } catch (error) {
    throw new Error(`ESLint 配置文件 JSON 格式无效: ${error.message}`);
  }

  assert(config && typeof config === 'object', 'ESLint 配置必须是一个有效的对象');
});

ConfigTestFramework.test('ESLint 基本配置结构正确', () => {
  const eslintConfigPath = path.join(process.cwd(), '.eslintrc.json');
  const config = JSON.parse(fs.readFileSync(eslintConfigPath, 'utf8'));

  assert(Array.isArray(config.extends), 'extends 字段必须是数组');
  assert(config.extends.length > 0, 'extends 数组不能为空');
  assert(config.hasOwnProperty('rules'), '必须包含 rules 配置');
  assert(typeof config.rules === 'object', 'rules 必须是对象类型');
});

ConfigTestFramework.test('Next.js ESLint 配置正确', () => {
  const eslintConfigPath = path.join(process.cwd(), '.eslintrc.json');
  const config = JSON.parse(fs.readFileSync(eslintConfigPath, 'utf8'));

  const hasNextConfig = config.extends.some(ext =>
    ext.includes('next/core-web-vitals') ||
    ext.includes('next/typescript') ||
    ext.includes('next')
  );

  assert(hasNextConfig, '必须包含 Next.js ESLint 配置');
});

ConfigTestFramework.test('TypeScript ESLint 配置正确', () => {
  const eslintConfigPath = path.join(process.cwd(), '.eslintrc.json');
  const config = JSON.parse(fs.readFileSync(eslintConfigPath, 'utf8'));

  const hasTypeScriptConfig = config.extends.some(ext =>
    ext.includes('@typescript-eslint/recommended') ||
    ext.includes('@typescript-eslint') ||
    ext.includes('next/typescript')
  );

  assert(hasTypeScriptConfig, '必须包含 TypeScript ESLint 配置');
});

ConfigTestFramework.test('ESLint 依赖已安装', () => {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  const requiredDeps = [
    'eslint',
    'eslint-config-next',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser'
  ];

  const devDeps = packageJson.devDependencies || {};

  for (const dep of requiredDeps) {
    assert(devDeps[dep], `缺少 ESLint 依赖: ${dep}`);
  }
});

ConfigTestFramework.test('ESLint 脚本配置正确', () => {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  const scripts = packageJson.scripts || {};

  assert(scripts.lint, '必须包含 lint 脚本');
  assert(scripts['lint:fix'], '必须包含 lint:fix 脚本');
});

ConfigTestFramework.test('ESLint 规则配置合理', () => {
  const eslintConfigPath = path.join(process.cwd(), '.eslintrc.json');
  const config = JSON.parse(fs.readFileSync(eslintConfigPath, 'utf8'));

  const rules = config.rules || {};

  // 检查一些重要的规则
  const recommendedRules = [
    '@typescript-eslint/no-unused-vars',
    '@typescript-eslint/no-explicit-any',
    'react-hooks/exhaustive-deps'
  ];

  for (const rule of recommendedRules) {
    assert(rules.hasOwnProperty(rule), `推荐规则 ${rule} 未配置`);
  }
});

ConfigTestFramework.test('项目文件 ESLint 检查', async () => {
  // 这里可以集成实际的 ESLint 检查
  // 暂时只检查关键文件存在
  const keyFiles = [
    'src/app/layout.tsx',
    'src/app/globals.css'
  ];

  for (const file of keyFiles) {
    const filePath = path.join(process.cwd(), file);
    assert(fs.existsSync(filePath), `关键文件 ${file} 不存在`);
  }
});

// 运行测试函数
async function runEslintTests() {
  return ConfigTestFramework.run();
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  runEslintTests().catch(error => {
    console.error('测试运行失败:', error);
    process.exit(1);
  });
}

module.exports = { runEslintTests };
