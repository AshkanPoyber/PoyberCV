/**
 * Abstract storage adapter interface.
 * All adapters must implement these methods.
 * This file exists only to document the contract — it is not instantiated.
 *
 * @typedef {Object} StorageAdapter
 * @property {(key: string) => Promise<*>} get
 * @property {(key: string, value: *) => Promise<void>} set
 * @property {(key: string) => Promise<void>} remove
 * @property {() => Promise<string[]>} keys
 */

/**
 * Error thrown when storage quota is exceeded.
 * Wraps the browser-specific error for consistent handling.
 */
export class QuotaExceededError extends Error {
  constructor(message = 'Storage quota exceeded') {
    super(message);
    this.name = 'QuotaExceededError';
  }
}

/**
 * Detect if an error is a quota-related error.
 * Handles both IndexedDB and LocalStorage errors.
 * @param {Error} err
 * @returns {boolean}
 */
export function isQuotaError(err) {
  if (!err) return false;
  return (
    err.name === 'QuotaExceededError' ||
    err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    (err.message && err.message.toLowerCase().includes('quota'))
  );
}
