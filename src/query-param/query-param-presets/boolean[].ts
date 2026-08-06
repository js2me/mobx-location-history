import type { QueryParamPresetConfig } from '../query-param.types.js';

export const booleanArrPreset: QueryParamPresetConfig<boolean[], 'boolean[]'> =
  {
    presetName: 'boolean[]',
    deserialize: (value) => {
      if (!value) return null;

      const values = value.split(',');
      if (values.some((item: string) => item !== '1' && item !== '0')) {
        return null;
      }

      return values.map((item: string) => item === '1');
    },
    serialize: (value) => {
      if (!value?.length) return;
      return value.map((item: boolean) => (item ? '1' : '0')).join(',');
    },
  };
