import { t, getLocale, setLocale } from '../i18n/index.js';
import { toggleTheme, getTheme } from '../theme/index.js';
import { createElement } from '../core/dom.js';

/**
 * Render the full Landing page into #app.
 */
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = '';
  app.appendChild(buildHeader());
  app.appendChild(buildHero());
  app.appendChild(buildFeatures());
  app.appendChild(buildTemplatesPreview());
  app.appendChild(buildCta());
  app.appendChild(buildFooter());
}

function buildHeader() {
  const locale = getLocale();

  return createElement(
    'header',
    { className: 'sticky top-0 z-10 border-b border-border bg-app/80 backdrop-blur-sm' },
    createElement(
      'div',
      { className: 'mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6' },
      createElement(
        'a',
        { href: '/', className: 'text-lg font-semibold tracking-tight' },
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
              setLocale(locale === 'fa' ? 'en' : 'fa');
              render();
            },
            'aria-label': t('lang.toggle'),
          },
          locale === 'fa' ? 'EN' : 'فا'
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
            'aria-label': t('theme.toggle'),
          },
          createElement('i', {
            className: getTheme() === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun',
          })
        ),
        createElement(
          'a',
          {
            href: '/app.html',
            className:
              'rounded-sm bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover',
          },
          t('nav.start')
        )
      )
    )
  );
}

function buildHero() {
  return createElement(
    'section',
    { className: 'mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28' },
    createElement(
      'div',
      { className: 'mx-auto max-w-2xl text-center' },
      createElement(
        'h1',
        { className: 'text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl' },
        t('landing.hero.title')
      ),
      createElement(
        'p',
        { className: 'mt-4 text-base leading-relaxed text-secondary sm:text-lg' },
        t('landing.hero.subtitle')
      ),
      createElement(
        'a',
        {
          href: '/app.html',
          className:
            'mt-8 inline-block rounded-sm bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover',
        },
        t('landing.hero.cta')
      )
    )
  );
}

function buildFeatures() {
  const features = [
    { icon: 'language', key: 'bilingual' },
    { icon: 'eye', key: 'preview' },
    { icon: 'file-pdf', key: 'pdf' },
    { icon: 'layer-group', key: 'templates' },
  ];

  return createElement(
    'section',
    { className: 'border-t border-border bg-surface py-16 sm:py-20' },
    createElement(
      'div',
      { className: 'mx-auto max-w-6xl px-4 sm:px-6' },
      createElement(
        'h2',
        { className: 'text-center text-2xl font-semibold sm:text-3xl' },
        t('landing.features.title')
      ),
      createElement(
        'div',
        { className: 'mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4' },
        ...features.map(({ icon, key }) =>
          createElement(
            'div',
            {
              className:
                'rounded-md border border-border bg-app p-6 transition-shadow hover:shadow-sm',
            },
            createElement(
              'div',
              { className: 'flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10' },
              createElement('i', { className: `fa-solid fa-${icon} text-accent text-lg` })
            ),
            createElement(
              'h3',
              { className: 'mt-4 text-base font-semibold' },
              t(`landing.features.${key}.title`)
            ),
            createElement(
              'p',
              { className: 'mt-1.5 text-sm leading-relaxed text-secondary' },
              t(`landing.features.${key}.desc`)
            )
          )
        )
      )
    )
  );
}

function buildTemplatesPreview() {
  return createElement(
    'section',
    { className: 'py-16 sm:py-20' },
    createElement(
      'div',
      { className: 'mx-auto max-w-6xl px-4 sm:px-6' },
      createElement(
        'h2',
        { className: 'text-center text-2xl font-semibold sm:text-3xl' },
        t('landing.templates.title')
      ),
      createElement(
        'div',
        { className: 'mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4' },
        ...[1, 2, 3, 4].map(i =>
          createElement(
            'div',
            {
              className:
                'aspect-[3/4] rounded-md border border-border bg-surface p-4 transition-shadow hover:shadow-md',
            },
            createElement(
              'div',
              { className: 'flex h-full flex-col gap-2' },
              createElement('div', { className: 'h-2 w-1/2 rounded-sm bg-accent/30' }),
              createElement('div', { className: 'h-1.5 w-3/4 rounded-sm bg-border' }),
              createElement('div', { className: 'mt-2 h-1 w-full rounded-sm bg-border' }),
              createElement('div', { className: 'h-1 w-5/6 rounded-sm bg-border' }),
              createElement('div', { className: 'h-1 w-4/6 rounded-sm bg-border' }),
              createElement('div', { className: 'mt-auto h-1.5 w-1/3 rounded-sm bg-accent/20' })
            )
          )
        )
      )
    )
  );
}

function buildCta() {
  return createElement(
    'section',
    { className: 'border-t border-border bg-surface py-16 sm:py-20' },
    createElement(
      'div',
      { className: 'mx-auto max-w-2xl px-4 text-center sm:px-6' },
      createElement(
        'h2',
        { className: 'text-2xl font-semibold sm:text-3xl' },
        t('landing.cta.title')
      ),
      createElement(
        'a',
        {
          href: '/app.html',
          className:
            'mt-6 inline-block rounded-sm bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover',
        },
        t('landing.cta.button')
      )
    )
  );
}

function buildFooter() {
  return createElement(
    'footer',
    { className: 'border-t border-border py-8' },
    createElement(
      'div',
      { className: 'mx-auto max-w-6xl px-4 text-center text-sm text-secondary sm:px-6' },
      `© ${new Date().getFullYear()} PoyberCV`
    )
  );
}

// Bootstrap
import { initLocale } from '../i18n/index.js';
import { initTheme } from '../theme/index.js';

initLocale();
initTheme();
render();
