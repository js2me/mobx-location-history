import { reaction } from 'mobx';
import { afterEach, describe, expect, it, vi } from 'vitest';

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

  afterEach(() => {
    history.replaceState(null, '', '/');
    location.hash = '';
  });

  histories.forEach((history) => {
    describe(history.name, () => {
      it('should be created', () => {
        const instance = history.creator();
        expect(instance).toBeDefined();
      });

      it('should have "block"', () => {
        const instance = history.creator();
        instance.push('/foo/bar/baz');
        expect(instance.location.pathname).toBe('/foo/bar/baz');

        const unblock = instance.block(() => {});

        instance.push('/foo/bar/baz/bad');
        expect(instance.location.pathname).toBe('/foo/bar/baz');
        expect(instance.lastBlockedTx).toStrictEqual({
          ...instance.lastBlockedTx,
          action: 'PUSH',
          location: {
            ...instance.lastBlockedTx?.location,
            hash: '',
            pathname: '/foo/bar/baz/bad',
            search: '',
            state: null,
          },
        });

        unblock();

        expect(instance.location.pathname).toBe('/foo/bar/baz');
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

      it('should have "locationUrl"', () => {
        const instance = history.creator();
        expect(instance.locationUrl).toBe('/');

        instance.push('/foo/bar/baz');
        expect(instance.locationUrl).toBe('/foo/bar/baz');

        instance.push('/bagasdfdsaf#32143214');
        expect(instance.locationUrl).toBe('/bagasdfdsaf#32143214');

        instance.push('/asdfdsafas?adsfadsf');
        expect(instance.locationUrl).toBe('/asdfdsafas?adsfadsf');

        instance.push('/asdfdsafas?adsfadsf=12341324');
        expect(instance.locationUrl).toBe('/asdfdsafas?adsfadsf=12341324');

        instance.push('/asdfdsafas#dsafdsafdsa?adsfadsf=12341324');
        expect(instance.locationUrl).toBe(
          '/asdfdsafas#dsafdsafdsa?adsfadsf=12341324',
        );

        expect(instance.location.pathname).toBe('/asdfdsafas');
        expect(instance.location.hash).toBe('#dsafdsafdsa?adsfadsf=12341324');
        expect(instance.location.search).toBe('');
      });
    });
  });
});
