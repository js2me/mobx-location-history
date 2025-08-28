import { LinkedAbortController } from 'linked-abort-controller';
import { action, makeObservable, observable, reaction } from 'mobx';

import type { History } from '../index.js';

import type { IQueryParams, QueryParamsOptions } from './query-params.types.js';
import { buildSearchString, parseSearchString } from './utils/index.js';

export class QueryParams implements IQueryParams {
  protected abortController: AbortController;
  private history: History;

  data!: Record<string, string>;

  constructor(options: QueryParamsOptions) {
    this.history = options.history;
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
    const searchString = buildSearchString(data);

    return `${this.history.location.pathname}${searchString}`;
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

export const createQueryParams = (options: QueryParamsOptions) =>
  new QueryParams(options);
