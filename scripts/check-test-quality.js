#!/usr/bin/env node

/**
 * 测试脚本质量检查脚本
 * 检查生成的测试脚本是否存在问题
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
  execution: { passed: 0, failed: 0, errors: [] },
  coverage: { passed: 0, failed: 0, errors: [] },
  structure: { passed: 0, failed: 0, errors: [] },
  output: { passed: 0, failed: 0, errors: [] }
};

/**
 * 检查测试脚本语法
 */
function checkTestSyntax() {
  console.log('🔍 检查测试脚本语法...');
  
  try {
    const testsDir = path.join(process.cwd(), 'tests');
    const testFiles = getAllTestFiles(testsDir);
    let hasErrors = false;
    
    for (const testFile of testFiles) {
      try {
        // 检查语法
        execSync(`node -c "${testFile}"`, { 
          stdio: 'pipe',
          timeout: 5000 
        });
      } catch (error) {
        hasErrors = true;
        results.syntax.errors.push(`${testFile}: ${error.message}`);
      }
    }
    
    if (!hasErrors) {
      results.syntax.passed++;
      console.log('✅ 测试脚本语法检查通过');
      return true;
    } else {
      results.syntax.failed++;
      console.log('❌ 测试脚本语法检查失败');
      return false;
    }
  } catch (error) {
    results.syntax.failed++;
    results.syntax.errors.push(error.message);
    console.log('❌ 测试脚本语法检查失败:', error.message);
    return false;
  }
}

/**
 * 检查测试脚本执行
 */
function checkTestExecution() {
  console.log('🔍 检查测试脚本执行...');
  
  try {
    const testsDir = path.join(process.cwd(), 'tests');
    const testFiles = getAllTestFiles(testsDir);
    let hasErrors = false;
    
    for (const testFile of testFiles) {
      try {
        // 运行测试脚本
        const output = execSync(`node "${testFile}"`, { 
          stdio: 'pipe',
          timeout: CONFIG.timeout,
          encoding: 'utf8'
        });
        
        // 检查输出是否包含测试结果
        if (!output.includes('✅') && !output.includes('❌') && !output.includes('测试')) {
          hasErrors = true;
          results.execution.errors.push(`${testFile}: 测试输出格式不正确`);
        }
      } catch (error) {
        hasErrors = true;
        results.execution.errors.push(`${testFile}: ${error.message}`);
      }
    }
    
    if (!hasErrors) {
      results.execution.passed++;
      console.log('✅ 测试脚本执行检查通过');
      return true;
    } else {
      results.execution.failed++;
      console.log('❌ 测试脚本执行检查失败');
      return false;
    }
  } catch (error) {
    results.execution.failed++;
    results.execution.errors.push(error.message);
    console.log('❌ 测试脚本执行检查失败:', error.message);
    return false;
  }
}

/**
 * 检查测试覆盖率
 */
function checkTestCoverage() {
  console.log('🔍 检查测试覆盖率...');
  
  try {
    const srcDir = path.join(process.cwd(), 'src');
    const testsDir = path.join(process.cwd(), 'tests');
    
    const srcFiles = getAllSourceFiles(srcDir);
    const testFiles = getAllTestFiles(testsDir);
    
    let uncoveredFiles = [];
    
    for (const srcFile of srcFiles) {
      const relativePath = path.relative(srcDir, srcFile);
      const expectedTestFile = path.join(testsDir, getTestFileName(relativePath));
      
      if (!fs.existsSync(expectedTestFile)) {
        uncoveredFiles.push(relativePath);
      }
    }
    
    if (uncoveredFiles.length === 0) {
      results.coverage.passed++;
      console.log('✅ 测试覆盖率检查通过');
      return true;
    } else {
      results.coverage.failed++;
      results.coverage.errors.push(`未覆盖的文件: ${uncoveredFiles.join(', ')}`);
      console.log('❌ 测试覆盖率检查失败');
      return false;
    }
  } catch (error) {
    results.coverage.failed++;
    results.coverage.errors.push(error.message);
    console.log('❌ 测试覆盖率检查失败:', error.message);
    return false;
  }
}

/**
 * 检查测试脚本结构
 */
function checkTestStructure() {
  console.log('🔍 检查测试脚本结构...');
  
  try {
    const testsDir = path.join(process.cwd(), 'tests');
    const testFiles = getAllTestFiles(testsDir);
    let hasErrors = false;
    
    for (const testFile of testFiles) {
      const content = fs.readFileSync(testFile, 'utf8');
      const errors = validateTestStructure(content, testFile);
      
      if (errors.length > 0) {
        hasErrors = true;
        results.structure.errors.push(...errors);
      }
    }
    
    if (!hasErrors) {
      results.structure.passed++;
      console.log('✅ 测试脚本结构检查通过');
      return true;
    } else {
      results.structure.failed++;
      console.log('❌ 测试脚本结构检查失败');
      return false;
    }
  } catch (error) {
    results.structure.failed++;
    results.structure.errors.push(error.message);
    console.log('❌ 测试脚本结构检查失败:', error.message);
    return false;
  }
}

