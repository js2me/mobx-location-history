/**
 * Interface for working with the Location API
 * adds reactivity to fields from the Location API
 */
export interface ILocation extends globalThis.Location {
  /**
   * Removes event listeners
   */
  destroy(): void;
}
