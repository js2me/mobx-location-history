/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Disposable, Disposer, IDisposer } from 'disposer-util';
import { action, makeObservable, observable, reaction } from 'mobx';

import { MobxHistory } from './mobx-history';

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

type LocationIgnoreFields = 'ancestorOrigins';

export class MobxLocation
  implements Omit<Location, LocationIgnoreFields>, Disposable
{
  disposer: IDisposer;

  hash!: string;
  host!: string;
  hostname!: string;
  href!: string;
  origin!: string;
  pathname!: string;
  port!: string;
  protocol!: string;
  search!: string;

  constructor(
    private history: MobxHistory,
    disposer?: IDisposer,
  ) {
    this.disposer = disposer || new Disposer();
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
      search: observable,
      updateLocationData: action.bound,
    });

    this.disposer.add(
      reaction(() => this.history.data, this.updateLocationData),
    );
  }

  protected updateLocationData() {
    locationReadableFields.forEach((field) => {
      this[field] = location[field];
    });
  }

  toString(): string {
    return location.toString();
  }

  assign(...args: Parameters<Location['assign']>): void {
    return location.assign(...args);
  }

  reload(): void {
    return location.reload();
  }

  replace(...args: Parameters<Location['assign']>): void {
    return location.replace(...args);
  }

  dispose(): void {
    this.disposer.dispose();
  }
}
