import type { QueryParamPresetConfig } from '../query-param.types.js';

export const stringArrPreset: QueryParamPresetConfig<string[], 'string[]'> = {
  presetName: 'string[]',
  deserialize: (value) => value?.split(',') ?? null,
  serialize: (value) => {
    if (!value?.length) return;
    return value.join(',');
  },
};
