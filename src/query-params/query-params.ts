import { LinkedAbortController } from 'linked-abort-controller';
import { action, makeObservable, observable, reaction } from 'mobx';
import { lazyObserve } from 'yummies/mobx';
import type { History, ParsedSearchString } from '../index.js';
import type { IQueryParams, QueryParamsOptions } from './query-params.types.js';
import { buildSearchString, parseSearchString } from './utils/index.js';

export class QueryParams<TData = ParsedSearchString>
  implements IQueryParams<TData>
{
  /**
   * @deprecated not needed
   */
  protected abortController: AbortController;
  private history: History;

  data: TData;

  protected parser: typeof parseSearchString<TData>;
  protected builder: typeof buildSearchString;

  constructor(protected options: QueryParamsOptions<TData>) {
    this.history = options.history;
    this.abortController = new LinkedAbortController();
    this.parser = options.parser || parseSearchString;
    this.builder = options.builder || buildSearchString;
    this.data = this.parser(
      options.history.location.search,
      options.parseOptions,
    );

    observable.deep(this, 'data');
    action.bound(this, 'set');
    action.bound(this, 'update');

    makeObservable(this);

    lazyObserve({
      context: this,
      property: 'data',
      onStart: () =>
        reaction(
          () => options.history.location.search,
          action((search) => {
            this.data = this.parser(search, options.parseOptions);
          }),
        ),
      onEnd: (disposer) => {
        return disposer();
      },
    });
  }

  protected navigate(url: string, replace?: boolean) {
    if (replace) {
      this.history.replace(url);
    } else {
      this.history.push(url);
    }
  }

  buildUrl(data: Record<string, any>) {
    const searchString = this.builder(data, this.options.buildOptions);
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

  /**
   * @deprecated
   * is not needed
   */
  destroy(): void {}
}

export const createQueryParams = (options: QueryParamsOptions) =>
  new QueryParams(options);
