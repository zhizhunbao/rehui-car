/**
 * 测试环境设置
 * 配置Jest测试环境、Mock设置、测试工具初始化
 */

import '@testing-library/jest-dom';

// 全局测试配置
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: Record<string, any>): R;
    }
  }
}

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isLocaleDomain: true,
      isReady: true,
      defaultLocale: 'en',
      domainLocales: [],
      isPreview: false,
    };
  },
}));

// Mock Next.js navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => props,
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => children,
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  writable: true,
  value: sessionStorageMock,
});

// 不 mock fetch，让 Supabase 使用真实的 fetch
// global.fetch = jest.fn();

// Mock console methods for cleaner test output
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
        args[0].includes('componentWillUpdate'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// 清理每个测试后的状态
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});

// 设置测试超时时间
jest.setTimeout(10000);

// 全局测试工具函数
export const createMockRouter = (overrides = {}) => ({
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  push: jest.fn(),
  pop: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: true,
  isReady: true,
  defaultLocale: 'en',
  domainLocales: [],
  isPreview: false,
  ...overrides,
});

// Mock API responses
export const createMockApiResponse = (data: any, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  json: jest.fn().mockResolvedValue(data),
  text: jest.fn().mockResolvedValue(JSON.stringify(data)),
  headers: new Headers(),
});

// 测试数据工厂
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockCar = (overrides = {}) => ({
  id: '1',
  make: 'Toyota',
  model: 'Camry',
  year: 2023,
  price: 25000,
  fuelType: 'gasoline',
  category: 'sedan',
  imageUrl: 'https://example.com/car.jpg',
  description: 'A reliable sedan',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// 为 AI 集成测试添加 fetch polyfill
if (typeof global.fetch === 'undefined') {
  // 使用 Node.js 18+ 的内置 fetch 或 undici
  try {
    const { fetch } = require('undici');
    global.fetch = fetch;
  } catch (error) {
    // 如果 undici 不可用，使用简单的 fetch 实现
    global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const https = require('https');
      const http = require('http');
      const { URL } = require('url');
      
      return new Promise((resolve, reject) => {
        const url = input instanceof Request ? input.url : input.toString();
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;
        
        const requestOptions = {
          hostname: urlObj.hostname,
          port: urlObj.port || (isHttps ? 443 : 80),
          path: urlObj.pathname + urlObj.search,
          method: init?.method || 'GET',
          headers: init?.headers || {}
        };
        
        const req = client.request(requestOptions, (res: any) => {
          let data = '';
          res.on('data', (chunk: any) => data += chunk);
          res.on('end', () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              statusText: res.statusMessage,
              json: () => Promise.resolve(JSON.parse(data)),
              text: () => Promise.resolve(data),
              headers: new Headers(res.headers),
              redirected: false,
              type: 'basic' as ResponseType,
              url: url,
              clone: () => Promise.resolve() as any,
              body: null,
              bodyUsed: false,
              arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
              blob: () => Promise.resolve(new Blob()),
              formData: () => Promise.resolve(new FormData())
            } as Response);
          });
        });
        
        req.on('error', reject);
        if (init?.body) {
          req.write(init.body);
        }
        req.end();
      });
    };
  }
}

export const createMockConversation = (overrides = {}) => ({
  id: '1',
  userId: '1',
  title: 'Car Recommendation',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockMessage = (overrides = {}) => ({
  id: '1',
  conversationId: '1',
  role: 'user',
  content: 'Hello, I need help finding a car',
  createdAt: new Date().toISOString(),
  ...overrides,
});

// 测试环境变量设置 - 全部使用真实值
// 根据 docs/prompt.md 要求，禁止使用 mock 测试，全部使用真实数据和真实 API 调用

// 确保环境变量从 .env.local 文件加载
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// 显示环境变量状态
console.log('🧪 使用真实环境变量进行测试');
console.log('Environment check:', {
  hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  hasGeminiKey: !!process.env.GOOGLE_GEMINI_API_KEY,
  geminiKeyPrefix: process.env.GOOGLE_GEMINI_API_KEY?.substring(0, 10) + '...',
  envPath: envPath
});

// 验证必需的环境变量
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GOOGLE_GEMINI_API_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.warn('⚠️  缺少必需的环境变量:', missingVars);
  console.warn('请确保 .env.local 文件包含所有必需的配置');
} else {
  console.log('✅ 所有必需的环境变量已配置');
} 