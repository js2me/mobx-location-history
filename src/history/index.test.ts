import { reaction } from 'mobx';
import { describe, expect, it, vi } from 'vitest';

import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
} from './index.js';

describe('history', () => {
  const histories = [
    { name: 'browser', creator: () => createBrowserHistory() },
    { name: 'hash', creator: () => createHashHistory() },
    { name: 'memory', creator: () => createMemoryHistory() },
  ];

  histories.forEach((history) => {
    describe(history.name, () => {
      it('should be created', () => {
        const instance = history.creator();
        expect(instance).toBeDefined();
      });

      it('should have "blockersCount"', () => {
        const instance = history.creator();
        const unblock1 = instance.block(() => {});
        const unblock2 = instance.block(() => {});
        const unblock3 = instance.block(() => {});
        expect(instance.blockersCount).toBe(3);
        unblock3();
        unblock2();
        unblock1();
        expect(instance.blockersCount).toBe(0);
      });

      it('should have "isBlocked"', () => {
        const instance = history.creator();
        const unblock1 = instance.block(() => {});
        const unblock2 = instance.block(() => {});
        const unblock3 = instance.block(() => {});
        expect(instance.isBlocked).toBe(true);
        unblock3();
        unblock2();
        unblock1();
        expect(instance.isBlocked).toBe(false);
      });

      it('"blockersCount" should have reactivity', () => {
        const reactionSpy = vi.fn();
        const instance = history.creator();
        reaction(
          () => instance.blockersCount,
          (value) => reactionSpy(value),
        );
        const unblock1 = instance.block(() => {});
        const unblock2 = instance.block(() => {});
        const unblock3 = instance.block(() => {});
        expect(reactionSpy).toBeCalledTimes(3);
        unblock3();
        unblock2();
        unblock1();
        expect(reactionSpy).toBeCalledTimes(6);
      });

      it('"isBlocked" should have reactivity', () => {
        const reactionSpy = vi.fn();
        const instance = history.creator();
        reaction(
          () => instance.isBlocked,
          (value) => reactionSpy(value),
        );
        const unblock1 = instance.block(() => {});
        const unblock2 = instance.block(() => {});
        const unblock3 = instance.block(() => {});
        expect(reactionSpy).toBeCalledTimes(1);
        unblock3();
        unblock2();
        unblock1();
        expect(reactionSpy).toBeCalledTimes(2);
      });
    });
  });
});
