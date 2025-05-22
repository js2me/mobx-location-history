/* eslint-disable unicorn/no-array-push-push */
import { reaction } from 'mobx';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sleep } from 'yummies/async';

import { History } from '../history/index.js';

import { Location } from './location.js';

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

  it('href test', () => {
    const reactionSpy1 = vi.fn();
    const history = new History();
    const location = new Location({
      history,
    });

    reaction(
      () => location.href,
      (fieldValue) => reactionSpy1(fieldValue),
    );

    history.pushState(null, '', '/home/bar/baz');
    history.pushState(null, '', '/home/bar/baz/bad');
    history.pushState(null, '', '/home/bar/aa/a/adf/f/f/bad/back');
    history.pushState(null, '', '/dsafdsz/bacll');
    history.pushState(null, '', '/dsafdsafe');
    history.pushState(null, '', '#asdfdsaffa');

    sleep(1000);
    vi.runAllTimers();

    expect(reactionSpy1).toHaveBeenCalledTimes(6);
    expect(reactionSpy1).toHaveBeenNthCalledWith(
      1,
      'http://localhost:3000/home/bar/baz',
    );
    expect(reactionSpy1).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3000/home/bar/baz/bad',
    );
    expect(reactionSpy1).toHaveBeenNthCalledWith(
      3,
      'http://localhost:3000/home/bar/aa/a/adf/f/f/bad/back',
    );
    expect(reactionSpy1).toHaveBeenNthCalledWith(
      4,
      'http://localhost:3000/dsafdsz/bacll',
    );
    expect(reactionSpy1).toHaveBeenNthCalledWith(
      5,
      'http://localhost:3000/dsafdsafe',
    );
    expect(reactionSpy1).toHaveBeenNthCalledWith(
      6,
      'http://localhost:3000/dsafdsafe#asdfdsaffa',
    );

    const reactionSpy2 = vi.fn();

    reaction(
      () => location.href,
      (fieldValue) => reactionSpy2(fieldValue),
    );

    history.push('/home/bar/baz');
    history.push('/home/bar/baz/bad');
    history.push('/home/bar/aa/a/adf/f/f/bad/back');
    history.push('/dsafdsz/bacll');
    history.push('/dsafdsafe');
    history.push('#asdfdsaffa');

    sleep(1000);
    vi.runAllTimers();

    expect(reactionSpy2).toHaveBeenCalledTimes(6);
    expect(reactionSpy2).toHaveBeenNthCalledWith(
      1,
      'http://localhost:3000/home/bar/baz',
    );
    expect(reactionSpy2).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3000/home/bar/baz/bad',
    );
    expect(reactionSpy2).toHaveBeenNthCalledWith(
      3,
      'http://localhost:3000/home/bar/aa/a/adf/f/f/bad/back',
    );
    expect(reactionSpy2).toHaveBeenNthCalledWith(
      4,
      'http://localhost:3000/dsafdsz/bacll',
    );
    expect(reactionSpy2).toHaveBeenNthCalledWith(
      5,
      'http://localhost:3000/dsafdsafe',
    );
    expect(reactionSpy2).toHaveBeenNthCalledWith(
      6,
      'http://localhost:3000/dsafdsafe#asdfdsaffa',
    );

    history.destroy();
    location.destroy();
  });

  const reactiveFieldsToTest: [
    keyof Location,
    {
      ignoredUrls?: string[];
      reactedUrls: string[];
      reactedValues?: any[];
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
                ignoredUrls?.forEach((ignoreUrl) => {
                  (skip ? it.skip : it)(
                    `[ignore reaction] "${ignoreUrl}"`,
                    () => {
                      const reactionSpy = vi.fn();
                      const history = new History();
                      const location = new Location({ history });

                      reaction(
                        () => location[field],
                        (fieldValue) => reactionSpy(fieldValue),
                      );

                      const historyToUse =
                        historyType === 'globalThis.history'
                          ? globalThis.history
                          : history;

                      if (changeStateStrategy === 'pushState') {
                        historyToUse.pushState(null, '', ignoreUrl);
                      } else {
                        historyToUse.replaceState(null, '', ignoreUrl);
                      }

                      sleep(1000);
                      vi.runAllTimers();

                      expect(reactionSpy).toHaveBeenCalledTimes(0);
                      history.destroy();
                      location.destroy();
                    },
                  );
                });

                reactedUrls?.forEach((reactedUrl, i) => {
                  const expectedReactedValue = reactedValues?.[i];

                  (skip ? it.skip : it)(
                    `[reaction works] "${reactedUrl}"` +
                      (expectedReactedValue === undefined
                        ? ''
                        : ` -> location.${field} = ${JSON.stringify(expectedReactedValue)}`),
                    () => {
                      const reactionSpy = vi.fn();
                      const history = new History();
                      const location = new Location({ history });

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

                      if (expectedReactedValue !== undefined) {
                        expect(reactionSpy).toHaveBeenCalledWith(
                          expectedReactedValue,
                        );
                      }

                      history.destroy();
                      location.destroy();
                    },
                  );
                });
              });
            });
          });
        });
      });
    },
  );
});
