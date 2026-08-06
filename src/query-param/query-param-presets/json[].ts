import type { QueryParamPresetConfig } from '../query-param.types.js';

export const jsonArrPreset: QueryParamPresetConfig<
  Record<string, any>[],
  'json[]'
> = {
  presetName: 'json[]',
  deserialize: (value) => {
    if (!value) return null;

    try {
      const result = JSON.parse(value);
      return Array.isArray(result) ? result : null;
    } catch {
      return null;
    }
  },
  serialize: (value) => {
    if (!value?.length) return;
    return JSON.stringify(value);
  },
};
