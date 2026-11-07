import { emit } from '../core/event-bus.js';

/**
 * Single source of truth.
 *
 * Three independent domains (D17):
 * - ui: lightweight preferences (locale, theme). Persisted to LocalStorage.
 * - resumes: summary list of all resumes (for Dashboard). Loaded from IndexedDB.
 * - activeResume: full data of the resume currently being edited.
 *
 * Channels:
 * - 'ui:changed'           → subscribe for UI preference changes
 * - 'resumes:changed'      → subscribe for dashboard list changes
 * - 'resume:content'       → subscribe for content changes (triggers persistence)
 * - 'resume:presentation'  → subscribe for presentation changes (triggers persistence)
 */

const state = {
  ui: {
    locale: 'fa',
    theme: 'light',
  },
  resumes: [],
  activeResume: null,
};

// ─────────────────────────────────────────────────────────
// UI preferences
// ─────────────────────────────────────────────────────────

/**
 * @param {'locale'|'theme'} key
 * @param {string} value
 */
export function setUiPreference(key, value) {
  if (state.ui[key] === value) return;
  state.ui = { ...state.ui, [key]: value };
  emit('ui:changed', { ...state.ui });
}

/**
 * @returns {{ locale: string, theme: string }}
 */
export function getUiState() {
  return { ...state.ui };
}

// ─────────────────────────────────────────────────────────
// Resumes list (Dashboard)
// ─────────────────────────────────────────────────────────

/**
 * Replace the resumes summary list.
 * @param {Array<{id: string, title: string, resumeLanguage: string, updatedAt: string}>} resumes
 */
export function setResumes(resumes) {
  state.resumes = resumes;
  emit('resumes:changed', [...resumes]);
}

/**
 * @returns {Array}
 */
export function getResumes() {
  return [...state.resumes];
}

// ─────────────────────────────────────────────────────────
// Active resume
// ─────────────────────────────────────────────────────────

/**
 * Load a full resume into the active slot.
 * @param {Object|null} resume
 */
export function setActiveResume(resume) {
  state.activeResume = resume;
  if (resume) {
    emit('resume:content', resume.content);
    emit('resume:presentation', resume.presentation);
  }
}

/**
 * @returns {Object|null}
 */
export function getActiveResume() {
  return state.activeResume;
}

/**
 * Immutable update of active resume content.
 * Emits 'resume:content' and triggers persistence.
 * @param {Partial<Object>} patch
 */
export function updateActiveResumeContent(patch) {
  if (!state.activeResume) return;

  state.activeResume = {
    ...state.activeResume,
    content: { ...state.activeResume.content, ...patch },
    updatedAt: new Date().toISOString(),
  };

  emit('resume:content', state.activeResume.content);
}

/**
 * Immutable update of active resume presentation.
 * Emits 'resume:presentation' and triggers persistence.
 * @param {Partial<Object>} patch
 */
export function updateActiveResumePresentation(patch) {
  if (!state.activeResume) return;

  state.activeResume = {
    ...state.activeResume,
    presentation: { ...state.activeResume.presentation, ...patch },
    updatedAt: new Date().toISOString(),
  };

  emit('resume:presentation', state.activeResume.presentation);
}

/**
 * Immutable update of resume metadata (title).
 * Emits 'resume:content' since title is part of persisted resume.
 * @param {string} title
 */
export function updateActiveResumeTitle(title) {
  if (!state.activeResume) return;

  state.activeResume = {
    ...state.activeResume,
    title,
    updatedAt: new Date().toISOString(),
  };

  emit('resume:content', state.activeResume.content);
}
