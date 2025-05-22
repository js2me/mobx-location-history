import { ILocation } from '../location/index.js';

/**
 * The pathname, search, and hash values of a URL.
 */
export interface Path {
  /**
   * A URL pathname, beginning with a /.
   */
  pathname: string;
  /**
   * A URL search string, beginning with a ?.
   */
  search: string;
  /**
   * A URL fragment identifier, beginning with a #.
   */
  hash: string;
}

export type To = string | Partial<Path> | URL;

export interface HistoryOptions {
  location?: ILocation;
  abortSignal?: AbortSignal;
}

/**
 * Interface for working with the History API
 * adds reactivity to fields from the History API
 */
export interface IHistory
  extends Omit<globalThis.History, 'pushState' | 'replaceState'> {
  location: ILocation;

  /**
   * @deprecated use `push()`. This method will be removed
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/History/pushState)
   */
  pushState(data: any, unused: string, url?: string | URL | null): void;

  /**
   * @deprecated use `replace()`. This method will be removed
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/History/replaceState)
   */
  replaceState(data: any, unused: string, url?: string | URL | null): void;

  /**
   * history npm package like api
   */
  push(to: To, state?: any): void;

  /**
   * history npm package like api
   */
  replace(to: To, state?: any): void;

  /**
   * Removes event listeners
   */
  destroy(): void;

  listen(
    listener: (history: IHistory) => void,
    opts?: { signal?: AbortSignal },
  ): () => void;
}
