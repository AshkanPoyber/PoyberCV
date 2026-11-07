/**
 * Canonical resume data schema.
 * This file documents the shape — it is not a runtime validator.
 * Validation happens in resume-factory.js and migrations.js.
 *
 * Design decisions (see D5, D16, D17):
 * - content and presentation are strictly separated.
 * - resumeLanguage (content) is independent from calendarSystem (presentation).
 * - Dates are stored as "YYYY-MM-DD" (Gregorian) when precise,
 *   or "YYYY-MM" when the user only provided month/year.
 *   The `datePrecision` field on each entry records which.
 * - photos are stored as Blob in a separate IndexedDB store (D6),
 *   referenced here by `photoId` only.
 */

export const SCHEMA_VERSION = 1;

/**
 * @typedef {Object} PersonalInfo
 * @property {string} fullName
 * @property {string} jobTitle
 * @property {string} email
 * @property {string} phone
 * @property {string} location
 * @property {string} website
 * @property {string} linkedin
 * @property {string|null} photoId
 */

/**
 * @typedef {'YYYY-MM-DD'|'YYYY-MM'} DatePrecision
 */

/**
 * @typedef {Object} ExperienceEntry
 * @property {string} id
 * @property {string} company
 * @property {string} role
 * @property {string} startDate   - "YYYY-MM" or "YYYY-MM-DD"
 * @property {string|null} endDate
 * @property {boolean} current
 * @property {DatePrecision} datePrecision
 * @property {string[]} bullets
 */

/**
 * @typedef {Object} EducationEntry
 * @property {string} id
 * @property {string} institution
 * @property {string} degree
 * @property {string} field
 * @property {string} startDate
 * @property {string|null} endDate
 * @property {boolean} current
 * @property {DatePrecision} datePrecision
 * @property {string[]} bullets
 */

/**
 * @typedef {Object} SkillEntry
 * @property {string} id
 * @property {string} name
 * @property {number|null} level  - 1..5 or null
 */

/**
 * @typedef {Object} ProjectEntry
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} url
 * @property {string} startDate
 * @property {string|null} endDate
 * @property {DatePrecision} datePrecision
 * @property {string[]} bullets
 */

/**
 * @typedef {Object} CertificationEntry
 * @property {string} id
 * @property {string} name
 * @property {string} issuer
 * @property {string} date
 * @property {string} url
 */

/**
 * @typedef {Object} LanguageEntry
 * @property {string} id
 * @property {string} name
 * @property {'native'|'fluent'|'intermediate'|'basic'} proficiency
 */

/**
 * @typedef {Object} CustomSectionEntry
 * @property {string} id
 * @property {string} title
 * @property {Array<{id: string, title: string, subtitle: string, description: string}>} items
 */

/**
 * @typedef {Object} ResumeContent
 * @property {PersonalInfo} personal
 * @property {string} summary
 * @property {ExperienceEntry[]} experience
 * @property {EducationEntry[]} education
 * @property {SkillEntry[]} skills
 * @property {ProjectEntry[]} projects
 * @property {CertificationEntry[]} certifications
 * @property {LanguageEntry[]} languages
 * @property {CustomSectionEntry[]} customSections
 */

/**
 * @typedef {Object} AppearanceSettings
 * @property {string} accentColor
 * @property {'default'|'serif'|'mono'} fontPair
 * @property {'sm'|'md'|'lg'} fontSize
 * @property {'compact'|'normal'|'relaxed'} spacing
 * @property {boolean} showPhoto
 */

/**
 * @typedef {Object} ResumePresentation
 * @property {'minimal'|'modern'|'classic'|'compact'} templateId
 * @property {AppearanceSettings} appearance
 * @property {string[]} sectionOrder
 * @property {'persian'|'gregory'} calendarSystem
 */

/**
 * @typedef {Object} Resume
 * @property {number} schemaVersion
 * @property {string} id
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} title
 * @property {'fa'|'en'} resumeLanguage
 * @property {ResumeContent} content
 * @property {ResumePresentation} presentation
 */
