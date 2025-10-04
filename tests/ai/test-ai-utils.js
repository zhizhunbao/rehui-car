#!/usr/bin/env node

/**
 * AI工具函数测试脚本
 * 测试AI工具函数的代码质量
 */

const fs = require('fs');
const path = require('path');

// 测试配置
const TEST_CONFIG = {
  timeout: 30000,
  verbose: true
};

/**
 * 检查AI工具文件是否存在
 */
function testFileExists() {
  console.log('🔍 检查AI工具文件是否存在...');
  
  const aiUtilsPath = path.join(process.cwd(), 'src/lib/ai-utils.ts');
  
  if (!fs.existsSync(aiUtilsPath)) {
    console.log('❌ AI工具文件不存在:', aiUtilsPath);
    return false;
  }
  
  console.log('✅ AI工具文件存在:', aiUtilsPath);
  return true;
}

/**
 * 检查AI工具文件内容质量
 */
function testFileContent() {
  console.log('🔍 检查AI工具文件内容质量...');
  
  const aiUtilsPath = path.join(process.cwd(), 'src/lib/ai-utils.ts');
  const content = fs.readFileSync(aiUtilsPath, 'utf8');
  
  const checks = [
    {
      name: '导入语句使用绝对路径',
      test: () => content.includes("from 'D:/BaiduSyncdisk/workspace/python_workspace/rehui-car/src/types'"),
      required: true
    },
    {
      name: '没有相对路径导入',
      test: () => !content.includes("from './") && !content.includes("from '../"),
      required: true
    },
    {
      name: '包含响应验证函数',
      test: () => content.includes('validateAIResponse'),
      required: true
    },
    {
      name: '包含响应格式化函数',
      test: () => content.includes('formatAIResponse'),
      required: true
    },
    {
      name: '包含默认响应生成函数',
      test: () => content.includes('generateDefaultResponse'),
      required: true
    },
    {
      name: '包含响应合并函数',
      test: () => content.includes('mergeAIResponses'),
      required: true
    },
    {
      name: '包含关键词提取函数',
      test: () => content.includes('extractKeywords'),
      required: true
    },
    {
      name: '包含相似度计算函数',
      test: () => content.includes('calculateSimilarity'),
      required: true
    },
    {
      name: '包含会话摘要生成函数',
      test: () => content.includes('generateConversationSummary'),
      required: true
    },
    {
      name: '包含环境变量验证函数',
      test: () => content.includes('validateEnvironmentVariables'),
      required: true
    },
    {
      name: '包含AI服务状态函数',
      test: () => content.includes('getAIServiceStatus'),
      required: true
    },
    {
      name: '包含JSDoc注释',
      test: () => content.includes('/**') && content.includes('@param'),
      required: true
    },
    {
      name: '包含TypeScript类型定义',
      test: () => content.includes(': boolean') && content.includes(': string'),
      required: true
    }
  ];
  
  let passed = 0;
  let total = checks.length;
  
  for (const check of checks) {
    try {
      const result = check.test();
      if (result) {
        console.log(`✅ ${check.name}`);
        passed++;
      } else {
        console.log(`❌ ${check.name}`);
        if (check.required) {
          console.log(`   ⚠️ 这是必需的质量检查项`);
        }
      }
    } catch (error) {
      console.log(`❌ ${check.name} - 检查失败: ${error.message}`);
    }
  }
  
  console.log(`\n📊 AI工具文件质量检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 检查AI工具文件语法
 */
function testFileSyntax() {
  console.log('🔍 检查AI工具文件语法...');
  
  try {
    const { execSync } = require('child_process');
    
    // 运行TypeScript编译检查
    execSync('npx tsc --noEmit src/lib/ai-utils.ts', { 
      stdio: 'pipe',
      timeout: 10000 
    });
    
    console.log('✅ AI工具文件语法检查通过');
    return true;
  } catch (error) {
    console.log('❌ AI工具文件语法检查失败:', error.message);
    return false;
  }
}

/**
 * 检查AI工具文件导入依赖
 */
function testFileImports() {
  console.log('🔍 检查AI工具文件导入依赖...');
  
  const aiUtilsPath = path.join(process.cwd(), 'src/lib/ai-utils.ts');
  const content = fs.readFileSync(aiUtilsPath, 'utf8');
  
  // 检查导入的类型文件是否存在
  const importChecks = [
    {
      name: 'Language类型',
      path: 'src/types/index.ts',
      test: () => content.includes('Language')
    },
    {
      name: 'BilingualText类型',
      path: 'src/types/index.ts',
      test: () => content.includes('BilingualText')
    },
    {
      name: 'CarRecommendation类型',
      path: 'src/types/car.ts',
      test: () => content.includes('CarRecommendation')
    },
    {
      name: 'NextStep类型',
      path: 'src/types/car.ts',
      test: () => content.includes('NextStep')
    }
  ];
  
  let passed = 0;
  let total = importChecks.length;
  
  for (const check of importChecks) {
    try {
      const typePath = path.join(process.cwd(), check.path);
      const typeExists = fs.existsSync(typePath);
      const importExists = check.test();
      
      if (typeExists && importExists) {
        console.log(`✅ ${check.name} - 类型文件存在且已导入`);
        passed++;
      } else if (!typeExists) {
        console.log(`❌ ${check.name} - 类型文件不存在: ${check.path}`);
      } else if (!importExists) {
        console.log(`❌ ${check.name} - 类型未导入`);
      }
    } catch (error) {
      console.log(`❌ ${check.name} - 检查失败: ${error.message}`);
    }
  }
  
  console.log(`\n📊 AI工具文件导入检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 检查AI工具文件函数设计
 */
function testFunctionDesign() {
  console.log('🔍 检查AI工具文件函数设计...');
  
  const aiUtilsPath = path.join(process.cwd(), 'src/lib/ai-utils.ts');
  const content = fs.readFileSync(aiUtilsPath, 'utf8');
  
  const designChecks = [
    {
      name: '响应验证函数',
      test: () => content.includes('validateAIResponse') && content.includes('function validateAIResponse')
    },
    {
      name: '响应格式化函数',
      test: () => content.includes('formatAIResponse') && content.includes('function formatAIResponse')
    },
    {
      name: '默认响应生成函数',
      test: () => content.includes('generateDefaultResponse') && content.includes('function generateDefaultResponse')
    },
    {
      name: '响应合并函数',
      test: () => content.includes('mergeAIResponses') && content.includes('function mergeAIResponses')
    },
    {
      name: '关键词提取函数',
      test: () => content.includes('extractKeywords') && content.includes('function extractKeywords')
    },
    {
      name: '相似度计算函数',
      test: () => content.includes('calculateSimilarity') && content.includes('function calculateSimilarity')
    },
    {
      name: '会话摘要生成函数',
      test: () => content.includes('generateConversationSummary') && content.includes('function generateConversationSummary')
    },
    {
      name: '环境变量验证函数',
      test: () => content.includes('validateEnvironmentVariables') && content.includes('function validateEnvironmentVariables')
    },
    {
      name: 'AI服务状态函数',
      test: () => content.includes('getAIServiceStatus') && content.includes('function getAIServiceStatus')
    },
    {
      name: '错误处理机制',
      test: () => content.includes('try {') && content.includes('catch (error)') && content.includes('console.error')
    },
    {
      name: '类型安全',
      test: () => content.includes(': boolean') && content.includes(': string') && content.includes(': Language')
    },
    {
      name: '函数导出',
      test: () => content.includes('export function') && content.includes('export function validateAIResponse')
    }
  ];
  
  let passed = 0;
  let total = designChecks.length;
  
  for (const check of designChecks) {
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
  
  console.log(`\n📊 AI工具文件函数设计检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 运行AI工具文件质量检查
 */
async function runAIUtilsQualityCheck() {
  console.log('🚀 开始AI工具文件质量检查');
  console.log('=' .repeat(50));
  
  const results = {
    fileExists: false,
    content: false,
    syntax: false,
    imports: false,
    functionDesign: false
  };
  
  // 检查文件是否存在
  results.fileExists = testFileExists();
  
  if (!results.fileExists) {
    console.log('\n❌ AI工具文件不存在，跳过其他检查');
    return false;
  }
  
  // 检查文件内容质量
  results.content = testFileContent();
  
  // 检查文件语法
  results.syntax = testFileSyntax();
  
  // 检查文件导入
  results.imports = testFileImports();
  
  // 检查函数设计
  results.functionDesign = testFunctionDesign();
  
  // 生成检查报告
  const report = {
    timestamp: new Date().toISOString(),
    file: 'src/lib/ai-utils.ts',
    results: results,
    overall: Object.values(results).every(result => result)
  };
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 AI工具文件质量检查结果汇总');
  console.log('=' .repeat(50));
  console.log(`文件存在: ${results.fileExists ? '✅' : '❌'}`);
  console.log(`内容质量: ${results.content ? '✅' : '❌'}`);
  console.log(`语法检查: ${results.syntax ? '✅' : '❌'}`);
  console.log(`导入检查: ${results.imports ? '✅' : '❌'}`);
  console.log(`函数设计: ${results.functionDesign ? '✅' : '❌'}`);
  console.log(`整体结果: ${report.overall ? '✅' : '❌'}`);
  
  return report.overall;
}

/**
 * 主函数
 */
async function main() {
  try {
    const success = await runAIUtilsQualityCheck();
    
    if (success) {
      console.log('\n🎉 AI工具文件质量检查通过！');
      process.exit(0);
    } else {
      console.log('\n🚨 AI工具文件质量检查失败，请修复问题');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 AI工具文件质量检查运行失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  runAIUtilsQualityCheck,
  testFileExists,
  testFileContent,
  testFileSyntax,
  testFileImports,
  testFunctionDesign
};
