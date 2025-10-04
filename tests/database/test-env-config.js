#!/usr/bin/env node

/**
 * 步骤 4: Supabase CLI 配置测试 - 环境变量配置详细测试
 * 专门测试环境变量配置的正确性和完整性
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Load environment variables
dotenv.config({ path: '.env.local' });

/**
 * Environment variable categories for testing
 */
const ENV_CATEGORIES = {
  required: {
    supabase: [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'SUPABASE_TOKEN'
    ],
    app: [
      'NEXT_PUBLIC_APP_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ]
  },
  optional: {
    ai: [
      'GOOGLE_GEMINI_API_KEY',
      'GROQ_API_KEY'
    ],
    app_config: [
      'NEXT_PUBLIC_APP_NAME',
      'NEXT_PUBLIC_APP_VERSION',
      'NODE_ENV',
      'NEXT_PUBLIC_DEBUG',
      'NEXT_PUBLIC_LOG_LEVEL'
    ],
    features: [
      'NEXT_PUBLIC_ENABLE_ANALYTICS',
      'NEXT_PUBLIC_ENABLE_CHAT_HISTORY',
      'NEXT_PUBLIC_ENABLE_CAR_RECOMMENDATIONS',
      'NEXT_PUBLIC_RATE_LIMIT_REQUESTS',
      'NEXT_PUBLIC_RATE_LIMIT_WINDOW',
      'NEXT_PUBLIC_MAX_FILE_SIZE',
      'NEXT_PUBLIC_ALLOWED_FILE_TYPES',
      'NEXT_PUBLIC_DEFAULT_LANGUAGE',
      'NEXT_PUBLIC_SUPPORTED_LANGUAGES'
    ],
    database: [
      'DATABASE_URL'
    ]
  }
};

/**
 * Validation rules for different types of environment variables
 */
const VALIDATION_RULES = {
  'NEXT_PUBLIC_SUPABASE_URL': {
    type: 'url',
    required: true,
    pattern: /^https:\/\/[a-zA-Z0-9\-\.]+\.supabase\.co$/,
    description: 'Supabase 项目 URL'
  },
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': {
    type: 'jwt',
    required: true,
    pattern: /^eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
    description: 'Supabase 匿名访问密钥'
  },
  'SUPABASE_SERVICE_ROLE_KEY': {
    type: 'jwt',
    required: true,
    pattern: /^eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
    description: 'Supabase 服务角色密钥'
  },
  'SUPABASE_TOKEN': {
    type: 'token',
    required: true,
    pattern: /^sbp_[A-Fa-f0-9]+$/,
    description: 'Supabase 个人访问令牌'
  },
  'GOOGLE_GEMINI_API_KEY': {
    type: 'key',
    required: false,
    pattern: /^AIza[A-Za-z0-9_-]+$/,
    description: 'Google Gemini API 密钥'
  },
  'GROQ_API_KEY': {
    type: 'key',
    required: false,
    pattern: /^gsk_[A-Za-z0-9]+$/,
    description: 'Groq API 密钥'
  },
  'NEXT_PUBLIC_APP_URL': {
    type: 'url',
    required: true,
    pattern: /^https?:\/\/([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}|localhost)(?::\d+)?$/,
    description: '应用基础 URL'
  },
  'NEXTAUTH_SECRET': {
    type: 'secret',
    required: true,
    minLength: 32,
    description: 'NextAuth 密钥'
  },
  'NEXTAUTH_URL': {
    type: 'url',
    required: true,
    pattern: /^https?:\/\/([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}|localhost)(?::\d+)?$/,
    description: 'NextAuth URL'
  }
};

/**
 * Validate a single environment variable
 */
function validateEnvVar(name, value) {
  const rule = VALIDATION_RULES[name];
  if (!rule) {
    return { valid: true, warnings: [] }; // No specific rule, assume valid
  }

  const warnings = [];

  // Check if required value exists
  if (rule.required && (!value || value.trim() === '')) {
    return { valid: false, errors: [`必需的环境变量 ${name} 未设置`] };
  }

  // Skip validation if optional and not set
  if (!rule.required && (!value || value.trim() === '')) {
    return { valid: true, warnings: [] };
  }

  // Type-specific validations
  switch (rule.type) {
    case 'url':
      if (rule.pattern && !rule.pattern.test(value)) {
        warnings.push(`${name} 格式不符合预期模式`);
      }
      break;

    case 'jwt':
      if (rule.pattern && !rule.pattern.test(value)) {
        return { valid: false, errors: [`${name} 格式无效，应为有效的 JWT 令牌`] };
      }
      break;

    case 'key':
      if (rule.pattern && !rule.pattern.test(value)) {
        warnings.push(`${name} 格式不符合预期模式`);
      }
      break;

    case 'token':
      if (rule.pattern && !rule.pattern.test(value)) {
        return { valid: false, errors: [`${name} 格式无效，应为有效的 Supabase 令牌`] };
      }
      break;

    case 'secret':
      if (rule.minLength && value.length < rule.minLength) {
        return { valid: false, errors: [`${name} 长度不足，应至少 ${rule.minLength} 个字符`] };
      }
      break;
  }

  return { valid: true, warnings };
}

