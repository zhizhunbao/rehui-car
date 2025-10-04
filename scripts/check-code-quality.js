#!/usr/bin/env node

/**
 * 代码质量检查脚本
 * 检查生成的代码是否存在问题
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const CONFIG = {
  timeout: 30000, // 30秒超时
  verbose: true
};

// 检查结果
const results = {
  syntax: { passed: 0, failed: 0, errors: [] },
  types: { passed: 0, failed: 0, errors: [] },
  imports: { passed: 0, failed: 0, errors: [] },
  tests: { passed: 0, failed: 0, errors: [] },
  integration: { passed: 0, failed: 0, errors: [] }
};

/**
 * 检查语法错误
 */
function checkSyntax() {
  console.log('🔍 检查语法错误...');
  
  try {
    // 运行 ESLint
    execSync('npm run lint', { 
      stdio: 'pipe',
      timeout: CONFIG.timeout 
    });
    
    results.syntax.passed++;
    console.log('✅ 语法检查通过');
    return true;
  } catch (error) {
    results.syntax.failed++;
    results.syntax.errors.push(error.message);
    console.log('❌ 语法检查失败:', error.message);
    return false;
  }
}

/**
 * 检查类型错误
 */
function checkTypes() {
  console.log('🔍 检查类型错误...');
  
  try {
    // 运行 TypeScript 类型检查
    execSync('npm run type-check', { 
      stdio: 'pipe',
      timeout: CONFIG.timeout 
    });
    
    results.types.passed++;
    console.log('✅ 类型检查通过');
    return true;
  } catch (error) {
    results.types.failed++;
    results.types.errors.push(error.message);
    console.log('❌ 类型检查失败:', error.message);
    return false;
  }
}

/**
 * 检查导入导出
 */
function checkImports() {
  console.log('🔍 检查导入导出...');
  
  try {
    const srcDir = path.join(process.cwd(), 'src');
    const files = getAllTsFiles(srcDir);
    let hasErrors = false;
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const errors = validateImports(content, file);
      
      if (errors.length > 0) {
        hasErrors = true;
        results.imports.errors.push(...errors);
      }
    }
    
    if (!hasErrors) {
      results.imports.passed++;
      console.log('✅ 导入导出检查通过');
      return true;
    } else {
      results.imports.failed++;
      console.log('❌ 导入导出检查失败');
      return false;
    }
  } catch (error) {
    results.imports.failed++;
    results.imports.errors.push(error.message);
    console.log('❌ 导入导出检查失败:', error.message);
    return false;
  }
}

/**
 * 检查测试脚本
 */
function checkTests() {
  console.log('🔍 检查测试脚本...');
  
  try {
    const testsDir = path.join(process.cwd(), 'tests');
    const testFiles = getAllJsFiles(testsDir);
    let hasErrors = false;
    
    for (const testFile of testFiles) {
      try {
        // 尝试运行测试脚本
        execSync(`node "${testFile}"`, { 
          stdio: 'pipe',
          timeout: CONFIG.timeout 
        });
      } catch (error) {
        hasErrors = true;
        results.tests.errors.push(`${testFile}: ${error.message}`);
      }
    }
    
    if (!hasErrors) {
      results.tests.passed++;
      console.log('✅ 测试脚本检查通过');
      return true;
    } else {
      results.tests.failed++;
      console.log('❌ 测试脚本检查失败');
      return false;
    }
  } catch (error) {
    results.tests.failed++;
    results.tests.errors.push(error.message);
    console.log('❌ 测试脚本检查失败:', error.message);
    return false;
  }
}

/**
 * 检查集成测试
 */
function checkIntegration() {
  console.log('🔍 检查集成测试...');
  
  try {
    // 运行集成测试
    execSync('npm run test:integration', { 
      stdio: 'pipe',
      timeout: CONFIG.timeout 
    });
    
    results.integration.passed++;
    console.log('✅ 集成测试通过');
    return true;
  } catch (error) {
    results.integration.failed++;
    results.integration.errors.push(error.message);
    console.log('❌ 集成测试失败:', error.message);
    return false;
  }
}

/**
 * 获取所有 TypeScript 文件
 */
function getAllTsFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * 获取所有 JavaScript 文件
 */
function getAllJsFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.js') && !item.endsWith('.test.js')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * 验证导入语句
 */
function validateImports(content, filePath) {
  const errors = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;
    
    // 检查 import 语句
    if (line.trim().startsWith('import ')) {
      // 检查相对路径导入
      if (line.includes('./') || line.includes('../')) {
        const importPath = extractImportPath(line);
        if (importPath) {
          const resolvedPath = resolveImportPath(filePath, importPath);
          if (!fs.existsSync(resolvedPath)) {
            errors.push(`${filePath}:${lineNumber} - 导入路径不存在: ${importPath}`);
          }
        }
      }
      
      // 检查绝对路径导入
      if (line.includes('@/')) {
        const importPath = extractImportPath(line);
        if (importPath) {
          const resolvedPath = resolveAbsoluteImport(importPath);
          if (!fs.existsSync(resolvedPath)) {
            errors.push(`${filePath}:${lineNumber} - 绝对导入路径不存在: ${importPath}`);
          }
        }
      }
    }
  }
  
  return errors;
}

/**
 * 提取导入路径
 */
function extractImportPath(line) {
  const match = line.match(/from\s+['"]([^'"]+)['"]/);
  return match ? match[1] : null;
}

/**
 * 解析导入路径
 */
function resolveImportPath(filePath, importPath) {
  const dir = path.dirname(filePath);
  const resolved = path.resolve(dir, importPath);
  
  // 尝试不同的扩展名
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.js'];
  
  for (const ext of extensions) {
    const fullPath = resolved + ext;
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  
  return resolved;
}

/**
 * 解析绝对导入路径
 */
function resolveAbsoluteImport(importPath) {
  const srcDir = path.join(process.cwd(), 'src');
  const resolved = path.resolve(srcDir, importPath.replace('@/', ''));
  
  // 尝试不同的扩展名
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.js'];
  
  for (const ext of extensions) {
    const fullPath = resolved + ext;
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  
  return resolved;
}

/**
 * 运行所有检查
 */
async function runAllChecks() {
  console.log('🚀 开始代码质量检查');
  console.log('=' .repeat(50));
  
  const checks = [
    { name: '语法检查', fn: checkSyntax },
    { name: '类型检查', fn: checkTypes },
    { name: '导入导出检查', fn: checkImports },
    { name: '测试脚本检查', fn: checkTests },
    { name: '集成测试检查', fn: checkIntegration }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const check of checks) {
    console.log(`\n🧪 运行检查: ${check.name}`);
    
    try {
      const result = await Promise.race([
        check.fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('检查超时')), CONFIG.timeout)
        )
      ]);
      
      if (result) {
        passed++;
        console.log(`✅ ${check.name} 通过`);
      } else {
        failed++;
        console.log(`❌ ${check.name} 失败`);
      }
    } catch (error) {
      failed++;
      console.log(`❌ ${check.name} 异常: ${error.message}`);
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 代码质量检查结果');
  console.log('=' .repeat(50));
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`📈 总计: ${checks.length}`);
  console.log(`📊 成功率: ${((passed / checks.length) * 100).toFixed(1)}%`);
  
  // 显示详细错误信息
  if (failed > 0) {
    console.log('\n❌ 检查失败详情:');
    
    Object.entries(results).forEach(([category, result]) => {
      if (result.failed > 0) {
        console.log(`\n${category.toUpperCase()}:`);
        result.errors.forEach(error => {
          console.log(`  - ${error}`);
        });
      }
    });
  }
  
  return {
    total: checks.length,
    passed,
    failed,
    results
  };
}

/**
 * 主函数
 */
async function main() {
  try {
    const results = await runAllChecks();
    
    if (results.failed > 0) {
      console.log('\n🚨 代码质量检查失败，请修复问题后重新检查');
      process.exit(1);
    } else {
      console.log('\n🎉 所有代码质量检查通过！');
      process.exit(0);
    }
  } catch (error) {
    console.error('💥 代码质量检查运行失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  runAllChecks,
  checkSyntax,
  checkTypes,
  checkImports,
  checkTests,
  checkIntegration
};
