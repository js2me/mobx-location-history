import { stringify } from 'qs';

const defaultBuildOptions = {
  addQueryPrefix: true,
  skipNulls: true,
  arrayFormat: 'comma',
} as const;

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
  return stringify(
    data,
    options ? { ...defaultBuildOptions, ...options } : defaultBuildOptions,
  );
};
