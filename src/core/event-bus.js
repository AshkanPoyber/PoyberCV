/**
 * Minimal pub/sub for cross-module communication.
 * Kept intentionally simple — no wildcard events, no async.
 */
const listeners = new Map();

/**
 * Subscribe to an event.
 * @param {string} event
 * @param {Function} callback
 * @returns {Function} unsubscribe function
 */
export function on(event, callback) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event).add(callback);
  return () => listeners.get(event)?.delete(callback);
}

/**
 * Emit an event to all subscribers.
 * @param {string} event
 * @param {*} payload
 */
export function emit(event, payload) {
  listeners.get(event)?.forEach(cb => cb(payload));
}
