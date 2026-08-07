import type { QueryParamPresetConfig } from '../query-param.types.js';

export const datePreset: QueryParamPresetConfig<Date> = {
  deserialize: (value) => {
    if (!value) return null;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  },
  serialize: (value) => {
    if (value == null || Number.isNaN(value.getTime())) return;
    return value.toISOString();
  },
};
