import { bench, describe } from 'vitest';
import { createMemoryHistory } from '../history/index.js';
import { createQueryParams } from '../query-params/index.js';
import { createQueryParam, createQueryParamFromPreset } from './query-param.js';

const createParams = (search = '') =>
  createQueryParams({
    history: createMemoryHistory({ initialEntries: [`/items${search}`] }),
  });

describe('QueryParam', () => {
  bench('createQueryParam and read value', () => {
    const queryParams = createParams('?page=2');
    const page = createQueryParam({
      queryParams,
      name: 'page',
      defaultValue: 1,
      serialize: (value) => value,
      deserialize: (value) => (value ? Number(value) : null),
    });
    page.value;
  });

  bench('QueryParam.set', () => {
    const queryParams = createParams();
    const page = createQueryParamFromPreset({
      queryParams,
      name: 'page',
      defaultValue: 1,
      preset: 'number',
    });
    page.set(2);
  });

  bench('buildUrl', () => {
    const queryParams = createParams('?page=1');
    const page = createQueryParamFromPreset({
      queryParams,
      name: 'page',
      defaultValue: 1,
      preset: 'number',
    });
    page.buildUrl(2);
  });
});

describe('QueryParam presets', () => {
  bench('string[]', () => {
    const queryParams = createParams('?tags=one%2Ctwo%2Cthree');
    const tags = createQueryParamFromPreset({
      queryParams,
      name: 'tags',
      defaultValue: [],
      preset: 'string[]',
    });
    tags.value;
  });

  bench('number[]', () => {
    const queryParams = createParams('?ids=1%2C2%2C3');
    const ids = createQueryParamFromPreset<number[]>({
      queryParams,
      name: 'ids',
      defaultValue: [],
      preset: 'number[]',
    });
    ids.value;
  });

  bench('boolean', () => {
    const queryParams = createParams('?enabled=1');
    const enabled = createQueryParamFromPreset({
      queryParams,
      name: 'enabled',
      defaultValue: false,
      preset: 'boolean',
    });
    enabled.value;
  });

  bench('json', () => {
    const queryParams = createParams(
      '?filters=%7B%22status%22%3A%22active%22%7D',
    );
    const filters = createQueryParamFromPreset({
      queryParams,
      name: 'filters',
      defaultValue: {},
      preset: 'json',
    });
    filters.value;
  });
});
