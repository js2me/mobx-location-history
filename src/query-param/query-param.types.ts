import type { AnyObject } from 'yummies/types';

import type { IQueryParams } from '../query-params/index.js';

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
   * @deprecated Use a query parameter preset instead.
   */
  serialize: (value: T | undefined, queryParams: IQueryParams) => any;
  /**
   * Deserialize to working value
   * @deprecated Use a query parameter preset instead.
   */
  deserialize: (value: any, queryParams: IQueryParams) => T | null;
}

export type PresetName = keyof PresetValueMap;

export interface PresetValueMap {
  boolean: boolean;
  booleanArray: boolean[];
  'boolean[]': boolean[];
  date: Date;
  json: Record<string, any>;
  jsonArray: Record<string, any>[];
  'json[]': Record<string, any>[];
  number: number;
  numberArray: number[];
  'number[]': number[];
  string: string;
  stringArray: string[];
  'string[]': string[];
}

export type PresetValue<Preset extends PresetName> = PresetValueMap[Preset];

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

export interface QueryParamPresetConfig<Value, Preset extends string = string> {
  readonly presetName: Preset;
  deserialize: (value: any, queryParams?: IQueryParams) => Value | null;
  serialize: (value: Value | undefined, queryParams?: IQueryParams) => any;
}

export type QueryParamPreset = QueryParamPresetConfig<any, string>;

export type PresetValueFromObject<Preset extends QueryParamPreset> =
  Preset extends QueryParamPresetConfig<infer Value, infer _Name>
    ? Value
    : never;

export type QueryParamsFieldModelPresetObjectConfig<
  Preset extends QueryParamPreset,
> = Omit<
  QueryParamsFieldModelConfig<PresetValueFromObject<Preset>>,
  'serialize' | 'deserialize'
> & {
  preset: Preset;
};
