import { typeGuard } from 'yummies/type-guard';

import { QueryParamsFieldModelConfig } from './query-param.types.js';

/*#__PURE__*/
export const queryParamPresets = {
  'string[]': {
    deserialize: (value) => value?.split(',') ?? null,
    serialize: (value) => {
      if (!value?.length) return;
      return value.join(',');
    },
  },
  'number[]': {
    deserialize: (raw): any => {
      const rawItems = queryParamPresets['string[]'].deserialize(raw);

      if (!rawItems) return rawItems;

      const result: any[] = [];

      for (const item of rawItems) {
        if (item !== '' && typeGuard.isNumber(+item)) {
          result.push(+item);
        }
      }
      return result;
    },
    serialize: (value): any => queryParamPresets['string[]'].serialize(value),
  },
  string: {
    deserialize: (value) => value ?? null,
    serialize: (value) => {
      if (!value) return;
      return value;
    },
  },
  boolean: {
    deserialize: (value) => value === '1',
    serialize: (value) => {
      if (!value || value !== true) return;
      return '1';
    },
  },
  number: {
    deserialize: (value) => {
      if (value === '' || !typeGuard.isNumber(+value)) return null;
      return +value;
    },
    serialize: (value) => {
      if (!value) return;
      return value;
    },
  },
  json: {
    deserialize: (value) => {
      try {
        return JSON.parse(value || '');
      } catch {
        return {};
      }
    },
    serialize: (value) => {
      if (!value || Object.keys(value).length === 0) return;
      return JSON.stringify(value);
    },
  },
} satisfies Record<
  string,
  Pick<QueryParamsFieldModelConfig<any>, 'deserialize' | 'serialize'>
>;
