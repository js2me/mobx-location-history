import { createLocation, Location } from './location.js';
import { ILocation } from './location.types.js';

export * from './location.types.js';
export * from './location.js';

/**
 * @deprecated use {createLocation}. Will be removed in next major release
 */
export const createMobxLocation = createLocation;

/**
 * @deprecated use {Location}. Will be removed in next major release
 */
export const MobxLocation = Location;

/**
 * @deprecated use {ILocation}. Will be removed in next major release
 */
export type IMobxLocation = ILocation;
