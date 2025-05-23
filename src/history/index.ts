import {
  BrowserHistoryOptions,
  createBrowserHistory as createBrowserHistoryLib,
  createHashHistory as createHashHistoryLib,
  createMemoryHistory as createMemoryHistoryLib,
  HashHistoryOptions,
  History,
  MemoryHistoryOptions,
} from 'history';
import { makeObservable, observable } from 'mobx';

export * from 'history';

export type ObservableHistory<THistory extends History> = THistory & {
  destroy: VoidFunction;
};

const createObservableHistory = <THistory extends History>(
  history: THistory,
): ObservableHistory<THistory> => {
  observable.deep(history, 'location');
  observable.ref(history, 'action');
  makeObservable(history);

  const unsubscribe = history.listen(({ action, location }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    history.action = action;
    Object.assign(history.location, location);
  });

  return Object.assign(history, {
    destroy: unsubscribe,
  });
};

export const createBrowserHistory = (options?: BrowserHistoryOptions) =>
  createObservableHistory(createBrowserHistoryLib(options));

export const createHashHistory = (options?: HashHistoryOptions) =>
  createObservableHistory(createHashHistoryLib(options));

export const createMemoryHistory = (options?: MemoryHistoryOptions) =>
  createObservableHistory(createMemoryHistoryLib(options));

export const isObservableHistory = <THistory extends History>(
  history: THistory,
): history is ObservableHistory<THistory> => 'destroy' in history;
