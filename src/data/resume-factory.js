import { uuid } from '../core/uuid.js';
import { SCHEMA_VERSION } from './resume-schema.js';

/**
 * Create a new resume with default values.
 * @param {Object} options
 * @param {string} [options.title]
 * @param {'fa'|'en'} [options.resumeLanguage]
 * @returns {Resume}
 */
export function createResume({ title = 'Untitled Resume', resumeLanguage = 'fa' } = {}) {
  const now = new Date().toISOString();

  return {
    schemaVersion: SCHEMA_VERSION,
    id: uuid(),
    createdAt: now,
    updatedAt: now,
    title,
    resumeLanguage,
    content: createEmptyContent(),
    presentation: createDefaultPresentation(),
  };
}

function createEmptyContent() {
  return {
    personal: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      photoId: null,
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    customSections: [],
  };
}

function createDefaultPresentation() {
  return {
    templateId: 'minimal',
    appearance: {
      accentColor: '#047857',
      fontPair: 'default',
      fontSize: 'md',
      spacing: 'normal',
      showPhoto: true,
    },
    sectionOrder: [
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages',
    ],
    calendarSystem: 'persian',
  };
}
