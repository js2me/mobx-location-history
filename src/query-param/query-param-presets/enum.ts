import type { QueryParamPresetConfig } from '../query-param.types.js';

export const enumPreset = <const Values extends readonly string[]>(
  values: Values,
) => {
  type Value = Values[number];
  const valuesSet = new Set(values);

  return {
    deserialize: (value: any): Value | null => {
      return valuesSet.has(value) ? value : null;
    },
    serialize: (value: Value | undefined) => {
      if (value == null || !valuesSet.has(value)) return;
      return value;
    },
  } satisfies QueryParamPresetConfig<Value>;
};
