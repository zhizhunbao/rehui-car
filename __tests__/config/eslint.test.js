/**
 * ESLint配置测试
 * 验证ESLint配置文件的正确性和规则设置
 */

const fs = require('fs');
const path = require('path');

describe('ESLint Configuration', () => {
  let eslintConfig;
  const configPath = path.join(process.cwd(), '.eslintrc.json');

  beforeAll(() => {
    // 检查配置文件是否存在
    expect(fs.existsSync(configPath)).toBe(true);
    
    // 加载配置
    const configContent = fs.readFileSync(configPath, 'utf8');
    eslintConfig = JSON.parse(configContent);
  });

  describe('配置文件结构', () => {
    test('应该是有效的JSON格式', () => {
      expect(eslintConfig).toBeDefined();
      expect(typeof eslintConfig).toBe('object');
    });

    test('应该包含基本配置项', () => {
      const requiredKeys = ['extends', 'rules'];
      
      requiredKeys.forEach(key => {
        expect(eslintConfig).toHaveProperty(key);
      });
    });
  });

  describe('扩展配置', () => {
    test('应该扩展Next.js推荐配置', () => {
      expect(eslintConfig.extends).toContain('next/core-web-vitals');
    });

    test('应该包含TypeScript支持', () => {
      const hasTypeScriptConfig = eslintConfig.extends.some(config => 
        config.includes('typescript') || config.includes('@typescript-eslint')
      );
      
      // 如果项目使用TypeScript，应该有相关配置
      if (fs.existsSync(path.join(process.cwd(), 'tsconfig.json'))) {
        expect(hasTypeScriptConfig).toBe(true);
      }
    });
  });

  describe('解析器配置', () => {
    test('如果使用TypeScript，应该配置正确的解析器', () => {
      const hasTsConfig = fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
      
      if (hasTsConfig && eslintConfig.parser) {
        expect(eslintConfig.parser).toContain('@typescript-eslint/parser');
      }
    });

    test('应该配置正确的解析器选项', () => {
      if (eslintConfig.parserOptions) {
        expect(eslintConfig.parserOptions.ecmaVersion).toBeGreaterThanOrEqual(2020);
        expect(eslintConfig.parserOptions.sourceType).toBe('module');
      }
    });
  });

  describe('环境配置', () => {
    test('应该配置适当的环境', () => {
      if (eslintConfig.env) {
        // 应该支持浏览器和Node.js环境
        expect(eslintConfig.env.browser || eslintConfig.env.node).toBeTruthy();
        
        // 应该支持ES6+
        expect(eslintConfig.env.es6 || eslintConfig.env.es2020 || eslintConfig.env.es2021).toBeTruthy();
      }
    });
  });

  describe('插件配置', () => {
    test('应该包含必要的插件', () => {
      if (eslintConfig.plugins) {
        // 检查常用插件
        const commonPlugins = ['react', '@typescript-eslint', 'react-hooks'];
        const hasRelevantPlugins = commonPlugins.some(plugin => 
          eslintConfig.plugins.includes(plugin)
        );
        
        expect(hasRelevantPlugins).toBe(true);
      }
    });
  });

  describe('规则配置', () => {
    test('应该有合理的规则配置', () => {
      expect(eslintConfig.rules).toBeDefined();
      expect(typeof eslintConfig.rules).toBe('object');
    });

    test('规则值应该是有效的', () => {
      const validRuleValues = ['off', 'warn', 'error', 0, 1, 2];
      
      Object.values(eslintConfig.rules).forEach(ruleValue => {
        if (Array.isArray(ruleValue)) {
          // 如果是数组，第一个元素应该是有效的规则值
          expect(validRuleValues.includes(ruleValue[0])).toBe(true);
        } else {
          // 如果是单个值，应该是有效的规则值
          expect(validRuleValues.includes(ruleValue)).toBe(true);
        }
      });
    });

    test('应该配置适当的代码质量规则', () => {
      // 检查一些重要的代码质量规则
      const importantRules = [
        'no-unused-vars',
        'no-console',
        'prefer-const',
        'no-var'
      ];

      // 至少应该配置一些重要规则
      const configuredRules = Object.keys(eslintConfig.rules);
      const hasImportantRules = importantRules.some(rule => 
        configuredRules.includes(rule) || 
        configuredRules.includes(`@typescript-eslint/${rule}`)
      );
      
      expect(hasImportantRules).toBe(true);
    });
  });

  describe('TypeScript特定配置', () => {
    test('如果使用TypeScript，应该有TypeScript规则', () => {
      const hasTsConfig = fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
      
      if (hasTsConfig) {
        const hasTypeScriptRules = Object.keys(eslintConfig.rules).some(rule => 
          rule.startsWith('@typescript-eslint/')
        );
        
        // 如果有TypeScript配置，应该有相关规则
        if (eslintConfig.parser && eslintConfig.parser.includes('@typescript-eslint')) {
          expect(hasTypeScriptRules).toBe(true);
        }
      }
    });
  });

  describe('React特定配置', () => {
    test('应该有React相关的规则配置', () => {
      // 检查是否有React相关的扩展或规则
      const hasReactConfig = 
        eslintConfig.extends.some(config => config.includes('react')) ||
        Object.keys(eslintConfig.rules).some(rule => rule.includes('react'));
      
      expect(hasReactConfig).toBe(true);
    });

    test('应该配置React Hooks规则', () => {
      const hasHooksRules = 
        eslintConfig.extends.some(config => config.includes('hooks')) ||
        Object.keys(eslintConfig.rules).some(rule => rule.includes('react-hooks'));
      
      expect(hasHooksRules).toBe(true);
    });
  });

  describe('Next.js特定配置', () => {
    test('应该包含Next.js核心规则', () => {
      expect(eslintConfig.extends).toContain('next/core-web-vitals');
    });

    test('应该支持Next.js特定的规则', () => {
      // Next.js的core-web-vitals配置应该包含相关规则
      const hasNextConfig = eslintConfig.extends.includes('next/core-web-vitals');
      expect(hasNextConfig).toBe(true);
    });
  });

  describe('配置有效性验证', () => {
    test('配置应该可以被ESLint正确解析', () => {
      // 验证JSON格式正确性
      expect(() => {
        JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }).not.toThrow();
    });

    test('扩展的配置应该存在', () => {
      // 验证扩展的配置包是否安装
      eslintConfig.extends.forEach(config => {
        if (typeof config === 'string' && !config.startsWith('./')) {
          // 检查是否是内置配置或已安装的包
          const isBuiltIn = ['eslint:recommended'].includes(config);
          
          if (!isBuiltIn) {
            const packageName = config.split('/')[0];
            const packagePath = path.join(process.cwd(), 'node_modules', packageName);
            
            // 包应该存在（除非是内置配置）
            if (!config.startsWith('eslint:')) {
              expect(fs.existsSync(packagePath)).toBe(true);
            }
          }
        }
      });
    });
  });

  describe('性能和最佳实践', () => {
    test('配置应该合理，不过于严格或宽松', () => {
      const ruleCount = Object.keys(eslintConfig.rules).length;
      
      // 规则数量应该合理（不超过50个自定义规则）
      expect(ruleCount).toBeLessThanOrEqual(50);
    });

    test('应该有适当的忽略配置', () => {
      // 检查是否有.eslintignore文件或ignorePatterns配置
      const hasIgnoreFile = fs.existsSync(path.join(process.cwd(), '.eslintignore'));
      const hasIgnorePatterns = eslintConfig.ignorePatterns && eslintConfig.ignorePatterns.length > 0;
      
      // 至少应该有一种忽略配置
      expect(hasIgnoreFile || hasIgnorePatterns).toBe(true);
    });
  });

  describe('开发体验', () => {
    test('不应该有过于严格的规则影响开发', () => {
      // 检查一些可能影响开发体验的规则
      const strictRules = ['no-console', 'no-debugger'];
      
      strictRules.forEach(rule => {
        if (eslintConfig.rules[rule]) {
          // 这些规则在开发环境中不应该是error级别
          const ruleValue = Array.isArray(eslintConfig.rules[rule]) 
            ? eslintConfig.rules[rule][0] 
            : eslintConfig.rules[rule];
          
          // 在开发环境中，console和debugger应该允许或只是警告
          if (process.env.NODE_ENV === 'development') {
            expect(ruleValue).not.toBe('error');
            expect(ruleValue).not.toBe(2);
          }
        }
      });
    });
  });
}); 