import type { QueryParamPresetConfig } from '../query-param.types.js';

export const jsonPreset: QueryParamPresetConfig<Record<string, any>> = {
  deserialize: (value) => {
    try {
      if (value == null || value === '') return null;
      return JSON.parse(value);
    } catch {
      return null;
    }
  },
  serialize: (value) => {
    if (!value || Object.keys(value).length === 0) return;
    return JSON.stringify(value);
  },
};
