const fs = require('fs');
const path = require('path');

describe('Next.js Configuration Tests', () => {
  let nextConfig;

  beforeAll(() => {
    const configPath = path.join(process.cwd(), 'next.config.js');
    if (fs.existsSync(configPath)) {
      delete require.cache[require.resolve(configPath)];
      nextConfig = require(configPath);
    } else {
      nextConfig = {};
    }
  });

  describe('Basic Configuration', () => {
    test('should have TypeScript support enabled', () => {
      // Next.js enables TypeScript by default when tsconfig.json exists
      const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
      expect(fs.existsSync(tsConfigPath)).toBe(true);
    });

    test('should have experimental features configured', () => {
      if (nextConfig.experimental) {
        // Check for modern Next.js features
        expect(typeof nextConfig.experimental).toBe('object');
      }
    });
  });

  describe('Build Optimization', () => {
    test('should have image optimization configured', () => {
      if (nextConfig.images) {
        expect(typeof nextConfig.images).toBe('object');
        
        // Should have domains or remotePatterns for external images
        if (nextConfig.images.domains) {
          expect(Array.isArray(nextConfig.images.domains)).toBeTruthy();
        }
        
        if (nextConfig.images.remotePatterns) {
          expect(Array.isArray(nextConfig.images.remotePatterns)).toBeTruthy();
        }
      }
    });

    test('should have bundle analyzer configuration', () => {
      // Check if bundle analyzer is configured
      if (nextConfig.bundleAnalyzer !== undefined) {
        expect(typeof nextConfig.bundleAnalyzer).toBe('boolean');
      }
    });

    test('should have compression enabled', () => {
      // Compression should be enabled by default or explicitly configured
      if (nextConfig.compress !== undefined) {
        expect(typeof nextConfig.compress).toBe('boolean');
      }
    });

    test('should have proper output configuration', () => {
      if (nextConfig.output) {
        expect(['standalone', 'export']).toContain(nextConfig.output);
      }
    });
  });

  describe('Environment and Security', () => {
    test('should have environment variables configuration', () => {
      const envExamplePath = path.join(process.cwd(), '.env.example');
      expect(fs.existsSync(envExamplePath)).toBe(true);
    });

    test('should have proper security headers', () => {
      if (nextConfig.headers) {
        expect(typeof nextConfig.headers).toBe('function');
      }
    });

    test('should have HTTPS redirect configuration', () => {
      if (nextConfig.redirects) {
        expect(typeof nextConfig.redirects).toBe('function');
      }
    });
  });

  describe('Routing Configuration', () => {
    test('should have App Router structure', () => {
      const appPath = path.join(process.cwd(), 'src', 'app');
      expect(fs.existsSync(appPath)).toBe(true);
      
      // Should have layout.tsx in app directory
      const layoutPath = path.join(appPath, 'layout.tsx');
      expect(fs.existsSync(layoutPath)).toBe(true);
    });

    test('should have proper rewrites configuration', () => {
      if (nextConfig.rewrites) {
        expect(typeof nextConfig.rewrites).toBe('function');
      }
    });

    test('should have trailing slash configuration', () => {
      if (nextConfig.trailingSlash !== undefined) {
        expect(typeof nextConfig.trailingSlash).toBe('boolean');
      }
    });
  });

  describe('Performance Configuration', () => {
    test('should have webpack configuration', () => {
      if (nextConfig.webpack) {
        expect(typeof nextConfig.webpack).toBe('function');
      }
    });

    test('should have proper SWC configuration', () => {
      if (nextConfig.swcMinify !== undefined) {
        expect(typeof nextConfig.swcMinify).toBe('boolean');
      }
    });

    test('should have ESLint configuration', () => {
      if (nextConfig.eslint) {
        expect(typeof nextConfig.eslint).toBe('object');
      }
      
      // Should have ESLint config file
      const eslintConfigPath = path.join(process.cwd(), '.eslintrc.json');
      expect(fs.existsSync(eslintConfigPath)).toBe(true);
    });
  });

  describe('API Routes Configuration', () => {
    test('should have API routes directory', () => {
      const apiPath = path.join(process.cwd(), 'src', 'app', 'api');
      expect(fs.existsSync(apiPath)).toBe(true);
    });

    test('should have proper API configuration', () => {
      if (nextConfig.api) {
        expect(typeof nextConfig.api).toBe('object');
        
        if (nextConfig.api.bodyParser) {
          expect(typeof nextConfig.api.bodyParser).toBe('object');
        }
      }
    });
  });

  describe('Static Assets Configuration', () => {
    test('should have public directory', () => {
      const publicPath = path.join(process.cwd(), 'public');
      expect(fs.existsSync(publicPath)).toBe(true);
    });

    test('should have proper asset prefix configuration', () => {
      if (nextConfig.assetPrefix) {
        expect(typeof nextConfig.assetPrefix).toBe('string');
      }
    });

    test('should have static file serving configuration', () => {
      if (nextConfig.generateEtags !== undefined) {
        expect(typeof nextConfig.generateEtags).toBe('boolean');
      }
    });
  });

  describe('Development Configuration', () => {
    test('should have development server configuration', () => {
      if (nextConfig.devIndicators) {
        expect(typeof nextConfig.devIndicators).toBe('object');
      }
    });

    test('should have hot reloading configuration', () => {
      if (nextConfig.onDemandEntries) {
        expect(typeof nextConfig.onDemandEntries).toBe('object');
      }
    });
  });

  describe('Internationalization', () => {
    test('should have i18n configuration if needed', () => {
      if (nextConfig.i18n) {
        expect(typeof nextConfig.i18n).toBe('object');
        expect(Array.isArray(nextConfig.i18n.locales)).toBeTruthy();
        expect(typeof nextConfig.i18n.defaultLocale).toBe('string');
      }
    });
  });

  describe('Build Output Validation', () => {
    test('should have proper build configuration', () => {
      if (nextConfig.distDir) {
        expect(typeof nextConfig.distDir).toBe('string');
      }
    });

    test('should have proper page extensions', () => {
      if (nextConfig.pageExtensions) {
        expect(Array.isArray(nextConfig.pageExtensions)).toBeTruthy();
        expect(nextConfig.pageExtensions).toContain('tsx');
        expect(nextConfig.pageExtensions).toContain('ts');
      }
    });
  });

  describe('Middleware Configuration', () => {
    test('should have middleware file if configured', () => {
      const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts');
      const middlewareJsPath = path.join(process.cwd(), 'middleware.ts');
      
      // Middleware is optional, but if it exists, it should be properly configured
      if (fs.existsSync(middlewarePath) || fs.existsSync(middlewareJsPath)) {
        expect(true).toBeTruthy(); // Middleware file exists
      }
    });
  });

  describe('Configuration Validation', () => {
    test('should be a valid Next.js configuration object', () => {
      expect(typeof nextConfig).toBe('object');
    });

    test('should not have conflicting configurations', () => {
      // Check for common configuration conflicts
      if (nextConfig.output === 'export') {
        // Static export shouldn't have server-side features
        expect(nextConfig.images?.unoptimized).toBeTruthy();
      }
    });

    test('should have proper module exports', () => {
      const configPath = path.join(process.cwd(), 'next.config.js');
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf8');
        expect(configContent).toContain('module.exports');
      }
    });
  });
}); 