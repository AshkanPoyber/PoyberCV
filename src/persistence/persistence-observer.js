import { on } from '../core/event-bus.js';
import { getActiveResume, setResumes, getUiState, getResumes } from '../data/store.js';
import { resumeRepository } from './resume-repository.js';
import { localStorageAdapter } from './localstorage-adapter.js';
import { QuotaExceededError } from './storage-adapter.js';

const DEBOUNCE_MS = 500;
const UI_LOCALE_KEY = 'ui:locale';
const UI_THEME_KEY = 'ui:theme';

let saveTimer = null;
let onSaveError = null;

/**
 * Start observing store changes and persisting them.
 * @param {Object} options
 * @param {(error: Error) => void} [options.onError] - called on save failure
 */
export function startPersistence({ onError } = {}) {
  onSaveError = onError || null;

  // Resume content and presentation → debounced IndexedDB save
  on('resume:content', scheduleResumeSave);
  on('resume:presentation', scheduleResumeSave);

  // UI preferences → immediate LocalStorage save
  on('ui:changed', persistUIPreferences);
}

/**
 * Schedule a debounced save of the active resume.
 */
function scheduleResumeSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(flushResumeSave, DEBOUNCE_MS);
}

/**
 * Perform the actual save (or fail gracefully).
 */
async function flushResumeSave() {
  saveTimer = null;
  const resume = getActiveResume();
  if (!resume) return;

  try {
    await resumeRepository.save(resume);
    await refreshResumeSummaries();
  } catch (err) {
    handleSaveError(err);
  }
}

/**
 * Immediately flush any pending save. Useful before navigation.
 * @returns {Promise<void>}
 */
export async function flushPendingSave() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  await flushResumeSave();
}

/**
 * Reload the resume summaries list from IndexedDB into the store.
 * @returns {Promise<void>}
 */
async function refreshResumeSummaries() {
  const summaries = await resumeRepository.listSummaries();
  setResumes(summaries);
}

/**
 * Persist UI preferences to LocalStorage.
 */
function persistUIPreferences() {
  const ui = getUiState();
  try {
    localStorageAdapter.set(UI_LOCALE_KEY, ui.locale);
    localStorageAdapter.set(UI_THEME_KEY, ui.theme);
  } catch (err) {
    handleSaveError(err);
  }
}

/**
 * Initial load: load summaries and UI preferences from storage.
 * Call once at app bootstrap.
 */
export async function loadInitialState() {
  // UI preferences
  const storedLocale = localStorageAdapter.get(UI_LOCALE_KEY);
  const storedTheme = localStorageAdapter.get(UI_THEME_KEY);
  // Note: i18n and theme modules already init from raw localStorage
  // (they use their own keys). We keep this in sync for the Store.

  // Resume summaries
  await refreshResumeSummaries();

  return { storedLocale, storedTheme };
}

/**
 * Centralized save error handling.
 * @param {Error} err
 */
function handleSaveError(err) {
  console.error('Persistence error:', err);

  if (onSaveError) {
    if (err instanceof QuotaExceededError) {
      onSaveError({
        code: 'QUOTA_EXCEEDED',
        message: 'Storage quota exceeded',
        original: err,
      });
    } else {
      onSaveError({
        code: 'SAVE_FAILED',
        message: 'Failed to save',
        original: err,
      });
    }
  }
}

/**
 * @returns {number} number of resumes currently in memory
 */
export function getResumeCount() {
  return getResumes().length;
}
