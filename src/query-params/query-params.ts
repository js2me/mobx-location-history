import { LinkedAbortController } from 'linked-abort-controller';
import { action, makeObservable, observable, reaction } from 'mobx';

import { IHistory } from '../history/index.js';
import { ILocation } from '../location/index.js';

import { IQueryParams } from './query-params.types.js';
import { buildSearchString, parseSearchString } from './utils/index.js';

export class QueryParams implements IQueryParams {
  protected abortController: AbortController;

  data!: Record<string, string>;

  constructor(
    private location: ILocation,
    private history: IHistory,
    abortSignal?: AbortSignal,
  ) {
    this.abortController = new LinkedAbortController(abortSignal);

    reaction(
      () => this.location.search,
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
    const url = new URL(this.location.href);

    const searchString = buildSearchString(data);

    return `${url.pathname}${searchString}`;
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
