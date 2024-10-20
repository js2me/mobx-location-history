import { Disposer, IDisposer } from 'disposer-util';
import { action, makeObservable, observable, reaction } from 'mobx';
import { AnyObject } from 'yammies/utils/types';

import { IMobxHistory } from '../mobx-history';
import { IMobxLocation } from '../mobx-location';

import { IQueryParams } from './query-params.types';

export class QueryParams implements IQueryParams {
  protected disposer: IDisposer;

  data!: Record<string, string>;

  constructor(
    private location: IMobxLocation,
    private history: IMobxHistory,
    disposer?: IDisposer,
  ) {
    this.disposer = disposer || new Disposer();

    this.disposer.add(
      reaction(
        () => this.location.search,
        (search) => {
          const params = new URLSearchParams(search);
          this.data = Object.fromEntries(params.entries());
        },
        {
          fireImmediately: true,
        },
      ),
    );

    makeObservable<this>(this, {
      data: observable.deep,
      set: action.bound,
      update: action.bound,
    });
  }

  set(data: AnyObject, replace?: boolean) {
    const url = new URL(this.location.href);

    const searchParams = new URLSearchParams(
      Object.entries(data).filter(([, value]) => value != null),
    ).toString();

    const nextUrl = `${url.pathname}${searchParams ? `?${searchParams}` : ''}`;

    if (replace) {
      this.history.replaceState(null, '', nextUrl);
    } else {
      this.history.pushState(null, '', nextUrl);
    }
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

  dispose() {
    this.disposer.dispose();
  }
}
