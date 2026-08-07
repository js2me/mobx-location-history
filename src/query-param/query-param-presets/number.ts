import { typeGuard } from 'yummies/type-guard';
import type { QueryParamPresetConfig } from '../query-param.types.js';

export const numberPreset: QueryParamPresetConfig<number> = {
  deserialize: (value) => {
    if (value === '' || !typeGuard.isNumber(+value)) return null;
    return +value;
  },
  serialize: (value) => {
    if (value == null) return;
    return value;
  },
};
