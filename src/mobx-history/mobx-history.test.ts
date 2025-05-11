import { reaction } from 'mobx';
import { describe, expect, it, vi } from 'vitest';
import { sleep } from 'yummies/async';

import { MobxHistory } from './mobx-history.js';

describe('MobxHistory', () => {
  it('"pushState" & "replaceState" should work', async () => {
    vi.useFakeTimers();

    const lengthReactionSpy = vi.fn();

    const mobxHistory = new MobxHistory();
    const globalHistory = history;

    reaction(
      () => mobxHistory.length,
      (length) => lengthReactionSpy(length),
    );

    const changeStateTest = (
      change: 'push' | 'replace' | false,
      path: string | false,
      using: 'global' | 'mobx' | false,
      lengthChanged: number,
      lengthReactionChanged: number,
    ) => {
      if (change !== false && path !== false) {
        if (change === 'push') {
          if (using === 'global') {
            globalHistory.pushState(null, '', path);
          } else {
            mobxHistory.push(path);
          }
        } else if (using === 'global') {
          globalHistory.replaceState(null, '', path);
        } else {
          mobxHistory.replace(path);
        }
      }

      expect(globalHistory.length).toBe(lengthChanged);
      expect(mobxHistory.length).toBe(lengthChanged);

      sleep(1000);
      vi.runAllTimers();

      expect(lengthReactionSpy).toHaveBeenCalledTimes(lengthReactionChanged);
    };

    changeStateTest(false, false, false, 1, 0);
    changeStateTest('push', '/home', 'mobx', 2, 1);
    changeStateTest('push', '/about', 'mobx', 3, 2);
    changeStateTest('replace', '/bak', 'mobx', 3, 2);
    changeStateTest('replace', '/baz', 'mobx', 3, 2);
    changeStateTest('push', '/bal', 'mobx', 4, 3);
    changeStateTest('replace', '/bal', 'mobx', 4, 3);
    changeStateTest('push', '/bal', 'global', 5, 4);
    changeStateTest('replace', '/bal', 'global', 5, 4);
    changeStateTest('replace', '/bal', 'global', 5, 4);
    changeStateTest('push', '/bal', 'global', 6, 5);
    changeStateTest('replace', '/bal', 'global', 6, 5);
    changeStateTest('replace', '/bal', 'global', 6, 5);
    changeStateTest(false, false, false, 6, 5);

    /// DESTROY
    mobxHistory.destroy();
    /// DESTROY

    // change listeners works because
    // after destroy we ONLY remove event listeners
    // from global history and it is all.
    changeStateTest('push', '/destroyed_home', 'mobx', 7, 6);
    changeStateTest('push', '/destroyed_home_2', 'mobx', 8, 7);
    changeStateTest('push', '/destroyed_home_3', 'mobx', 9, 8);

    changeStateTest('replace', '/destroyed_home_4', 'mobx', 9, 8);
    changeStateTest('replace', '/destroyed_home_5', 'mobx', 9, 8);
    changeStateTest('replace', '/destroyed_home_6', 'mobx', 9, 8);

    // but if we will using global history
    // updates for mobx will not work
    // because listeners was died
    changeStateTest('push', '/destroyed_home_7', 'global', 10, 8);
    changeStateTest('push', '/destroyed_home_8', 'global', 11, 8);
    changeStateTest('push', '/destroyed_home_9', 'global', 12, 8);

    changeStateTest('replace', '/destroyed_home_10', 'global', 12, 8);
    changeStateTest('replace', '/destroyed_home_11', 'global', 12, 8);
    changeStateTest('replace', '/destroyed_home_12', 'global', 12, 8);

    vi.useRealTimers();
  });
});
