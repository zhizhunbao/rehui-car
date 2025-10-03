/**
 * @fileoverview 车型类型测试
 * 测试车型相关的类型定义
 */

import {
  Car,
  CarRecommendation,
  NextStep,
  CarFilters,
  CarSearchParams
} from '../car'

describe('车型类型测试', () => {
  describe('基础车型类型', () => {
    test('Car 应该正确定义', () => {
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
        description_en: 'Reliable and efficient sedan',
        description_zh: '可靠高效的轿车',
        pros_en: ['Reliable', 'Fuel efficient'],
        pros_zh: ['可靠', '省油'],
        cons_en: ['Road noise'],
        cons_zh: ['路噪'],
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
      expect(car.model).toBe('Camry')
      expect(car.category).toBe('sedan')
      expect(car.fuel_type).toBe('gasoline')
      expect(car.reliability_score).toBe(4.5)
      expect(car.is_active).toBe(true)
      expect(car.pros_en).toContain('Reliable')
      expect(car.features).toContain('Apple CarPlay')
    })

    test('CarRecommendation 应该正确定义', () => {
      const car: Car = {
        id: 'car-1',
        make: 'Honda',
        model: 'Civic',
        year_min: 2023,
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
        match_score: 0.92,
        reasoning: {
          en: 'Excellent fuel economy and reliability for your budget',
          zh: '在您的预算范围内具有出色的燃油经济性和可靠性'
        }
      }
      
      expect(recommendation.match_score).toBe(0.92)
      expect(recommendation.reasoning.en).toContain('fuel economy')
      expect(recommendation.car.make).toBe('Honda')
    })

    test('NextStep 应该正确定义', () => {
      const nextStep: NextStep = {
        id: 'step-1',
        title: {
          en: 'Visit Honda Dealership',
          zh: '访问本田经销商'
        },
        description: {
          en: 'Schedule a test drive at your local Honda dealer',
          zh: '在当地本田经销商预约试驾'
        },
        priority: 'high',
        action_type: 'visit',
        estimated_time: '60 minutes'
      }
      
      expect(nextStep.priority).toBe('high')
      expect(nextStep.action_type).toBe('visit')
      expect(nextStep.title.en).toContain('Honda')
      expect(nextStep.estimated_time).toBe('60 minutes')
    })
  })

  describe('车型筛选和搜索', () => {
    test('CarFilters 应该正确定义', () => {
      const filters: CarFilters = {
        category: ['sedan', 'suv'],
        fuel_type: ['gasoline', 'hybrid'],
        make: ['Toyota', 'Honda', 'Mazda'],
        price_min: 25000,
        price_max: 45000,
        year_min: 2020,
        year_max: 2024,
        reliability_min: 4.0,
        fuel_economy_min: 8.0,
        safety_rating_min: 4,
        features: ['Apple CarPlay', 'Backup Camera']
      }
      
      expect(filters.category).toContain('sedan')
      expect(filters.make).toContain('Toyota')
      expect(filters.price_min).toBe(25000)
      expect(filters.features).toContain('Apple CarPlay')
    })

    test('CarSearchParams 应该正确定义', () => {
      const searchParams: CarSearchParams = {
        query: 'reliable sedan',
        filters: {
          category: ['sedan'],
          price_max: 40000
        },
        sort_by: 'price_min',
        sort_order: 'asc',
        page: 1,
        limit: 20,
        language: 'en'
      }
      
      expect(searchParams.query).toBe('reliable sedan')
      expect(searchParams.filters?.category).toContain('sedan')
      expect(searchParams.sort_by).toBe('price_min')
      expect(searchParams.limit).toBe(20)
    })
  })

  describe('类型兼容性测试', () => {
    test('CarFilters 应该兼容 CarSearchParams', () => {
      const filters: CarFilters = {
        category: ['sedan'],
        make: ['Toyota']
      }
      
      const searchParams: CarSearchParams = {
        query: 'sedan',
        filters: filters
      }
      
      expect(searchParams.filters?.category).toEqual(filters.category)
      expect(searchParams.filters?.make).toEqual(filters.make)
    })

    test('可选字段应该正确处理', () => {
      const minimalCar: Car = {
        id: 'car-min',
        make: 'Toyota',
        model: 'Corolla',
        year_min: 2023,
        year_max: 2023,
        currency: 'CAD',
        category: 'sedan',
        fuel_type: 'gasoline',
        features: [],
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
      
      expect(minimalCar.price_min).toBeUndefined()
      expect(minimalCar.description_en).toBeUndefined()
      expect(minimalCar.reliability_score).toBeUndefined()
    })

    test('空数组和空对象应该正确处理', () => {
      const emptyFilters: CarFilters = {}
      const emptyFeatures: string[] = []
      
      expect(Object.keys(emptyFilters)).toHaveLength(0)
      expect(emptyFeatures).toHaveLength(0)
    })
  })
}) 