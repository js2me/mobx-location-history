import { LinkedAbortController } from 'linked-abort-controller';
import { action, makeObservable, observable, reaction } from 'mobx';
import { AnyObject } from 'yammies/utils/types';

import { IMobxHistory } from '../mobx-history';
import { IMobxLocation } from '../mobx-location';

import { IQueryParams } from './query-params.types';

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
        const params = new URLSearchParams(search);
        this.data = Object.fromEntries(params.entries());
      },
      {
        fireImmediately: true,
        signal: this.abortController.signal,
      },
    );

    makeObservable<this>(this, {
      data: observable.deep,
      set: action.bound,
      update: action.bound,
    });
  }

  protected navigate(url: string, replace?: boolean) {
    if (replace) {
      this.history.replaceState(null, '', url);
    } else {
      this.history.pushState(null, '', url);
    }
  }

  set(data: AnyObject, replace?: boolean) {
    const url = new URL(this.location.href);

    const searchParams = new URLSearchParams(
      Object.entries(data).filter(([, value]) => value != null),
    ).toString();

    const nextUrl = `${url.pathname}${searchParams ? `?${searchParams}` : ''}`;

    this.navigate(nextUrl, replace);
  }

  update(data: AnyObject, replace?: boolean) {
    this.set(
      {
        ...this.data,
        ...data,
      },
      replace,
    );
  }
}
