import { t } from '../i18n/index.js';
import { createElement } from '../core/dom.js';
import { emit } from '../core/event-bus.js';
import { getResumes } from '../data/store.js';
import { createResume } from '../data/resume-factory.js';
import { resumeRepository } from '../persistence/resume-repository.js';
import { flushPendingSave } from '../persistence/persistence-observer.js';
import { openModal } from '../ui/components/modal.js';
import { showToast } from '../ui/components/toast.js';
import { createEmptyState } from '../ui/components/empty-state.js';
import { loadResumeSummaries } from '../main-app.js';

/**
 * Render the Dashboard into the provided container.
 * @param {HTMLElement} container
 */
export function renderDashboard(container) {
  container.innerHTML = '';

  const resumes = getResumes();

  const header = createElement(
    'div',
    { className: 'flex items-center justify-between gap-4' },
    createElement('h1', { className: 'text-2xl font-semibold' }, t('dashboard.title')),
    createElement(
      'button',
      {
        type: 'button',
        className:
          'inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover',
        onClick: openNewResumeModal,
      },
      createElement('i', { className: 'fa-solid fa-plus' }),
      t('dashboard.new')
    )
  );

  container.appendChild(header);

  if (resumes.length === 0) {
    container.appendChild(
      createEmptyState({
        icon: 'fa-file-circle-plus',
        title: t('dashboard.empty.title'),
        description: t('dashboard.empty.desc'),
        action: {
          label: t('dashboard.empty.cta'),
          onClick: openNewResumeModal,
        },
      })
    );
    return;
  }

  const grid = createElement('div', {
    className: 'mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  });

  resumes.forEach(resume => {
    grid.appendChild(buildResumeCard(resume));
  });

  container.appendChild(grid);
}

function buildResumeCard(resume) {
  const langLabel =
    resume.resumeLanguage === 'fa' ? t('dashboard.resume.lang.fa') : t('dashboard.resume.lang.en');

  const updated = new Date(resume.updatedAt);
  const updatedStr = updated.toLocaleDateString(
    document.documentElement.lang === 'fa' ? 'fa-IR' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  return createElement(
    'div',
    {
      className:
        'group flex flex-col rounded-md border border-border bg-surface p-5 transition-shadow hover:shadow-sm',
    },
    createElement(
      'div',
      { className: 'flex items-start justify-between gap-2' },
      createElement(
        'h3',
        { className: 'font-semibold leading-snug' },
        resume.title || t('dashboard.untitled')
      ),
      createElement(
        'span',
        {
          className: 'shrink-0 rounded-sm bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent',
        },
        langLabel
      )
    ),
    createElement(
      'p',
      { className: 'mt-2 text-xs text-secondary' },
      `${t('dashboard.resume.updated')}: ${updatedStr}`
    ),
    createElement(
      'div',
      { className: 'mt-4 flex flex-wrap gap-1' },
      iconButton('fa-pen', t('dashboard.resume.edit'), () => handleEdit(resume)),
      iconButton('fa-i-cursor', t('dashboard.resume.rename'), () => openRenameModal(resume)),
      iconButton('fa-copy', t('dashboard.resume.duplicate'), () => handleDuplicate(resume)),
      iconButton('fa-trash', t('dashboard.resume.delete'), () => openDeleteModal(resume))
    )
  );
}

function iconButton(icon, label, onClick) {
  return createElement(
    'button',
    {
      type: 'button',
      className:
        'inline-flex items-center gap-1 rounded-sm border border-border px-2.5 py-1.5 text-xs text-secondary transition-colors hover:text-primary',
      onClick,
      'aria-label': label,
      title: label,
    },
    createElement('i', { className: `fa-solid ${icon}` })
  );
}

// ─────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────

function openNewResumeModal() {
  let selectedLang = 'fa';
  let titleValue = '';

  const langButtons = ['fa', 'en'].map(lang =>
    createElement(
      'button',
      {
        type: 'button',
        className: langButtonClass(lang === selectedLang),
        'data-lang': lang,
        onClick: e => {
          selectedLang = lang;
          e.currentTarget.parentElement.querySelectorAll('[data-lang]').forEach(btn => {
            btn.className = langButtonClass(btn.dataset.lang === lang);
          });
        },
      },
      t(lang === 'fa' ? 'dashboard.resume.lang.fa' : 'dashboard.resume.lang.en')
    )
  );

  const input = createElement('input', {
    type: 'text',
    className:
      'mt-2 w-full rounded-sm border border-border bg-app px-3 py-2 text-sm focus:border-accent focus:outline-none',
    placeholder: t('dashboard.new.modal.titlePlaceholder'),
    onInput: e => {
      titleValue = e.target.value;
    },
  });

  const body = createElement(
    'div',
    { className: 'mt-4' },
    createElement(
      'label',
      { className: 'block text-sm font-medium' },
      t('dashboard.new.modal.langLabel')
    ),
    createElement('div', { className: 'mt-2 flex gap-2' }, ...langButtons),
    createElement(
      'label',
      { className: 'mt-4 block text-sm font-medium' },
      t('dashboard.new.modal.titleLabel')
    ),
    input
  );

  openModal({
    title: t('dashboard.new.modal.title'),
    body,
    actions: [
      {
        label: t('dashboard.new.modal.cancel'),
        variant: 'secondary',
        onClick: () => {},
      },
      {
        label: t('dashboard.new.modal.create'),
        variant: 'primary',
        onClick: async () => {
          const resume = createResume({
            title: titleValue.trim() || t('dashboard.untitled'),
            resumeLanguage: selectedLang,
          });
          try {
            await resumeRepository.save(resume);
            await loadResumeSummaries();
            emit('app:rerender');
            showToast({ message: t('dashboard.toast.created'), type: 'success' });
          } catch {
            showToast({ message: t('dashboard.toast.saveFailed'), type: 'error' });
          }
        },
      },
    ],
  });
}

function openRenameModal(resume) {
  let newTitle = resume.title;

  const input = createElement('input', {
    type: 'text',
    className:
      'mt-2 w-full rounded-sm border border-border bg-app px-3 py-2 text-sm focus:border-accent focus:outline-none',
    value: resume.title,
    onInput: e => {
      newTitle = e.target.value;
    },
  });

  const body = createElement(
    'div',
    { className: 'mt-4' },
    createElement(
      'label',
      { className: 'block text-sm font-medium' },
      t('dashboard.rename.modal.label')
    ),
    input
  );

  openModal({
    title: t('dashboard.rename.modal.title'),
    body,
    actions: [
      {
        label: t('dashboard.new.modal.cancel'),
        variant: 'secondary',
        onClick: () => {},
      },
      {
        label: t('dashboard.rename.modal.save'),
        variant: 'primary',
        onClick: async () => {
          const loaded = await resumeRepository.load(resume.id);
          if (!loaded) return;
          const updated = {
            ...loaded,
            title: newTitle.trim() || resume.title,
            updatedAt: new Date().toISOString(),
          };
          await resumeRepository.save(updated);
          await loadResumeSummaries();
          emit('app:rerender');
          showToast({ message: t('dashboard.toast.renamed'), type: 'success' });
        },
      },
    ],
  });
}

function openDeleteModal(resume) {
  openModal({
    title: t('dashboard.delete.modal.title'),
    body: t('dashboard.delete.modal.message'),
    actions: [
      {
        label: t('dashboard.new.modal.cancel'),
        variant: 'secondary',
        onClick: () => {},
      },
      {
        label: t('dashboard.delete.modal.confirm'),
        variant: 'danger',
        onClick: async () => {
          await resumeRepository.delete(resume.id);
          await loadResumeSummaries();
          emit('app:rerender');
          showToast({ message: t('dashboard.toast.deleted'), type: 'success' });
        },
      },
    ],
  });
}

async function handleDuplicate(resume) {
  const copyTitle = `${t('dashboard.duplicate.suffix')} ${resume.title}`;
  await resumeRepository.duplicate(resume.id, copyTitle);
  await loadResumeSummaries();
  emit('app:rerender');
  showToast({ message: t('dashboard.toast.duplicated'), type: 'success' });
}

async function handleEdit(resume) {
  await flushPendingSave();
  showToast({
    message: t('dashboard.toast.editorComingSoon'),
    type: 'info',
    duration: 3000,
  });
}

function langButtonClass(active) {
  return active
    ? 'rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white'
    : 'rounded-sm border border-border px-4 py-2 text-sm text-secondary transition-colors hover:text-primary';
}
