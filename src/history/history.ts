/* eslint-disable @typescript-eslint/ban-ts-comment */

import { LinkedAbortController } from 'linked-abort-controller';
import { action, createAtom, IAtom, makeObservable, reaction } from 'mobx';

import { ILocation } from '../location/index.js';
import { Location } from '../location/location.js';

import { HistoryOptions, IHistory, To } from './history.types.js';
import { normalizePath } from './utils/normalize-path.js';

const historyEvents = ['popstate', 'pushState', 'replaceState', 'hashchange'];

const originHistoryMethods: Partial<globalThis.History> = {};

export class History implements IHistory {
  location: ILocation;

  protected abortController: AbortController;
  protected atom: IAtom;
  protected originHistory: globalThis.History;

  constructor(options?: HistoryOptions) {
    this.atom = createAtom('history_update');
    this.abortController = new LinkedAbortController(options?.abortSignal);
    this.originHistory = history;

    action.bound(this, 'back');
    action.bound(this, 'go');
    action.bound(this, 'forward');
    action.bound(this, 'replaceState');
    action.bound(this, 'pushState');

    makeObservable(this);

    this.overrideHistoryMethod('back', this.back);
    this.overrideHistoryMethod('go', this.go);
    this.overrideHistoryMethod('forward', this.forward);
    this.overrideHistoryMethod('replaceState', this.replaceState);
    this.overrideHistoryMethod('pushState', this.pushState);

    this.location =
      options?.location ??
      new Location({
        history: this,
        abortSignal: this.abortController.signal,
      });

    /**
     * History API docs @see https://developer.mozilla.org/en-US/docs/Web/API/History
     */
    historyEvents.forEach((event) => {
      globalThis.addEventListener(event, this.reportChanged, {
        signal: this.abortController.signal,
      });
    });
  }

  protected overrideHistoryMethod(method: keyof History, handler: any) {
    if (!(method in originHistoryMethods)) {
      // @ts-ignore
      originHistoryMethods[method] = this.originHistory[method].bind(
        this.originHistory,
      );
    }

    // @ts-ignore
    this.originHistory[method] = handler;

    this.abortController.signal.addEventListener('abort', () => {
      // @ts-ignore
      this.originHistory[method] = originHistoryMethods[method];
    });
  }

  get scrollRestoration() {
    this.atom.reportObserved();
    return this.originHistory.scrollRestoration;
  }

  set scrollRestoration(scrollRestoration: ScrollRestoration) {
    this.reportChanged();
    this.originHistory.scrollRestoration = scrollRestoration;
  }

  get data(): Pick<History, 'state' | 'length' | 'scrollRestoration'> {
    this.atom.reportObserved();

    return {
      length: this.originHistory.length,
      state: this.originHistory.state,
      scrollRestoration: this.originHistory.scrollRestoration,
    };
  }

  push(to: To, state?: any): void {
    this.pushState(state, '', normalizePath(to));
  }

  pushState(...args: Parameters<globalThis.History['pushState']>): void {
    originHistoryMethods.pushState!(...args);
    this.reportChanged();
  }

  replace(to: To, state?: any): void {
    this.replaceState(state, '', normalizePath(to));
  }

  replaceState(...args: Parameters<globalThis.History['replaceState']>): void {
    originHistoryMethods.replaceState!(...args);
    this.reportChanged();
  }

  get length() {
    this.atom.reportObserved();
    return this.originHistory.length;
  }

  get state() {
    this.atom.reportObserved();
    return this.originHistory.state;
  }

  back(): void {
    originHistoryMethods.back!();
    this.reportChanged();
  }

  forward(): void {
    originHistoryMethods.forward!();
    this.reportChanged();
  }

  go(...args: Parameters<IHistory['go']>): void {
    originHistoryMethods.go!(...args);
    this.reportChanged();
  }

  listen(
    listener: (history: IHistory) => void,
    opts?: { signal?: AbortSignal },
  ): () => void {
    return reaction(
      () => [this.state, this.length, this.scrollRestoration],
      () => listener(this),
      { signal: opts?.signal ?? this.abortController.signal },
    );
  }

  protected reportChanged = () => {
    this.atom.reportChanged();
  };

  destroy(): void {
    this.abortController.abort();
  }
}

/*#__PURE__*/
export const createHistory = (params?: HistoryOptions) => new History(params);