/**
 * Test .env.local file structure and encoding
 */
function testEnvFileStructure() {
  console.log('📁 测试 .env.local 文件结构');
  console.log('==============================');

  const envPath = '.env.local';
  let fileExists = true;
  let encodingCorrect = true;
  let formatCorrect = true;

  try {
    if (!fs.existsSync(envPath)) {
      console.log('❌ .env.local 文件不存在');
      fileExists = false;
    } else {
      console.log('✅ .env.local 文件存在');

      // Check file encoding (basic check for BOM)
      const content = fs.readFileSync(envPath);
      if (content.length >= 3 && content[0] === 0xEF && content[1] === 0xBB && content[2] === 0xBF) {
        console.log('⚠️  文件包含 BOM 标记，可能导致兼容性问题');
        encodingCorrect = false;
      } else {
        console.log('✅ 文件编码正确 (无 BOM)');
      }

      // Check file format (should be text, one env var per line)
      const text = content.toString('utf8');
      const lines = text.split('\n').filter(line => line.trim());

      let validLines = 0;
      for (const line of lines) {
        if (line.includes('=') && !line.trim().startsWith('#')) {
          validLines++;
        }
      }

      console.log(`✅ 文件格式正确，包含 ${validLines} 个环境变量定义`);

      // Check for common formatting issues
      const issues = [];
      for (const line of lines) {
        if (line.trim().startsWith('#')) continue; // Skip comments

        if (line.includes('=') && line.trim().endsWith('=')) {
          issues.push('发现空值变量赋值');
        }
        if (line.includes('=') && !line.includes('=') && line.trim()) {
          issues.push('发现可能格式错误的行');
        }
      }

      if (issues.length === 0) {
        formatCorrect = true;
      } else {
        console.log(`⚠️  发现 ${issues.length} 个潜在格式问题`);
        formatCorrect = false;
      }
    }

  } catch (error) {
    console.error('❌ 文件结构测试失败:', error.message);
    return false;
  }

  return fileExists && encodingCorrect && formatCorrect;
}

/**
 * Test all environment variables by category
 */
function testEnvironmentVariables() {
  console.log('\n🔍 测试环境变量配置');
  console.log('==============================');

  let allValid = true;
  const results = {};

  // Test required variables
  console.log('\n🚨 必需环境变量:');
  for (const [category, variables] of Object.entries(ENV_CATEGORIES.required)) {
    console.log(`\n${category.toUpperCase()} 类:`);
    results[category] = {};

    for (const variable of variables) {
      const value = process.env[variable];
      const validation = validateEnvVar(variable, value);

      if (validation.errors && validation.errors.length > 0) {
        console.log(`❌ ${variable}: ${validation.errors.join(', ')}`);
        allValid = false;
        results[category][variable] = false;
      } else if (validation.warnings && validation.warnings.length > 0) {
        console.log(`⚠️  ${variable}: 已配置，但 ${validation.warnings.join(', ')}`);
        results[category][variable] = true;
      } else {
        console.log(`✅ ${variable}: 配置正确`);
        results[category][variable] = true;
      }
    }
  }

  // Test optional variables
  console.log('\n💡 可选环境变量:');
  for (const [category, variables] of Object.entries(ENV_CATEGORIES.optional)) {
    console.log(`\n${category.toUpperCase()} 类:`);
    results[category] = {};

    for (const variable of variables) {
      const value = process.env[variable];
      const validation = validateEnvVar(variable, value);

      if (!value || value.trim() === '') {
        console.log(`⚠️  ${variable}: 未配置 (可选)`);
        results[category][variable] = 'optional';
      } else if (validation.errors && validation.errors.length > 0) {
        console.log(`❌ ${variable}: ${validation.errors.join(', ')}`);
        allValid = false;
        results[category][variable] = false;
      } else if (validation.warnings && validation.warnings.length > 0) {
        console.log(`⚠️  ${variable}: ${validation.warnings.join(', ')}`);
        results[category][variable] = true;
      } else {
        console.log(`✅ ${variable}: 配置正确`);
        results[category][variable] = true;
      }
    }
  }

  return { allValid, results };
}

/**
 * Test environment variable security
 */
