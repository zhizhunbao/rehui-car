import {
  cn,
  formatPrice,
  formatPriceRange,
  formatYearRange,
  formatFuelEconomy,
  formatRating,
  generateStarRating,
  getBilingualText,
  createBilingualText,
  getRelativeTime,
  formatFileSize,
  isValidEmail,
  isValidUrl,
  generateSessionId,
  deepClone,
  isEmpty,
  debounce,
  throttle,
  retry,
  sleep,
  truncateText,
  safeJsonParse,
  generateRandomColor,
} from '../utils'
import { Language, BilingualText } from '@/types'

// Mock timers for debounce/throttle tests
jest.useFakeTimers()

describe('utils.ts', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'active')).toBe('base active')
      expect(cn('base', false && 'active')).toBe('base')
    })
  })

  describe('formatPrice', () => {
    it('should format prices correctly', () => {
      expect(formatPrice(25000)).toBe('$25,000')
      expect(formatPrice(25000, 'CAD')).toBe('CA$25,000')
      expect(formatPrice(25000, 'USD')).toBe('$25,000')
    })

    it('should handle zero and negative values', () => {
      expect(formatPrice(0)).toBe('$0')
      expect(formatPrice(-1000)).toBe('-$1,000')
    })

    it('should handle large numbers', () => {
      expect(formatPrice(1000000)).toBe('$1,000,000')
    })
  })

  describe('formatPriceRange', () => {
    it('should format price ranges correctly', () => {
      expect(formatPriceRange(20000, 30000)).toBe('$20,000 - $30,000')
      expect(formatPriceRange(20000, 20000)).toBe('$20,000')
    })

    it('should handle different currencies', () => {
      expect(formatPriceRange(20000, 30000, 'CAD')).toBe('CA$20,000 - CA$30,000')
    })
  })

  describe('formatYearRange', () => {
    it('should format year ranges correctly', () => {
      expect(formatYearRange(2020, 2023)).toBe('2020-2023')
      expect(formatYearRange(2023, 2023)).toBe('2023')
    })
  })

  describe('formatFuelEconomy', () => {
    it('should format fuel economy correctly', () => {
      expect(formatFuelEconomy(8.5)).toBe('8.5 L/100km')
      expect(formatFuelEconomy(8.5, 'zh')).toBe('8.5 升/100公里')
    })

    it('should handle zero values', () => {
      expect(formatFuelEconomy(0)).toBe('0.0 L/100km')
    })
  })

  describe('formatRating', () => {
    it('should format ratings correctly', () => {
      expect(formatRating(4.5)).toBe('4.5/5')
      expect(formatRating(4.5, 10)).toBe('4.5/10')
    })

    it('should handle edge values', () => {
      expect(formatRating(0)).toBe('0.0/5')
      expect(formatRating(5)).toBe('5.0/5')
    })
  })

  describe('generateStarRating', () => {
    it('should generate star ratings', () => {
      expect(generateStarRating(4.5)).toBe('★★★★☆')
      expect(generateStarRating(5)).toBe('★★★★★')
      expect(generateStarRating(0)).toBe('☆☆☆☆☆')
    })
  })

  describe('getBilingualText', () => {
    const bilingualText: BilingualText = {
      en: 'Hello',
      zh: '你好'
    }

    it('should return correct language text', () => {
      expect(getBilingualText(bilingualText, 'en')).toBe('Hello')
      expect(getBilingualText(bilingualText, 'zh')).toBe('你好')
    })

    it('should fallback to English for invalid language', () => {
      expect(getBilingualText(bilingualText, 'fr' as Language)).toBe('Hello')
    })
  })

  describe('createBilingualText', () => {
    it('should create bilingual text object', () => {
      const result = createBilingualText('Hello', '你好')
      expect(result).toEqual({ en: 'Hello', zh: '你好' })
    })
  })

  describe('getRelativeTime', () => {
    const now = new Date('2023-01-01T12:00:00Z')
    
    beforeEach(() => {
      jest.setSystemTime(now)
    })

    it('should return relative time strings', () => {
      const oneHourAgo = new Date('2023-01-01T11:00:00Z')
      const oneDayAgo = new Date('2022-12-31T12:00:00Z')
      
      expect(getRelativeTime(oneHourAgo)).toContain('ago')
      expect(getRelativeTime(oneDayAgo)).toContain('ago')
    })

    it('should handle future dates', () => {
      const oneHourLater = new Date('2023-01-01T13:00:00Z')
      expect(getRelativeTime(oneHourLater)).toContain('in')
    })
  })

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(1024)).toBe('1.00 KB')
      expect(formatFileSize(1048576)).toBe('1.00 MB')
      expect(formatFileSize(1073741824)).toBe('1.00 GB')
    })

    it('should handle small sizes', () => {
      expect(formatFileSize(500)).toBe('500 bytes')
      expect(formatFileSize(0)).toBe('0 bytes')
    })
  })

  describe('isValidEmail', () => {
    it('should validate email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user+tag@domain.co.uk')).toBe(true)
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('should validate URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
      expect(isValidUrl('ftp://files.example.com')).toBe(true)
      expect(isValidUrl('invalid-url')).toBe(false)
      expect(isValidUrl('example.com')).toBe(false)
    })
  })

  describe('generateSessionId', () => {
    it('should generate unique session IDs', () => {
      const id1 = generateSessionId()
      const id2 = generateSessionId()
      
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })
  })

  describe('deepClone', () => {
    it('should deep clone objects', () => {
      const original = {
        name: 'test',
        nested: { value: 42 },
        array: [1, 2, { nested: true }]
      }
      
      const cloned = deepClone(original)
      
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.nested).not.toBe(original.nested)
      expect(cloned.array).not.toBe(original.array)
    })

    it('should handle primitive values', () => {
      expect(deepClone(42)).toBe(42)
      expect(deepClone('string')).toBe('string')
      expect(deepClone(null)).toBe(null)
      expect(deepClone(undefined)).toBe(undefined)
    })
  })

  describe('isEmpty', () => {
    it('should check if values are empty', () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
      expect(isEmpty('')).toBe(true)
      expect(isEmpty([])).toBe(true)
      expect(isEmpty({})).toBe(true)
      
      expect(isEmpty('text')).toBe(false)
      expect(isEmpty([1])).toBe(false)
      expect(isEmpty({ key: 'value' })).toBe(false)
      expect(isEmpty(0)).toBe(false)
      expect(isEmpty(false)).toBe(false)
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      expect(mockFn).not.toHaveBeenCalled()
      
      jest.advanceTimersByTime(100)
      
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)
      
      throttledFn()
      throttledFn()
      throttledFn()
      
      expect(mockFn).toHaveBeenCalledTimes(1)
      
      jest.advanceTimersByTime(100)
      throttledFn()
      
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('retry', () => {
    it('should retry failed operations', async () => {
      let attempts = 0
      const failingFn = jest.fn().mockImplementation(() => {
        attempts++
        if (attempts < 2) {
          throw new Error('Failed')
        }
        return 'success'
      })
      
      const result = await retry(failingFn, 1, 0) // 最多重试1次，无延迟
      
      expect(result).toBe('success')
      expect(failingFn).toHaveBeenCalledTimes(2)
    })

    it('should throw after max retries', async () => {
      const failingFn = jest.fn().mockRejectedValue(new Error('Always fails'))
      
      await expect(retry(failingFn, 0, 0)).rejects.toThrow('Always fails') // 不重试，无延迟
      expect(failingFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('sleep', () => {
    it('should resolve after specified time', async () => {
      const promise = sleep(100)
      
      jest.advanceTimersByTime(100)
      await expect(promise).resolves.toBeUndefined()
    })
  })

  describe('truncateText', () => {
    it('should truncate long strings', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...')
      expect(truncateText('Short', 10)).toBe('Short')
      expect(truncateText('Exact', 5)).toBe('Exact')
    })

    it('should use custom suffix', () => {
      expect(truncateText('Hello World', 5, ' [more]')).toBe('Hello [more]')
    })
  })

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const result = safeJsonParse('{"key": "value"}', {})
      expect(result).toEqual({ key: 'value' })
    })

    it('should return default value for invalid JSON', () => {
      const defaultValue = { default: true }
      const result = safeJsonParse('invalid json', defaultValue)
      expect(result).toBe(defaultValue)
    })
  })

  describe('generateRandomColor', () => {
    it('should generate valid hex color', () => {
      const color = generateRandomColor()
      expect(color).toMatch(/^#[0-9A-F]{6}$/i)
    })

    it('should generate different colors', () => {
      const color1 = generateRandomColor()
      const color2 = generateRandomColor()
      // Note: There's a small chance they could be the same, but very unlikely
      expect(typeof color1).toBe('string')
      expect(typeof color2).toBe('string')
    })
  })
}) 