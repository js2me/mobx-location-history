import { stringify } from 'qs';

/**
 * Converts an object into a URL search string.
 * Filters out entries with null or undefined values.
 *
 * [**Documentation**](https://js2me.github.io/mobx-location-history/utilities/buildSearchString)
 */
export const buildSearchString = (
  data: Record<string, any>,
  options?: Parameters<typeof stringify>[1],
) => {
  return stringify(data, {
    addQueryPrefix: true,
    skipNulls: true,
    arrayFormat: 'comma',
    ...options,
  });
};
