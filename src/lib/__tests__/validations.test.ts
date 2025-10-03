/**
 * @jest-environment jsdom
 */

import {
  LanguageSchema,
  UUIDSchema,
  EmailSchema,
  ChatRequestSchema,
  CreateCarSchema,
  CarFiltersSchema,
  validateRequest,
  ValidationError,
} from '../validations'

describe('validations.ts', () => {
  describe('LanguageSchema', () => {
    test('should accept valid languages', () => {
      expect(() => LanguageSchema.parse('en')).not.toThrow()
      expect(() => LanguageSchema.parse('zh')).not.toThrow()
    })

    test('should reject invalid languages', () => {
      expect(() => LanguageSchema.parse('fr')).toThrow()
      expect(() => LanguageSchema.parse('invalid')).toThrow()
    })
  })

  describe('UUIDSchema', () => {
    test('should accept valid UUIDs', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000'
      expect(() => UUIDSchema.parse(validUUID)).not.toThrow()
    })

    test('should reject invalid UUIDs', () => {
      expect(() => UUIDSchema.parse('invalid-uuid')).toThrow()
      expect(() => UUIDSchema.parse('123')).toThrow()
    })
  })

  describe('EmailSchema', () => {
    test('should accept valid emails', () => {
      expect(() => EmailSchema.parse('test@example.com')).not.toThrow()
      expect(() => EmailSchema.parse('user+tag@domain.co.uk')).not.toThrow()
    })

    test('should reject invalid emails', () => {
      expect(() => EmailSchema.parse('invalid-email')).toThrow()
      expect(() => EmailSchema.parse('test@')).toThrow()
      expect(() => EmailSchema.parse('@example.com')).toThrow()
    })
  })

  describe('ChatRequestSchema', () => {
    test('should accept valid chat requests', () => {
      const validRequest = {
        message: 'Hello, I need help choosing a car',
        language: 'en',
        session_id: 'session_123456789'
      }
      expect(() => ChatRequestSchema.parse(validRequest)).not.toThrow()
    })

    test('should reject invalid chat requests', () => {
      const invalidRequest = {
        message: '', // Empty message
        language: 'en',
        session_id: 'session_123456789'
      }
      expect(() => ChatRequestSchema.parse(invalidRequest)).toThrow()
    })

    test('should reject requests with invalid language', () => {
      const invalidRequest = {
        message: 'Hello',
        language: 'invalid',
        session_id: 'session_123456789'
      }
      expect(() => ChatRequestSchema.parse(invalidRequest)).toThrow()
    })
  })

  describe('CreateCarSchema', () => {
    test('should accept valid car data', () => {
      const validCar = {
        make: 'Toyota',
        model: 'Camry',
        year_min: 2020,
        year_max: 2023,
        price_min: 25000,
        price_max: 35000,
        category: 'sedan',
        fuel_type: 'gasoline'
      }
      expect(() => CreateCarSchema.parse(validCar)).not.toThrow()
    })

    test('should reject car with invalid year range', () => {
      const invalidCar = {
        make: 'Toyota',
        model: 'Camry',
        year_min: 2023,
        year_max: 2020, // Invalid: min > max
        category: 'sedan',
        fuel_type: 'gasoline'
      }
      expect(() => CreateCarSchema.parse(invalidCar)).toThrow()
    })

    test('should reject car with invalid price range', () => {
      const invalidCar = {
        make: 'Toyota',
        model: 'Camry',
        year_min: 2020,
        year_max: 2023,
        price_min: 35000,
        price_max: 25000, // Invalid: min > max
        category: 'sedan',
        fuel_type: 'gasoline'
      }
      expect(() => CreateCarSchema.parse(invalidCar)).toThrow()
    })
  })

  describe('CarFiltersSchema', () => {
    test('should accept valid filters', () => {
      const validFilters = {
        category: ['sedan', 'suv'],
        fuel_type: ['gasoline', 'hybrid'],
        price_min: 20000,
        price_max: 50000
      }
      expect(() => CarFiltersSchema.parse(validFilters)).not.toThrow()
    })

    test('should accept empty filters', () => {
      expect(() => CarFiltersSchema.parse({})).not.toThrow()
    })
  })

  describe('validateRequest', () => {
    test('should return parsed data for valid input', () => {
      const result = validateRequest(EmailSchema, 'test@example.com')
      expect(result).toBe('test@example.com')
    })

    test('should throw ValidationError for invalid input', () => {
      expect(() => {
        validateRequest(EmailSchema, 'invalid-email')
      }).toThrow(ValidationError)
    })

    test('ValidationError should contain error details', () => {
      try {
        validateRequest(EmailSchema, 'invalid-email')
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        if (error instanceof ValidationError) {
          expect(error.errors).toHaveLength(1)
          expect(error.errors[0]).toHaveProperty('path')
          expect(error.errors[0]).toHaveProperty('message')
        }
      }
    })
  })

  describe('ValidationError', () => {
    test('should create error with message and details', () => {
      const errors = [{ path: 'email', message: 'Invalid email format' }]
      const error = new ValidationError('Validation failed', errors)
      
      expect(error.name).toBe('ValidationError')
      expect(error.message).toBe('Validation failed')
      expect(error.errors).toEqual(errors)
    })
  })
}) 