import { LinkedAbortController } from 'linked-abort-controller';
import { action, makeObservable, observable, reaction } from 'mobx';

import { AnyHistory, AnyLocation } from '../index.js';

import { IQueryParams, QueryParamsOptions } from './query-params.types.js';
import { buildSearchString, parseSearchString } from './utils/index.js';

export class QueryParams implements IQueryParams {
  protected abortController: AbortController;
  private history: AnyHistory;
  private location: AnyLocation;

  data!: Record<string, string>;

  constructor(options: QueryParamsOptions) {
    this.history = options.history;
    this.location = this.history.location;
    this.abortController = new LinkedAbortController(options?.abortSignal);

    reaction(
      () => options.history.location.search,
      (search) => {
        this.data = parseSearchString(search);
      },
      {
        fireImmediately: true,
        signal: this.abortController.signal,
      },
    );

    observable.deep(this, 'data');
    action.bound(this, 'set');
    action.bound(this, 'update');

    makeObservable(this);
  }

  protected navigate(url: string, replace?: boolean) {
    if (replace) {
      this.history.replace(url);
    } else {
      this.history.push(url);
    }
  }

  buildUrl(data: Record<string, any>) {
    let pathname: string;

    if ('href' in this.location) {
      const url = new URL(this.location.href);
      pathname = url.pathname;
    } else {
      pathname = this.location.pathname;
    }

    const searchString = buildSearchString(data);

    return `${pathname}${searchString}`;
  }

  set(data: Record<string, any>, replace?: boolean) {
    const nextUrl = this.buildUrl(data);

    this.navigate(nextUrl, replace);
  }

  update(data: Record<string, any>, replace?: boolean) {
    this.set(
      {
        ...this.data,
        ...data,
      },
      replace,
    );
  }

  destroy(): void {
    this.abortController.abort();
  }
}
