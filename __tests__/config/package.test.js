const fs = require('fs');
const path = require('path');
const semver = require('semver');

describe('Package.json Configuration Tests', () => {
  let packageJson;

  beforeAll(() => {
    const packagePath = path.join(process.cwd(), 'package.json');
    packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  });

  describe('Basic Package Information', () => {
    test('should have required package metadata', () => {
      expect(packageJson.name).toBe('rehui-car');
      expect(packageJson.version).toBeDefined();
      expect(packageJson.description).toBeDefined();
      expect(packageJson.private).toBe(true);
    });

    test('should have correct scripts', () => {
      const requiredScripts = [
        'dev',
        'build',
        'start',
        'lint',
        'test',
        'test:watch',
        'test:coverage'
      ];
      
      requiredScripts.forEach(script => {
        expect(packageJson.scripts[script]).toBeDefined();
      });
    });
  });

  describe('Dependencies Validation', () => {
    test('should have all required Next.js dependencies', () => {
      const nextDeps = ['next', 'react', 'react-dom'];
      nextDeps.forEach(dep => {
        expect(packageJson.dependencies[dep]).toBeDefined();
        expect(semver.valid(semver.coerce(packageJson.dependencies[dep]))).toBeTruthy();
      });
    });

    test('should have all required UI dependencies', () => {
      const uiDeps = [
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-label',
        '@radix-ui/react-select',
        '@radix-ui/react-switch',
        '@radix-ui/react-tabs',
        '@radix-ui/react-toast',
        'class-variance-authority',
        'clsx',
        'tailwind-merge'
      ];
      
      uiDeps.forEach(dep => {
        expect(packageJson.dependencies[dep]).toBeDefined();
      });
    });

    test('should have all required database and API dependencies', () => {
      const apiDeps = [
        '@supabase/supabase-js',
        '@google/generative-ai',
        'zod'
      ];
      
      apiDeps.forEach(dep => {
        expect(packageJson.dependencies[dep]).toBeDefined();
      });
    });

    test('should have all required styling dependencies', () => {
      const styleDeps = [
        'tailwindcss',
        'autoprefixer',
        'postcss',
        'lucide-react'
      ];
      
      styleDeps.forEach(dep => {
        const isDev = packageJson.devDependencies && packageJson.devDependencies[dep];
        const isProd = packageJson.dependencies && packageJson.dependencies[dep];
        expect(isDev || isProd).toBeTruthy();
      });
    });
  });

  describe('Development Dependencies', () => {
    test('should have TypeScript configuration', () => {
      const tsDeps = [
        'typescript',
        '@types/node',
        '@types/react',
        '@types/react-dom'
      ];
      
      tsDeps.forEach(dep => {
        // TypeScript相关依赖可能在dependencies或devDependencies中
        const inDeps = packageJson.dependencies && packageJson.dependencies[dep];
        const inDevDeps = packageJson.devDependencies && packageJson.devDependencies[dep];
        expect(inDeps || inDevDeps).toBeDefined();
      });
    });

    test('should have testing framework', () => {
      const testDeps = [
        'jest',
        '@testing-library/react',
        '@testing-library/jest-dom',
        '@testing-library/user-event'
      ];
      
      testDeps.forEach(dep => {
        expect(packageJson.devDependencies[dep]).toBeDefined();
      });
    });

    test('should have linting tools', () => {
      const lintDeps = [
        'eslint',
        'eslint-config-next',
        'prettier'
      ];
      
      lintDeps.forEach(dep => {
        expect(packageJson.devDependencies[dep]).toBeDefined();
      });
    });
  });

  describe('Version Compatibility', () => {
    test('should have compatible React versions', () => {
      const reactVersion = packageJson.dependencies.react;
      const reactDomVersion = packageJson.dependencies['react-dom'];
      
      expect(semver.major(semver.coerce(reactVersion))).toBe(
        semver.major(semver.coerce(reactDomVersion))
      );
    });

    test('should have compatible Next.js version with React', () => {
      const nextVersion = packageJson.dependencies.next;
      const reactVersion = packageJson.dependencies.react;
      
      // Next.js 14+ requires React 18+
      if (semver.gte(semver.coerce(nextVersion), '14.0.0')) {
        expect(semver.gte(semver.coerce(reactVersion), '18.0.0')).toBeTruthy();
      }
    });

    test('should have compatible TypeScript version', () => {
      const tsVersion = packageJson.devDependencies?.typescript || packageJson.dependencies?.typescript;
      expect(tsVersion).toBeDefined();
      expect(semver.gte(semver.coerce(tsVersion), '5.0.0')).toBeTruthy();
    });
  });

  describe('Package Security', () => {
    test('should not have known vulnerable packages', () => {
      // This would typically integrate with npm audit or similar tools
      // For now, we check that we have recent versions of critical packages
      const criticalPackages = {
        'next': '14.0.0',
        'react': '18.0.0',
        'typescript': '5.0.0'
      };

      Object.entries(criticalPackages).forEach(([pkg, minVersion]) => {
        const currentVersion = packageJson.dependencies[pkg] || packageJson.devDependencies[pkg];
        if (currentVersion) {
          expect(semver.gte(semver.coerce(currentVersion), minVersion)).toBeTruthy();
        }
      });
    });
  });
}); 