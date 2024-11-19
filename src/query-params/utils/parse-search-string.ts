/**
 * Converts a URL search string into an object.
 *
 * @example
 * // returns { foo: 'bar', baz: 'qux' }
 * parseSearchString('?foo=bar&baz=qux');
 *
 * @example
 * // returns { foo: 'bar', baz: 'qux' }
 * parseSearchString('foo=bar&baz=qux');
 *
 * @param {string} search - A URL search string.
 * @returns {Record<string, string>} - An object of parameters.
 */
export const parseSearchString = (search: string) => {
  const params = new URLSearchParams(search);
  return Object.fromEntries(params.entries());
};
