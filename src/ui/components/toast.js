import { createElement } from '../../core/dom.js';

const CONTAINER_ID = 'toast-container';
const DEFAULT_DURATION = 4000;

/**
 * Show a toast notification.
 * @param {Object} options
 * @param {string} options.message
 * @param {'success'|'error'|'info'} [options.type]
 * @param {number} [options.duration] - ms, default 4000
 */
export function showToast({ message, type = 'info', duration = DEFAULT_DURATION }) {
  const container = getOrCreateContainer();

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    info: 'fa-circle-info',
  };

  const colors = {
    success: 'text-success',
    error: 'text-danger',
    info: 'text-accent',
  };

  const toast = createElement(
    'div',
    {
      className:
        'pointer-events-auto flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3 shadow-md',
      role: 'status',
      'aria-live': 'polite',
    },
    createElement('i', { className: `fa-solid ${icons[type]} ${colors[type]}` }),
    createElement('span', { className: 'text-sm' }, message)
  );

  container.appendChild(toast);

  const timeout = setTimeout(() => remove(), duration);

  function remove() {
    clearTimeout(timeout);
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 150ms';
    setTimeout(() => toast.remove(), 150);
  }

  toast.addEventListener('click', remove);
}

function getOrCreateContainer() {
  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = createElement('div', {
      id: CONTAINER_ID,
      className: 'pointer-events-none fixed bottom-4 end-4 z-[60] flex flex-col gap-2',
    });
    document.body.appendChild(container);
  }
  return container;
}
