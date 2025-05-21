import { createHistory } from './history.js';
import { IHistory } from './history.types.js';

export * from './history.types.js';
export * from './history.js';

/**
 * @deprecated use {createLocation}. Will be removed in next major release
 */
export const createMobxHistory = createHistory;

/**
 * @deprecated use {History}. Will be removed in next major release
 */
export const MobxHistory = History;

/**
 * @deprecated use {ILocation}. Will be removed in next major release
 */
export type IMobxHistory = IHistory;
