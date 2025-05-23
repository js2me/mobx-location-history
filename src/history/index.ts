/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BrowserHistoryOptions,
  createBrowserHistory as createBrowserHistoryLib,
  createHashHistory as createHashHistoryLib,
  createMemoryHistory as createMemoryHistoryLib,
  HashHistoryOptions,
  History,
  Listener,
  MemoryHistoryOptions,
} from 'history';
import { makeObservable, observable, runInAction } from 'mobx';
import { AnyObject } from 'yummies/utils/types';

export * from 'history';

export type ObservableHistory<THistory extends History> = THistory & {
  destroy: VoidFunction;
};

export type WithObservableHistoryParams<TParams extends AnyObject> = TParams & {
  listener?: Listener;
};

const makeHistoryObservable = <THistory extends History>(
  history: THistory,
  observableParams?: WithObservableHistoryParams<AnyObject>,
): ObservableHistory<THistory> => {
  const location = { ...history.location };
  const action = history.action;

  // @ts-ignore
  delete history['location'];
  // @ts-ignore
  delete history['action'];
  // @ts-ignore
  history.location = { ...location };
  // @ts-ignore
  history.action = action;

  observable.deep(history, 'location');
  observable.ref(history, 'action');
  makeObservable(history);

  const unsubscribe = history.listen((update) => {
    runInAction(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      history.action = update.action;
      Object.assign(history.location, update.location);
      observableParams?.listener?.(update);
    });
  });

  return Object.assign(history, {
    destroy: unsubscribe,
  });
};

export const createBrowserHistory = (
  options?: WithObservableHistoryParams<BrowserHistoryOptions>,
) => makeHistoryObservable(createBrowserHistoryLib(options), options);

export const createHashHistory = (
  options?: WithObservableHistoryParams<HashHistoryOptions>,
) => makeHistoryObservable(createHashHistoryLib(options), options);

export const createMemoryHistory = (
  options?: WithObservableHistoryParams<MemoryHistoryOptions>,
) => makeHistoryObservable(createMemoryHistoryLib(options), options);

export const isObservableHistory = <THistory extends History>(
  history: THistory,
): history is ObservableHistory<THistory> => 'destroy' in history;
