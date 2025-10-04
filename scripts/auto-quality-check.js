#!/usr/bin/env node

/**
 * 自动质量检查脚本
 * 在代码生成和测试脚本生成后自动运行质量检查
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  timeout: 60000, // 60秒超时
  verbose: true
};

/**
 * 运行代码质量检查
 */
async function runCodeQualityCheck() {
  console.log('🔍 运行代码质量检查...');
  
  try {
    execSync('npm run check:code', { 
      stdio: 'inherit',
      timeout: CONFIG.timeout 
    });
    
    console.log('✅ 代码质量检查通过');
    return true;
  } catch (error) {
    console.log('❌ 代码质量检查失败:', error.message);
    return false;
  }
}

/**
 * 运行测试脚本质量检查
 */
async function runTestQualityCheck() {
  console.log('🔍 运行测试脚本质量检查...');
  
  try {
    execSync('npm run check:test', { 
      stdio: 'inherit',
      timeout: CONFIG.timeout 
    });
    
    console.log('✅ 测试脚本质量检查通过');
    return true;
  } catch (error) {
    console.log('❌ 测试脚本质量检查失败:', error.message);
    return false;
  }
}

/**
 * 运行集成测试
 */
async function runIntegrationTest() {
  console.log('🔍 运行集成测试...');
  
  try {
    execSync('npm run test:integration', { 
      stdio: 'inherit',
      timeout: CONFIG.timeout 
    });
    
    console.log('✅ 集成测试通过');
    return true;
  } catch (error) {
    console.log('❌ 集成测试失败:', error.message);
    return false;
  }
}

/**
 * 检查最近修改的文件
 */
function checkRecentFiles() {
  console.log('🔍 检查最近修改的文件...');
  
  try {
    const srcDir = path.join(process.cwd(), 'src');
    const testsDir = path.join(process.cwd(), 'tests');
    
    // 获取最近5分钟修改的文件
    const recentFiles = getRecentFiles(srcDir, 5 * 60 * 1000); // 5分钟
    const recentTests = getRecentFiles(testsDir, 5 * 60 * 1000);
    
    console.log(`📁 最近修改的源文件: ${recentFiles.length}`);
    console.log(`📁 最近修改的测试文件: ${recentTests.length}`);
    
    return { recentFiles, recentTests };
  } catch (error) {
    console.log('❌ 检查最近修改文件失败:', error.message);
    return { recentFiles: [], recentTests: [] };
  }
}

/**
 * 获取最近修改的文件
 */
function getRecentFiles(dir, timeThreshold) {
  const files = [];
  const now = Date.now();
  
  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (stat.mtime.getTime() > now - timeThreshold) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // 忽略无法访问的目录
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * 生成质量检查报告
 */
function generateQualityReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    codeQuality: results.codeQuality,
    testQuality: results.testQuality,
    integration: results.integration,
    overall: results.codeQuality && results.testQuality && results.integration
  };
  
  const reportPath = path.join(process.cwd(), 'quality-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📊 质量检查报告已生成: ${reportPath}`);
  return report;
}

/**
 * 运行完整的质量检查流程
 */
async function runFullQualityCheck() {
  console.log('🚀 开始自动质量检查');
  console.log('=' .repeat(50));
  
  // 检查最近修改的文件
  const { recentFiles, recentTests } = checkRecentFiles();
  
  if (recentFiles.length === 0 && recentTests.length === 0) {
    console.log('ℹ️ 没有检测到最近修改的文件，跳过质量检查');
    return true;
  }
  
  console.log(`📁 检测到 ${recentFiles.length} 个最近修改的源文件`);
  console.log(`📁 检测到 ${recentTests.length} 个最近修改的测试文件`);
  
  const results = {
    codeQuality: false,
    testQuality: false,
    integration: false
  };
  
  // 运行代码质量检查
  if (recentFiles.length > 0) {
    results.codeQuality = await runCodeQualityCheck();
  } else {
    console.log('⏭️ 跳过代码质量检查（没有修改的源文件）');
    results.codeQuality = true;
  }
  
  // 运行测试脚本质量检查
  if (recentTests.length > 0) {
    results.testQuality = await runTestQualityCheck();
  } else {
    console.log('⏭️ 跳过测试脚本质量检查（没有修改的测试文件）');
    results.testQuality = true;
  }
  
  // 运行集成测试
  results.integration = await runIntegrationTest();
  
  // 生成质量检查报告
  const report = generateQualityReport(results);
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 质量检查结果汇总');
  console.log('=' .repeat(50));
  console.log(`代码质量: ${results.codeQuality ? '✅' : '❌'}`);
  console.log(`测试质量: ${results.testQuality ? '✅' : '❌'}`);
  console.log(`集成测试: ${results.integration ? '✅' : '❌'}`);
  console.log(`整体结果: ${report.overall ? '✅' : '❌'}`);
  
  return report.overall;
}

/**
 * 主函数
 */
async function main() {
  try {
    const success = await runFullQualityCheck();
    
    if (success) {
      console.log('\n🎉 所有质量检查通过！');
      process.exit(0);
    } else {
      console.log('\n🚨 质量检查失败，请修复问题后重新检查');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 自动质量检查运行失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  runFullQualityCheck,
  runCodeQualityCheck,
  runTestQualityCheck,
  runIntegrationTest,
  checkRecentFiles,
  generateQualityReport
};
