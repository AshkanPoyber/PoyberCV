/**
 * Apply language and direction attributes on an element.
 * @param {HTMLElement} element
 * @param {'fa'|'en'} locale
 */
export function applyDirection(element, locale) {
  element.setAttribute('dir', locale === 'fa' ? 'rtl' : 'ltr');
  element.setAttribute('lang', locale);
}

/**
 * @param {'fa'|'en'} locale
 * @returns {'rtl'|'ltr'}
 */
export function getDirection(locale) {
  return locale === 'fa' ? 'rtl' : 'ltr';
}
