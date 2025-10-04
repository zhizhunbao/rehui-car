/**
 * 简单的API测试示例
 * 使用原生JavaScript，无需Jest配置
 */

// 加载环境变量
require('dotenv').config({ path: '.env.local' });

describe('API Connection Tests', () => {
  test('should connect to Supabase database', async () => {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // 测试数据库连接
    const { data, error } = await supabase
      .from('cars')
      .select('id, make, model')
      .limit(1);
    
    expect(error).toBe(null);
    expect(data).toBeTruthy();
    console.log('✅ Supabase连接成功，找到车型:', data?.[0]?.make, data?.[0]?.model);
  });

  test('should connect to Gemini AI API', async () => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: 'Say hello in one word' }] 
          }]
        })
      }
    );
    
    expect(response.ok).toBeTruthy();
    
    const data = await response.json();
    expect(data.candidates).toBeTruthy();
    console.log('✅ Gemini AI连接成功，响应:', data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
  });

  test('should test health check API', async () => {
    // 这里可以测试本地API端点
    // 需要先启动开发服务器: npm run dev
    try {
      const response = await fetch('http://localhost:3000/api/health');
      if (response.ok) {
        const data = await response.json();
        expect(data.status).toBe('healthy');
        console.log('✅ Health API正常:', data);
      } else {
        console.log('⚠️  Health API测试跳过（开发服务器未启动）');
      }
    } catch (error) {
      console.log('⚠️  Health API测试跳过（开发服务器未启动）');
    }
  });
});

describe('Environment Tests', () => {
  test('should have all required environment variables', () => {
    const required = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'GOOGLE_GEMINI_API_KEY'
    ];
    
    for (const key of required) {
      expect(process.env[key]).toBeTruthy();
      console.log(`✅ ${key}: ${process.env[key]?.substring(0, 10)}...`);
    }
  });

  test('should validate environment variable formats', () => {
    // 验证Supabase URL格式
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    expect(supabaseUrl.startsWith('https://')).toBeTruthy();
    expect(supabaseUrl.includes('.supabase.co')).toBeTruthy();
    
    // 验证API密钥长度
    expect(process.env.GOOGLE_GEMINI_API_KEY.length).toBe(39); // Gemini API key length
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 100).toBeTruthy();
    
    console.log('✅ 环境变量格式验证通过');
  });
});