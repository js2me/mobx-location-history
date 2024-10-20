import { Disposable } from 'disposer-util';
import { AnyObject } from 'yammies/utils/types';

export interface IQueryParams extends Disposable {
  data: Record<string, string>;
  set(data: AnyObject, replace?: boolean): void;
  update(data: AnyObject, replace?: boolean): void;
}
