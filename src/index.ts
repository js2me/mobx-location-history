import { IHistory } from './history/index.js';
import { IMemoryHistory } from './memory-history/index.js';

export * from './history/index.js';
export * from './location/index.js';
export * from './query-params/index.js';
export * from './query-param/index.js';
export * from './memory-history/index.js';

export type AnyHistory = IMemoryHistory | IHistory;
export type AnyLocation = AnyHistory['location'];
