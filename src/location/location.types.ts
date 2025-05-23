import { AnyPrimitive, NonReadonly, PickByValue } from 'yummies/utils/types';

import { AnyHistory } from '../index.js';

export interface LocationOptions {
  history: AnyHistory;
  abortSignal?: AbortSignal;
  getField?: (field: LocationField, history: AnyHistory) => any;
  setField?: (
    field: LocationWritableField,
    value: any,
    history: AnyHistory,
  ) => void;
}

/**
 * Interface for working with the Location API
 * adds reactivity to fields from the Location API
 */
export interface ILocation {
  /**
   * Returns the Location object's URL's fragment (includes leading "#" if non-empty).
   *
   * Can be set, to navigate to the same URL with a changed fragment (ignores leading "#").
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Location/hash)
   */
  hash: string;
  /**
   * Returns the Location object's URL's host and port (if different from the default port for the scheme).
   *
   * Can be set, to navigate to the same URL with a changed host and port.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Location/host)
   */
  host: string;
  /**
   * Returns the Location object's URL's host.
   *
   * Can be set, to navigate to the same URL with a changed host.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Location/hostname)
   */
  hostname: string;
  /**
   * Returns the Location object's URL.
   *
   * Can be set, to navigate to the given URL.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Location/href)
   */
  href: string;
  /**
   * Returns the Location object's URL's origin.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Location/origin)
   */
  readonly origin: string;
  /**
   * Returns the Location object's URL's path.
   *
   * Can be set, to navigate to the same URL with a changed path.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Location/pathname)
   */
  pathname: string;
  /**
   * Returns the Location object's URL's port.
   *
   * Can be set, to navigate to the same URL with a changed port.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Location/port)
   */
  port: string;
  /**
   * Returns the Location object's URL's scheme.
   *
   * Can be set, to navigate to the same URL with a changed scheme.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Location/protocol)
   */
  protocol: string;
  /**
   * Returns the Location object's URL's query (includes leading "?" if non-empty).
   *
   * Can be set, to navigate to the same URL with a changed query (ignores leading "?").
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Location/search)
   */
  search: string;

  toString(): string;

  /**
   * Removes event listeners
   */
  destroy(): void;
}

export type LocationField = keyof PickByValue<ILocation, AnyPrimitive>;

export type LocationWritableField = Extract<
  keyof NonReadonly<ILocation>,
  LocationField
>;
