import { observable, runInAction } from 'mobx';
import { describe, expect, it } from 'vitest';

import { createMemoryHistory } from '../history/index.js';

import { blockHistoryWhile } from './block-history-while.js';

describe('block-history-while', () => {
  it('should work', () => {
    const box = observable.box(false);
    const history = createMemoryHistory();

    const unblock = blockHistoryWhile(() => box.get(), {
      history,
    });

    history.push('/foo/bar/baz');

    expect(history.isBlocked).toBe(false);
    expect(history.location.pathname).toBe('/foo/bar/baz');

    runInAction(() => {
      box.set(true);
    });
    expect(history.isBlocked).toBe(true);
    history.push('/foo/bar/baz/bad');
    expect(history.location.pathname).toBe('/foo/bar/baz');

    runInAction(() => {
      box.set(false);
    });
    expect(history.isBlocked).toBe(false);
    expect(history.location.pathname).toBe('/foo/bar/baz');

    unblock();
    expect(history.isBlocked).toBe(false);
    expect(history.location.pathname).toBe('/foo/bar/baz');
  });

  it('should retry work', () => {
    const box = observable.box(true);
    const history = createMemoryHistory();

    expect(history.isBlocked).toBe(false);
    expect(history.location.pathname).toBe('/');

    const unblock = blockHistoryWhile(() => box.get(), {
      history,
      blocker: (tx) => {
        if (tx.location.pathname === '/foo/bar/baz/bag') {
          unblock();
          tx.retry();
        }
      },
    });

    history.push('/foo/bar/baz');

    expect(history.isBlocked).toBe(true);
    expect(history.location.pathname).toBe('/');

    history.push('/foo/bar/baz/bad');
    history.push('/foo/bar/baz/bag');

    expect(history.location.pathname).toBe('/foo/bar/baz/bag');
  });
});
