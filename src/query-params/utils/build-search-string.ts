/**
 * Converts an object into a URL search string.
 * Filters out entries with null or undefined values.
 *
 * [**Documentation**](https://js2me.github.io/mobx-location-history/utilities/buildSearchString)
 */
export const buildSearchString = (data: Record<string, any>) => {
  const fixedData: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      let stringifiedValue: string;

      if (Array.isArray(value)) {
        stringifiedValue = value.join(',');
      } else {
        stringifiedValue = String(value);
      }

      fixedData[key] = stringifiedValue;
    }
  }

  const urlSearchParams = new URLSearchParams(fixedData);

  return urlSearchParams.size > 0 ? `?${urlSearchParams}` : '';
};
