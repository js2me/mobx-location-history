import { bench, describe } from 'vitest';
import { createMemoryHistory } from '../history/index.js';
import { QueryParams } from './query-params.js';

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
});
