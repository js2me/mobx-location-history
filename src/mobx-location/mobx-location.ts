/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LinkedAbortController } from 'linked-abort-controller';
import { action, makeObservable, observable, reaction } from 'mobx';

import { IMobxHistory } from '../mobx-history/index.js';

import { IMobxLocation } from './mobx-location.types.js';

const locationReadableFields = [
  'hash',
  'host',
  'hostname',
  'href',
  'origin',
  'pathname',
  'port',
  'protocol',
  'search',
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
    this.originLocation = location;

    /**
     * Проводит инициализацию начальных значений всех свойств из location
     */
    this.initializeLocationProperties();

    observable(this, '_hash');
    observable(this, '_host');
    observable(this, '_hostname');
    observable(this, '_href');
    observable(this, '_origin');
    observable(this, '_pathname');
    observable(this, '_port');
    observable(this, '_protocol');
    observable.ref(this, '_ancestorOrigins');
    observable(this, '_search');

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
    locationReadableFields.forEach((field) => {
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
    locationReadableFields.forEach((field) => {
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
