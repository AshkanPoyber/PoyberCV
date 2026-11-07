import { emit } from '../core/event-bus.js';
import { localStorageAdapter } from '../persistence/localstorage-adapter.js';

const STORAGE_KEY = 'ui:theme';

let currentTheme = 'light';

/**
 * @returns {'light'|'dark'}
 */
export function getTheme() {
  return currentTheme;
}

/**
 * Apply theme class on <html>, persist, notify.
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorageAdapter.set(STORAGE_KEY, theme);
  emit('theme:changed', theme);
}

/**
 * Toggle between light and dark.
 */
export function toggleTheme() {
  applyTheme(currentTheme === 'light' ? 'dark' : 'light');
}

/**
 * Initialize theme from storage before first render.
 * Call once at bootstrap to avoid flicker.
 */
export function initTheme() {
  const stored = localStorageAdapter.get(STORAGE_KEY);
  const theme = stored === 'dark' ? 'dark' : 'light';

  currentTheme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}
