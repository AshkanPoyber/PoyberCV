import { createElement } from '../../core/dom.js';

/**
 * Render an empty state block.
 * @param {Object} options
 * @param {string} options.icon - Font Awesome class, e.g. 'fa-file-circle-plus'
 * @param {string} options.title
 * @param {string} [options.description]
 * @param {{label: string, onClick: () => void}} [options.action]
 * @returns {HTMLElement}
 */
export function createEmptyState({ icon, title, description, action }) {
  const children = [
    createElement(
      'div',
      {
        className: 'flex h-16 w-16 items-center justify-center rounded-full bg-accent/10',
      },
      createElement('i', { className: `fa-solid ${icon} text-2xl text-accent` })
    ),
    createElement('h3', { className: 'mt-4 text-lg font-semibold' }, title),
  ];

  if (description) {
    children.push(
      createElement('p', { className: 'mt-2 max-w-md text-sm text-secondary' }, description)
    );
  }

  if (action) {
    children.push(
      createElement(
        'button',
        {
          type: 'button',
          className:
            'mt-6 rounded-sm bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover',
          onClick: action.onClick,
        },
        action.label
      )
    );
  }

  return createElement(
    'div',
    {
      className: 'flex flex-col items-center justify-center px-4 py-16 text-center',
    },
    ...children
  );
}
