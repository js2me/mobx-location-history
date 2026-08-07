import { typeGuard } from 'yummies/type-guard';
import type { QueryParamPresetConfig } from '../query-param.types.js';
import { stringArrPreset } from './string-array.js';

export const numberArrPreset: QueryParamPresetConfig<number[]> = {
  deserialize: (raw): any => {
    const rawItems = stringArrPreset.deserialize(raw);

    if (!rawItems) return rawItems;

    const result: any[] = [];

    for (const item of rawItems) {
      if (item === '' || !typeGuard.isNumber(+item)) return null;
      result.push(+item);
    }
    return result;
  },
  serialize: (value) => {
    if (!value?.length) return;
    return value.join(',');
  },
};
