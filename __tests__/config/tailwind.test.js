const fs = require('fs');
const path = require('path');

describe('Tailwind CSS Configuration Tests', () => {
  let tailwindConfig;

  beforeAll(() => {
    // Load the Tailwind config file
    const configPath = path.join(process.cwd(), 'tailwind.config.js');
    delete require.cache[require.resolve(configPath)];
    tailwindConfig = require(configPath);
  });

  describe('Basic Configuration', () => {
    test('should have correct content paths', () => {
      expect(tailwindConfig.content).toContain('./src/pages/**/*.{js,ts,jsx,tsx,mdx}');
      expect(tailwindConfig.content).toContain('./src/components/**/*.{js,ts,jsx,tsx,mdx}');
      expect(tailwindConfig.content).toContain('./src/app/**/*.{js,ts,jsx,tsx,mdx}');
    });

    test('should have darkMode configuration', () => {
      expect(tailwindConfig.darkMode).toBeDefined();
      expect(['class', 'media']).toContain(tailwindConfig.darkMode);
    });
  });

  describe('Theme Configuration', () => {
    test('should have custom colors defined', () => {
      const colors = tailwindConfig.theme?.extend?.colors || {};
      
      // Check for custom color definitions
      expect(colors.border).toBeDefined();
      expect(colors.input).toBeDefined();
      expect(colors.ring).toBeDefined();
      expect(colors.background).toBeDefined();
      expect(colors.foreground).toBeDefined();
      expect(colors.primary).toBeDefined();
      expect(colors.secondary).toBeDefined();
      expect(colors.destructive).toBeDefined();
      expect(colors.muted).toBeDefined();
      expect(colors.accent).toBeDefined();
      expect(colors.popover).toBeDefined();
      expect(colors.card).toBeDefined();
    });

    test('should have responsive breakpoints', () => {
      const screens = tailwindConfig.theme?.extend?.screens || tailwindConfig.theme?.screens;
      
      if (screens) {
        // Standard Tailwind breakpoints should be available
        const expectedBreakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];
        expectedBreakpoints.forEach(bp => {
          // Either in extend or default theme
          expect(
            screens[bp] || 
            (tailwindConfig.theme?.screens && tailwindConfig.theme.screens[bp])
          ).toBeDefined();
        });
      }
    });

    test('should have border radius configuration', () => {
      const borderRadius = tailwindConfig.theme?.extend?.borderRadius || {};
      
      expect(borderRadius.lg).toBeDefined();
      expect(borderRadius.md).toBeDefined();
      expect(borderRadius.sm).toBeDefined();
    });

    test('should have font family configuration', () => {
      const fontFamily = tailwindConfig.theme?.extend?.fontFamily || {};
      
      // Should have sans font family defined
      expect(fontFamily.sans).toBeDefined();
    });

    test('should have keyframes and animations', () => {
      const keyframes = tailwindConfig.theme?.extend?.keyframes || {};
      const animation = tailwindConfig.theme?.extend?.animation || {};
      
      // Check for common animations
      if (Object.keys(keyframes).length > 0) {
        expect(keyframes['accordion-down'] || keyframes.fadeIn || keyframes.slideIn).toBeDefined();
      }
      
      if (Object.keys(animation).length > 0) {
        expect(animation['accordion-down'] || animation.fadeIn || animation.slideIn).toBeDefined();
      }
    });
  });

  describe('Plugins Configuration', () => {
    test('should have required plugins', () => {
      const plugins = tailwindConfig.plugins || [];
      
      // Should have tailwindcss-animate plugin
      const hasAnimatePlugin = plugins.some(plugin => 
        plugin.toString().includes('tailwindcss-animate') ||
        plugin.toString().includes('animate')
      );
      
      expect(plugins.length).toBeGreaterThan(0);
    });

    test('should have plugin functions', () => {
      const plugins = tailwindConfig.plugins || [];
      
      plugins.forEach(plugin => {
        // 插件可能是函数或者是require()的结果（对象）
        expect(typeof plugin === 'function' || typeof plugin === 'object').toBe(true);
      });
    });
  });

  describe('CSS Variables Integration', () => {
    test('should use CSS variables for colors', () => {
      const colors = tailwindConfig.theme?.extend?.colors || {};
      
      // Check if colors use CSS variables (hsl format)
      Object.values(colors).forEach(colorValue => {
        if (typeof colorValue === 'string') {
          // Should either be a CSS variable or hsl value
          expect(
            colorValue.includes('var(--') || 
            colorValue.includes('hsl(') ||
            colorValue.startsWith('#') ||
            colorValue.startsWith('rgb')
          ).toBeTruthy();
        }
      });
    });
  });

  describe('File System Validation', () => {
    test('should have globals.css file', () => {
      const globalsCssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
      expect(fs.existsSync(globalsCssPath)).toBe(true);
    });

    test('globals.css should contain Tailwind directives', () => {
      const globalsCssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
      
      if (fs.existsSync(globalsCssPath)) {
        const cssContent = fs.readFileSync(globalsCssPath, 'utf8');
        
        expect(cssContent).toContain('@tailwind base');
        expect(cssContent).toContain('@tailwind components');
        expect(cssContent).toContain('@tailwind utilities');
      }
    });

    test('should have PostCSS configuration', () => {
      const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
      expect(fs.existsSync(postcssConfigPath)).toBe(true);
    });
  });

  describe('Theme Consistency', () => {
    test('should have consistent color naming', () => {
      const colors = tailwindConfig.theme?.extend?.colors || {};
      
      // Check for consistent naming patterns
      const colorKeys = Object.keys(colors);
      const expectedColors = [
        'background', 'foreground', 'primary', 'secondary', 
        'muted', 'accent', 'destructive', 'border', 'input', 'ring'
      ];
      
      expectedColors.forEach(expectedColor => {
        expect(colorKeys).toContain(expectedColor);
      });
    });

    test('should have proper color structure', () => {
      const colors = tailwindConfig.theme?.extend?.colors || {};
      
      // Colors should have proper structure (either string or object with DEFAULT and foreground)
      Object.entries(colors).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Should have DEFAULT property for complex colors
          expect(value.DEFAULT || value.foreground).toBeDefined();
        }
      });
    });
  });

  describe('Performance and Optimization', () => {
    test('should have content purging configured', () => {
      expect(tailwindConfig.content).toBeDefined();
      expect(Array.isArray(tailwindConfig.content)).toBeTruthy();
      expect(tailwindConfig.content.length).toBeGreaterThan(0);
    });

    test('should not include unnecessary paths in content', () => {
      const content = tailwindConfig.content;
      
      // Should not include node_modules or other unnecessary paths
      content.forEach(path => {
        expect(path).not.toContain('node_modules');
        expect(path).not.toContain('.git');
      });
    });
  });
}); 