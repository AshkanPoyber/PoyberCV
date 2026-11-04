import fa from './locales/fa.json';
import en from './locales/en.json';
import { applyDirection } from './direction.js';
import { emit } from '../core/event-bus.js';

const locales = { fa, en };
const STORAGE_KEY = 'poybercv:ui:locale';

let currentLocale = 'fa';
let translations = fa;

/**
 * Translate a key. Falls back to the key itself if not found.
 * @param {string} key
 * @returns {string}
 */
export function t(key) {
  return translations[key] ?? key;
}

/**
 * @returns {'fa'|'en'}
 */
export function getLocale() {
  return currentLocale;
}

/**
 * Change locale, update DOM attributes, persist, and notify subscribers.
 * @param {'fa'|'en'} locale
 */
export function setLocale(locale) {
  if (!locales[locale] || locale === currentLocale) return;

  currentLocale = locale;
  translations = locales[locale];

  applyDirection(document.documentElement, locale);
  localStorage.setItem(STORAGE_KEY, locale);
  emit('locale:changed', locale);
}

/**
 * Initialize locale from LocalStorage before first render.
 * Call once at bootstrap to avoid flicker.
 */
export function initLocale() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const locale = stored && locales[stored] ? stored : 'fa';

  currentLocale = locale;
  translations = locales[locale];
  applyDirection(document.documentElement, locale);
}
