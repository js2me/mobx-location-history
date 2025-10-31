import { describe, expect, it } from 'vitest';
import { createMemoryHistory } from '../history/index.js';
import { mockHistory } from '../history/index.test.js';
import { QueryParams } from './query-params.js';

describe('query params', () => {
  it('test', () => {
    const history = mockHistory(createMemoryHistory());

    history.push('/foo/bar?a=3&b=1%2C2%2C3');

    const qp = new QueryParams({ history });

    expect(qp.data).toEqual({ a: '3', b: '1,2,3' });
  });
});
