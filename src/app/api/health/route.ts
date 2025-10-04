import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { genAI } from '@/lib/gemini';

/**
 * 健康检查API
 * GET /api/health - 检查系统状态、数据库连接、AI服务状态
 */
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // 检查数据库连接
    let dbStatus = 'unknown';
    let dbLatency = 0;
    try {
      const dbStartTime = Date.now();
      const { data, error } = await supabase
        .from('cars')
        .select('id')
        .limit(1);
      
      dbLatency = Date.now() - dbStartTime;
      
      if (error) {
        dbStatus = 'error';
        console.error('Database health check error:', error);
      } else {
        dbStatus = 'healthy';
      }
    } catch (error) {
      dbStatus = 'error';
      console.error('Database connection error:', error);
    }

    // 检查AI服务状态
    let aiStatus = 'unknown';
    let aiLatency = 0;
    try {
      const aiStartTime = Date.now();
      
      // 发送简单的测试请求到Gemini
      const testMessage = '测试连接';
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(testMessage);
      
      aiLatency = Date.now() - aiStartTime;
      
      if (result.response) {
        aiStatus = 'healthy';
      } else {
        aiStatus = 'error';
      }
    } catch (error) {
      aiStatus = 'error';
      console.error('AI service health check error:', error);
    }

    const totalLatency = Date.now() - startTime;
    
    // 确定整体状态
    const overallStatus = dbStatus === 'healthy' && aiStatus === 'healthy' 
      ? 'healthy' 
      : dbStatus === 'error' || aiStatus === 'error' 
        ? 'error' 
        : 'degraded';

    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: dbStatus,
          latency: dbLatency,
          provider: 'supabase'
        },
        ai: {
          status: aiStatus,
          latency: aiLatency,
          provider: 'gemini'
        }
      },
      performance: {
        totalLatency,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      }
    };

    // 根据状态返回相应的HTTP状态码
    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 207 : 503;

    return NextResponse.json(healthData, { status: statusCode });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Internal server error during health check',
      services: {
        database: { status: 'unknown' },
        ai: { status: 'unknown' }
      }
    }, { status: 503 });
  }
}

/**
 * 详细健康检查API
 * POST /api/health - 执行更详细的健康检查
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { detailed = false } = body;

    if (!detailed) {
      // 如果不需要详细检查，直接调用GET方法
      return GET(request);
    }

    const startTime = Date.now();
    const checks = [];

    // 详细数据库检查
    try {
      const dbStartTime = Date.now();
      
      // 检查多个表
      const [carsResult, conversationsResult] = await Promise.all([
        supabase.from('cars').select('count', { count: 'exact', head: true }),
        supabase.from('conversations').select('count', { count: 'exact', head: true })
      ]);

      const dbLatency = Date.now() - dbStartTime;

      checks.push({
        name: 'database_tables',
        status: carsResult.error || conversationsResult.error ? 'error' : 'healthy',
        latency: dbLatency,
        details: {
          cars_count: carsResult.count,
          conversations_count: conversationsResult.count,
          errors: [carsResult.error, conversationsResult.error].filter(Boolean)
        }
      });
    } catch (error) {
      checks.push({
        name: 'database_tables',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // 详细AI服务检查
    try {
      const aiStartTime = Date.now();
      
      // 测试不同类型的AI请求
      const testPrompts = [
        '你好',
        '推荐一款汽车',
        '比较两款车型的优缺点'
      ];

      const aiResults = await Promise.all(
        testPrompts.map(async (prompt) => {
          try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const result = await model.generateContent(prompt);
            return { prompt, success: true, response: result.response?.text()?.substring(0, 100) };
          } catch (error) {
            return { prompt, success: false, error: error instanceof Error ? error.message : 'Unknown error' };
          }
        })
      );

      const aiLatency = Date.now() - aiStartTime;
      const successCount = aiResults.filter(r => r.success).length;

      checks.push({
        name: 'ai_service',
        status: successCount === testPrompts.length ? 'healthy' : 
                successCount > 0 ? 'degraded' : 'error',
        latency: aiLatency,
        details: {
          total_tests: testPrompts.length,
          successful_tests: successCount,
          results: aiResults
        }
      });
    } catch (error) {
      checks.push({
        name: 'ai_service',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    const totalLatency = Date.now() - startTime;
    
    // 计算整体状态
    const healthyCount = checks.filter(c => c.status === 'healthy').length;
    const errorCount = checks.filter(c => c.status === 'error').length;
    
    const overallStatus = errorCount === 0 ? 'healthy' :
                         healthyCount > 0 ? 'degraded' : 'error';

    const detailedHealthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks,
      summary: {
        total_checks: checks.length,
        healthy_checks: healthyCount,
        degraded_checks: checks.filter(c => c.status === 'degraded').length,
        error_checks: errorCount
      },
      performance: {
        totalLatency,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      }
    };

    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 207 : 503;

    return NextResponse.json(detailedHealthData, { status: statusCode });

  } catch (error) {
    console.error('Detailed health check error:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Internal server error during detailed health check'
    }, { status: 503 });
  }
}
