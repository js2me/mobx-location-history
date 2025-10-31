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

    qp.update({ bar: 1, baz: 2 });

    expect(qp.data).toEqual({ a: '3', b: '1,2,3', bar: '1', baz: '2' });

    qp.set({ bar: 1, baz: 2 });

    expect(qp.data).toEqual({
      bar: '1',
      baz: '2',
    });

    history.push('/baabba');

    expect(qp.data).toEqual({});

    qp.set({ kkee: null });

    expect(history.location.search).toBe('');
  });
});
