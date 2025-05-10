/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LinkedAbortController } from 'linked-abort-controller';
import { action, makeObservable, observable, reaction } from 'mobx';

import { IMobxHistory } from '../mobx-history/index.js';

import { IMobxLocation } from './mobx-location.types.js';

const locationFieldConfigs = [
  ['hash', observable.ref],
  ['host', observable.ref],
  ['hostname', observable.ref],
  ['href', observable.ref],
  ['origin', observable.ref],
  ['pathname', observable.ref],
  ['port', observable.ref],
  ['protocol', observable.ref],
  ['ancestorOrigins', observable.ref],
  ['search', observable.ref],
] as const;

export class MobxLocation implements IMobxLocation {
  protected abortController: AbortController;
  protected originLocation: Location;

  private _hash!: string;
  private _host!: string;
  private _hostname!: string;
  private _href!: string;
  private _origin!: string;
  private _pathname!: string;
  private _port!: string;
  private _protocol!: string;
  private _ancestorOrigins!: DOMStringList;
  private _search!: string;

  hash!: string;
  host!: string;
  hostname!: string;
  href!: string;
  origin!: string;
  pathname!: string;
  port!: string;
  protocol!: string;
  ancestorOrigins!: DOMStringList;
  search!: string;

  constructor(
    private history: IMobxHistory,
    abortSignal?: AbortSignal,
  ) {
    this.abortController = new LinkedAbortController(abortSignal);
    this.originLocation = globalThis.location;

    /**
     * Проводит инициализацию начальных значений всех свойств из location
     */
    this.initializeLocationProperties();

    locationFieldConfigs.forEach(([field, config]) => {
      config(this, `_${field}`);
    });

    action.bound(this, 'updateLocationData');

    makeObservable(this);

    reaction(
      () => [this.history.state, this.history.length],
      this.updateLocationData,
      {
        signal: this.abortController.signal,
      },
    );
  }

  protected initializeLocationProperties() {
    locationFieldConfigs.forEach(([field]) => {
      // @ts-ignore
      this[`_${field}`] = this.originLocation[field];
      Object.defineProperty(this, field, {
        get: () => this[`_${field}`],
        set: (value) => {
          this[`_${field}`] = value;
          // @ts-ignore
          this.originLocation[field] = value;
        },
      });
    });
  }

  protected updateLocationData() {
    locationFieldConfigs.forEach(([field]) => {
      // @ts-ignore
      this[`_${field}`] = this.originLocation[field];
    });
  }

  toString(): string {
    return this.originLocation.toString();
  }

  assign(...args: Parameters<Location['assign']>): void {
    return this.originLocation.assign(...args);
  }

  reload(): void {
    return this.originLocation.reload();
  }

  replace(...args: Parameters<Location['assign']>): void {
    return this.originLocation.replace(...args);
  }

  destroy(): void {
    this.abortController.abort();
  }
}

/*#__PURE__*/
export const createMobxLocation = (
  history: IMobxHistory,
  abortSignal?: AbortSignal,
) => new MobxLocation(history, abortSignal);
