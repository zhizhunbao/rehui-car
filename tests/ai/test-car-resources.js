#!/usr/bin/env node

/**
 * 汽车资源配置测试脚本
 * 测试汽车资源配置文件的代码质量
 */

const fs = require('fs');
const path = require('path');

// 测试配置
const TEST_CONFIG = {
  timeout: 30000,
  verbose: true
};

/**
 * 检查汽车资源配置文件是否存在
 */
function testFileExists() {
  console.log('🔍 检查汽车资源配置文件是否存在...');
  
  const carResourcesPath = path.join(process.cwd(), 'src/lib/constants/car-resources.ts');
  
  if (!fs.existsSync(carResourcesPath)) {
    console.log('❌ 汽车资源配置文件不存在:', carResourcesPath);
    return false;
  }
  
  console.log('✅ 汽车资源配置文件存在:', carResourcesPath);
  return true;
}

/**
 * 检查汽车资源配置文件内容质量
 */
function testFileContent() {
  console.log('🔍 检查汽车资源配置文件内容质量...');
  
  const carResourcesPath = path.join(process.cwd(), 'src/lib/constants/car-resources.ts');
  const content = fs.readFileSync(carResourcesPath, 'utf8');
  
  const checks = [
    {
      name: '包含二手车平台配置',
      test: () => content.includes('USED_CAR_PLATFORMS'),
      required: true
    },
    {
      name: '包含车辆信息工具配置',
      test: () => content.includes('VEHICLE_INFO_TOOLS'),
      required: true
    },
    {
      name: '包含保险提供商配置',
      test: () => content.includes('INSURANCE_PROVIDERS'),
      required: true
    },
    {
      name: '包含汽车贷款提供商配置',
      test: () => content.includes('FINANCING_PROVIDERS'),
      required: true
    },
    {
      name: '包含维修保养服务配置',
      test: () => content.includes('MAINTENANCE_SERVICES'),
      required: true
    },
    {
      name: '包含配件提供商配置',
      test: () => content.includes('ACCESSORIES_PROVIDERS'),
      required: true
    },
    {
      name: '包含运输服务配置',
      test: () => content.includes('TRANSPORTATION_SERVICES'),
      required: true
    },
    {
      name: '包含环保服务配置',
      test: () => content.includes('ENVIRONMENTAL_SERVICES'),
      required: true
    },
    {
      name: '包含AutoTrader平台',
      test: () => content.includes('AUTOTRADER') && content.includes('autotrader.ca'),
      required: true
    },
    {
      name: '包含CarGurus平台',
      test: () => content.includes('CARGURUS') && content.includes('cargurus.ca'),
      required: true
    },
    {
      name: '包含Kijiji平台',
      test: () => content.includes('KIJIJI') && content.includes('kijiji.ca'),
      required: true
    },
    {
      name: '包含CARFAX工具',
      test: () => content.includes('CARFAX_CANADA') && content.includes('carfax.ca'),
      required: true
    },
    {
      name: '包含KBB工具',
      test: () => content.includes('KBB_CANADA') && content.includes('kbb.ca'),
      required: true
    },
    {
      name: '包含ICBC保险',
      test: () => content.includes('ICBC') && content.includes('icbc.com'),
      required: true
    },
    {
      name: '包含工具函数',
      test: () => content.includes('getPlatformSearchUrl') && content.includes('getAllPlatforms'),
      required: true
    },
    {
      name: '包含JSDoc注释',
      test: () => content.includes('/**') && content.includes('@param'),
      required: true
    },
    {
      name: '包含TypeScript类型定义',
      test: () => content.includes(': string') && content.includes('as const'),
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
  
  console.log(`\n📊 汽车资源配置文件质量检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 检查汽车资源配置文件语法
 */
function testFileSyntax() {
  console.log('🔍 检查汽车资源配置文件语法...');
  
  try {
    const { execSync } = require('child_process');
    
    // 运行TypeScript编译检查
    execSync('npx tsc --noEmit src/lib/constants/car-resources.ts', { 
      stdio: 'pipe',
      timeout: 10000 
    });
    
    console.log('✅ 汽车资源配置文件语法检查通过');
    return true;
  } catch (error) {
    console.log('❌ 汽车资源配置文件语法检查失败:', error.message);
    return false;
  }
}

/**
 * 检查汽车资源配置文件结构
 */
function testFileStructure() {
  console.log('🔍 检查汽车资源配置文件结构...');
  
  const carResourcesPath = path.join(process.cwd(), 'src/lib/constants/car-resources.ts');
  const content = fs.readFileSync(carResourcesPath, 'utf8');
  
  const structureChecks = [
    {
      name: '二手车平台配置结构',
      test: () => content.includes('AUTOTRADER:') && content.includes('CARGURUS:') && content.includes('KIJIJI:')
    },
    {
      name: '车辆信息工具配置结构',
      test: () => content.includes('CARFAX_CANADA:') && content.includes('KBB_CANADA:') && content.includes('VIN_DECODER:')
    },
    {
      name: '保险提供商配置结构',
      test: () => content.includes('ICBC:') && content.includes('INTACT:') && content.includes('TD_INSURANCE:')
    },
    {
      name: '汽车贷款提供商配置结构',
      test: () => content.includes('BANKS:') && content.includes('CREDIT_UNIONS:') && content.includes('DEALERSHIP_FINANCING:')
    },
    {
      name: '维修保养服务配置结构',
      test: () => content.includes('DEALERSHIP_SERVICE:') && content.includes('INDEPENDENT_SHOPS:') && content.includes('CHAIN_SHOPS:')
    },
    {
      name: '配件提供商配置结构',
      test: () => content.includes('CANADIAN_TIRE:') && content.includes('AUTOZONE:') && content.includes('NAPA:')
    },
    {
      name: '运输服务配置结构',
      test: () => content.includes('AUTO_SHIPPING:') && content.includes('FERRY_SERVICES:')
    },
    {
      name: '环保服务配置结构',
      test: () => content.includes('SCRAP_IT:') && content.includes('RETIRE_YOUR_RIDE:')
    },
    {
      name: '工具函数导出',
      test: () => content.includes('export function getPlatformSearchUrl') && content.includes('export function getAllPlatforms')
    },
    {
      name: '常量导出',
      test: () => content.includes('export const USED_CAR_PLATFORMS') && content.includes('export const VEHICLE_INFO_TOOLS')
    }
  ];
  
  let passed = 0;
  let total = structureChecks.length;
  
  for (const check of structureChecks) {
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
  
  console.log(`\n📊 汽车资源配置文件结构检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 检查汽车资源配置文件数据完整性
 */
function testDataIntegrity() {
  console.log('🔍 检查汽车资源配置文件数据完整性...');
  
  const carResourcesPath = path.join(process.cwd(), 'src/lib/constants/car-resources.ts');
  const content = fs.readFileSync(carResourcesPath, 'utf8');
  
  const integrityChecks = [
    {
      name: 'AutoTrader配置完整性',
      test: () => content.includes('name:') && content.includes('url:') && content.includes('description:') && content.includes('type:')
    },
    {
      name: 'CarGurus配置完整性',
      test: () => content.includes('cargurus.ca') && content.includes('价格评估')
    },
    {
      name: 'Kijiji配置完整性',
      test: () => content.includes('kijiji.ca') && content.includes('个人卖家')
    },
    {
      name: 'CARFAX配置完整性',
      test: () => content.includes('carfax.ca') && content.includes('车辆历史报告')
    },
    {
      name: 'KBB配置完整性',
      test: () => content.includes('kbb.ca') && content.includes('车辆估值工具')
    },
    {
      name: 'ICBC配置完整性',
      test: () => content.includes('icbc.com') && content.includes('BC省公共保险公司')
    },
    {
      name: '银行配置完整性',
      test: () => content.includes('RBC') && content.includes('TD') && content.includes('SCOTIABANK')
    },
    {
      name: '维修服务配置完整性',
      test: () => content.includes('MISTER_LUBE') && content.includes('CANADIAN_TIRE')
    },
    {
      name: '配件提供商配置完整性',
      test: () => content.includes('AutoZone') && content.includes('NAPA')
    },
    {
      name: '环保服务配置完整性',
      test: () => content.includes('scrapit.ca') && content.includes('retireyourride.ca')
    }
  ];
  
  let passed = 0;
  let total = integrityChecks.length;
  
  for (const check of integrityChecks) {
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
  
  console.log(`\n📊 汽车资源配置文件数据完整性检查结果: ${passed}/${total} 通过`);
  return passed === total;
}

/**
 * 运行汽车资源配置文件质量检查
 */
async function runCarResourcesQualityCheck() {
  console.log('🚀 开始汽车资源配置文件质量检查');
  console.log('=' .repeat(50));
  
  const results = {
    fileExists: false,
    content: false,
    syntax: false,
    structure: false,
    dataIntegrity: false
  };
  
  // 检查文件是否存在
  results.fileExists = testFileExists();
  
  if (!results.fileExists) {
    console.log('\n❌ 汽车资源配置文件不存在，跳过其他检查');
    return false;
  }
  
  // 检查文件内容质量
  results.content = testFileContent();
  
  // 检查文件语法
  results.syntax = testFileSyntax();
  
  // 检查文件结构
  results.structure = testFileStructure();
  
  // 检查数据完整性
  results.dataIntegrity = testDataIntegrity();
  
  // 生成检查报告
  const report = {
    timestamp: new Date().toISOString(),
    file: 'src/lib/constants/car-resources.ts',
    results: results,
    overall: Object.values(results).every(result => result)
  };
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 汽车资源配置文件质量检查结果汇总');
  console.log('=' .repeat(50));
  console.log(`文件存在: ${results.fileExists ? '✅' : '❌'}`);
  console.log(`内容质量: ${results.content ? '✅' : '❌'}`);
  console.log(`语法检查: ${results.syntax ? '✅' : '❌'}`);
  console.log(`结构检查: ${results.structure ? '✅' : '❌'}`);
  console.log(`数据完整性: ${results.dataIntegrity ? '✅' : '❌'}`);
  console.log(`整体结果: ${report.overall ? '✅' : '❌'}`);
  
  return report.overall;
}

/**
 * 主函数
 */
async function main() {
  try {
    const success = await runCarResourcesQualityCheck();
    
    if (success) {
      console.log('\n🎉 汽车资源配置文件质量检查通过！');
      process.exit(0);
    } else {
      console.log('\n🚨 汽车资源配置文件质量检查失败，请修复问题');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 汽车资源配置文件质量检查运行失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  runCarResourcesQualityCheck,
  testFileExists,
  testFileContent,
  testFileSyntax,
  testFileStructure,
  testDataIntegrity
};
