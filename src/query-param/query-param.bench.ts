import { bench, describe } from 'vitest';
import { createMemoryHistory } from '../history/index.js';
import { createQueryParams } from '../query-params/index.js';
import { createQueryParam } from './query-param.js';
import { presets } from './query-param-presets.js';

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
    const page = createQueryParam({
      queryParams,
      name: 'page',
      defaultValue: 1,
      preset: presets.number,
    });
    page.set(2);
  });

  bench('buildUrl', () => {
    const queryParams = createParams('?page=1');
    const page = createQueryParam({
      queryParams,
      name: 'page',
      defaultValue: 1,
      preset: presets.number,
    });
    page.buildUrl(2);
  });
});

describe('QueryParam presets', () => {
  bench('stringArray', () => {
    const queryParams = createParams('?tags=one%2Ctwo%2Cthree');
    const tags = createQueryParam({
      queryParams,
      name: 'tags',
      defaultValue: [],
      preset: presets.stringArray,
    });
    tags.value;
  });

  bench('numberArray', () => {
    const queryParams = createParams('?ids=1%2C2%2C3');
    const ids = createQueryParam({
      queryParams,
      name: 'ids',
      defaultValue: [],
      preset: presets.numberArray,
    });
    ids.value;
  });

  bench('boolean', () => {
    const queryParams = createParams('?enabled=1');
    const enabled = createQueryParam({
      queryParams,
      name: 'enabled',
      defaultValue: false,
      preset: presets.boolean,
    });
    enabled.value;
  });

  bench('json', () => {
    const queryParams = createParams(
      '?filters=%7B%22status%22%3A%22active%22%7D',
    );
    const filters = createQueryParam({
      queryParams,
      name: 'filters',
      defaultValue: {},
      preset: presets.json,
    });
    filters.value;
  });
});
