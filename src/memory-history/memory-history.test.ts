import { reaction } from 'mobx';
import { describe, expect, it, vi } from 'vitest';
import { sleep } from 'yummies/async';

import { MemoryHistory } from './memory-history.js';

describe('MemoryHistory', () => {
  it('"pushState" & "replaceState" should work', async () => {
    vi.useFakeTimers();

    const lengthReactionSpy = vi.fn();

    const mobxHistory = new MemoryHistory();

    reaction(
      () => mobxHistory.length,
      (length) => lengthReactionSpy(length),
    );

    const changeStateTest = ({
      action,
      path,
      expected,
    }: {
      action?: 'push' | 'replace';
      path?: string;
      expected: {
        length: number;
        lengthReactions: number;
      };
    }) => {
      if (action && path) {
        if (action === 'push') {
          mobxHistory.push(path);
        } else {
          mobxHistory.replace(path);
        }
      }

      expect(mobxHistory.length).toBe(expected.length);

      sleep(1000);
      vi.runAllTimers();

      expect(lengthReactionSpy).toHaveBeenCalledTimes(expected.lengthReactions);
    };

    changeStateTest({ expected: { length: 1, lengthReactions: 0 } });
    changeStateTest({
      action: 'push',
      path: '/home',
      expected: { length: 2, lengthReactions: 1 },
    });
    changeStateTest({
      action: 'push',
      path: '/about',
      expected: { length: 3, lengthReactions: 2 },
    });
    changeStateTest({
      action: 'replace',
      path: '/bak',
      expected: { length: 3, lengthReactions: 2 },
    });
    changeStateTest({
      action: 'replace',
      path: '/baz',
      expected: { length: 3, lengthReactions: 2 },
    });
    changeStateTest({
      action: 'push',
      path: '/bal',
      expected: { length: 4, lengthReactions: 3 },
    });
    changeStateTest({
      action: 'replace',
      path: '/bal',
      expected: { length: 4, lengthReactions: 3 },
    });
    changeStateTest({ expected: { length: 4, lengthReactions: 3 } });

    /// DESTROY
    mobxHistory.destroy();
    /// DESTROY

    // change listeners works because
    // after destroy we ONLY remove event listeners
    // from global history and it is all.
    changeStateTest({
      action: 'push',
      path: '/destroyed_home',
      expected: { length: 5, lengthReactions: 4 },
    });
    changeStateTest({
      action: 'push',
      path: '/destroyed_home_2',
      expected: { length: 6, lengthReactions: 5 },
    });
    changeStateTest({
      action: 'push',
      path: '/destroyed_home_3',
      expected: { length: 7, lengthReactions: 6 },
    });

    changeStateTest({
      action: 'replace',
      path: '/destroyed_home_4',
      expected: { length: 7, lengthReactions: 6 },
    });
    changeStateTest({
      action: 'replace',
      path: '/destroyed_home_5',
      expected: { length: 7, lengthReactions: 6 },
    });
    changeStateTest({
      action: 'replace',
      path: '/destroyed_home_6',
      expected: { length: 7, lengthReactions: 6 },
    });

    // but if we will using global history
    // updates for mobx will not work
    // because listeners was died

    vi.useRealTimers();
  });

  it('should handle AbortController signals', () => {
    const abortController = new AbortController();
    const history = new MemoryHistory();
    const listener = vi.fn();

    history.listen(listener, { signal: abortController.signal });

    history.push('/first');
    abortController.abort();
    history.push('/second');

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should handle dispose function in .listen() method', async () => {
    vi.useFakeTimers();
    const history = new MemoryHistory();
    const listener = vi.fn();

    const removeListener = history.listen(listener);

    history.push('/new-location');
    sleep(1000);
    vi.runAllTimers();
    expect(listener).toHaveBeenCalledTimes(1);

    history.replace('/replaced-location');
    sleep(1000);
    vi.runAllTimers();
    expect(listener).toHaveBeenCalledTimes(2);

    history.replace('/replaced-location');
    sleep(1000);
    vi.runAllTimers();
    expect(listener).toHaveBeenCalledTimes(3);

    removeListener();
    history.push('/no-listener');
    sleep(1000);
    vi.runAllTimers();
    expect(listener).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
  });
});
