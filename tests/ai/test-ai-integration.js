#!/usr/bin/env node

/**
 * AI集成综合测试脚本
 * 测试所有AI集成组件的综合功能
 */

const fs = require('fs');
const path = require('path');

// 测试配置
const TEST_CONFIG = {
  timeout: 30000,
  verbose: true
};

/**
 * 检查所有AI集成文件是否存在
 */
function testAllFilesExist() {
  console.log('🔍 检查所有AI集成文件是否存在...');
  
  const requiredFiles = [
    'src/lib/groq.ts',
    'src/lib/gemini.ts',
    'src/lib/prompts.ts',
    'src/lib/ai-utils.ts',
    'src/lib/constants/car-resources.ts'
  ];
  
  let allExist = true;
  
  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} 存在`);
    } else {
      console.log(`❌ ${file} 不存在`);
      allExist = false;
    }
  }
  
  return allExist;
}

/**
 * 检查所有AI集成测试脚本是否存在
 */
function testAllTestFilesExist() {
  console.log('🔍 检查所有AI集成测试脚本是否存在...');
  
  const requiredTestFiles = [
    'tests/ai/test-groq.js',
    'tests/ai/test-gemini.js',
    'tests/ai/test-prompts.js',
    'tests/ai/test-ai-utils.js',
    'tests/ai/test-car-resources.js'
  ];
  
  let allExist = true;
  
  for (const file of requiredTestFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} 存在`);
    } else {
      console.log(`❌ ${file} 不存在`);
      allExist = false;
    }
  }
  
  return allExist;
}

/**
 * 检查AI集成文件导入关系
 */
