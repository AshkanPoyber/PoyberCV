import './ui/styles/main.css';
import { t, initLocale } from './i18n/index.js';
import { initTheme, toggleTheme, getTheme } from './theme/index.js';
import { getLocale, setLocale } from './i18n/index.js';
import { createElement } from './core/dom.js';
import { registerRoute, startRouter, navigate } from './core/router.js';
import {
  startPersistence,
  loadInitialState,
  flushPendingSave,
} from './persistence/persistence-observer.js';
import { renderDashboard } from './pages/dashboard.js';
import { showToast } from './ui/components/toast.js';

/**
 * Render the app shell (header + content area).
 * @param {Node} content
 */
function renderShell(content) {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = '';

  app.appendChild(buildHeader());

  const main = createElement('main', { className: 'mx-auto max-w-6xl px-4 py-8 sm:px-6' }, content);

  app.appendChild(main);
}

function buildHeader() {
  return createElement(
    'header',
    { className: 'sticky top-0 z-10 border-b border-border bg-app/80 backdrop-blur-sm' },
    createElement(
      'div',
      {
        className: 'mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6',
      },
      createElement(
        'a',
        {
          href: '#/dashboard',
          className: 'text-lg font-semibold tracking-tight',
        },
        'PoyberCV'
      ),
      createElement(
        'nav',
        { className: 'flex items-center gap-2' },
        createElement(
          'button',
          {
            type: 'button',
            className:
              'rounded-sm border border-border px-3 py-1.5 text-sm text-secondary transition-colors hover:text-primary',
            onClick: () => {
              setLocale(getLocale() === 'fa' ? 'en' : 'fa');
              rerenderCurrentRoute();
            },
            'aria-label': t('lang.toggle'),
          },
          getLocale() === 'fa' ? 'EN' : 'فا'
        ),
        createElement(
          'button',
          {
            type: 'button',
            className:
              'rounded-sm border border-border px-3 py-1.5 text-sm text-secondary transition-colors hover:text-primary',
            onClick: () => {
              toggleTheme();
              rerenderCurrentRoute();
            },
            'aria-label': t('theme.toggle'),
          },
          createElement('i', {
            className: getTheme() === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun',
          })
        ),
        createElement(
          'a',
          {
            href: '/',
            className: 'text-sm text-accent transition-colors hover:text-accent-hover',
          },
          t('nav.back')
        )
      )
    )
  );
}

// ─────────────────────────────────────────────────────────
// Routing
// ─────────────────────────────────────────────────────────

let currentRoute = null;

export function rerenderCurrentRoute() {
  if (currentRoute) currentRoute();
}

registerRoute('/dashboard', () => {
  currentRoute = () => {
    const container = createElement('div');
    renderDashboard(container);
    renderShell(container);
  };
  currentRoute();
});

// Fallback: unknown routes go to dashboard
registerRoute('/editor/:id', ({ id }) => {
  // Editor will be implemented in v0.3
  // For now, redirect back to dashboard
  console.warn(`Editor not implemented yet (id=${id})`);
  navigate('/dashboard');
});

// ─────────────────────────────────────────────────────────
// Bootstrap
// ─────────────────────────────────────────────────────────

/**
 * Load resume summaries from IndexedDB into the store.
 * Exposed for Dashboard to refresh after mutations.
 * @returns {Promise<void>}
 */
export async function loadResumeSummaries() {
  await loadInitialState();
}

/**
 * Navigate to editor route (placeholder for v0.3).
 * @param {string} id
 */
export function navigateToEditor(id) {
  navigate(`/editor/${id}`);
}

/**
 * Force a rerender of the current route.
 */
export function rerenderApp() {
  rerenderCurrentRoute();
}

import { on } from './core/event-bus.js';

async function bootstrap() {
  initLocale();
  initTheme();

  startPersistence({
    onError: err => {
      if (err.code === 'QUOTA_EXCEEDED') {
        showToast({ message: t('dashboard.toast.quota'), type: 'error', duration: 6000 });
      } else {
        showToast({ message: t('dashboard.toast.saveFailed'), type: 'error' });
      }
    },
  });

  // Listen for rerender requests from other modules (avoids circular imports)
  on('app:rerender', () => rerenderCurrentRoute());

  await loadInitialState();
  startRouter();
}

bootstrap();
