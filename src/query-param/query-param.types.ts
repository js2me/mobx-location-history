import type { AnyObject } from 'yummies/utils/types';

import type { IQueryParams } from '../query-params/index.js';

import type { queryParamPresets } from './query-param-presets.js';

export interface QueryParamsFieldModelConfig<T> {
  queryParams: IQueryParams;
  /**
   * Name of the field in query parameters
   */
  name: string;
  /**
   * Default value if nothing is present
   */
  defaultValue: T;
  /**
   * Strategy for updating this field
   */
  strategy?: 'replace' | 'push';
  /**
   * Serialize query param value
   */
  serialize: (value: T | undefined, queryParams: IQueryParams) => any;
  /**
   * Deserialize to working value
   */
  deserialize: (value: any, queryParams: IQueryParams) => T | null;
}

export type PresetName = keyof typeof queryParamPresets;

export type DefinePresetByType<T> = T extends string[]
  ? 'string[]'
  : T extends number[]
    ? 'number[]'
    : T extends string
      ? 'string'
      : T extends boolean
        ? 'boolean'
        : T extends number
          ? 'number'
          : T extends AnyObject
            ? 'json'
            : 'string';

export interface QueryParamsFieldModelPresetConfig<Preset extends PresetName, T>
  extends Omit<QueryParamsFieldModelConfig<T>, 'serialize' | 'deserialize'> {
  preset: Preset;
}
