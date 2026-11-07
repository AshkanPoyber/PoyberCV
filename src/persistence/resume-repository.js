import { resumeAdapter } from './indexeddb-adapter.js';
import { migrateResume } from '../data/migrations.js';
import { uuid } from '../core/uuid.js';

/**
 * High-level CRUD operations on resumes.
 * Handles migration on read, and summary extraction for the Dashboard.
 */
export const resumeRepository = {
  /**
   * Save (upsert) a resume. Migrates to current schema first.
   * @param {Object} resume
   * @returns {Promise<void>}
   */
  async save(resume) {
    const migrated = migrateResume(resume);
    await resumeAdapter.put(migrated);
  },

  /**
   * Load a full resume by id. Migrates on read.
   * Returns null if not found or corrupted.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async load(id) {
    try {
      const raw = await resumeAdapter.get(id);
      if (!raw) return null;
      return migrateResume(raw);
    } catch (err) {
      console.error('Failed to load resume:', err);
      return null;
    }
  },

  /**
   * Get summaries for the Dashboard.
   * Sorted by updatedAt descending.
   * @returns {Promise<Array<{id, title, resumeLanguage, updatedAt}>>}
   */
  async listSummaries() {
    try {
      const all = await resumeAdapter.getAll();
      return all
        .map(r => ({
          id: r.id,
          title: r.title,
          resumeLanguage: r.resumeLanguage,
          updatedAt: r.updatedAt,
        }))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (err) {
      console.error('Failed to list resumes:', err);
      return [];
    }
  },

  /**
   * Delete a resume and its associated image (if any).
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    await resumeAdapter.delete(id);
  },

  /**
   * Duplicate a resume with a new id and title.
   * @param {string} id
   * @param {string} newTitle
   * @returns {Promise<Object|null>}
   */
  async duplicate(id, newTitle) {
    const original = await this.load(id);
    if (!original) return null;

    const now = new Date().toISOString();
    const copy = {
      ...original,
      id: uuid(),
      title: newTitle,
      createdAt: now,
      updatedAt: now,
    };

    await resumeAdapter.put(copy);
    return copy;
  },
};
