import { Disposable } from 'disposer-util';

/**
 * Interface for working with the Location API
 * adds reactivity to fields from the Location API
 */
export interface IMobxLocation extends Location, Disposable {}
