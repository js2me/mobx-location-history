import { LinkedAbortController } from 'linked-abort-controller';
import { action, computed, makeObservable } from 'mobx';
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

  protected parser: typeof parseSearchString<TData>;
  protected builder: typeof buildSearchString;

  constructor(protected options: QueryParamsOptions<TData>) {
    this.history = options.history;
    this.abortController = new LinkedAbortController();
    this.parser = options.parser || parseSearchString;
    this.builder = options.builder || buildSearchString;

    computed.struct(this, 'data');
    action.bound(this, 'set');
    action.bound(this, 'update');

    makeObservable(this);
  }

  get data(): TData {
    return this.parser(
      this.options.history.location.search,
      this.options.parseOptions,
    );
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
