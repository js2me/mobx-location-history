import { parse } from 'qs';

export type ParsedSearchString = Record<string, string>;

/**
 * Converts a URL search string into an object.
 *
 * [**Documentation**](https://js2me.github.io/mobx-location-history/utilities/parseSearchString)
 */
export const parseSearchString = <TResult = ParsedSearchString>(
  search: string,
  options?: Parameters<typeof parse>[1],
): TResult => {
  return parse(search, { ignoreQueryPrefix: true, ...options }) as TResult;
};
