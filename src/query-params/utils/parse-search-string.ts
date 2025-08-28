/**
 * Converts a URL search string into an object.
 *
 * [**Documentation**](https://js2me.github.io/mobx-location-history/utilities/parseSearchString)
 */
export const parseSearchString = (search: string) => {
  const params = new URLSearchParams(search);
  return Object.fromEntries(params.entries());
};
