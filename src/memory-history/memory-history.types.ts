import type { HistoryOptions, IHistory, Path } from '../history/index.js';

/**
 * MemoryHistory specific options
 */
export interface MemoryHistoryOptions extends HistoryOptions {
  /**
   * Initial location entries for the memory history
   * Can be an array of paths or location objects
   * @default ['/']
   */
  initialEntries?: (Partial<Path> | string)[];

  /**
   * Initial active history entry index
   * @default initialEntries.length - 1
   */
  initialIndex?: number;
}

/**
 * Interface for location objects in memory history
 */
export interface MemoryLocation extends Path {
  /**
   * State object associated with this location
   */
  state: any;

  /**
   * Key uniquely identifying this location
   */
  key: string;

  /**
   * Allows web applications to explicitly set default scroll restoration behavior on history navigation.
   */
  scrollRestoration: ScrollRestoration;
}

export interface IMemoryHistory extends Omit<IHistory, 'location' | 'listen'> {
  location: MemoryLocation;

  listen(
    listener: (history: IMemoryHistory) => void,
    opts?: { signal?: AbortSignal },
  ): () => void;
}
