/**
 * Interface for working with query parameters
 */
export interface IQueryParams {
  /**
   * Raw query parameter data (strings)
   */
  data: Record<string, string>;

  /**
   * Sets the query parameters (replacing all existing query parameters in the address bar)
   * If null or undefined is specified, the parameter will not be recorded in the address bar
   */
  set(data: Record<string, any>, replace?: boolean): void;

  /**
   * Updates the query parameters (adds query parameters to the current ones)
   * If null or undefined is specified for value, the parameter will be removed ({ key: undefined })
   */
  update(data: Record<string, any>, replace?: boolean): void;
}
