// 导出所有仓库类
export { UserRepository } from './user';
export { ConversationRepository } from './conversation';
export { MessageRepository } from './message';
export { CarRepository } from './car';
export { RecommendationRepository } from './recommendation';
export { NextStepRepository } from './next-step';

// 导出仓库接口类型
export type { UserRepository as UserRepositoryInterface } from './user';
export type { ConversationRepository as ConversationRepositoryInterface } from './conversation';
export type { MessageRepository as MessageRepositoryInterface } from './message';
export type { CarRepository as CarRepositoryInterface } from './car';
export type { RecommendationRepository as RecommendationRepositoryInterface } from './recommendation';
export type { NextStepRepository as NextStepRepositoryInterface } from './next-step';