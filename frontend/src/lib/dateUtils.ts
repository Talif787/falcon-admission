// frontend/src/lib/dateUtils.ts

import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Safely parse a date string or Date object
 */
export function safeParseDate(date: Date | string | undefined | null): Date | null {
  if (!date) return null;
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? parsedDate : null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}

/**
 * Format date with fallback
 */
export function safeFormat(
  date: Date | string | undefined | null,
  formatStr: string = 'PPpp',
  fallback: string = 'Unknown'
): string {
  const parsedDate = safeParseDate(date);
  if (!parsedDate) return fallback;
  
  try {
    return format(parsedDate, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return fallback;
  }
}

/**
 * Format relative time with fallback
 */
export function safeFormatDistanceToNow(
  date: Date | string | undefined | null,
  options?: { addSuffix?: boolean },
  fallback: string = 'Unknown'
): string {
  const parsedDate = safeParseDate(date);
  if (!parsedDate) return fallback;
  
  try {
    return formatDistanceToNow(parsedDate, options);
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return fallback;
  }
}

/**
 * Format time only (HH:mm:ss)
 */
export function safeFormatTime(
  date: Date | string | undefined | null,
  fallback: string = ''
): string {
  return safeFormat(date, 'HH:mm:ss', fallback);
}

/**
 * Format date only (MMM dd, yyyy)
 */
export function safeFormatDate(
  date: Date | string | undefined | null,
  fallback: string = 'Unknown'
): string {
  return safeFormat(date, 'MMM dd, yyyy', fallback);
}

/**
 * Format full date and time
 */
export function safeFormatDateTime(
  date: Date | string | undefined | null,
  fallback: string = 'Unknown'
): string {
  return safeFormat(date, 'PPpp', fallback);
}

/**
 * Check if date is valid
 */
export function isValidDate(date: Date | string | undefined | null): boolean {
  const parsedDate = safeParseDate(date);
  return parsedDate !== null;
}

/**
 * Get duration between two dates in minutes
 */
export function getDurationMinutes(
  startDate: Date | string | undefined | null,
  endDate: Date | string | undefined | null
): number | null {
  const start = safeParseDate(startDate);
  const end = safeParseDate(endDate);
  
  if (!start || !end) return null;
  
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / 60000);
}

/**
 * Format duration in milliseconds to readable format
 */
export function formatDuration(durationMs: number | undefined | null): string {
  if (!durationMs) return 'Unknown';
  
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  
  if (minutes === 0) {
    return `${seconds}s`;
  } else if (seconds === 0) {
    return `${minutes}m`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
}