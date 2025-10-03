/**
 * AI 集成真实测试
 * 使用真实的 Gemini API 进行端到端测试
 */

// 确保环境变量正确加载 - 必须在所有导入之前
import dotenv from 'dotenv';
import path from 'path';

// 使用绝对路径确保找到 .env.local 文件
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// 验证环境变量是否正确加载
console.log('Environment check:', {
  hasApiKey: !!process.env.GOOGLE_GEMINI_API_KEY,
  apiKeyPrefix: process.env.GOOGLE_GEMINI_API_KEY?.substring(0, 10) + '...',
  envPath: envPath
});

import { 
  generateChatResponse, 
  generateCarRecommendation,
  generateConversationSummary,
  healthCheck 
} from '../gemini';
import { ChatMessage, Language } from '@/types';

// 跳过 mock，使用真实的 API
jest.unmock('../gemini');

describe('AI Integration - Real API Tests', () => {
  // 设置较长的超时时间，因为需要调用真实的 API
  jest.setTimeout(30000);

  beforeAll(() => {
    // 检查环境变量
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY environment variable is required for real API tests');
    }
  });

  describe('Health Check', () => {
    it('should connect to Gemini API successfully', async () => {
      const isHealthy = await healthCheck();
      expect(isHealthy).toBe(true);
    });
  });

  describe('Chat Response Generation', () => {
    it('should generate chat response in English', async () => {
      const messages: ChatMessage[] = [
        {
          id: '1',
          type: 'user',
          content: 'I need a reliable car under $20,000 CAD for family use',
          timestamp: new Date(),
          metadata: {}
        }
      ];

      const result = await generateChatResponse(messages, 'en');
      
      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.summary.en).toBeDefined();
      expect(result.summary.zh).toBeDefined();
      expect(typeof result.summary.en).toBe('string');
      expect(typeof result.summary.zh).toBe('string');
      expect(result.summary.en.length).toBeGreaterThan(0);
      expect(result.summary.zh.length).toBeGreaterThan(0);
      
      console.log('English summary:', result.summary.en);
      console.log('Chinese summary:', result.summary.zh);
    });

    it('should generate chat response in Chinese', async () => {
      const messages: ChatMessage[] = [
        {
          id: '1',
          type: 'user',
          content: '我需要一辆可靠的车，预算在2万加元以下，适合家庭使用',
          timestamp: new Date(),
          metadata: {}
        }
      ];

      const result = await generateChatResponse(messages, 'zh');
      
      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.summary.en).toBeDefined();
      expect(result.summary.zh).toBeDefined();
      expect(typeof result.summary.en).toBe('string');
      expect(typeof result.summary.zh).toBe('string');
      expect(result.summary.en.length).toBeGreaterThan(0);
      expect(result.summary.zh.length).toBeGreaterThan(0);
      
      console.log('English summary:', result.summary.en);
      console.log('Chinese summary:', result.summary.zh);
    });
  });

  describe('Car Recommendation Generation', () => {
    it('should generate car recommendations in English', async () => {
      const userMessage = 'I need a reliable car under $20,000 CAD for family use';
      const result = await generateCarRecommendation(userMessage, 'en');
      
      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.summary.en).toBeDefined();
      expect(result.summary.zh).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(Array.isArray(result.next_steps)).toBe(true);
      
      console.log('Recommendations count:', result.recommendations.length);
      console.log('Next steps count:', result.next_steps.length);
      
      if (result.recommendations.length > 0) {
        const rec = result.recommendations[0];
        expect(rec.car).toBeDefined();
        expect(rec.car.make).toBeDefined();
        expect(rec.car.model).toBeDefined();
        expect(rec.match_score).toBeGreaterThan(0);
        expect(rec.match_score).toBeLessThanOrEqual(1);
        expect(rec.reasoning).toBeDefined();
        expect(rec.reasoning.en).toBeDefined();
        expect(rec.reasoning.zh).toBeDefined();
        
        console.log('First recommendation:', {
          make: rec.car.make,
          model: rec.car.model,
          score: rec.match_score,
          reasoning: rec.reasoning.en.substring(0, 100) + '...'
        });
      }
    });

    it('should generate car recommendations in Chinese', async () => {
      const userMessage = '我需要一辆可靠的车，预算在2万加元以下，适合家庭使用';
      const result = await generateCarRecommendation(userMessage, 'zh');
      
      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.summary.en).toBeDefined();
      expect(result.summary.zh).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(Array.isArray(result.next_steps)).toBe(true);
      
      console.log('Recommendations count:', result.recommendations.length);
      console.log('Next steps count:', result.next_steps.length);
    });
  });

  describe('Conversation Summary Generation', () => {
    it('should generate conversation summary in English', async () => {
      const messages: ChatMessage[] = [
        {
          id: '1',
          type: 'user',
          content: 'I need a reliable car under $20,000 CAD',
          timestamp: new Date(),
          metadata: {}
        },
        {
          id: '2',
          type: 'assistant',
          content: 'I can help you find a reliable car within your budget. What type of car are you looking for?',
          timestamp: new Date(),
          metadata: {}
        },
        {
          id: '3',
          type: 'user',
          content: 'I prefer a sedan or SUV for family use',
          timestamp: new Date(),
          metadata: {}
        }
      ];

      const result = await generateConversationSummary(messages, 'en');
      
      expect(result).toBeDefined();
      expect(result.en).toBeDefined();
      expect(result.zh).toBeDefined();
      expect(typeof result.en).toBe('string');
      expect(typeof result.zh).toBe('string');
      expect(result.en.length).toBeGreaterThan(0);
      expect(result.zh.length).toBeGreaterThan(0);
      
      console.log('English summary:', result.en);
      console.log('Chinese summary:', result.zh);
    });

    it('should generate conversation summary in Chinese', async () => {
      const messages: ChatMessage[] = [
        {
          id: '1',
          type: 'user',
          content: '我需要一辆可靠的车，预算在2万加元以下',
          timestamp: new Date(),
          metadata: {}
        },
        {
          id: '2',
          type: 'assistant',
          content: '我可以帮您找到预算内的可靠汽车。您想要什么类型的车？',
          timestamp: new Date(),
          metadata: {}
        },
        {
          id: '3',
          type: 'user',
          content: '我更喜欢轿车或SUV，适合家庭使用',
          timestamp: new Date(),
          metadata: {}
        }
      ];

      const result = await generateConversationSummary(messages, 'zh');
      
      expect(result).toBeDefined();
      expect(result.en).toBeDefined();
      expect(result.zh).toBeDefined();
      expect(typeof result.en).toBe('string');
      expect(typeof result.zh).toBe('string');
      expect(result.en.length).toBeGreaterThan(0);
      expect(result.zh.length).toBeGreaterThan(0);
      
      console.log('English summary:', result.en);
      console.log('Chinese summary:', result.zh);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty messages gracefully', async () => {
      const messages: ChatMessage[] = [];
      const result = await generateChatResponse(messages, 'en');
      
      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.summary.en).toBeDefined();
      expect(result.summary.zh).toBeDefined();
    });

    it('should handle very long messages', async () => {
      const longMessage = 'I need a car '.repeat(1000); // 很长的消息
      const messages: ChatMessage[] = [
        {
          id: '1',
          type: 'user',
          content: longMessage,
          timestamp: new Date(),
          metadata: {}
        }
      ];

      const result = await generateChatResponse(messages, 'en');
      
      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.summary.en).toBeDefined();
      expect(result.summary.zh).toBeDefined();
    });
  });

  describe('Performance Tests', () => {
    it('should respond within reasonable time', async () => {
      const startTime = Date.now();
      
      const messages: ChatMessage[] = [
        {
          id: '1',
          type: 'user',
          content: 'I need a car recommendation',
          timestamp: new Date(),
          metadata: {}
        }
      ];

      await generateChatResponse(messages, 'en');
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`Response time: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(10000); // 应该在10秒内响应
    });
  });
});
