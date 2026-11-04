import './ui/styles/main.css';
import { t, getLocale, setLocale, initLocale } from './i18n/index.js';
import { initTheme, toggleTheme, getTheme } from './theme/index.js';
import { createElement } from './core/dom.js';

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = '';

  app.appendChild(
    createElement(
      'div',
      {
        className:
          'mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center',
      },
      createElement('h1', { className: 'text-2xl font-semibold' }, 'PoyberCV'),
      createElement('p', { className: 'text-secondary' }, t('app.placeholder')),
      createElement(
        'div',
        { className: 'flex gap-2' },
        createElement(
          'button',
          {
            type: 'button',
            className:
              'rounded-sm border border-border px-3 py-1.5 text-sm text-secondary transition-colors hover:text-primary',
            onClick: () => {
              setLocale(getLocale() === 'fa' ? 'en' : 'fa');
              render();
            },
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
              render();
            },
          },
          createElement('i', {
            className: getTheme() === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun',
          })
        )
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
  );
}

initLocale();
initTheme();
render();
