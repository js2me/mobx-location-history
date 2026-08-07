import type { QueryParamPresetConfig } from '../query-param.types.js';

export const stringArrPreset: QueryParamPresetConfig<string[]> = {
  deserialize: (value) => value?.split(',') ?? null,
  serialize: (value) => {
    if (!value?.length) return;
    return value.join(',');
  },
};
