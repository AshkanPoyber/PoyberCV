import { createElement } from '../../core/dom.js';

/**
 * Open a modal dialog.
 * - Traps focus inside the modal
 * - Closes on Escape or backdrop click
 * - Restores focus to the previously focused element on close
 *
 * @param {Object} options
 * @param {string} options.title
 * @param {Node|string} options.body
 * @param {Array<{label: string, variant?: 'primary'|'secondary'|'danger', onClick: () => void}>} options.actions
 * @param {() => void} [options.onClose]
 * @returns {{ close: () => void, element: HTMLElement }}
 */
export function openModal({ title, body, actions, onClose }) {
  const previouslyFocused = document.activeElement;

  const overlay = createElement('div', {
    className:
      'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'modal-title',
  });

  const dialog = createElement('div', {
    className: 'w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-md',
  });

  const header = createElement(
    'div',
    { className: 'flex items-start justify-between gap-4' },
    createElement('h2', { id: 'modal-title', className: 'text-lg font-semibold' }, title),
    createElement(
      'button',
      {
        type: 'button',
        className: 'rounded-sm p-1 text-secondary transition-colors hover:text-primary',
        'aria-label': 'Close',
        onClick: () => close(),
      },
      createElement('i', { className: 'fa-solid fa-xmark' })
    )
  );

  const bodyEl =
    typeof body === 'string'
      ? createElement('p', { className: 'mt-3 text-sm text-secondary' }, body)
      : body;

  const actionsEl = createElement(
    'div',
    { className: 'mt-6 flex justify-end gap-2' },
    ...actions.map(({ label, variant = 'secondary', onClick }) =>
      createElement(
        'button',
        {
          type: 'button',
          className: buttonClass(variant),
          onClick: async () => {
            await onClick();
            close();
          },
        },
        label
      )
    )
  );

  dialog.appendChild(header);
  dialog.appendChild(bodyEl);
  dialog.appendChild(actionsEl);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // Focus trap
  const focusable = dialog.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];
  firstFocusable?.focus();

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  function handleBackdropClick(e) {
    if (e.target === overlay) close();
  }

  document.addEventListener('keydown', handleKeyDown);
  overlay.addEventListener('click', handleBackdropClick);

  function close() {
    document.removeEventListener('keydown', handleKeyDown);
    overlay.removeEventListener('click', handleBackdropClick);
    overlay.remove();
    previouslyFocused?.focus?.();
    onClose?.();
  }

  return { close, element: overlay };
}

function buttonClass(variant) {
  const base = 'rounded-sm px-4 py-2 text-sm font-medium transition-colors';
  if (variant === 'primary') {
    return `${base} bg-accent text-white hover:bg-accent-hover`;
  }
  if (variant === 'danger') {
    return `${base} bg-danger text-white hover:opacity-90`;
  }
  return `${base} border border-border text-secondary hover:text-primary`;
}
