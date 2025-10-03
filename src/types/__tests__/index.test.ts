/**
 * @fileoverview 类型系统主入口测试
 * 测试所有类型的导出和基础类型定义
 */

import {
  // 基础类型
  Language,
  BilingualText,
  
  // 聊天类型
  ChatMessage,
  Conversation,
  ChatRequest,
  ChatResponse,
  
  // 车型类型
  Car,
  CarRecommendation,
  CarFilters,
  
  // 用户类型
  User,
  CreateUserData,
  UpdateUserData
} from '../index'

// 从各个模块单独导入
import { APIResponse, APIListResponse, PaginationParams, SortParams } from '../api'
import { LoadingState, BaseComponentProps, ButtonVariant } from '../ui'

describe('类型系统主入口', () => {
  describe('基础类型导出', () => {
    test('Language 类型应该正确定义', () => {
      const languages: Language[] = ['en', 'zh']
      expect(languages).toHaveLength(2)
      
      // 类型检查 - 这些应该编译通过
      const en: Language = 'en'
      const zh: Language = 'zh'
      expect(en).toBe('en')
      expect(zh).toBe('zh')
    })

    test('BilingualText 类型应该正确定义', () => {
      const text: BilingualText = {
        en: 'Hello',
        zh: '你好'
      }
      
      expect(text.en).toBe('Hello')
      expect(text.zh).toBe('你好')
      expect(Object.keys(text)).toEqual(['en', 'zh'])
    })
  })

  describe('API 类型导出', () => {
    test('APIResponse 类型应该正确定义', () => {
      const successResponse: APIResponse<string> = {
        data: 'test data',
        success: true,
        message: 'Success',
        timestamp: new Date().toISOString()
      }
      
      expect(successResponse.success).toBe(true)
      expect(successResponse.data).toBe('test data')
      expect(typeof successResponse.timestamp).toBe('string')
    })

    test('APIListResponse 类型应该正确定义', () => {
      const listResponse: APIListResponse<string> = {
        data: ['item1', 'item2'],
        success: true,
        message: 'Success',
        timestamp: new Date().toISOString(),
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          total_pages: 1
        }
      }
      
      expect(listResponse.data).toHaveLength(2)
      expect(listResponse.pagination.total).toBe(2)
      expect(listResponse.pagination.page).toBe(1)
    })

    test('PaginationParams 和 SortParams 类型应该正确定义', () => {
      const pagination: PaginationParams = {
        page: 1,
        limit: 10
      }
      
      const sort: SortParams = {
        sort_by: 'price',
        sort_order: 'asc'
      }
      
      expect(pagination.page).toBe(1)
      expect(sort.sort_order).toBe('asc')
    })

    test('CarFilters 类型应该正确定义', () => {
      const filters: CarFilters = {
        category: ['sedan', 'suv'],
        make: ['Toyota', 'Honda'],
        price_min: 20000,
        price_max: 50000,
        year_min: 2020,
        year_max: 2024,
        fuel_type: ['gasoline', 'hybrid'],
        reliability_min: 4.0,
        fuel_economy_min: 7.0,
        safety_rating_min: 4,
        features: ['Apple CarPlay', 'Backup Camera']
      }
      
      expect(filters.category).toContain('sedan')
      expect(filters.make).toContain('Toyota')
      expect(filters.price_min).toBe(20000)
      expect(filters.year_max).toBe(2024)
      expect(filters.fuel_type).toContain('gasoline')
      expect(filters.reliability_min).toBe(4.0)
      expect(filters.features).toContain('Apple CarPlay')
    })
  })

  describe('聊天类型导出', () => {
    test('ChatMessage 类型应该正确定义', () => {
      const userMessage: ChatMessage = {
        id: 'msg-1',
        content: 'Hello',
        type: 'user',
        timestamp: new Date()
      }
      
      const assistantMessage: ChatMessage = {
        id: 'msg-2',
        content: 'Hi there!',
        type: 'assistant',
        timestamp: new Date(),
        metadata: {
          model: 'gemini-pro',
          tokens: 10
        }
      }
      
      expect(userMessage.type).toBe('user')
      expect(assistantMessage.type).toBe('assistant')
      expect(assistantMessage.metadata?.model).toBe('gemini-pro')
    })

    test('Conversation 类型应该正确定义', () => {
      const conversation: Conversation = {
        id: 'conv-1',
        user_id: 'user-1',
        title: 'Car Recommendation Chat',
        summary: 'Discussion about car recommendations',
        language: 'en',
        session_id: 'session-123',
        created_at: new Date(),
        updated_at: new Date()
      }
      
      expect(conversation.language).toBe('en')
      expect(conversation.title).toBe('Car Recommendation Chat')
      expect(conversation.session_id).toBe('session-123')
    })

    test('ChatRequest 和 ChatResponse 类型应该正确定义', () => {
      const request: ChatRequest = {
        message: 'I need a car recommendation',
        conversation_id: 'conv-1',
        language: 'en',
        session_id: 'session-123'
      }
      
      const response: ChatResponse = {
        conversation_id: 'conv-1',
        message_id: 'msg-1',
        summary: {
          en: 'Car recommendation summary',
          zh: '汽车推荐摘要'
        },
        recommendations: [],
        next_steps: []
      }
      
      expect(request.message).toBe('I need a car recommendation')
      expect(response.message_id).toBe('msg-1')
      expect(response.summary.en).toBe('Car recommendation summary')
    })
  })

  describe('车型类型导出', () => {
    test('Car 类型应该正确定义', () => {
      const car: Car = {
        id: 'car-1',
        make: 'Toyota',
        model: 'Camry',
        year_min: 2022,
        year_max: 2024,
        price_min: 30000,
        price_max: 40000,
        currency: 'CAD',
        category: 'sedan',
        fuel_type: 'gasoline',
        description_en: 'Reliable sedan',
        description_zh: '可靠的轿车',
        pros_en: ['Reliable', 'Fuel efficient'],
        pros_zh: ['可靠', '省油'],
        cons_en: ['Limited cargo space'],
        cons_zh: ['货物空间有限'],
        features: ['Apple CarPlay', 'Safety Sense 2.0'],
        image_url: 'https://example.com/camry.jpg',
        reliability_score: 4.5,
        fuel_economy: 7.5,
        safety_rating: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
      
      expect(car.make).toBe('Toyota')
      expect(car.category).toBe('sedan')
      expect(car.fuel_economy).toBe(7.5)
      expect(car.safety_rating).toBe(5)
      expect(car.is_active).toBe(true)
    })

    test('CarRecommendation 类型应该正确定义', () => {
      const car: Car = {
        id: 'car-1',
        make: 'Toyota',
        model: 'Camry',
        year_min: 2022,
        year_max: 2024,
        currency: 'CAD',
        category: 'sedan',
        fuel_type: 'gasoline',
        features: [],
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }

      const recommendation: CarRecommendation = {
        id: 'rec-1',
        car: car,
        match_score: 0.95,
        reasoning: {
          en: 'Excellent fuel economy and high safety rating',
          zh: '出色的燃油经济性和高安全评级'
        }
      }
      
      expect(recommendation.match_score).toBe(0.95)
      expect(recommendation.reasoning.en).toContain('fuel economy')
      expect(recommendation.car.make).toBe('Toyota')
    })
  })

  describe('用户类型导出', () => {
    test('User 类型应该正确定义', () => {
      const user: User = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        language: 'en',
        session_id: 'session-123',
        created_at: new Date(),
        updated_at: new Date()
      }
      
      expect(user.language).toBe('en')
      expect(user.email).toBe('test@example.com')
      expect(user.session_id).toBe('session-123')
    })

    test('CreateUserData 和 UpdateUserData 类型应该正确定义', () => {
      const createData: CreateUserData = {
        email: 'new@example.com',
        name: 'New User',
        language: 'zh',
        session_id: 'session-456'
      }
      
      const updateData: UpdateUserData = {
        name: 'Updated User',
        language: 'en'
      }
      
      expect(createData.session_id).toBe('session-456')
      expect(updateData.language).toBe('en')
    })
  })

  describe('UI 类型导出', () => {
    test('BaseComponentProps 类型应该正确定义', () => {
      const props: BaseComponentProps = {
        className: 'test-class',
        children: 'Test content'
      }
      
      expect(props.className).toBe('test-class')
      expect(props.children).toBe('Test content')
    })

    test('LoadingState 类型应该正确定义', () => {
      const loadingState: LoadingState = {
        isLoading: true,
        error: null
      }
      
      const errorState: LoadingState = {
        isLoading: false,
        error: 'Something went wrong'
      }
      
      expect(loadingState.isLoading).toBe(true)
      expect(errorState.error).toBe('Something went wrong')
    })

    test('ButtonVariant 类型应该正确定义', () => {
      const variants: ButtonVariant[] = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
      
      variants.forEach(variant => {
        expect(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']).toContain(variant)
      })
    })
  })

  describe('类型兼容性', () => {
    test('类型应该相互兼容', () => {
      // 测试 BilingualText 在不同上下文中的使用
      const reasoning: BilingualText = {
        en: 'Test reasoning',
        zh: '测试推理'
      }
      
      const car: Car = {
        id: 'car-1',
        make: 'Toyota',
        model: 'Camry',
        year_min: 2022,
        year_max: 2024,
        currency: 'CAD',
        category: 'sedan',
        fuel_type: 'gasoline',
        features: [],
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }

      const recommendation: CarRecommendation = {
        id: 'rec-1',
        car: car,
        match_score: 0.9,
        reasoning: reasoning // BilingualText 应该兼容
      }
      
      expect(recommendation.reasoning).toBe(reasoning)
    })

    test('泛型类型应该正确工作', () => {
      // 测试 APIResponse 泛型
      const carResponse: APIResponse<Car[]> = {
        data: [],
        success: true,
        message: 'Cars fetched successfully',
        timestamp: new Date().toISOString()
      }
      
      const stringResponse: APIResponse<string> = {
        data: 'test',
        success: true,
        message: 'Success',
        timestamp: new Date().toISOString()
      }
      
      expect(Array.isArray(carResponse.data)).toBe(true)
      expect(typeof stringResponse.data).toBe('string')
    })
  })

  describe('类型约束验证', () => {
    test('枚举类型应该有正确的约束', () => {
      // 这些应该编译通过
      const validLanguage: Language = 'en'
      const validButtonVariant: ButtonVariant = 'default'
      
      expect(['en', 'zh']).toContain(validLanguage)
      expect(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']).toContain(validButtonVariant)
    })

    test('必需字段应该存在', () => {
      // 测试必需字段的存在
      const minimalCar: Pick<Car, 'id' | 'make' | 'model' | 'year_min' | 'year_max' | 'currency' | 'category' | 'fuel_type' | 'features' | 'is_active' | 'created_at' | 'updated_at'> = {
        id: 'car-1',
        make: 'Toyota',
        model: 'Camry',
        year_min: 2022,
        year_max: 2024,
        currency: 'CAD',
        category: 'sedan',
        fuel_type: 'gasoline',
        features: [],
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
      
      expect(minimalCar.id).toBeDefined()
      expect(minimalCar.make).toBeDefined()
      expect(minimalCar.model).toBeDefined()
    })
  })
}) 