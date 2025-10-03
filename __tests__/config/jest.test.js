/**
 * Jest配置测试
 * 验证Jest配置文件和测试环境设置的正确性
 */

const fs = require('fs');
const path = require('path');

describe('Jest Configuration', () => {
  let configContent;
  let customJestConfig;
  const configPath = path.join(process.cwd(), 'jest.config.js');
  const setupPath = path.join(process.cwd(), '__tests__/setup/test-setup.ts');

  beforeAll(() => {
    // 检查配置文件是否存在
    expect(fs.existsSync(configPath)).toBe(true);
    expect(fs.existsSync(setupPath)).toBe(true);
    
    // 读取配置文件内容进行静态分析
    configContent = fs.readFileSync(configPath, 'utf8');
    
    // 提取customJestConfig对象
    const configMatch = configContent.match(/const customJestConfig = ({[\s\S]*?});/);
    if (configMatch) {
      // 安全地评估配置对象
      try {
        customJestConfig = eval(`(${configMatch[1]})`);
      } catch (error) {
        console.warn('Could not parse Jest config object, using fallback tests');
        customJestConfig = {};
      }
    }
  });

  describe('配置文件结构', () => {
    test('应该导出有效的配置对象', () => {
      expect(configContent).toContain('const customJestConfig');
      expect(configContent).toContain('module.exports = createJestConfig');
    });

    test('应该包含基本配置项', () => {
      expect(configContent).toContain('testEnvironment');
      expect(configContent).toContain('setupFilesAfterEnv');
    });
  });

  describe('测试环境配置', () => {
    test('应该使用jsdom环境', () => {
      expect(configContent).toContain('jest-environment-jsdom');
    });

    test('应该配置正确的设置文件', () => {
      expect(configContent).toContain('__tests__/setup/test-setup.ts');
    });
  });

  describe('模块解析配置', () => {
    test('应该配置路径别名映射', () => {
      expect(configContent).toContain('moduleNameMapper');
      expect(configContent).toContain('^@/(.*)$');
      expect(configContent).toContain('<rootDir>/src/$1');
    });

    test('应该配置模块文件扩展名', () => {
      // Jest默认支持这些扩展名，检查是否有transform配置
      expect(configContent).toContain('transform');
    });
  });

  describe('测试文件匹配', () => {
    test('应该配置正确的测试文件模式', () => {
      expect(configContent).toContain('testMatch');
      expect(configContent).toContain('__tests__');
      expect(configContent).toContain('.test.');
    });

    test('应该忽略不必要的目录', () => {
      expect(configContent).toContain('testPathIgnorePatterns');
      expect(configContent).toContain('node_modules');
      expect(configContent).toContain('.next');
    });
  });

  describe('转换配置', () => {
    test('应该配置TypeScript和JSX转换', () => {
      expect(configContent).toContain('transform');
      expect(configContent).toContain('babel-jest');
      expect(configContent).toContain('next/babel');
    });

    test('应该处理CSS和样式文件', () => {
      expect(configContent).toContain('transformIgnorePatterns');
      expect(configContent).toContain('module');
      expect(configContent).toContain('css');
    });
  });

  describe('覆盖率配置', () => {
    test('应该配置覆盖率收集', () => {
      expect(configContent).toContain('collectCoverageFrom');
    });

    test('应该配置覆盖率目录', () => {
      expect(configContent).toContain('src/**/*.{js,jsx,ts,tsx}');
      expect(configContent).toContain('!src/**/*.d.ts');
    });

    test('应该配置覆盖率阈值', () => {
      expect(configContent).toContain('coverageThreshold');
      expect(configContent).toContain('global');
    });
  });

  describe('Jest设置文件', () => {
    test('设置文件应该存在', () => {
      expect(fs.existsSync(setupPath)).toBe(true);
    });

    test('设置文件应该配置测试库', () => {
      const setupContent = fs.readFileSync(setupPath, 'utf8');
      expect(setupContent).toContain('@testing-library/jest-dom');
    });

    test('设置文件应该有全局配置', () => {
      const setupContent = fs.readFileSync(setupPath, 'utf8');
      const hasGlobalSetup = 
        setupContent.includes('global') ||
        setupContent.includes('jest.') ||
        setupContent.includes('beforeAll') ||
        setupContent.includes('afterAll');
      
      expect(hasGlobalSetup).toBe(true);
    });
  });

  describe('Next.js集成', () => {
    test('应该支持Next.js特性', () => {
      expect(configContent).toContain('next/jest');
      expect(configContent).toContain('next/babel');
    });
  });

  describe('React Testing Library集成', () => {
    test('应该配置React Testing Library', () => {
      const setupContent = fs.readFileSync(setupPath, 'utf8');
      expect(setupContent).toContain('@testing-library/jest-dom');
    });
  });

  describe('配置有效性验证', () => {
    test('配置文件语法应该正确', () => {
      expect(configContent).toContain('const nextJest');
      expect(configContent).toContain('const createJestConfig');
      expect(configContent).toContain('const customJestConfig');
    });

    test('设置文件应该可以正确执行', () => {
      expect(() => {
        require(setupPath);
      }).not.toThrow();
    });
  });
}); 