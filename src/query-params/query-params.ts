import { LinkedAbortController } from 'linked-abort-controller';
import { action, makeObservable, observable, reaction } from 'mobx';

import { IMobxHistory } from '../mobx-history';
import { IMobxLocation } from '../mobx-location';

import { IQueryParams } from './query-params.types';
import { buildSearchString, parseSearchString } from './utils';

export class QueryParams implements IQueryParams {
  protected abortController: AbortController;

  data!: Record<string, string>;

  constructor(
    private location: IMobxLocation,
    private history: IMobxHistory,
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
      this.history.replaceState(null, '', url);
    } else {
      this.history.pushState(null, '', url);
    }
  }

  set(data: Record<string, any>, replace?: boolean) {
    const url = new URL(this.location.href);

    const searchString = buildSearchString(data);
    const nextUrl = `${url.pathname}${searchString}`;

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
}
