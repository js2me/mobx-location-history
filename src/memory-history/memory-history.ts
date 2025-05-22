import { LinkedAbortController } from 'linked-abort-controller';
import {
  action,
  computed,
  createAtom,
  IAtom,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from 'mobx';

import { IHistory, To } from '../history/index.js';
import { normalizePath } from '../history/utils/normalize-path.js';
import { ILocation, Location } from '../location/index.js';

import {
  MemoryHistoryOptions,
  MemoryLocation,
} from './memory-history.types.js';
import { generateKey } from './utils/generate-key.js';

/**
 * A history implementation that doesn't interact with the browser URL.
 * This is useful for tests, non-DOM environments, or scenarios where you
 * want to have full control over the history stack.
 */
export class MemoryHistory implements IHistory {
  location: ILocation;

  private _scrollRestoration: ScrollRestoration;

  protected abortController: AbortController;
  protected atom: IAtom;

  protected entries: MemoryLocation[] = [];
  protected backEntries: MemoryLocation[] = [];

  index: number;

  constructor(options?: MemoryHistoryOptions) {
    this.atom = createAtom('history_update');
    this.abortController = new LinkedAbortController(options?.abortSignal);

    this.entries = (options?.initialEntries ?? ['/']).map((path) => {
      if (typeof path === 'string') {
        return this.createLocation(path);
      }

      return this.createLocation({
        pathname: path.pathname ?? '/',
        search: path.search ?? '',
        hash: path.hash ?? '',
      });
    });

    this._scrollRestoration = 'auto';
    this.index = Math.min(
      Math.max(0, options?.initialIndex ?? this.entries.length - 1),
      this.entries.length - 1,
    );

    observable.ref(this, '_scrollRestoration');
    observable.deep(this, 'entries');
    observable.deep(this, 'backEntries');
    computed.struct(this, 'lastEntry');
    action.bound(this, 'back');
    action.bound(this, 'go');
    action.bound(this, 'forward');
    action.bound(this, 'replaceState');
    action.bound(this, 'pushState');

    makeObservable(this);

    this.location =
      options?.location ??
      new Location({
        history: this,
        abortSignal: this.abortController.signal,
      });
  }

  get scrollRestoration() {
    return this._scrollRestoration;
  }

  set scrollRestoration(scrollRestoration: ScrollRestoration) {
    runInAction(() => {
      this._scrollRestoration = scrollRestoration;
    });
  }

  private get lastEntry() {
    return this.entries.at(-1) ?? null;
  }

  push(to: To, state?: any): void {
    this.pushState(state, '', normalizePath(to));
  }

  pushState(...args: Parameters<globalThis.History['pushState']>): void {
    this.entries.push(this.createLocation(args[2] ?? {}, args[0]));
  }

  replace(to: To, state?: any): void {
    this.replaceState(state, '', normalizePath(to));
  }

  replaceState(...args: Parameters<globalThis.History['replaceState']>): void {
    const lastEntry = this.entries.at(-1)!;
    Object.assign(lastEntry, this.createLocation(args[2] ?? {}, args[0]));
  }

  get length() {
    return this.entries.length;
  }

  get state() {
    return this.lastEntry?.state;
  }

  back(): void {
    const [entry] = this.entries.splice(-1, 1);
    if (entry) {
      this.backEntries.unshift(entry);
    }
  }

  forward(): void {
    if (this.backEntries.length > 0) {
      const entry = this.backEntries.shift()!;
      this.entries.push(entry);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  go(...args: Parameters<globalThis.History['go']>): void {
    throw new Error('not implemented');
    // const delta = args[0] ?? 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const nextIndex = Math.min(
    //   Math.max(this.index + delta, 0),
    //   this.entries.length - 1,
    // );
  }

  destroy(): void {
    this.abortController.abort();
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

  private createLocation(to: To, state?: any): MemoryLocation {
    let pathname: string;
    let search: string = '';
    let hash: string = '';

    if (typeof to === 'string') {
      // Parse URL parts from string
      const url = new URL(to, 'http://localhost:8080');
      pathname = url.pathname;
      search = url.search;
      hash = url.hash;
    } else {
      // Use provided path parts
      pathname = to.pathname ?? '/';
      search = to.search ?? '';
      hash = to.hash ?? '';
    }

    return {
      pathname,
      search,
      hash,
      state: state ?? null,
      scrollRestoration: 'auto',
      key: generateKey(),
    };
  }
}

/**
 * Create a new memory history instance
 */
export const createMemoryHistory = (options: MemoryHistoryOptions = {}) =>
  new MemoryHistory(options);
