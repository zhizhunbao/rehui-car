#!/usr/bin/env node

/**
 * AI提示词模板测试脚本
 * 测试提示词模板的代码质量
 */

const fs = require('fs');
const path = require('path');

// 测试配置
const TEST_CONFIG = {
  timeout: 30000,
  verbose: true
};

/**
 * 检查Prompts文件是否存在
 */
function testFileExists() {
  console.log('🔍 检查Prompts文件是否存在...');
  
  const promptsPath = path.join(process.cwd(), 'src/lib/prompts.ts');
  
  if (!fs.existsSync(promptsPath)) {
    console.log('❌ Prompts文件不存在:', promptsPath);
    return false;
  }
  
  console.log('✅ Prompts文件存在:', promptsPath);
  return true;
}

/**
 * 检查Prompts文件内容质量
 */
function testFileContent() {
  console.log('🔍 检查Prompts文件内容质量...');
  
  const promptsPath = path.join(process.cwd(), 'src/lib/prompts.ts');
  const content = fs.readFileSync(promptsPath, 'utf8');
  
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
      name: '包含汽车推荐提示词',
      test: () => content.includes('CAR_RECOMMENDATION_PROMPT'),
      required: true
    },
    {
      name: '包含聊天系统提示词',
      test: () => content.includes('CHAT_SYSTEM_PROMPT'),
      required: true
    },
    {
      name: '包含车型搜索提示词',
      test: () => content.includes('CAR_SEARCH_PROMPT'),
      required: true
    },
    {
      name: '包含价格分析提示词',
      test: () => content.includes('PRICE_ANALYSIS_PROMPT'),
      required: true
    },
    {
      name: '包含比较分析提示词',
      test: () => content.includes('COMPARISON_PROMPT'),
      required: true
    },
    {
      name: '包含错误处理提示词',
      test: () => content.includes('ERROR_HANDLING_PROMPT'),
      required: true
    },
    {
      name: '包含JSDoc注释',
      test: () => content.includes('/**') && content.includes('@param'),
      required: true
    },
    {
      name: '包含TypeScript类型定义',
      test: () => content.includes(': string') && content.includes('Language'),
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
  
  console.log(`\n📊 Prompts文件质量检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 检查Prompts文件语法
 */
function testFileSyntax() {
  console.log('🔍 检查Prompts文件语法...');
  
  try {
    const { execSync } = require('child_process');
    
    // 运行TypeScript编译检查
    execSync('npx tsc --noEmit src/lib/prompts.ts', { 
      stdio: 'pipe',
      timeout: 10000 
    });
    
    console.log('✅ Prompts文件语法检查通过');
    return true;
  } catch (error) {
    console.log('❌ Prompts文件语法检查失败:', error.message);
    return false;
  }
}

/**
 * 检查Prompts文件导入依赖
 */
function testFileImports() {
  console.log('🔍 检查Prompts文件导入依赖...');
  
  const promptsPath = path.join(process.cwd(), 'src/lib/prompts.ts');
  const content = fs.readFileSync(promptsPath, 'utf8');
  
  // 检查导入的类型文件是否存在
  const importChecks = [
    {
      name: 'Language类型',
      path: 'src/types/index.ts',
      test: () => content.includes('Language')
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
  
  console.log(`\n📊 Prompts文件导入检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 检查Prompts文件模板设计
 */
function testTemplateDesign() {
  console.log('🔍 检查Prompts文件模板设计...');
  
  const promptsPath = path.join(process.cwd(), 'src/lib/prompts.ts');
  const content = fs.readFileSync(promptsPath, 'utf8');
  
  const designChecks = [
    {
      name: '汽车推荐模板',
      test: () => content.includes('CAR_RECOMMENDATION_PROMPT') && content.includes('userMessage')
    },
    {
      name: '聊天系统模板',
      test: () => content.includes('CHAT_SYSTEM_PROMPT') && content.includes('language')
    },
    {
      name: '车型搜索模板',
      test: () => content.includes('CAR_SEARCH_PROMPT') && content.includes('searchQuery')
    },
    {
      name: '价格分析模板',
      test: () => content.includes('PRICE_ANALYSIS_PROMPT') && content.includes('carInfo')
    },
    {
      name: '比较分析模板',
      test: () => content.includes('COMPARISON_PROMPT') && content.includes('cars')
    },
    {
      name: '错误处理模板',
      test: () => content.includes('ERROR_HANDLING_PROMPT') && content.includes('error')
    },
    {
      name: '中英文双语支持',
      test: () => {
        const hasZh = content.includes('language === \'zh\'');
        const hasTernary = content.includes('?') && content.includes(':');
        console.log(`   Debug: hasZh=${hasZh}, hasTernary=${hasTernary}`);
        return hasZh && hasTernary;
      }
    },
    {
      name: 'JSON格式输出',
      test: () => content.includes('JSON格式') || content.includes('JSON format')
    },
    {
      name: '函数参数类型',
      test: () => content.includes(': Language') && content.includes(': string')
    },
    {
      name: '模板导出',
      test: () => content.includes('export const') && content.includes('export const CAR_RECOMMENDATION_PROMPT')
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
  
  console.log(`\n📊 Prompts文件模板设计检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 运行Prompts文件质量检查
 */
async function runPromptsQualityCheck() {
  console.log('🚀 开始Prompts文件质量检查');
  console.log('=' .repeat(50));
  
  const results = {
    fileExists: false,
    content: false,
    syntax: false,
    imports: false,
    templateDesign: false
  };
  
  // 检查文件是否存在
  results.fileExists = testFileExists();
  
  if (!results.fileExists) {
    console.log('\n❌ Prompts文件不存在，跳过其他检查');
    return false;
  }
  
  // 检查文件内容质量
  results.content = testFileContent();
  
  // 检查文件语法
  results.syntax = testFileSyntax();
  
  // 检查文件导入
  results.imports = testFileImports();
  
  // 检查模板设计
  results.templateDesign = testTemplateDesign();
  
  // 生成检查报告
  const report = {
    timestamp: new Date().toISOString(),
    file: 'src/lib/prompts.ts',
    results: results,
    overall: Object.values(results).every(result => result)
  };
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Prompts文件质量检查结果汇总');
  console.log('=' .repeat(50));
  console.log(`文件存在: ${results.fileExists ? '✅' : '❌'}`);
  console.log(`内容质量: ${results.content ? '✅' : '❌'}`);
  console.log(`语法检查: ${results.syntax ? '✅' : '❌'}`);
  console.log(`导入检查: ${results.imports ? '✅' : '❌'}`);
  console.log(`模板设计: ${results.templateDesign ? '✅' : '❌'}`);
  console.log(`整体结果: ${report.overall ? '✅' : '❌'}`);
  
  return report.overall;
}

/**
 * 主函数
 */
async function main() {
  try {
    const success = await runPromptsQualityCheck();
    
    if (success) {
      console.log('\n🎉 Prompts文件质量检查通过！');
      process.exit(0);
    } else {
      console.log('\n🚨 Prompts文件质量检查失败，请修复问题');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Prompts文件质量检查运行失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  runPromptsQualityCheck,
  testFileExists,
  testFileContent,
  testFileSyntax,
  testFileImports,
  testTemplateDesign
};
