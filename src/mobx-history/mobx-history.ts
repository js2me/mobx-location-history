/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Disposer, IDisposer } from 'disposer-util';
import { action, computed, createAtom, makeObservable } from 'mobx';

import { IMobxHistory } from './mobx-history.types';

const alwaysBoundOriginHistoryMethods: Partial<History> = {};

export class MobxHistory implements IMobxHistory {
  protected disposer: IDisposer;
  protected historyUpdateAtom = createAtom('history_update');
  protected originHistory: History;

  constructor(disposer?: IDisposer) {
    this.disposer = disposer || new Disposer();
    this.originHistory = history;

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

    this.overrideHistoryMethod('back', this.back);
    this.overrideHistoryMethod('go', this.go);
    this.overrideHistoryMethod('forward', this.forward);
    this.overrideHistoryMethod('replaceState', this.replaceState);
    this.overrideHistoryMethod('pushState', this.pushState);

    /**
     * History API docs @see https://developer.mozilla.org/en-US/docs/Web/API/History
     */
    globalThis.addEventListener('popstate', this.handlePopState);
    globalThis.addEventListener('pushState', this.handlePushState);
    globalThis.addEventListener('replaceState', this.handleReplaceState);
    globalThis.addEventListener('hashchange', this.handleHashChange);

    this.disposer.add(this.handlePopState);
  }

  protected overrideHistoryMethod(method: keyof History, handler: any) {
    // @ts-ignore
    alwaysBoundOriginHistoryMethods[method] =
      method in alwaysBoundOriginHistoryMethods
        ? alwaysBoundOriginHistoryMethods[method]
        : this.originHistory[method].bind(this.originHistory);

    // @ts-ignore
    this.originHistory[method] = handler;

    this.disposer.add(() => {
      // @ts-ignore
      this.originHistory[method] = alwaysBoundOriginHistoryMethods[method];
    });
  }

  get scrollRestoration() {
    this.historyUpdateAtom.reportObserved();
    return this.originHistory.scrollRestoration;
  }

  set scrollRestoration(scrollRestoration: ScrollRestoration) {
    this.historyUpdateAtom.reportChanged();
    this.originHistory.scrollRestoration = scrollRestoration;
  }

  get data(): Pick<History, 'state' | 'length' | 'scrollRestoration'> {
    this.historyUpdateAtom.reportObserved();

    return {
      length: this.originHistory.length,
      state: this.originHistory.state,
      scrollRestoration: this.originHistory.scrollRestoration,
    };
  }

  protected handlePopState() {
    this.historyUpdateAtom.reportChanged();
  }

  protected handlePushState() {
    this.historyUpdateAtom.reportChanged();
  }

  protected handleReplaceState() {
    this.historyUpdateAtom.reportChanged();
  }

  protected handleHashChange() {
    this.historyUpdateAtom.reportChanged();
  }

  pushState(...args: Parameters<History['pushState']>): void {
    alwaysBoundOriginHistoryMethods.pushState!(...args);
    this.historyUpdateAtom.reportChanged();
  }

  replaceState(...args: Parameters<History['replaceState']>): void {
    alwaysBoundOriginHistoryMethods.replaceState!(...args);
    this.historyUpdateAtom.reportChanged();
  }

  get length() {
    this.historyUpdateAtom.reportObserved();
    return this.originHistory.length;
  }

  get state() {
    this.historyUpdateAtom.reportObserved();
    return this.originHistory.state;
  }

  back(): void {
    alwaysBoundOriginHistoryMethods.back!();
    this.historyUpdateAtom.reportChanged();
  }

  forward(): void {
    alwaysBoundOriginHistoryMethods.forward!();
    this.historyUpdateAtom.reportChanged();
  }

  go(...args: Parameters<History['go']>): void {
    alwaysBoundOriginHistoryMethods.go!(...args);
    this.historyUpdateAtom.reportChanged();
  }

  dispose(): void {
    globalThis.removeEventListener('popstate', this.handlePopState);
    globalThis.removeEventListener('pushState', this.handlePushState);
    globalThis.removeEventListener('replaceState', this.handleReplaceState);
    globalThis.removeEventListener('hashchange', this.handleHashChange);
    this.disposer.dispose();
  }
}
