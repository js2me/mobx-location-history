import { AnyObject } from 'yammies/utils/types';

export const buildSearchString = (data: AnyObject) => {
  const fixedData: AnyObject = {};

  for (const [key, value] of Object.entries(data)) {
    if (value != null) {
      fixedData[key] = value;
    }
  }

  const urlSearchParams = new URLSearchParams(fixedData);

  return urlSearchParams.size > 0 ? `?${urlSearchParams}` : '';
};
