/**
 * Minimal sprintf supporting %d (integer) placeholders.
 * @param {string} format
 * @param {...(number|string)} args
 * @returns {string}
 */
export function sprintf(format, ...args) {
  let i = 0;
  return format.replace(/%d/g, () => {
    const val = args[i++];
    return val != null ? String(Math.floor(Number(val))) : '';
  });
}
