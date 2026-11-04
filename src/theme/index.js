import { emit } from '../core/event-bus.js';

const STORAGE_KEY = 'poybercv:ui:theme';

let currentTheme = 'light';

/**
 * @returns {'light'|'dark'}
 */
export function getTheme() {
  return currentTheme;
}

/**
 * Apply theme class on <html>, persist, and notify.
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(STORAGE_KEY, theme);
  emit('theme:changed', theme);
}

/**
 * Toggle between light and dark.
 */
export function toggleTheme() {
  applyTheme(currentTheme === 'light' ? 'dark' : 'light');
}

/**
 * Initialize theme from LocalStorage before first render.
 * Call once at bootstrap to avoid flicker.
 */
export function initTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const theme = stored === 'dark' ? 'dark' : 'light';

  currentTheme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}
