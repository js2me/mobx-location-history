/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Disposable, Disposer, IDisposer } from 'disposer-util';
import { action, computed, createAtom, makeObservable } from 'mobx';

const alwaysBoundOriginHistoryMethods: Partial<History> = {};

export class MobxHistory
  implements Omit<History, 'scrollRestoration'>, Disposable
{
  disposer: IDisposer;

  historyUpdate = createAtom('history_update');

  constructor(disposer?: IDisposer) {
    this.disposer = disposer || new Disposer();

    makeObservable<
      this,
      | 'handlePopState'
      | 'handlePushState'
      | 'handleReplaceState'
      | 'handleHashChange'
    >(this, {
      handlePopState: action.bound,
      handlePushState: action.bound,
      handleReplaceState: action.bound,
      handleHashChange: action.bound,
      back: action.bound,
      go: action.bound,
      forward: action.bound,
      replaceState: action.bound,
      pushState: action.bound,
      data: computed,
    });

    const overrideHistoryMethod = (method: keyof History, handler: any) => {
      // @ts-ignore
      alwaysBoundOriginHistoryMethods[method] =
        method in alwaysBoundOriginHistoryMethods
          ? alwaysBoundOriginHistoryMethods[method]
          : globalThis.history[method].bind(globalThis.history);

      // @ts-ignore
      globalThis.history[method] = handler;

      this.disposer.add(() => {
        // @ts-ignore
        globalThis.history[method] = alwaysBoundOriginHistoryMethods[method];
      });
    };

    overrideHistoryMethod('back', this.back);
    overrideHistoryMethod('go', this.go);
    overrideHistoryMethod('forward', this.forward);
    overrideHistoryMethod('replaceState', this.replaceState);
    overrideHistoryMethod('pushState', this.pushState);

    /**
     * History API docs @see https://developer.mozilla.org/en-US/docs/Web/API/History
     */
    globalThis.addEventListener('popstate', this.handlePopState);
    globalThis.addEventListener('pushState', this.handlePushState);
    globalThis.addEventListener('replaceState', this.handleReplaceState);
    globalThis.addEventListener('hashchange', this.handleHashChange);

    this.disposer.add(this.handlePopState);
  }

  get data(): Pick<History, 'state' | 'length'> {
    this.historyUpdate.reportObserved();
    return {
      length: history.length,
      state: history.state,
    };
  }

  protected handlePopState() {
    this.historyUpdate.reportChanged();
  }

  protected handlePushState() {
    this.historyUpdate.reportChanged();
  }

  protected handleReplaceState() {
    this.historyUpdate.reportChanged();
  }

  protected handleHashChange() {
    this.historyUpdate.reportChanged();
  }

  pushState(...args: Parameters<History['pushState']>): void {
    alwaysBoundOriginHistoryMethods.pushState!(...args);
    this.historyUpdate.reportChanged();
  }

  replaceState(...args: Parameters<History['replaceState']>): void {
    alwaysBoundOriginHistoryMethods.replaceState!(...args);
    this.historyUpdate.reportChanged();
  }

  get length() {
    return this.data.length;
  }

  get state() {
    return this.data.state;
  }

  back(): void {
    alwaysBoundOriginHistoryMethods.back!();
    this.historyUpdate.reportChanged();
  }

  forward(): void {
    alwaysBoundOriginHistoryMethods.forward!();
    this.historyUpdate.reportChanged();
  }

  go(...args: Parameters<History['go']>): void {
    alwaysBoundOriginHistoryMethods.go!(...args);
    this.historyUpdate.reportChanged();
  }

  dispose(): void {
    globalThis.removeEventListener('popstate', this.handlePopState);
    globalThis.removeEventListener('pushState', this.handlePushState);
    globalThis.removeEventListener('replaceState', this.handleReplaceState);
    globalThis.removeEventListener('hashchange', this.handleHashChange);
    this.disposer.dispose();
  }
}