function testImportRelationships() {
  console.log('🔍 检查AI集成文件导入关系...');
  
  const importChecks = [
    {
      name: 'GROQ文件导入类型',
      file: 'src/lib/groq.ts',
      test: () => {
        const content = fs.readFileSync(path.join(process.cwd(), 'src/lib/groq.ts'), 'utf8');
        return content.includes('ChatMessage') && content.includes('Language') && content.includes('BilingualText');
      }
    },
    {
      name: 'Gemini文件导入类型',
      file: 'src/lib/gemini.ts',
      test: () => {
        const content = fs.readFileSync(path.join(process.cwd(), 'src/lib/gemini.ts'), 'utf8');
        return content.includes('ChatMessage') && content.includes('Language') && content.includes('BilingualText');
      }
    },
    {
      name: 'Prompts文件导入类型',
      file: 'src/lib/prompts.ts',
      test: () => {
        const content = fs.readFileSync(path.join(process.cwd(), 'src/lib/prompts.ts'), 'utf8');
        return content.includes('Language');
      }
    },
    {
      name: 'AI工具文件导入类型',
      file: 'src/lib/ai-utils.ts',
      test: () => {
        const content = fs.readFileSync(path.join(process.cwd(), 'src/lib/ai-utils.ts'), 'utf8');
        return content.includes('Language') && content.includes('BilingualText') && content.includes('CarRecommendation');
      }
    },
    {
      name: '汽车资源配置文件独立',
      file: 'src/lib/constants/car-resources.ts',
      test: () => {
        const content = fs.readFileSync(path.join(process.cwd(), 'src/lib/constants/car-resources.ts'), 'utf8');
        return !content.includes('import') || content.includes('export');
      }
    }
  ];
  
  let passed = 0;
  let total = importChecks.length;
  
  for (const check of importChecks) {
    try {
      const result = check.test();
      if (result) {
        console.log(`✅ ${check.name}`);
        passed++;
      } else {
        console.log(`❌ ${check.name}`);
      }
    } catch (error) {
      console.log(`❌ ${check.name} - 检查失败: ${error.message}`);
    }
  }
  
  console.log(`\n📊 AI集成文件导入关系检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 检查AI集成文件功能完整性
 */
function testFunctionCompleteness() {
  console.log('🔍 检查AI集成文件功能完整性...');
  
  const functionChecks = [
    {
      name: 'GROQ文件功能',
      file: 'src/lib/groq.ts',
      test: () => {
        const content = fs.readFileSync(path.join(process.cwd(), 'src/lib/groq.ts'), 'utf8');
        return content.includes('generateChatResponse') && 
               content.includes('generateCarRecommendation') && 
               content.includes('healthCheck') && 
               content.includes('getUsageStats');
      }
    },
    {
      name: 'Gemini文件功能',
      file: 'src/lib/gemini.ts',
      test: () => {
        const content = fs.readFileSync(path.join(process.cwd(), 'src/lib/gemini.ts'), 'utf8');
        return content.includes('generateChatResponse') && 
               content.includes('generateCarRecommendation') && 
               content.includes('healthCheck') && 
               content.includes('getUsageStats');
      }
    },
    {
      name: 'Prompts文件功能',
      file: 'src/lib/prompts.ts',
      test: () => {
        const content = fs.readFileSync(path.join(process.cwd(), 'src/lib/prompts.ts'), 'utf8');
        return content.includes('CAR_RECOMMENDATION_PROMPT') && 
               content.includes('CHAT_SYSTEM_PROMPT') && 
               content.includes('CAR_SEARCH_PROMPT') && 
               content.includes('PRICE_ANALYSIS_PROMPT');
      }
    },
    {
      name: 'AI工具文件功能',
      file: 'src/lib/ai-utils.ts',
      test: () => {
        const content = fs.readFileSync(path.join(process.cwd(), 'src/lib/ai-utils.ts'), 'utf8');
        return content.includes('validateAIResponse') && 
               content.includes('formatAIResponse') && 
               content.includes('generateDefaultResponse') && 
               content.includes('mergeAIResponses');
      }
    },
    {
      name: '汽车资源配置功能',
      file: 'src/lib/constants/car-resources.ts',
      test: () => {
        const content = fs.readFileSync(path.join(process.cwd(), 'src/lib/constants/car-resources.ts'), 'utf8');
        return content.includes('USED_CAR_PLATFORMS') && 
               content.includes('VEHICLE_INFO_TOOLS') && 
               content.includes('getPlatformSearchUrl') && 
               content.includes('getAllPlatforms');
      }
    }
  ];
  
  let passed = 0;
  let total = functionChecks.length;
  
  for (const check of functionChecks) {
    try {
      const result = check.test();
      if (result) {
        console.log(`✅ ${check.name}`);
        passed++;
      } else {
        console.log(`❌ ${check.name}`);
      }
    } catch (error) {
      console.log(`❌ ${check.name} - 检查失败: ${error.message}`);
    }
  }
  
  console.log(`\n📊 AI集成文件功能完整性检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 检查AI集成文件语法一致性
 */
function testSyntaxConsistency() {
  console.log('🔍 检查AI集成文件语法一致性...');
  
  const syntaxChecks = [
    {
      name: 'GROQ文件语法',
      file: 'src/lib/groq.ts',
      test: () => {
        try {
          const { execSync } = require('child_process');
          execSync('npx tsc --noEmit src/lib/groq.ts', { stdio: 'pipe', timeout: 10000 });
          return true;
        } catch (error) {
          return false;
        }
      }
    },
    {
      name: 'Gemini文件语法',
      file: 'src/lib/gemini.ts',
      test: () => {
        try {
          const { execSync } = require('child_process');
          execSync('npx tsc --noEmit src/lib/gemini.ts', { stdio: 'pipe', timeout: 10000 });
          return true;
        } catch (error) {
          return false;
        }
      }
    },
    {
      name: 'Prompts文件语法',
      file: 'src/lib/prompts.ts',
      test: () => {
        try {
          const { execSync } = require('child_process');
          execSync('npx tsc --noEmit src/lib/prompts.ts', { stdio: 'pipe', timeout: 10000 });
          return true;
        } catch (error) {
          return false;
        }
      }
    },
    {
      name: 'AI工具文件语法',
      file: 'src/lib/ai-utils.ts',
      test: () => {
        try {
          const { execSync } = require('child_process');
          execSync('npx tsc --noEmit src/lib/ai-utils.ts', { stdio: 'pipe', timeout: 10000 });
          return true;
        } catch (error) {
          return false;
        }
      }
    },
    {
      name: '汽车资源配置文件语法',
      file: 'src/lib/constants/car-resources.ts',
      test: () => {
        try {
          const { execSync } = require('child_process');
          execSync('npx tsc --noEmit src/lib/constants/car-resources.ts', { stdio: 'pipe', timeout: 10000 });
          return true;
        } catch (error) {
          return false;
        }
      }
    }
  ];
  
  let passed = 0;
  let total = syntaxChecks.length;
  
  for (const check of syntaxChecks) {
    try {
      const result = check.test();
      if (result) {
        console.log(`✅ ${check.name}`);
        passed++;
      } else {
        console.log(`❌ ${check.name}`);
      }
    } catch (error) {
      console.log(`❌ ${check.name} - 检查失败: ${error.message}`);
    }
  }
  
  console.log(`\n📊 AI集成文件语法一致性检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 运行AI集成综合测试
 */
async function runAIIntegrationTest() {
  console.log('🚀 开始AI集成综合测试');
  console.log('=' .repeat(50));
  
  const results = {
    allFilesExist: false,
    allTestFilesExist: false,
    importRelationships: false,
    functionCompleteness: false,
    syntaxConsistency: false
  };
  
  // 检查所有文件是否存在
  results.allFilesExist = testAllFilesExist();
  
  // 检查所有测试文件是否存在
  results.allTestFilesExist = testAllTestFilesExist();
  
  // 检查导入关系
  results.importRelationships = testImportRelationships();
  
  // 检查功能完整性
  results.functionCompleteness = testFunctionCompleteness();
  
  // 检查语法一致性
  results.syntaxConsistency = testSyntaxConsistency();
  
  // 生成测试报告
  const report = {
    timestamp: new Date().toISOString(),
    testType: 'AI Integration Comprehensive Test',
    results: results,
    overall: Object.values(results).every(result => result)
  };
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 AI集成综合测试结果汇总');
  console.log('=' .repeat(50));
  console.log(`所有源文件存在: ${results.allFilesExist ? '✅' : '❌'}`);
  console.log(`所有测试文件存在: ${results.allTestFilesExist ? '✅' : '❌'}`);
  console.log(`导入关系正确: ${results.importRelationships ? '✅' : '❌'}`);
  console.log(`功能完整性: ${results.functionCompleteness ? '✅' : '❌'}`);
  console.log(`语法一致性: ${results.syntaxConsistency ? '✅' : '❌'}`);
  console.log(`整体结果: ${report.overall ? '✅' : '❌'}`);
  
  return report.overall;
}

/**
 * 主函数
 */
async function main() {
  try {
    const success = await runAIIntegrationTest();
    
    if (success) {
      console.log('\n🎉 AI集成综合测试通过！');
      process.exit(0);
    } else {
      console.log('\n🚨 AI集成综合测试失败，请修复问题');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 AI集成综合测试运行失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  runAIIntegrationTest,
  testAllFilesExist,
  testAllTestFilesExist,
  testImportRelationships,
  testFunctionCompleteness,
  testSyntaxConsistency
};
