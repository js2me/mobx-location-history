import type { QueryParamPresetConfig } from '../query-param.types.js';

export const booleanPreset: QueryParamPresetConfig<boolean> = {
  deserialize: (value) => value === '1' || value === 'true',
  serialize: (value) => {
    if (!value || value !== true) return;
    return '1';
  },
};
