#!/usr/bin/env node

/**
 * Gemini AI客户端测试脚本
 * 测试Gemini API集成和代码质量
 */

const fs = require('fs');
const path = require('path');

// 测试配置
const TEST_CONFIG = {
  timeout: 30000,
  verbose: true
};

/**
 * 检查Gemini文件是否存在
 */
function testFileExists() {
  console.log('🔍 检查Gemini文件是否存在...');
  
  const geminiPath = path.join(process.cwd(), 'src/lib/gemini.ts');
  
  if (!fs.existsSync(geminiPath)) {
    console.log('❌ Gemini文件不存在:', geminiPath);
    return false;
  }
  
  console.log('✅ Gemini文件存在:', geminiPath);
  return true;
}

/**
 * 检查Gemini文件内容质量
 */
function testFileContent() {
  console.log('🔍 检查Gemini文件内容质量...');
  
  const geminiPath = path.join(process.cwd(), 'src/lib/gemini.ts');
  const content = fs.readFileSync(geminiPath, 'utf8');
  
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
      name: '包含环境变量验证',
      test: () => content.includes('process.env.GEMINI_API_KEY'),
      required: true
    },
    {
      name: '包含错误处理',
      test: () => content.includes('try {') && content.includes('catch (error)'),
      required: true
    },
    {
      name: '包含TypeScript类型定义',
      test: () => content.includes('interface ') && content.includes(': Promise<'),
      required: true
    },
    {
      name: '包含JSDoc注释',
      test: () => content.includes('/**') && content.includes('@param'),
      required: true
    },
    {
      name: '包含健康检查函数',
      test: () => content.includes('healthCheck'),
      required: true
    },
    {
      name: '包含使用统计函数',
      test: () => content.includes('getUsageStats'),
      required: true
    },
    {
      name: '包含聊天响应函数',
      test: () => content.includes('generateChatResponse'),
      required: true
    },
    {
      name: '包含汽车推荐函数',
      test: () => content.includes('generateCarRecommendation'),
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
  
  console.log(`\n📊 Gemini文件质量检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 检查Gemini文件语法
 */
function testFileSyntax() {
  console.log('🔍 检查Gemini文件语法...');
  
  try {
    const { execSync } = require('child_process');
    
    // 运行TypeScript编译检查
    execSync('npx tsc --noEmit src/lib/gemini.ts', { 
      stdio: 'pipe',
      timeout: 10000 
    });
    
    console.log('✅ Gemini文件语法检查通过');
    return true;
  } catch (error) {
    console.log('❌ Gemini文件语法检查失败:', error.message);
    return false;
  }
}

/**
 * 检查Gemini文件导入依赖
 */
function testFileImports() {
  console.log('🔍 检查Gemini文件导入依赖...');
  
  const geminiPath = path.join(process.cwd(), 'src/lib/gemini.ts');
  const content = fs.readFileSync(geminiPath, 'utf8');
  
  // 检查导入的类型文件是否存在
  const importChecks = [
    {
      name: 'ChatMessage类型',
      path: 'src/types/chat.ts',
      test: () => content.includes('ChatMessage')
    },
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
  
  console.log(`\n📊 Gemini文件导入检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 检查Gemini文件API设计
 */
function testAPIDesign() {
  console.log('🔍 检查Gemini文件API设计...');
  
  const geminiPath = path.join(process.cwd(), 'src/lib/gemini.ts');
  const content = fs.readFileSync(geminiPath, 'utf8');
  
  const designChecks = [
    {
      name: 'API URL配置',
      test: () => content.includes('GEMINI_API_URL') && content.includes('generativelanguage.googleapis.com')
    },
    {
      name: '模型配置',
      test: () => content.includes('GEMINI_MODEL') && content.includes('gemini-2.0-flash-exp')
    },
    {
      name: '环境变量验证函数',
      test: () => content.includes('getGeminiApiKey') && content.includes('throw new Error')
    },
    {
      name: '响应类型定义',
      test: () => content.includes('interface GeminiResponse')
    },
    {
      name: 'AI推荐响应类型',
      test: () => content.includes('interface AIRecommendationResponse')
    },
    {
      name: '错误处理机制',
      test: () => content.includes('try {') && content.includes('catch (error)') && content.includes('throw new Error')
    },
    {
      name: 'HTTP请求配置',
      test: () => content.includes('fetch(') && content.includes('method: \'POST\'')
    },
    {
      name: '请求头配置',
      test: () => content.includes('Content-Type') && content.includes('application/json')
    },
    {
      name: '响应处理',
      test: () => content.includes('response.json()') && content.includes('response.ok')
    },
    {
      name: 'JSON解析',
      test: () => content.includes('JSON.parse') && content.includes('as AIRecommendationResponse')
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
  
  console.log(`\n📊 Gemini文件API设计检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 运行Gemini文件质量检查
 */
async function runGeminiQualityCheck() {
  console.log('🚀 开始Gemini文件质量检查');
  console.log('=' .repeat(50));
  
  const results = {
    fileExists: false,
    content: false,
    syntax: false,
    imports: false,
    apiDesign: false
  };
  
  // 检查文件是否存在
  results.fileExists = testFileExists();
  
  if (!results.fileExists) {
    console.log('\n❌ Gemini文件不存在，跳过其他检查');
    return false;
  }
  
  // 检查文件内容质量
  results.content = testFileContent();
  
  // 检查文件语法
  results.syntax = testFileSyntax();
  
  // 检查文件导入
  results.imports = testFileImports();
  
  // 检查API设计
  results.apiDesign = testAPIDesign();
  
  // 生成检查报告
  const report = {
    timestamp: new Date().toISOString(),
    file: 'src/lib/gemini.ts',
    results: results,
    overall: Object.values(results).every(result => result)
  };
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Gemini文件质量检查结果汇总');
  console.log('=' .repeat(50));
  console.log(`文件存在: ${results.fileExists ? '✅' : '❌'}`);
  console.log(`内容质量: ${results.content ? '✅' : '❌'}`);
  console.log(`语法检查: ${results.syntax ? '✅' : '❌'}`);
  console.log(`导入检查: ${results.imports ? '✅' : '❌'}`);
  console.log(`API设计: ${results.apiDesign ? '✅' : '❌'}`);
  console.log(`整体结果: ${report.overall ? '✅' : '❌'}`);
  
  return report.overall;
}

/**
 * 主函数
 */
async function main() {
  try {
    const success = await runGeminiQualityCheck();
    
    if (success) {
      console.log('\n🎉 Gemini文件质量检查通过！');
      process.exit(0);
    } else {
      console.log('\n🚨 Gemini文件质量检查失败，请修复问题');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Gemini文件质量检查运行失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  runGeminiQualityCheck,
  testFileExists,
  testFileContent,
  testFileSyntax,
  testFileImports,
  testAPIDesign
};
