/* eslint-disable unicorn/no-array-push-push */
import { reaction } from 'mobx';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sleep } from 'yummies/async';

import { MobxHistory } from '../mobx-history/mobx-history.js';

import { MobxLocation } from './mobx-location.js';

describe('MobxLocation', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
    vi.clearAllMocks();

    globalThis.location.href = '';

    sleep(1000);
    await vi.runAllTimersAsync();
  });

  const reactiveFieldsToTest: [
    keyof MobxLocation,
    {
      ignoredUrls?: string[];
      reactedUrls: string[];
      reactedValues: any[];
      skip?: boolean;
    },
  ][] = [
    [
      'href',
      {
        skip: true,
        reactedUrls: ['/home/bar/baz'],
        reactedValues: ['http://localhost:3000/home/bar/baz'],
      },
    ],
    [
      'hash',
      {
        ignoredUrls: [
          '/adsf322423',
          '/adsfbare',
          '/adsfbad',
          '/adsfbar',
          '/adsfbafdds',
        ],
        reactedUrls: [
          '/home#322423',
          '/home#bare',
          '/home#bad',
          '/home#bar',
          '/home#bafdds',
        ],
        reactedValues: ['#322423', '#bare', '#bad', '#bar', '#bafdds'],
      },
    ],
    [
      'pathname',
      {
        reactedUrls: ['/aboba', '/baeb', '/dsaf213', '/s311#213213', '/'],
        reactedValues: ['/aboba', '/baeb', '/dsaf213', '/s311', '/'],
      },
    ],
  ];

  reactiveFieldsToTest.forEach(
    ([field, { ignoredUrls, reactedUrls, reactedValues, skip }]) => {
      describe(`"${field}" field`, () => {
        const histories = ['globalThis.history', 'mobxHistory'] as const;
        const changeStateStrategies = ['pushState', 'replaceState'] as const;

        histories.forEach((historyType) => {
          describe(`using "${historyType}" for update`, () => {
            changeStateStrategies.forEach((changeStateStrategy) => {
              describe(`change state using: "${changeStateStrategy}"`, () => {
                if (ignoredUrls?.length) {
                  (skip ? it.skip : it)(
                    `should have reactive "${field}" (ignore reaction)`,
                    () => {
                      const reactionSpy = vi.fn();
                      const history = new MobxHistory();
                      const location = new MobxLocation(history);

                      reaction(
                        () => location[field],
                        (fieldValue) => reactionSpy(fieldValue),
                      );

                      const historyToUse =
                        historyType === 'globalThis.history'
                          ? globalThis.history
                          : history;

                      ignoredUrls.forEach((url) => {
                        if (changeStateStrategy === 'pushState') {
                          historyToUse.pushState(null, '', url);
                        } else {
                          historyToUse.replaceState(null, '', url);
                        }
                      });

                      sleep(1000);
                      vi.runAllTimers();

                      expect(reactionSpy).toHaveBeenCalledTimes(0);
                      history.destroy();
                      location.destroy();
                    },
                  );
                }

                (skip ? it.skip : it)(
                  `should have reactive "${field}" (work reaction)`,
                  () => {
                    const reactionSpy = vi.fn();
                    const history = new MobxHistory();
                    const location = new MobxLocation(history);

                    reaction(
                      () => location[field],
                      (fieldValue) => reactionSpy(fieldValue),
                    );

                    const historyToUse =
                      historyType === 'globalThis.history'
                        ? globalThis.history
                        : history;

                    reactedUrls.forEach((url) => {
                      if (changeStateStrategy === 'pushState') {
                        historyToUse.pushState(null, '', url);
                      } else {
                        historyToUse.replaceState(null, '', url);
                      }
                    });

                    sleep(1000);
                    vi.runAllTimers();

                    expect(reactionSpy).toHaveBeenCalledTimes(
                      reactedUrls.length,
                    );

                    reactedValues.forEach((value, i) => {
                      expect(reactionSpy).toHaveBeenNthCalledWith(i + 1, value);
                    });

                    history.destroy();
                    location.destroy();
                  },
                );
              });
            });
          });
        });
      });
    },
  );
});
