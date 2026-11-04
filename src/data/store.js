import { emit } from '../core/event-bus.js';

/**
 * Single source of truth for UI state in v0.1.
 * Resume data domain will be added in v0.2.
 */
const state = {
  ui: {
    locale: 'fa',
    theme: 'light',
  },
};

/**
 * Immutable update of a UI preference.
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
