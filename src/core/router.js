import { emit } from './event-bus.js';

/**
 * Minimal hash-based router.
 * Routes are registered as { pattern, handler }.
 * Pattern supports simple params like '/editor/:id'.
 */

const routes = [];
let currentHandler = null;

/**
 * Register a route.
 * @param {string} pattern - e.g. '/dashboard', '/editor/:id'
 * @param {(params: Object) => void} handler
 */
export function registerRoute(pattern, handler) {
  routes.push({ pattern: compilePattern(pattern), handler });
}

/**
 * Start the router: listen to hashchange and render current route.
 */
export function startRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

/**
 * Navigate to a hash path.
 * @param {string} path - e.g. '/dashboard'
 */
export function navigate(path) {
  window.location.hash = path;
}

function compilePattern(pattern) {
  const paramNames = [];
  const regexStr =
    '^' +
    pattern
      .replace(/\/:([^/]+)/g, (_, name) => {
        paramNames.push(name);
        return '/([^/]+)';
      })
      .replace(/\//g, '\\/') +
    '$';

  return { regex: new RegExp(regexStr), paramNames };
}

function parseHash() {
  const hash = window.location.hash.replace(/^#/, '') || '/dashboard';
  return hash;
}

function handleRoute() {
  const path = parseHash();

  for (const route of routes) {
    const match = path.match(route.pattern.regex);
    if (match) {
      const params = {};
      route.pattern.paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });

      if (currentHandler !== route.handler) {
        currentHandler = route.handler;
        emit('route:changed', { path, params });
      }

      route.handler(params);
      return;
    }
  }

  // Default fallback
  navigate('/dashboard');
}
