import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// 环境变量验证
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// 客户端配置
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'rehui-car@1.0.0'
    }
  }
};

// 创建客户端实例
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  supabaseConfig
);

// 服务端客户端（使用服务角色密钥）
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    ...supabaseConfig,
    auth: {
      ...supabaseConfig.auth,
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// 创建服务端客户端（用于API路由）
export function createServerSupabaseClient() {
  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      ...supabaseConfig,
      auth: {
        ...supabaseConfig.auth,
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

// 数据库连接测试
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Database connection test error:', error);
    return false;
  }
}

// 健康检查
export async function getDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    auth: 'up' | 'down';
  };
}> {
  const timestamp = new Date().toISOString();
  
  try {
    // 测试数据库连接
    const dbTest = await testDatabaseConnection();
    
    // 测试认证服务
    const { data: authData, error: authError } = await supabase.auth.getSession();
    const authTest = !authError;
    
    return {
      status: dbTest && authTest ? 'healthy' : 'unhealthy',
      timestamp,
      services: {
        database: dbTest ? 'up' : 'down',
        auth: authTest ? 'up' : 'down'
      }
    };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      status: 'unhealthy',
      timestamp,
      services: {
        database: 'down',
        auth: 'down'
      }
    };
  }
}

// 错误处理工具
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

// 处理Supabase错误
export function handleSupabaseError(error: any): SupabaseError {
  if (error?.code) {
    return new SupabaseError(
      error.message || 'Database operation failed',
      error.code,
      error.details
    );
  }
  
  return new SupabaseError(
    error?.message || 'Unknown database error',
    'UNKNOWN_ERROR',
    error
  );
}

// 导出类型
export type { Database } from '@/types/database';
