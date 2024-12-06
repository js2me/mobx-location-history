/* eslint-disable @typescript-eslint/ban-ts-comment */

import { LinkedAbortController } from 'linked-abort-controller';
import { action, computed, createAtom, makeObservable } from 'mobx';

import { IMobxHistory } from './mobx-history.types';

const alwaysBoundOriginHistoryMethods: Partial<History> = {};

export class MobxHistory implements IMobxHistory {
  protected abortController: AbortController;
  protected historyUpdateAtom = createAtom('history_update');
  protected originHistory: History;

  constructor(abortSignal?: AbortSignal) {
    this.abortController = new LinkedAbortController(abortSignal);
    this.originHistory = history;

    action.bound(this, 'handlePopState');
    action.bound(this, 'handlePushState');
    action.bound(this, 'handleReplaceState');
    action.bound(this, 'handleHashChange');
    action.bound(this, 'back');
    action.bound(this, 'go');
    action.bound(this, 'forward');
    action.bound(this, 'replaceState');
    action.bound(this, 'pushState');
    computed(this, 'data');

    makeObservable(this);

    this.overrideHistoryMethod('back', this.back);
    this.overrideHistoryMethod('go', this.go);
    this.overrideHistoryMethod('forward', this.forward);
    this.overrideHistoryMethod('replaceState', this.replaceState);
    this.overrideHistoryMethod('pushState', this.pushState);

    /**
     * History API docs @see https://developer.mozilla.org/en-US/docs/Web/API/History
     */
    globalThis.addEventListener('popstate', this.handlePopState, {
      signal: this.abortController.signal,
    });
    globalThis.addEventListener('pushState', this.handlePushState, {
      signal: this.abortController.signal,
    });
    globalThis.addEventListener('replaceState', this.handleReplaceState, {
      signal: this.abortController.signal,
    });
    globalThis.addEventListener('hashchange', this.handleHashChange, {
      signal: this.abortController.signal,
    });
  }

  protected overrideHistoryMethod(method: keyof History, handler: any) {
    // @ts-ignore
    alwaysBoundOriginHistoryMethods[method] =
      method in alwaysBoundOriginHistoryMethods
        ? alwaysBoundOriginHistoryMethods[method]
        : this.originHistory[method].bind(this.originHistory);

    // @ts-ignore
    this.originHistory[method] = handler;

    this.abortController.signal.addEventListener('abort', () => {
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
}
