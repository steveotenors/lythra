/**
 * Type for JSON-serializable values
 */
export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * User entity representing an authenticated user
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  created_at: string;
}

/**
 * User preference for theme
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Type-guard utilities
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
} 