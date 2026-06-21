

/**
 * Creates a standard API response
 * @param {boolean} success
 * @param {string} message
 * @param {any} data
 * @param {string|null} error
 * @returns {Object}
 */
export const apiResponse = (
  success,
  message,
  data = null,
  error = null
) => ({
  success,
  message,
  data,
  error
});