import { LinkedAbortController } from 'linked-abort-controller';
import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from 'mobx';

import { To } from '../history/index.js';
import { normalizePath } from '../history/utils/normalize-path.js';

import {
  IMemoryHistory,
  MemoryHistoryOptions,
  MemoryLocation,
} from './memory-history.types.js';
import { generateKey } from './utils/generate-key.js';

/**
 * A history implementation that doesn't interact with the browser URL.
 * This is useful for tests, non-DOM environments, or scenarios where you
 * want to have full control over the history stack.
 */
export class MemoryHistory implements IMemoryHistory {
  protected abortController: AbortController;

  protected entries: MemoryLocation[] = [];

  index: number;

  constructor(options?: MemoryHistoryOptions) {
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

    this.index = Math.min(
      Math.max(0, options?.initialIndex ?? this.entries.length - 1),
      this.entries.length - 1,
    );

    observable.ref(this, 'index');
    observable.deep(this, 'entries');
    computed.struct(this, 'lastEntry');
    computed.struct(this, 'length');
    computed.struct(this, 'state');

    action.bound(this, 'back');
    action.bound(this, 'go');
    action.bound(this, 'forward');
    action.bound(this, 'replaceState');
    action.bound(this, 'pushState');

    makeObservable(this);
  }

  get location() {
    return this.entries[this.index];
  }

  get scrollRestoration() {
    return this.location?.scrollRestoration ?? 'auto';
  }

  set scrollRestoration(scrollRestoration: ScrollRestoration) {
    runInAction(() => {
      if (this.location) {
        this.location.scrollRestoration = scrollRestoration;
      }
    });
  }

  push(to: To, state?: any): void {
    this.pushState(state, '', normalizePath(to));
  }

  pushState(...args: Parameters<globalThis.History['pushState']>): void {
    const currentIndexIsLast = this.index === this.length - 1;
    const nextLocation = this.createLocation(args[2] ?? {}, {
      state: args[0],
      scrollRestoration: this.location?.scrollRestoration,
    });

    if (!currentIndexIsLast) {
      this.entries.splice(this.index);
    }

    this.entries.push(nextLocation);
    this.index = this.entries.length - 1;
  }

  replace(to: To, state?: any): void {
    this.replaceState(state, '', normalizePath(to));
  }

  replaceState(...args: Parameters<globalThis.History['replaceState']>): void {
    if (this.location) {
      const nextLocation = this.createLocation(args[2] ?? {}, {
        state: args[0],
        scrollRestoration: this.location.scrollRestoration,
      });

      Object.assign(this.location, nextLocation);
    }
  }

  get length() {
    return this.entries.length;
  }

  get state() {
    return this.location?.state;
  }

  back(): void {
    this.go(-1);
  }

  forward(): void {
    this.go(1);
  }

  go(...args: Parameters<globalThis.History['go']>): void {
    const delta = args[0] ?? 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const nextIndex = Math.min(
      Math.max(this.index + delta, 0),
      this.length - 1,
    );

    this.index = nextIndex;
  }

  listen(
    listener: (history: IMemoryHistory) => void,
    opts?: { signal?: AbortSignal },
  ): () => void {
    return reaction(
      () => [Object.values(this.location), this.length, this.state],
      () => listener(this),
      { signal: opts?.signal ?? this.abortController.signal },
    );
  }

  private createLocation(
    to: To,
    extra?: Partial<Pick<MemoryLocation, 'state' | 'scrollRestoration'>>,
  ): MemoryLocation {
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
      pathname = to?.pathname ?? '/';
      search = to?.search ?? '';
      hash = to?.hash ?? '';
    }

    return {
      pathname,
      search,
      hash,
      state: extra?.state ?? null,
      scrollRestoration: extra?.scrollRestoration ?? 'auto',
      key: generateKey(),
    };
  }

  destroy(): void {
    this.abortController.abort();
  }
}

/**
 * Create a new memory history instance
 */
export const createMemoryHistory = (options: MemoryHistoryOptions = {}) =>
  new MemoryHistory(options);
