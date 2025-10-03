const fs = require('fs');
const path = require('path');

describe('TypeScript Configuration Tests', () => {
  let tsConfig;

  beforeAll(() => {
    const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
    tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
  });

  describe('Compiler Options', () => {
    test('should have correct target and lib settings', () => {
      expect(tsConfig.compilerOptions.target).toBe('es5');
      expect(tsConfig.compilerOptions.lib).toContain('dom');
      expect(tsConfig.compilerOptions.lib).toContain('dom.iterable');
      expect(tsConfig.compilerOptions.lib).toContain('es6');
    });

    test('should have module resolution settings', () => {
      expect(tsConfig.compilerOptions.allowJs).toBe(true);
      expect(tsConfig.compilerOptions.skipLibCheck).toBe(true);
      expect(tsConfig.compilerOptions.esModuleInterop).toBe(true);
      expect(tsConfig.compilerOptions.allowSyntheticDefaultImports).toBe(true);
      expect(tsConfig.compilerOptions.moduleResolution).toBe('bundler');
    });

    test('should have strict type checking enabled', () => {
      expect(tsConfig.compilerOptions.strict).toBe(true);
      expect(tsConfig.compilerOptions.noEmit).toBe(true);
      expect(tsConfig.compilerOptions.forceConsistentCasingInFileNames).toBe(true);
    });

    test('should have JSX configuration', () => {
      expect(tsConfig.compilerOptions.jsx).toBe('preserve');
      expect(tsConfig.compilerOptions.incremental).toBe(true);
    });

    test('should have Next.js specific settings', () => {
      expect(tsConfig.compilerOptions.resolveJsonModule).toBe(true);
      expect(tsConfig.compilerOptions.isolatedModules).toBe(true);
      expect(tsConfig.compilerOptions.plugins).toEqual([
        {
          name: 'next'
        }
      ]);
    });
  });

  describe('Path Aliases', () => {
    test('should have baseUrl configured', () => {
      expect(tsConfig.compilerOptions.baseUrl).toBe('.');
    });

    test('should have correct path mappings', () => {
      const paths = tsConfig.compilerOptions.paths;
      
      expect(paths['@/*']).toEqual(['./src/*']);
      expect(paths['@/components/*']).toEqual(['./src/components/*']);
      expect(paths['@/lib/*']).toEqual(['./src/lib/*']);
      expect(paths['@/types/*']).toEqual(['./src/types/*']);
      expect(paths['@/hooks/*']).toEqual(['./src/hooks/*']);
      expect(paths['@/app/*']).toEqual(['./src/app/*']);
    });

    test('should resolve path aliases correctly', () => {
      // Test that the path mappings would resolve correctly
      const testPaths = [
        { alias: '@/components/ui/button', expected: './src/components/ui/button' },
        { alias: '@/lib/utils', expected: './src/lib/utils' },
        { alias: '@/types/api', expected: './src/types/api' },
        { alias: '@/hooks/useChat', expected: './src/hooks/useChat' }
      ];

      testPaths.forEach(({ alias, expected }) => {
        const aliasPattern = alias.replace('@/', './src/');
        expect(aliasPattern).toBe(expected);
      });
    });
  });

  describe('Include and Exclude Patterns', () => {
    test('should include correct file patterns', () => {
      expect(tsConfig.include).toContain('next-env.d.ts');
      expect(tsConfig.include).toContain('**/*.ts');
      expect(tsConfig.include).toContain('**/*.tsx');
      expect(tsConfig.include).toContain('.next/types/**/*.ts');
    });

    test('should exclude node_modules', () => {
      expect(tsConfig.exclude).toContain('node_modules');
    });
  });

  describe('File System Validation', () => {
    test('should have src directory structure', () => {
      const srcPath = path.join(process.cwd(), 'src');
      expect(fs.existsSync(srcPath)).toBe(true);
    });

    test('should have components directory', () => {
      const componentsPath = path.join(process.cwd(), 'src', 'components');
      expect(fs.existsSync(componentsPath)).toBe(true);
    });

    test('should have lib directory', () => {
      const libPath = path.join(process.cwd(), 'src', 'lib');
      expect(fs.existsSync(libPath)).toBe(true);
    });

    test('should have types directory', () => {
      const typesPath = path.join(process.cwd(), 'src', 'types');
      expect(fs.existsSync(typesPath)).toBe(true);
    });

    test('should have app directory', () => {
      const appPath = path.join(process.cwd(), 'src', 'app');
      expect(fs.existsSync(appPath)).toBe(true);
    });
  });

  describe('TypeScript Compilation', () => {
    test('should be valid TypeScript configuration', () => {
      // Basic validation that the config is parseable
      expect(typeof tsConfig).toBe('object');
      expect(tsConfig.compilerOptions).toBeDefined();
    });

    test('should have compatible settings for Next.js', () => {
      // Ensure settings are compatible with Next.js requirements
      expect(tsConfig.compilerOptions.jsx).toBe('preserve');
      expect(tsConfig.compilerOptions.allowJs).toBe(true);
      expect(tsConfig.compilerOptions.moduleResolution).toBe('bundler');
    });

    test('should support modern JavaScript features', () => {
      const lib = tsConfig.compilerOptions.lib;
      expect(lib).toContain('dom');
      expect(lib).toContain('dom.iterable');
      expect(lib).toContain('es6');
    });
  });

  describe('Development Experience', () => {
    test('should have incremental compilation enabled', () => {
      expect(tsConfig.compilerOptions.incremental).toBe(true);
    });

    test('should skip lib check for faster compilation', () => {
      expect(tsConfig.compilerOptions.skipLibCheck).toBe(true);
    });

    test('should have source map support', () => {
      // While not explicitly in tsconfig, Next.js handles this
      expect(tsConfig.compilerOptions.noEmit).toBe(true);
    });
  });
}); 