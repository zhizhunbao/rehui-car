import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/database';
import { supabase } from '../supabase';
import { UserRepository } from './repositories/user';
import { ConversationRepository } from './repositories/conversation';
import { MessageRepository } from './repositories/message';
import { CarRepository } from './repositories/car';
import { RecommendationRepository } from './repositories/recommendation';
import { NextStepRepository } from './repositories/next-step';

// 数据库客户端接口
export interface DatabaseClient {
  users: UserRepository;
  conversations: ConversationRepository;
  messages: MessageRepository;
  cars: CarRepository;
  recommendations: RecommendationRepository;
  nextSteps: NextStepRepository;
}

// 数据库客户端实现
export class DatabaseClientImpl implements DatabaseClient {
  public users: UserRepository;
  public conversations: ConversationRepository;
  public messages: MessageRepository;
  public cars: CarRepository;
  public recommendations: RecommendationRepository;
  public nextSteps: NextStepRepository;

  constructor(private client: SupabaseClient<Database>) {
    this.users = new UserRepository(client);
    this.conversations = new ConversationRepository(client);
    this.messages = new MessageRepository(client);
    this.cars = new CarRepository(client);
    this.recommendations = new RecommendationRepository(client);
    this.nextSteps = new NextStepRepository(client);
  }

  // 获取原始客户端
  getClient(): SupabaseClient<Database> {
    return this.client;
  }

  // 健康检查
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    repositories: {
      users: 'up' | 'down';
      conversations: 'up' | 'down';
      messages: 'up' | 'down';
      cars: 'up' | 'down';
      recommendations: 'up' | 'down';
      nextSteps: 'up' | 'down';
    };
  }> {
    const timestamp = new Date().toISOString();
    const results = await Promise.allSettled([
      this.users.healthCheck(),
      this.conversations.healthCheck(),
      this.messages.healthCheck(),
      this.cars.healthCheck(),
      this.recommendations.healthCheck(),
      this.nextSteps.healthCheck()
    ]);

    const repositoryStatus = {
      users: results[0].status === 'fulfilled' ? 'up' as const : 'down' as const,
      conversations: results[1].status === 'fulfilled' ? 'up' as const : 'down' as const,
      messages: results[2].status === 'fulfilled' ? 'up' as const : 'down' as const,
      cars: results[3].status === 'fulfilled' ? 'up' as const : 'down' as const,
      recommendations: results[4].status === 'fulfilled' ? 'up' as const : 'down' as const,
      nextSteps: results[5].status === 'fulfilled' ? 'up' as const : 'down' as const
    };

    const allHealthy = Object.values(repositoryStatus).every(status => status === 'up');

    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp,
      repositories: repositoryStatus
    };
  }
}

// 创建数据库客户端实例
export function createDatabaseClient(client: SupabaseClient<Database>): DatabaseClient {
  return new DatabaseClientImpl(client);
}

// 导出默认数据库客户端实例
export const db: DatabaseClient = new DatabaseClientImpl(supabase);

// 导出仓库类型
export type {
  UserRepository,
  ConversationRepository,
  MessageRepository,
  CarRepository,
  RecommendationRepository,
  NextStepRepository
} from './repositories';

// 导出数据库类型
export type { Database } from '@/types/database';
