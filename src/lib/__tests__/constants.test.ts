/**
 * @jest-environment jsdom
 */

import {
  APP_CONFIG,
  LANGUAGE_CONFIG,
  CAR_CATEGORIES,
  CAR_CATEGORY_LABELS,
  FUEL_TYPES,
  FUEL_TYPE_LABELS,
  CAR_MAKES,
  ERROR_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_ENDPOINTS,
  REGEX_PATTERNS,
} from '../constants'

describe('constants.ts', () => {
  describe('APP_CONFIG', () => {
    test('should have required configuration properties', () => {
      expect(APP_CONFIG).toHaveProperty('name')
      expect(APP_CONFIG).toHaveProperty('version')
      expect(APP_CONFIG).toHaveProperty('description')
      expect(APP_CONFIG).toHaveProperty('author')
      expect(APP_CONFIG).toHaveProperty('url')
      expect(APP_CONFIG).toHaveProperty('environment')
    })

    test('should have valid default values', () => {
      expect(APP_CONFIG.name).toBe('ReHui Car')
      expect(APP_CONFIG.version).toBe('1.0.0')
      expect(APP_CONFIG.description).toBe('AI-powered car buying advisor for Canada')
      expect(APP_CONFIG.author).toBe('ReHui Team')
    })
  })

  describe('LANGUAGE_CONFIG', () => {
    test('should have language configuration properties', () => {
      expect(LANGUAGE_CONFIG).toHaveProperty('default')
      expect(LANGUAGE_CONFIG).toHaveProperty('supported')
      expect(LANGUAGE_CONFIG).toHaveProperty('fallback')
    })

    test('should have valid language values', () => {
      expect(LANGUAGE_CONFIG.default).toBe('zh')
      expect(LANGUAGE_CONFIG.fallback).toBe('en')
      expect(Array.isArray(LANGUAGE_CONFIG.supported)).toBe(true)
      expect(LANGUAGE_CONFIG.supported).toContain('en')
      expect(LANGUAGE_CONFIG.supported).toContain('zh')
    })
  })

  describe('CAR_CATEGORIES', () => {
    test('should be an object with category constants', () => {
      expect(typeof CAR_CATEGORIES).toBe('object')
      expect(CAR_CATEGORIES).toHaveProperty('SEDAN')
      expect(CAR_CATEGORIES).toHaveProperty('SUV')
      expect(CAR_CATEGORIES).toHaveProperty('HATCHBACK')
    })

    test('should have string values', () => {
      Object.values(CAR_CATEGORIES).forEach(category => {
        expect(typeof category).toBe('string')
      })
    })
  })

  describe('CAR_CATEGORY_LABELS', () => {
    test('should have bilingual labels for each category', () => {
      Object.values(CAR_CATEGORY_LABELS).forEach(label => {
        expect(label).toHaveProperty('en')
        expect(label).toHaveProperty('zh')
        expect(typeof label.en).toBe('string')
        expect(typeof label.zh).toBe('string')
      })
    })
  })

  describe('FUEL_TYPES', () => {
    test('should be an object with fuel type constants', () => {
      expect(typeof FUEL_TYPES).toBe('object')
      expect(FUEL_TYPES).toHaveProperty('GASOLINE')
      expect(FUEL_TYPES).toHaveProperty('DIESEL')
      expect(FUEL_TYPES).toHaveProperty('ELECTRIC')
    })

    test('should have string values', () => {
      Object.values(FUEL_TYPES).forEach(fuelType => {
        expect(typeof fuelType).toBe('string')
      })
    })
  })

  describe('FUEL_TYPE_LABELS', () => {
    test('should have bilingual labels for each fuel type', () => {
      Object.values(FUEL_TYPE_LABELS).forEach(label => {
        expect(label).toHaveProperty('en')
        expect(label).toHaveProperty('zh')
        expect(typeof label.en).toBe('string')
        expect(typeof label.zh).toBe('string')
      })
    })
  })

  describe('CAR_MAKES', () => {
    test('should be an array of car make strings', () => {
      expect(Array.isArray(CAR_MAKES)).toBe(true)
      expect(CAR_MAKES.length).toBeGreaterThan(0)
    })

    test('should contain expected car makes', () => {
      expect(CAR_MAKES).toContain('Toyota')
      expect(CAR_MAKES).toContain('Honda')
      expect(CAR_MAKES).toContain('BMW')
      expect(CAR_MAKES).toContain('Tesla')
    })

    test('should have string values', () => {
      CAR_MAKES.forEach(make => {
        expect(typeof make).toBe('string')
        expect(make.length).toBeGreaterThan(0)
      })
    })
  })

  describe('ERROR_CODES', () => {
    test('should have standard error codes', () => {
      expect(ERROR_CODES).toHaveProperty('VALIDATION_ERROR')
      expect(ERROR_CODES).toHaveProperty('NOT_FOUND')
      expect(ERROR_CODES).toHaveProperty('UNAUTHORIZED')
      expect(ERROR_CODES).toHaveProperty('FORBIDDEN')
      expect(ERROR_CODES).toHaveProperty('SERVICE_UNAVAILABLE')
    })

    test('should have string values', () => {
      Object.values(ERROR_CODES).forEach(code => {
        expect(typeof code).toBe('string')
      })
    })
  })

  describe('ERROR_MESSAGES', () => {
    test('should have bilingual error messages', () => {
      Object.values(ERROR_MESSAGES).forEach(message => {
        expect(message).toHaveProperty('en')
        expect(message).toHaveProperty('zh')
        expect(typeof message.en).toBe('string')
        expect(typeof message.zh).toBe('string')
      })
    })
  })

  describe('SUCCESS_MESSAGES', () => {
    test('should have bilingual success messages', () => {
      Object.values(SUCCESS_MESSAGES).forEach(message => {
        expect(message).toHaveProperty('en')
        expect(message).toHaveProperty('zh')
        expect(typeof message.en).toBe('string')
        expect(typeof message.zh).toBe('string')
      })
    })
  })

  describe('API_ENDPOINTS', () => {
    test('should have required API endpoints', () => {
      expect(API_ENDPOINTS).toHaveProperty('chat')
      expect(API_ENDPOINTS).toHaveProperty('cars')
      expect(API_ENDPOINTS).toHaveProperty('conversations')
      expect(API_ENDPOINTS).toHaveProperty('recommendations')
      expect(API_ENDPOINTS).toHaveProperty('users')
    })

    test('should have valid endpoint paths', () => {
      expect(typeof API_ENDPOINTS.chat).toBe('string')
      expect(typeof API_ENDPOINTS.cars).toBe('string')
      expect(typeof API_ENDPOINTS.conversations).toBe('string')
      expect(API_ENDPOINTS.chat.startsWith('/')).toBe(true)
      expect(API_ENDPOINTS.cars.startsWith('/')).toBe(true)
    })

    test('should have function endpoints for dynamic routes', () => {
      expect(typeof API_ENDPOINTS.carDetail).toBe('function')
      expect(typeof API_ENDPOINTS.conversationDetail).toBe('function')
      expect(API_ENDPOINTS.carDetail('123')).toBe('/api/cars/123')
      expect(API_ENDPOINTS.conversationDetail('abc')).toBe('/api/conversations/abc')
    })
  })

  describe('REGEX_PATTERNS', () => {
    test('should have required regex patterns', () => {
      expect(REGEX_PATTERNS).toHaveProperty('email')
      expect(REGEX_PATTERNS).toHaveProperty('sessionId')
      expect(REGEX_PATTERNS).toHaveProperty('carMake')
      expect(REGEX_PATTERNS).toHaveProperty('carModel')
    })

    test('should have valid regex patterns', () => {
      Object.values(REGEX_PATTERNS).forEach(pattern => {
        expect(pattern).toBeInstanceOf(RegExp)
      })
    })

    test('email regex should validate emails correctly', () => {
      expect(REGEX_PATTERNS.email.test('test@example.com')).toBe(true)
      expect(REGEX_PATTERNS.email.test('invalid-email')).toBe(false)
    })

    test('uuid regex should validate UUIDs correctly', () => {
      expect(REGEX_PATTERNS.uuid.test('123e4567-e89b-12d3-a456-426614174000')).toBe(true)
      expect(REGEX_PATTERNS.uuid.test('invalid-uuid')).toBe(false)
    })
  })
}) 