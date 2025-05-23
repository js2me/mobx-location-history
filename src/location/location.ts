/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LinkedAbortController } from 'linked-abort-controller';
import { action, makeObservable, observable } from 'mobx';

import { AnyHistory } from '../index.js';

import {
  ILocation,
  LocationOptions,
  LocationWritableField,
} from './location.types.js';

const locationFieldConfigs = [
  ['hash', observable.ref],
  ['host', observable.ref],
  ['hostname', observable.ref],
  ['href', observable.ref],
  ['origin', observable.ref],
  ['pathname', observable.ref],
  ['port', observable.ref],
  ['protocol', observable.ref],
  ['search', observable.ref],
  // ['key', observable.ref],
  // ['scrollRestoration', observable.ref],
  // ['state', observable.ref],
] as const satisfies [keyof ILocation, any][];

export const defaultFieldSetter: Required<LocationOptions>['setField'] = (
  field,
  value,
) => {
  globalThis.location[field] = value;
};

export const defaultFieldGetter: Required<LocationOptions>['getField'] = (
  field,
) => {
  return globalThis.location[field];
};

export class Location implements ILocation {
  protected abortController: AbortController;
  protected history: AnyHistory;

  private _observableFields!: Record<keyof ILocation, any>;

  hash!: string;
  host!: string;
  hostname!: string;
  href!: string;
  origin!: string;
  pathname!: string;
  port!: string;
  protocol!: string;
  search!: string;
  key!: string;
  scrollRestoration!: ScrollRestoration;
  state!: any;

  private fieldSetter: Required<LocationOptions>['setField'];
  private fieldGetter: Required<LocationOptions>['getField'];

  constructor(options: LocationOptions) {
    this.abortController = new LinkedAbortController(options.abortSignal);
    this._observableFields = {} as Record<keyof ILocation, any>;

    this.history = options.history;
    this.fieldSetter = options.setField ?? defaultFieldSetter;
    this.fieldGetter = options.getField ?? defaultFieldGetter;

    /**
     * Проводит инициализацию начальных значений всех свойств из location
     */
    locationFieldConfigs.forEach(([field]) => {
      this._observableFields[field] = this.fieldGetter(field, this.history);
      Object.defineProperty(this, field, {
        get: () => this._observableFields[field],
        set: (value) => {
          this._observableFields[field] = value;
          this.fieldSetter(field as LocationWritableField, value, this.history);
        },
      });
    });

    locationFieldConfigs.forEach(([field, config]) => {
      config(this._observableFields, field);
    });

    action.bound(this, 'syncLocationData');

    makeObservable(this._observableFields);
    makeObservable(this);

    options.history.listen(
      () => {
        this.syncLocationData();
      },
      {
        signal: this.abortController.signal,
      },
    );
  }

  protected syncLocationData() {
    locationFieldConfigs.forEach(([field]) => {
      this._observableFields[field] = this.fieldGetter(field, this.history);
    });
  }

  toString(): string {
    return this.href;
  }

  destroy(): void {
    this.abortController.abort();
  }
}

export const createLocation = (options: LocationOptions) =>
  new Location(options);
