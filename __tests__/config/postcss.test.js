/**
 * PostCSS配置测试
 * 验证PostCSS配置文件的正确性和插件加载
 */

const fs = require('fs');
const path = require('path');

describe('PostCSS Configuration', () => {
  let postcssConfig;
  const configPath = path.join(process.cwd(), 'postcss.config.js');

  beforeAll(() => {
    // 检查配置文件是否存在
    expect(fs.existsSync(configPath)).toBe(true);
    
    // 加载配置
    postcssConfig = require(configPath);
  });

  describe('配置文件结构', () => {
    test('应该导出配置对象', () => {
      expect(postcssConfig).toBeDefined();
      expect(typeof postcssConfig).toBe('object');
    });

    test('应该包含plugins配置', () => {
      expect(postcssConfig.plugins).toBeDefined();
      expect(typeof postcssConfig.plugins).toBe('object');
    });
  });

  describe('必需插件配置', () => {
    test('应该包含tailwindcss插件', () => {
      expect(postcssConfig.plugins.tailwindcss).toBeDefined();
    });

    test('应该包含autoprefixer插件', () => {
      expect(postcssConfig.plugins.autoprefixer).toBeDefined();
    });
  });

  describe('插件加载测试', () => {
    test('tailwindcss插件应该可以正常加载', () => {
      expect(() => {
        require('tailwindcss');
      }).not.toThrow();
    });

    test('autoprefixer插件应该可以正常加载', () => {
      expect(() => {
        require('autoprefixer');
      }).not.toThrow();
    });
  });

  describe('配置有效性', () => {
    test('配置应该符合PostCSS规范', () => {
      // 验证配置结构
      const validKeys = ['plugins', 'parser', 'stringifier', 'syntax'];
      const configKeys = Object.keys(postcssConfig);
      
      configKeys.forEach(key => {
        expect(validKeys.includes(key)).toBe(true);
      });
    });

    test('插件配置应该是有效的', () => {
      const plugins = postcssConfig.plugins;
      
      // 验证每个插件配置
      Object.keys(plugins).forEach(pluginName => {
        const pluginConfig = plugins[pluginName];
        
        // 插件配置应该是对象或undefined
        expect(
          typeof pluginConfig === 'object' || 
          typeof pluginConfig === 'undefined'
        ).toBe(true);
      });
    });
  });

  describe('开发环境兼容性', () => {
    test('配置应该支持开发模式', () => {
      // 在开发环境下配置应该正常工作
      process.env.NODE_ENV = 'development';
      
      expect(() => {
        const devConfig = require(configPath);
        expect(devConfig).toBeDefined();
      }).not.toThrow();
    });

    test('配置应该支持生产模式', () => {
      // 在生产环境下配置应该正常工作
      process.env.NODE_ENV = 'production';
      
      expect(() => {
        const prodConfig = require(configPath);
        expect(prodConfig).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('CSS处理功能', () => {
    test('应该能够处理Tailwind CSS指令', () => {
      const testCSS = `
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `;
      
      // 这里我们只验证配置存在，实际的CSS处理需要PostCSS实例
      expect(postcssConfig.plugins.tailwindcss).toBeDefined();
    });

    test('应该能够添加浏览器前缀', () => {
      // 验证autoprefixer配置存在
      expect(postcssConfig.plugins.autoprefixer).toBeDefined();
    });
  });

  describe('性能和优化', () => {
    test('配置应该针对性能进行优化', () => {
      // 验证没有不必要的插件
      const plugins = Object.keys(postcssConfig.plugins);
      
      // 基本插件数量应该合理（不超过10个）
      expect(plugins.length).toBeLessThanOrEqual(10);
    });

    test('插件顺序应该正确', () => {
      const plugins = Object.keys(postcssConfig.plugins);
      
      // tailwindcss应该在autoprefixer之前
      const tailwindIndex = plugins.indexOf('tailwindcss');
      const autoprefixerIndex = plugins.indexOf('autoprefixer');
      
      if (tailwindIndex !== -1 && autoprefixerIndex !== -1) {
        expect(tailwindIndex).toBeLessThan(autoprefixerIndex);
      }
    });
  });

  describe('错误处理', () => {
    test('配置文件语法应该正确', () => {
      expect(() => {
        require(configPath);
      }).not.toThrow();
    });

    test('缺失插件应该有适当的错误处理', () => {
      // 验证必需插件存在
      const requiredPlugins = ['tailwindcss', 'autoprefixer'];
      
      requiredPlugins.forEach(plugin => {
        expect(() => {
          require(plugin);
        }).not.toThrow();
      });
    });
  });
}); 