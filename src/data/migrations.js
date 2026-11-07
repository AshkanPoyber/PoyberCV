import { SCHEMA_VERSION } from './resume-schema.js';

/**
 * Migration chain.
 * Each migration upgrades a resume from `from` version to `from + 1`.
 * Add new migrations here as the schema evolves.
 *
 * @type {Array<{ from: number, migrate: (resume: Object) => Object }>}
 */
const migrations = [
  // Example for future:
  // {
  //   from: 1,
  //   migrate: (resume) => ({ ...resume, schemaVersion: 2, newField: '' }),
  // },
];

/**
 * Migrate a resume object to the current schema version.
 * Returns the same object if no migration is needed.
 * @param {Object} resume
 * @returns {Object}
 */
export function migrateResume(resume) {
  if (!resume || typeof resume !== 'object') {
    throw new Error('Invalid resume: not an object');
  }

  let current = resume;
  let version = Number(current.schemaVersion) || 0;

  while (version < SCHEMA_VERSION) {
    const step = migrations.find(m => m.from === version);
    if (!step) {
      throw new Error(`No migration path from schema version ${version} to ${SCHEMA_VERSION}`);
    }
    current = step.migrate(current);
    version = Number(current.schemaVersion);
  }

  if (version > SCHEMA_VERSION) {
    throw new Error(
      `Resume schema version ${version} is newer than supported version ${SCHEMA_VERSION}`
    );
  }

  return current;
}
