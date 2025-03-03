import CryptoJS from 'crypto-js';

// Secret key should come from environment variable in production
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'fallback-dev-key-change-in-production';

/**
 * Encrypt sensitive data before storing
 * 
 * @param {unknown} data - The data to encrypt
 * @returns {string} Encrypted string
 */
export function encryptData(data: unknown): string {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
}

/**
 * Decrypt data after retrieving from storage
 * 
 * @param {string} encryptedData - The encrypted data string
 * @returns {unknown} Decrypted data or null if decryption fails
 */
export function decryptData(encryptedData: string): unknown {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Failed to decrypt data:', error);
    return null;
  }
}

/**
 * Sanitize user input to prevent XSS attacks
 * 
 * @param {string} input - The user input to sanitize
 * @returns {string} Sanitized string safe for rendering
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Create a secure random ID
 * 
 * @param {number} length - The length of the ID to generate
 * @returns {string} A cryptographically secure random ID
 */
export function secureRandomId(length: number = 20): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if a module has the required permission
 * 
 * @param {string[]} modulePermissions - The permissions granted to the module
 * @param {string} requiredPermission - The permission to check for
 * @returns {boolean} True if the module has the permission
 */
export function hasPermission(
  modulePermissions: string[],
  requiredPermission: string
): boolean {
  return modulePermissions.includes(requiredPermission);
}

/**
 * Generate a secure hash of content
 * 
 * @param {string} content - The content to hash
 * @returns {string} Secure hash value
 */
export function generateHash(content: string): string {
  return CryptoJS.SHA256(content).toString();
}

/**
 * Validate if a token is properly formatted
 * 
 * @param {string} token - The token to validate
 * @returns {boolean} True if the token has valid format
 */
export function isValidToken(token: string): boolean {
  // Basic validation - in reality would be more sophisticated
  return /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token);
}

/**
 * Obfuscate sensitive information for logging
 * 
 * @param {string} value - The sensitive value to obfuscate
 * @param {number} visibleChars - Number of characters to show at start and end
 * @returns {string} Obfuscated string for safer logging
 */
export function obfuscateSensitiveData(value: string, visibleChars: number = 4): string {
  if (!value || value.length <= visibleChars * 2) {
    return '***';
  }
  
  const start = value.substring(0, visibleChars);
  const end = value.substring(value.length - visibleChars);
  const middle = '*'.repeat(Math.min(value.length - (visibleChars * 2), 10));
  
  return `${start}${middle}${end}`;
} 