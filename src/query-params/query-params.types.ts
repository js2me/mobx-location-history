import type { History } from 'history';
import type {
  buildSearchString,
  ParsedSearchString,
  parseSearchString,
} from './utils/index.js';

export type RawQueryParamsData = ParsedSearchString;

/**
 * Options for the `update` method.
 */
export interface QueryParamsUpdateOptions {
  /** Replace the current history entry instead of pushing a new one. */
  replace?: boolean;
  /** Keys to remove from the current query parameters before merging. */
  delete?: string[];
}

export interface QueryParamsOptions<TData = ParsedSearchString> {
  history: History;
  buildOptions?: Parameters<typeof buildSearchString>[1];
  parseOptions?: Parameters<typeof parseSearchString>[1];
  parser?: typeof parseSearchString<TData>;
  builder?: typeof buildSearchString;

  /**
   * @deprecated
   */
  abortSignal?: AbortSignal;
}

/**
 * Interface for working with query parameters
 */
export interface IQueryParams<TData = ParsedSearchString> {
  /**
   * Raw query parameter data (strings)
   */
  data: TData;

  /**
   * Sets the query parameters (replacing all existing query parameters in the address bar)
   * If null or undefined is specified, the parameter will not be recorded in the address bar
   */
  set(data: Record<string, any>, replace?: boolean): void;

  /**
   * Merges the given data into the current query parameters.
   * Values of `null` or `undefined` will remove the corresponding key.
   * You can also pass an options object as the second argument to delete keys and control navigation behavior.
   */
  update(
    data: Record<string, any>,
    replaceOrOptions?: boolean | QueryParamsUpdateOptions,
  ): void;

  /**
   * Removes query parameters by their keys.
   */
  delete(keys: string[], replace?: boolean): void;

  /**
   * Builds a URL with the query parameters (first argument)
   */
  createUrl(data: Record<string, any>): string;

  /**
   * Destroy the QueryParams instance
   * @deprecated
   */
  destroy(): void;
}
