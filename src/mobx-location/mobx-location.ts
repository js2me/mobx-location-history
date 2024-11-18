/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LinkedAbortController } from 'linked-abort-controller';
import { action, makeObservable, observable, reaction } from 'mobx';

import { IMobxHistory } from '../mobx-history';

import { IMobxLocation } from './mobx-location.types';

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
    this.updateLocationData();

    makeObservable<this, 'updateLocationData'>(this, {
      hash: observable,
      host: observable,
      hostname: observable,
      href: observable,
      origin: observable,
      pathname: observable,
      port: observable,
      protocol: observable,
      ancestorOrigins: observable.ref,
      search: observable,
      updateLocationData: action.bound,
    });

    reaction(
      () => [this.history.state, this.history.length],
      this.updateLocationData,
      {
        signal: this.abortController.signal,
      },
    );
  }

  protected updateLocationData() {
    locationReadableFields.forEach((field) => {
      this[field] = this.originLocation[field];
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
}
