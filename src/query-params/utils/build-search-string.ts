/**
 * Converts an object into a URL search string.
 * Filters out entries with null or undefined values.
 *
 * @param {AnyObject} data - The data object to convert.
 * @returns {string} A URL search string starting with '?' if parameters exist, otherwise an empty string.
 *
 * @example
 * // returns "?foo=bar&baz=qux"
 * buildSearchString({ foo: 'bar', baz: 'qux', unset: null });
 *
 * @example
 * // returns ""
 * buildSearchString({ unset: null, other: undefined });
 */
export const buildSearchString = (data: Record<string, any>) => {
  const fixedData: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value != null) {
      fixedData[key] = value;
    }
  }

  const urlSearchParams = new URLSearchParams(fixedData);

  return urlSearchParams.size > 0 ? `?${urlSearchParams}` : '';
};
