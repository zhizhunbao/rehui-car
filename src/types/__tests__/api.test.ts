/**
 * @fileoverview API类型测试
 * 测试API相关的类型定义
 */

import {
  PaginationParams,
  PaginationResponse,
  CarFilters as APICarFilters,
  SortParams,
  APIResponse,
  APIListResponse,
  CarsQueryParams,
  ConversationsQueryParams,
  HealthResponse,
  CarsResponse,
  CarDetailResponse,
  ConversationDetailResponse,
  UserResponse,
  RecommendationsResponse
} from '../api'

describe('API类型测试', () => {
  describe('分页类型', () => {
    test('PaginationParams 应该正确定义', () => {
      const params: PaginationParams = {
        page: 1,
        limit: 20
      }
      
      expect(params.page).toBe(1)
      expect(params.limit).toBe(20)
    })

    test('PaginationResponse 应该正确定义', () => {
      const response: PaginationResponse = {
        page: 1,
        limit: 20,
        total: 100,
        total_pages: 5
      }
      
      expect(response.page).toBe(1)
      expect(response.total_pages).toBe(5)
    })
  })

  describe('筛选和排序类型', () => {
    test('APICarFilters 应该正确定义', () => {
      const filters: APICarFilters = {
        category: 'sedan',
        fuel_type: 'gasoline',
        make: 'Toyota',
        price_min: 20000,
        price_max: 50000,
        year_min: 2020,
        year_max: 2024,
        reliability_min: 4.0,
        fuel_economy_min: 7.0,
        safety_rating_min: 4
      }
      
      expect(filters.category).toBe('sedan')
      expect(filters.make).toBe('Toyota')
      expect(filters.price_min).toBe(20000)
    })

    test('SortParams 应该正确定义', () => {
      const sortByPrice: SortParams = {
        sort_by: 'price',
        sort_order: 'asc'
      }
      
      const sortByReliability: SortParams = {
        sort_by: 'reliability',
        sort_order: 'desc'
      }
      
      expect(sortByPrice.sort_by).toBe('price')
      expect(sortByReliability.sort_order).toBe('desc')
    })
  })

  describe('API响应类型', () => {
    test('APIResponse 应该正确定义', () => {
      const successResponse: APIResponse<string> = {
        data: 'test data',
        success: true,
        message: 'Operation successful',
        timestamp: '2024-01-01T00:00:00Z'
      }
      
      expect(successResponse.success).toBe(true)
      expect(successResponse.data).toBe('test data')
    })

    test('APIListResponse 应该正确定义', () => {
      const listResponse: APIListResponse<{ id: string; name: string }> = {
        data: [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' }
        ],
        success: true,
        message: 'Items retrieved',
        timestamp: '2024-01-01T00:00:00Z',
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          total_pages: 1
        },
        filters: {
          category: 'test'
        }
      }
      
      expect(listResponse.data).toHaveLength(2)
      expect(listResponse.pagination.total).toBe(2)
      expect(listResponse.filters?.category).toBe('test')
    })

    test('HealthResponse 应该正确定义', () => {
      const healthResponse: HealthResponse = {
        status: 'healthy',
        timestamp: '2024-01-01T00:00:00Z',
        version: '1.0.0',
        services: {
          database: 'up',
          ai: 'up',
          cache: 'up'
        }
      }
      
      expect(healthResponse.status).toBe('healthy')
      expect(healthResponse.services.database).toBe('up')
      expect(healthResponse.version).toBe('1.0.0')
    })
  })

  describe('查询参数类型', () => {
    test('CarsQueryParams 应该正确定义', () => {
      const params: CarsQueryParams = {
        page: 1,
        limit: 20,
        category: 'sedan',
        make: 'Toyota',
        price_min: 20000,
        price_max: 50000,
        sort_by: 'price',
        sort_order: 'asc'
      }
      
      expect(params.page).toBe(1)
      expect(params.category).toBe('sedan')
      expect(params.sort_by).toBe('price')
    })

    test('ConversationsQueryParams 应该正确定义', () => {
      const params: ConversationsQueryParams = {
        page: 1,
        limit: 10,
        user_id: 'user-123',
        language: 'en'
      }
      
      expect(params.user_id).toBe('user-123')
      expect(params.language).toBe('en')
    })
  })

  describe('具体响应类型', () => {
    test('CarsResponse 应该正确定义', () => {
      const carsResponse: CarsResponse = {
        cars: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          total_pages: 0
        },
        filters: {
          categories: ['sedan', 'suv'],
          fuel_types: ['gasoline', 'hybrid'],
          makes: ['Toyota', 'Honda'],
          price_range: { min: 20000, max: 50000 }
        }
      }
      
      expect(Array.isArray(carsResponse.cars)).toBe(true)
      expect(carsResponse.filters.categories).toContain('sedan')
      expect(carsResponse.filters.price_range.min).toBe(20000)
    })

    test('UserResponse 应该正确定义', () => {
      const userResponse: UserResponse = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          language: 'en',
          session_id: 'session-456',
          created_at: new Date(),
          updated_at: new Date()
        },
        message: 'User retrieved successfully'
      }
      
      expect(userResponse.user.id).toBe('user-123')
      expect(userResponse.user.language).toBe('en')
      expect(userResponse.message).toBe('User retrieved successfully')
    })
  })

  describe('类型兼容性测试', () => {
    test('分页参数应该兼容查询参数', () => {
      const pagination: PaginationParams = {
        page: 1,
        limit: 20
      }
      
      const carsQuery: CarsQueryParams = {
        ...pagination,
        category: 'sedan'
      }
      
      expect(carsQuery.page).toBe(pagination.page)
      expect(carsQuery.limit).toBe(pagination.limit)
    })

    test('API响应应该支持不同数据类型', () => {
      interface TestData {
        id: string
        value: number
      }
      
      const response: APIResponse<TestData> = {
        data: { id: 'test', value: 42 },
        success: true,
        message: 'Success',
        timestamp: '2024-01-01T00:00:00Z'
      }
      
      expect(response.data.id).toBe('test')
      expect(response.data.value).toBe(42)
    })
  })

  describe('边界条件测试', () => {
    test('可选字段应该正确处理', () => {
      const minimalFilters: APICarFilters = {}
      const minimalParams: CarsQueryParams = {}
      
      expect(Object.keys(minimalFilters)).toHaveLength(0)
      expect(Object.keys(minimalParams)).toHaveLength(0)
    })

    test('分页参数边界值', () => {
      const minPage: PaginationParams = {
        page: 1,
        limit: 1
      }
      
      const maxPage: PaginationParams = {
        page: 999999,
        limit: 100
      }
      
      expect(minPage.page).toBe(1)
      expect(maxPage.limit).toBe(100)
    })
  })
}) 