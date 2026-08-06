import type { QueryParamPresetConfig } from '../query-param.types.js';

export const stringPreset: QueryParamPresetConfig<string, 'string'> = {
  presetName: 'string',
  deserialize: (value) => value ?? null,
  serialize: (value) => {
    if (value == null) return;
    return value;
  },
};
