import { bench, describe } from 'vitest';
import { createMemoryHistory } from '../history/index.js';
import { createQueryParams, QueryParams } from './query-params.js';
import { buildSearchString } from './utils/build-search-string.js';
import { parseSearchString } from './utils/parse-search-string.js';

describe('QueryParams.createUrl', () => {
  const history = createMemoryHistory();
  const queryParams = new QueryParams({ history });

  bench('100 calls without an existing query', () => {
    for (let index = 0; index < 100; index++) {
      queryParams.createUrl(
        { TeamcityAgent: index },
        '/nova/products/details/6637',
      );
    }
  });

  bench('100 calls with an existing query', () => {
    for (let index = 0; index < 100; index++) {
      queryParams.createUrl(
        { TeamcityAgent: index },
        '/nova/products/details/6637?tab=runners&page=2',
      );
    }
  });

  bench('empty data', () => {
    queryParams.createUrl({}, '/items');
  });

  bench('existing query and hash', () => {
    queryParams.createUrl({ page: 2 }, '/items?filter=active#results');
  });
});

describe('QueryParams operations', () => {
  bench('createQueryParams', () => {
    createQueryParams({ history: createMemoryHistory() });
  });

  bench('data', () => {
    const history = createMemoryHistory({
      initialEntries: ['/items?page=1&filter=active'],
    });
    const queryParams = new QueryParams({ history });
    void queryParams.data;
  });

  bench('QueryParams.set', () => {
    const queryParams = new QueryParams({ history: createMemoryHistory() });
    queryParams.set({ page: 2, filter: 'active' });
  });

  bench('QueryParams.update', () => {
    const history = createMemoryHistory({ initialEntries: ['/items?page=1'] });
    const queryParams = new QueryParams({ history });
    queryParams.update({ page: 2, filter: 'active' });
  });

  bench('QueryParams.update with delete and replace', () => {
    const history = createMemoryHistory({
      initialEntries: ['/items?page=1&filter=active'],
    });
    const queryParams = new QueryParams({ history });
    queryParams.update({ page: 2 }, { delete: ['filter'], replace: true });
  });

  bench('QueryParams.delete', () => {
    const history = createMemoryHistory({
      initialEntries: ['/items?page=1&filter=active&sort=name'],
    });
    const queryParams = new QueryParams({ history });
    queryParams.delete(['filter']);
  });

  bench('QueryParams.delete with replace', () => {
    const history = createMemoryHistory({
      initialEntries: ['/items?page=1&filter=active'],
    });
    const queryParams = new QueryParams({ history });
    queryParams.delete(['filter'], true);
  });

  bench('toString', () => {
    const queryParams = new QueryParams({ history: createMemoryHistory() });
    queryParams.toString({ page: 2, tags: ['one', 'two'], enabled: true });
  });

  bench('deprecated buildUrl alias', () => {
    const queryParams = new QueryParams({ history: createMemoryHistory() });
    queryParams.buildUrl({ page: 2 });
  });
});

describe('query string utilities', () => {
  bench('buildSearchString', () => {
    buildSearchString({ page: 2, tags: ['one', 'two'], empty: undefined });
  });

  bench('parseSearchString', () => {
    parseSearchString('?page=2&tags=one%2Ctwo&enabled=1');
  });
});
