/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Blocker,
  BrowserHistoryOptions,
  createBrowserHistory as createBrowserHistoryLib,
  createHashHistory as createHashHistoryLib,
  createMemoryHistory as createMemoryHistoryLib,
  HashHistoryOptions,
  History,
  Listener,
  MemoryHistoryOptions,
  Transition,
} from 'history';
import { computed, makeObservable, observable, runInAction } from 'mobx';
import { AnyObject } from 'yummies/utils/types';

export * from 'history';

export type ObservableHistory<THistory extends History> = THistory & {
  /**
   * [**Documentation**](https://js2me.github.io/mobx-location-history/core/BrowserHistory#blockerscount-number)
   */
  blockersCount: number;
  /**
   * [**Documentation**](https://js2me.github.io/mobx-location-history/core/BrowserHistory#isblocked-blocked)
   */
  isBlocked: boolean;
  /**
   * [**Documentation**](https://js2me.github.io/mobx-location-history/core/BrowserHistory#destroy)
   */
  destroy: VoidFunction;
  /**
   * [**Documentation**](https://js2me.github.io/mobx-location-history/core/BrowserHistory#locationurl)
   */
  locationUrl: string;
  /**
   * [**Documentation**](https://js2me.github.io/mobx-location-history/core/BrowserHistory#lastblockedtx-transition-null)
   */
  lastBlockedTx: Transition | null;
};

export type WithObservableHistoryParams<TParams extends AnyObject> = TParams & {
  listener?: Listener;
};

const makeHistoryObservable = <THistory extends History>(
  originHistory: THistory,
  observableParams?: WithObservableHistoryParams<AnyObject>,
): ObservableHistory<THistory> => {
  const location = { ...originHistory.location };
  const action = originHistory.action;

  const history = originHistory as unknown as ObservableHistory<THistory>;

  // @ts-ignore
  delete history['location'];
  // @ts-ignore
  delete history['action'];
  // @ts-ignore
  history.location = { ...location };
  // @ts-ignore
  history.action = action;

  history.blockersCount = 0;
  history.isBlocked = false;
  history.lastBlockedTx = null;
  history.locationUrl = '';

  const blockOrigin = history.block;

  Object.defineProperty(history, 'isBlocked', {
    get: () => history.blockersCount > 0,
  });

  Object.defineProperty(history, 'locationUrl', {
    get: () => {
      const { pathname, search, hash } = history.location;
      return `${pathname}${hash}${search}`;
    },
  });

  computed.struct(history, 'isBlocked');
  computed.struct(history, 'locationUrl');
  observable.deep(history, 'location');
  observable.ref(history, 'action');
  observable.ref(history, 'blockersCount');
  observable.ref(history, 'lastBlockedTx');
  makeObservable(history);

  const unsubscribe = history.listen((update) => {
    runInAction(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      history.action = update.action;
      Object.assign(history.location, update.location);
      if ('hash' in update.location) {
        history.location.hash = update.location.hash;
      }
      observableParams?.listener?.(update);
    });
  });

  return Object.assign(history, {
    destroy: unsubscribe,
    block: (blocker: Blocker) => {
      runInAction(() => {
        history.blockersCount++;
      });
      const unblockerOrigin = blockOrigin((tx) => {
        runInAction(() => {
          history.lastBlockedTx = tx;
        });
        blocker(tx);
      });
      return () => {
        runInAction(() => {
          history.blockersCount--;
          if (history.blockersCount === 0) {
            history.lastBlockedTx = null;
          }
        });
        return unblockerOrigin();
      };
    },
  });
};

/**
 * Browser history stores the location in regular URLs. This is the standard for
 * most web apps, but it requires some configuration on the server to ensure you
 * serve the same app at multiple URLs.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createbrowserhistory
 *
 * MobX enhancers:
 * - `observable.deep` `history.location`
 * - `observable.ref` `history.action`
 * - `observable.ref` `history.blockersCount`
 * - `computed.struct` `history.isBlocked`
 */
export const createBrowserHistory = (
  options?: WithObservableHistoryParams<BrowserHistoryOptions>,
) => makeHistoryObservable(createBrowserHistoryLib(options), options);

/**
 * Hash history stores the location in window.location.hash. This makes it ideal
 * for situations where you don't want to send the location to the server for
 * some reason, either because you do cannot configure it or the URL space is
 * reserved for something else.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createhashhistory
 *
 * MobX enhancers:
 * - `observable.deep` `history.location`
 * - `observable.ref` `history.action`
 * - `observable.ref` `history.blockersCount`
 * - `computed.struct` `history.isBlocked`
 */
export const createHashHistory = (
  options?: WithObservableHistoryParams<HashHistoryOptions>,
) => makeHistoryObservable(createHashHistoryLib(options), options);

/**
 * Memory history stores the current location in memory. It is designed for use
 * in stateful non-browser environments like tests and React Native.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#creatememoryhistory
 *
 * MobX enhancers:
 * - `observable.deep` `history.location`
 * - `observable.ref` `history.action`
 * - `observable.ref` `history.blockersCount`
 * - `computed.struct` `history.isBlocked`
 */
export const createMemoryHistory = (
  options?: WithObservableHistoryParams<MemoryHistoryOptions>,
) => makeHistoryObservable(createMemoryHistoryLib(options), options);

/**
 * Checks if history object is created using this library
 */
export const isObservableHistory = <THistory extends History>(
  history: THistory,
): history is ObservableHistory<THistory> => 'destroy' in history;
