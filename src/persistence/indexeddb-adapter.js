import { openDB } from 'idb';
import { isQuotaError, QuotaExceededError } from './storage-adapter.js';

const DB_NAME = 'poybercv';
const DB_VERSION = 1;

let dbPromise = null;

/**
 * Lazily open (and cache) the IndexedDB connection.
 * @returns {Promise<IDBPDatabase>}
 */
function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('resumes')) {
          db.createObjectStore('resumes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Wrap an IndexedDB operation and convert quota errors to our type.
 * @template T
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 */
async function withQuotaHandling(fn) {
  try {
    return await fn();
  } catch (err) {
    if (isQuotaError(err)) {
      throw new QuotaExceededError('IndexedDB quota exceeded');
    }
    throw err;
  }
}

/**
 * Adapter for the `resumes` object store.
 */
export const resumeAdapter = {
  /**
   * @param {Object} resume
   * @returns {Promise<void>}
   */
  async put(resume) {
    return withQuotaHandling(async () => {
      const db = await getDB();
      await db.put('resumes', resume);
    });
  },

  /**
   * @param {string} id
   * @returns {Promise<Object|undefined>}
   */
  async get(id) {
    const db = await getDB();
    return db.get('resumes', id);
  },

  /**
   * @returns {Promise<Object[]>}
   */
  async getAll() {
    const db = await getDB();
    return db.getAll('resumes');
  },

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    const db = await getDB();
    await db.delete('resumes', id);
  },
};

/**
 * Adapter for the `images` object store (used in v0.7 for JSON export).
 */
export const imageAdapter = {
  /**
   * @param {{id: string, blob: Blob, mimeType: string}} image
   * @returns {Promise<void>}
   */
  async put(image) {
    return withQuotaHandling(async () => {
      const db = await getDB();
      await db.put('images', image);
    });
  },

  /**
   * @param {string} id
   * @returns {Promise<Object|undefined>}
   */
  async get(id) {
    const db = await getDB();
    return db.get('images', id);
  },

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    const db = await getDB();
    await db.delete('images', id);
  },
};
