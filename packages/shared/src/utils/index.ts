/**
 * Shared utility functions for SiteForge
 */

import { clsx, type ClassValue } from 'clsx';

/**
 * Merge Tailwind CSS classes with conflict resolution
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Convert string to URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format phone number for display: (704) 555-0123
 */
export function formatPhoneDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Format phone number for tel: link: +17045550123
 */
export function formatPhoneLink(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+${cleaned}`;
  }
  return `+${cleaned}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (US format)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1');
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate a random ID
 */
export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format number with commas: 1234567 -> 1,234,567
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format currency: 1234.56 -> $1,234.56
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Convert state name to abbreviation
 */
export const STATE_ABBREVIATIONS: Record<string, string> = {
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  washington: 'WA',
  'west virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',
  'district of columbia': 'DC',
};

export function getStateAbbreviation(stateName: string): string {
  return STATE_ABBREVIATIONS[stateName.toLowerCase()] || stateName;
}

/**
 * Get state name from abbreviation
 */
export function getStateName(abbr: string): string {
  const entry = Object.entries(STATE_ABBREVIATIONS).find(
    ([, value]) => value.toUpperCase() === abbr.toUpperCase()
  );
  return entry ? titleCase(entry[0]) : abbr;
}

/**
 * Format address for display
 */
export function formatAddress(address: {
  street?: string;
  city: string;
  state: string;
  zip: string;
}): string {
  const parts = [];
  if (address.street) parts.push(address.street);
  parts.push(`${address.city}, ${address.state} ${address.zip}`);
  return parts.join(', ');
}

/**
 * Calculate reading time for text (words per minute)
 */
export function calculateReadingTime(text: string, wpm = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
}

/**
 * Ensure URL has protocol
 */
export function ensureHttps(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url.replace('http://', 'https://');
  }
  return `https://${url}`;
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(ensureHttps(url));
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

// Re-export clsx for convenience
export { clsx };
export type { ClassValue };