function testEnvironmentSecurity() {
  console.log('\n🔒 测试环境变量安全性');
  console.log('==============================');

  const securityIssues = [];
  const envPath = '.env.local';

  if (!fs.existsSync(envPath)) {
    console.log('❌ 无法检查安全性：.env.local 文件不存在');
    return false;
  }

  try {
    // Check if .env.local is in .gitignore
    const gitignorePath = '.gitignore';
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      if (gitignoreContent.includes('.env.local') || gitignoreContent.includes('.env')) {
        console.log('✅ .env.local 文件已在 .gitignore 中');
      } else {
        securityIssues.push('.env.local 文件未在 .gitignore 中，存在泄露风险');
      }
    } else {
      securityIssues.push('项目缺少 .gitignore 文件');
    }

    // Check file permissions (on Unix systems)
    try {
      const stats = fs.statSync(envPath);
      const mode = stats.mode;

      // Skip permission check on Windows
      if (process.platform === 'win32') {
        console.log('ℹ️  文件权限检查在 Windows 上不可用');
      } else {
        // Check if file is readable by others (Unix permissions)
        if (mode & 0o007) {
          securityIssues.push('.env.local 文件权限过于宽松，可能被其他用户读取');
        } else {
          console.log('✅ .env.local 文件权限设置合理');
        }
      }
    } catch (error) {
      // Windows doesn't have the same permission model
      console.log('ℹ️  文件权限检查不可用');
    }

    // Check for potentially sensitive information in variable names or values
    const content = fs.readFileSync(envPath, 'utf8');
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /private/i,
      /token/i
    ];

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (sensitivePatterns.some(pattern => pattern.test(line))) {
        console.log(`ℹ️  第 ${i + 1} 行包含敏感信息标记（这是正常的）`);
      }
    }

    if (securityIssues.length === 0) {
      console.log('✅ 未发现明显的安全问题');
      return true;
    } else {
      console.log('⚠️  发现以下安全问题:');
      securityIssues.forEach(issue => console.log(`  - ${issue}`));
      return false;
    }

  } catch (error) {
    console.error('❌ 安全性测试失败:', error.message);
    return false;
  }
}

/**
 * Generate environment configuration report
 */
function generateEnvReport(results) {
  console.log('\n📊 环境配置报告');
  console.log('==============================');

  const report = {
    timestamp: new Date().toISOString(),
    required: {},
    optional: {},
    security: {}
  };

  // Count required variables
  let requiredTotal = 0;
  let requiredConfigured = 0;

  for (const [category, variables] of Object.entries(ENV_CATEGORIES.required)) {
    report.required[category] = {};
    for (const variable of variables) {
      requiredTotal++;
      const isConfigured = results[category] && results[category][variable] === true;
      report.required[category][variable] = isConfigured;
      if (isConfigured) requiredConfigured++;
    }
  }

  // Count optional variables
  let optionalTotal = 0;
  let optionalConfigured = 0;

  for (const [category, variables] of Object.entries(ENV_CATEGORIES.optional)) {
    report.optional[category] = {};
    for (const variable of variables) {
      optionalTotal++;
      const isConfigured = results[category] && results[category][variable] === true;
      report.optional[category][variable] = isConfigured;
      if (isConfigured) optionalConfigured++;
    }
  }

  console.log(`必需变量: ${requiredConfigured}/${requiredTotal} 已配置`);
  console.log(`可选变量: ${optionalConfigured}/${optionalTotal} 已配置`);

  const coverage = ((requiredConfigured / requiredTotal) * 100).toFixed(1);
  console.log(`配置覆盖率: ${coverage}%`);

  return report;
}

/**
 * Run all step 4 environment configuration tests
 */
async function runAllTests() {
  console.log('🚀 开始步骤 4: 环境变量配置详细测试');
  console.log('====================================');

  const fileStructureOk = testEnvFileStructure();
  const { allValid, results } = testEnvironmentVariables();
  const securityOk = testEnvironmentSecurity();
  const report = generateEnvReport(results);

  console.log('\n🏁 测试结果汇总');
  console.log('==============================');
  console.log(`文件结构: ${fileStructureOk ? '✅ 通过' : '❌ 失败'}`);
  console.log(`变量验证: ${allValid ? '✅ 通过' : '❌ 失败'}`);
  console.log(`安全性检查: ${securityOk ? '✅ 通过' : '❌ 失败'}`);

  const allPassed = fileStructureOk && allValid && securityOk;

  console.log('\n🎯 总体结果');
  console.log('==============================');
  console.log(`步骤 4 环境配置测试: ${allPassed ? '✅ 全部通过' : '❌ 存在问题'}`);

  if (!allPassed) {
    console.log('\n💡 改进建议:');
    console.log('1. 确保所有必需的环境变量都已正确设置');
    console.log('2. 检查环境变量值的格式是否正确');
    console.log('3. 验证 .env.local 文件的安全性配置');
    console.log('4. 考虑使用环境变量管理工具');
  }

  // Optionally save report to file
  try {
    const reportPath = 'tests/reports/env-config-report.json';
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 详细报告已保存至: ${reportPath}`);
  } catch (error) {
    console.log('\n⚠️  无法保存详细报告:', error.message);
  }

  return allPassed;
}

// Run tests if this file is executed directly
if (process.argv[1].endsWith('test-env-config.js')) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('测试过程中发生错误:', error);
    process.exit(1);
  });
}

export { runAllTests };
