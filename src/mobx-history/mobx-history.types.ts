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

export type To = string | Partial<Path>;

/**
 * Interface for working with the History API
 * adds reactivity to fields from the History API
 */
export interface IMobxHistory extends History {
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
}
