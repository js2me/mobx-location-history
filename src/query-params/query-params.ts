import { LinkedAbortController } from 'linked-abort-controller';
import { action, computed } from 'mobx';
import { applyObservable } from 'yummies/mobx';
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

    applyObservable(this, [
      [computed.struct, 'data'],
      [action.bound, 'set', 'update'],
    ]);
  }

  /**
   * [**Documentation**](https://js2me.github.io/mobx-location-history/utilities/QueryParams#data)
   */
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

  /**
   * [**Documentation**](https://js2me.github.io/mobx-location-history/utilities/QueryParams#tostringdata-addqueryprefix)
   */
  toString(data?: Record<string, any>, addQueryPrefix?: boolean) {
    const buildOptions =
      addQueryPrefix === undefined
        ? this.options.buildOptions
        : {
            ...this.options.buildOptions,
            addQueryPrefix,
          };

    return this.builder(
      data ?? (this.data as Record<string, any>),
      buildOptions,
    );
  }

  /**
   * [**Documentation**](https://js2me.github.io/mobx-location-history/utilities/QueryParams#createurldata-path)
   */
  createUrl(
    data: Record<string, any>,
    path: string = this.history.location.pathname,
  ) {
    return `${path}${this.toString(data)}`;
  }

  /**
   * @deprecated use `createUrl`
   */
  buildUrl(data: Record<string, any>) {
    return this.createUrl(data);
  }

  /**
   * [**Documentation**](https://js2me.github.io/mobx-location-history/utilities/QueryParams#setdata-replace)
   */
  set(data: Record<string, any>, replace?: boolean) {
    const nextUrl = this.createUrl(data);

    this.navigate(nextUrl, replace);
  }

  /**
   * [**Documentation**](https://js2me.github.io/mobx-location-history/utilities/QueryParams#updatedata-replace)
   */
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
