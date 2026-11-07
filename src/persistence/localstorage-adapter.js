import { isQuotaError, QuotaExceededError } from './storage-adapter.js';

const PREFIX = 'poybercv:';

/**
 * Lightweight adapter for UI preferences.
 * LocalStorage is synchronous — only use for small, non-resume data.
 */
export const localStorageAdapter = {
  /**
   * @param {string} key
   * @returns {*|null}
   */
  get(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (err) {
      if (isQuotaError(err)) {
        throw new QuotaExceededError('LocalStorage quota exceeded');
      }
      throw err;
    }
  },

  /**
   * @param {string} key
   */
  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },
};