/**
 * 检查测试输出格式
 */
function checkTestOutput() {
  console.log('🔍 检查测试输出格式...');
  
  try {
    const testsDir = path.join(process.cwd(), 'tests');
    const testFiles = getAllTestFiles(testsDir);
    let hasErrors = false;
    
    for (const testFile of testFiles) {
      try {
        const output = execSync(`node "${testFile}"`, { 
          stdio: 'pipe',
          timeout: CONFIG.timeout,
          encoding: 'utf8'
        });
        
        const errors = validateTestOutput(output, testFile);
        
        if (errors.length > 0) {
          hasErrors = true;
          results.output.errors.push(...errors);
        }
      } catch (error) {
        hasErrors = true;
        results.output.errors.push(`${testFile}: ${error.message}`);
      }
    }
    
    if (!hasErrors) {
      results.output.passed++;
      console.log('✅ 测试输出格式检查通过');
      return true;
    } else {
      results.output.failed++;
      console.log('❌ 测试输出格式检查失败');
      return false;
    }
  } catch (error) {
    results.output.failed++;
    results.output.errors.push(error.message);
    console.log('❌ 测试输出格式检查失败:', error.message);
    return false;
  }
}

/**
 * 获取所有测试文件
 */
function getAllTestFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.js') && item.startsWith('test-')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * 获取所有源文件
 */
function getAllSourceFiles(dir) {
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
 * 获取测试文件名
 */
function getTestFileName(relativePath) {
  const dir = path.dirname(relativePath);
  const name = path.basename(relativePath, '.ts');
  return path.join(dir, `test-${name}.js`);
}

/**
 * 验证测试脚本结构
 */
function validateTestStructure(content, filePath) {
  const errors = [];
  
  // 检查是否包含测试用例
  if (!content.includes('testCases') && !content.includes('describe') && !content.includes('it(')) {
    errors.push(`${filePath}: 缺少测试用例定义`);
  }
  
  // 检查是否包含测试运行函数
  if (!content.includes('runTest') && !content.includes('runAllTests')) {
    errors.push(`${filePath}: 缺少测试运行函数`);
  }
  
  // 检查是否包含主函数
  if (!content.includes('main()') && !content.includes('if (require.main === module)')) {
    errors.push(`${filePath}: 缺少主函数或模块检查`);
  }
  
  // 检查是否包含错误处理
  if (!content.includes('try') && !content.includes('catch')) {
    errors.push(`${filePath}: 缺少错误处理`);
  }
  
  return errors;
}

/**
 * 验证测试输出格式
 */
function validateTestOutput(output, filePath) {
  const errors = [];
  
  // 检查是否包含测试开始标识
  if (!output.includes('🚀') && !output.includes('开始')) {
    errors.push(`${filePath}: 测试输出缺少开始标识`);
  }
  
  // 检查是否包含测试结果
  if (!output.includes('✅') && !output.includes('❌')) {
    errors.push(`${filePath}: 测试输出缺少结果标识`);
  }
  
  // 检查是否包含测试统计
  if (!output.includes('通过') && !output.includes('失败') && !output.includes('总计')) {
    errors.push(`${filePath}: 测试输出缺少统计信息`);
  }
  
  return errors;
}

/**
 * 运行所有检查
 */
async function runAllChecks() {
  console.log('🚀 开始测试脚本质量检查');
  console.log('=' .repeat(50));
  
  const checks = [
    { name: '语法检查', fn: checkTestSyntax },
    { name: '执行检查', fn: checkTestExecution },
    { name: '覆盖率检查', fn: checkTestCoverage },
    { name: '结构检查', fn: checkTestStructure },
    { name: '输出格式检查', fn: checkTestOutput }
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
  console.log('📊 测试脚本质量检查结果');
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
      console.log('\n🚨 测试脚本质量检查失败，请修复问题后重新检查');
      process.exit(1);
    } else {
      console.log('\n🎉 所有测试脚本质量检查通过！');
      process.exit(0);
    }
  } catch (error) {
    console.error('💥 测试脚本质量检查运行失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  runAllChecks,
  checkTestSyntax,
  checkTestExecution,
  checkTestCoverage,
  checkTestStructure,
  checkTestOutput
};
