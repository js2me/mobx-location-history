import type { QueryParamPresetConfig } from '../query-param.types.js';

export const createEnumPreset = <const Values extends readonly string[]>(
  values: Values,
) => {
  type Value = Values[number];

  return {
    presetName: 'enum' as const,
    deserialize: (value: any): Value | null => {
      return values.includes(value) ? value : null;
    },
    serialize: (value: Value | undefined) => {
      if (value == null || !values.includes(value)) return;
      return value;
    },
  } satisfies QueryParamPresetConfig<Value, 'enum'>;
};
