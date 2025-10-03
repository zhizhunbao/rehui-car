import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BilingualText, Language } from "@/types";

/**
 * 合并 Tailwind CSS 类名
 * 使用 clsx 和 tailwind-merge 来智能合并类名
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * 生成唯一的会话ID
 * 格式: timestamp-randomString
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomStr}`;
}

/**
 * 格式化价格显示
 * @param price 价格数值
 * @param currency 货币代码 (默认: CAD)
 * @param language 语言 (默认: en)
 */
export function formatPrice(
  price: number, 
  currency: string = 'USD', 
  language: Language = 'en'
): string {
  // 处理负数
  const isNegative = price < 0;
  const absPrice = Math.abs(price);
  
  // 格式化数字部分
  const formattedNumber = new Intl.NumberFormat('en-US').format(absPrice);
  
  // 根据货币类型添加前缀
  let result: string;
  if (currency === 'CAD') {
    result = `CA$${formattedNumber}`;
  } else {
    result = `$${formattedNumber}`;
  }
  
  // 处理负号
  return isNegative ? `-${result}` : result;
}

/**
 * 格式化价格范围
 * @param minPrice 最低价格
 * @param maxPrice 最高价格
 * @param currency 货币代码
 * @param language 语言
 */
export function formatPriceRange(
  minPrice?: number,
  maxPrice?: number,
  currency: string = 'USD',
  language: Language = 'en'
): string {
  if (!minPrice && !maxPrice) {
    return language === 'zh' ? '价格面议' : 'Price on request';
  }
  
  if (minPrice && maxPrice) {
    if (minPrice === maxPrice) {
      return formatPrice(minPrice, currency, language);
    }
    return `${formatPrice(minPrice, currency, language)} - ${formatPrice(maxPrice, currency, language)}`;
  }
  
  if (minPrice) {
    const prefix = language === 'zh' ? '起价 ' : 'Starting from ';
    return `${prefix}${formatPrice(minPrice, currency, language)}`;
  }
  
  if (maxPrice) {
    const prefix = language === 'zh' ? '最高 ' : 'Up to ';
    return `${prefix}${formatPrice(maxPrice, currency, language)}`;
  }
  
  return '';
}

/**
 * 获取双语文本的指定语言版本
 * @param text 双语文本对象
 * @param language 目标语言
 */
export function getBilingualText(text: BilingualText, language: Language): string {
  return text[language] || text.en || text.zh || '';
}

/**
 * 创建双语文本对象
 * @param en 英文文本
 * @param zh 中文文本
 */
export function createBilingualText(en: string, zh: string): BilingualText {
  return { en, zh };
}

/**
 * 格式化年份范围
 * @param yearMin 最小年份
 * @param yearMax 最大年份
 */
export function formatYearRange(yearMin: number, yearMax: number): string {
  if (yearMin === yearMax) {
    return yearMin.toString();
  }
  return `${yearMin}-${yearMax}`;
}

/**
 * 格式化燃油经济性
 * @param fuelEconomy 燃油经济性数值 (L/100km)
 * @param language 语言
 */
export function formatFuelEconomy(fuelEconomy: number, language: Language = 'en'): string {
  const unit = language === 'zh' ? '升/100公里' : 'L/100km';
  return `${fuelEconomy.toFixed(1)} ${unit}`;
}

/**
 * 格式化评分显示
 * @param rating 评分 (0-5)
 * @param maxRating 最大评分 (默认: 5)
 */
export function formatRating(rating: number, maxRating: number = 5): string {
  return `${rating.toFixed(1)}/${maxRating}`;
}

/**
 * 生成星级评分显示
 * @param rating 评分 (0-5)
 * @param maxRating 最大评分 (默认: 5)
 */
export function generateStarRating(rating: number, maxRating: number = 5): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars);
}

/**
 * 截断文本并添加省略号
 * @param text 原始文本
 * @param maxLength 最大长度
 * @param suffix 后缀 (默认: '...')
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  // 按单词截断，保持单词完整性
  // 测试期望保留完整的单词，即使超过maxLength
  const words = text.split(' ');
  let result = '';
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testResult = result ? `${result} ${word}` : word;
    
    // 如果这是第一个单词，或者添加这个单词后长度仍然合理
    if (i === 0 || testResult.length <= maxLength) {
      result = testResult;
    } else {
      break;
    }
  }
  
  return result + suffix;
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间 (毫秒)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间 (毫秒)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any };
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }
  
  return obj;
}

/**
 * 检查是否为空值 (null, undefined, 空字符串, 空数组, 空对象)
 * @param value 要检查的值
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
}

/**
 * 安全的 JSON 解析
 * @param jsonString JSON 字符串
 * @param defaultValue 解析失败时的默认值
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn('JSON parse error:', error);
    return defaultValue;
  }
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param decimals 小数位数 (默认: 2)
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  if (i === 0) {
    return bytes + ' ' + sizes[i];
  }
  
  return (bytes / Math.pow(k, i)).toFixed(dm) + ' ' + sizes[i];
}

/**
 * 生成随机颜色 (十六进制)
 */
export function generateRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * 检查是否为有效的 URL
 * @param url URL 字符串
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 检查是否为有效的邮箱地址
 * @param email 邮箱地址
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 获取相对时间描述
 * @param date 日期
 * @param language 语言
 */
export function getRelativeTime(date: Date, language: Language = 'en'): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const isFuture = diffInSeconds < 0;
  const absDiffInSeconds = Math.abs(diffInSeconds);
  
  const intervals = {
    en: {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    },
    zh: {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    }
  };
  
  const labels = {
    en: {
      year: 'year',
      month: 'month',
      week: 'week',
      day: 'day',
      hour: 'hour',
      minute: 'minute',
      ago: 'ago',
      in: 'in',
      just_now: 'just now'
    },
    zh: {
      year: '年',
      month: '个月',
      week: '周',
      day: '天',
      hour: '小时',
      minute: '分钟',
      ago: '前',
      in: '后',
      just_now: '刚刚'
    }
  };
  
  const currentLabels = labels[language];
  
  if (absDiffInSeconds < 60) {
    return currentLabels.just_now;
  }
  
  for (const [unit, seconds] of Object.entries(intervals[language])) {
    const interval = Math.floor(absDiffInSeconds / seconds);
    if (interval >= 1) {
      if (language === 'zh') {
        const timeWord = isFuture ? currentLabels.in : currentLabels.ago;
        return `${interval}${currentLabels[unit as keyof typeof currentLabels]}${timeWord}`;
      } else {
        const plural = interval > 1 ? 's' : '';
        const timeWord = isFuture ? currentLabels.in : currentLabels.ago;
        return isFuture 
          ? `${timeWord} ${interval} ${currentLabels[unit as keyof typeof currentLabels]}${plural}`
          : `${interval} ${currentLabels[unit as keyof typeof currentLabels]}${plural} ${timeWord}`;
      }
    }
  }
  
  return currentLabels.just_now;
}

/**
 * 睡眠函数 (异步延迟)
 * @param ms 毫秒数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 * @param fn 要重试的异步函数
 * @param maxRetries 最大重试次数
 * @param delay 重试间隔 (毫秒)
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries && delay > 0) {
        await sleep(delay); // 只有当延迟大于0时才sleep
      }
    }
  }
  
  throw lastError!;
} 