import type { AnyObject } from 'yummies/types';

import type { IQueryParams } from '../query-params/index.js';
import type { presets } from './query-param-presets.js';

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
  serialize?: (value: T | undefined, queryParams: IQueryParams) => any;
  /**
   * Deserialize to working value
   */
  deserialize?: (value: any, queryParams: IQueryParams) => T | null;
}

export interface QueryParamPresetConfig<Value> {
  deserialize: (value: any, queryParams?: IQueryParams) => Value | null;
  serialize: (value: Value | undefined, queryParams?: IQueryParams) => any;
}

type ExportedPresets = typeof presets;

export type PresetName = {
  [Name in keyof ExportedPresets]: ExportedPresets[Name] extends QueryParamPresetConfig<any>
    ? Name
    : never;
}[keyof ExportedPresets];

export type PresetValueMap = {
  [Name in PresetName]: ExportedPresets[Name] extends QueryParamPresetConfig<
    infer Value
  >
    ? Value
    : never;
};

export type PresetValue<Preset extends PresetName> = PresetValueMap[Preset];

/** @deprecated - use preset */
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

export type QueryParamPreset = QueryParamPresetConfig<any>;

export type PresetValueFromObject<Preset extends QueryParamPreset> =
  Preset extends QueryParamPresetConfig<infer Value> ? Value : never;

export type QueryParamsFieldModelPresetObjectConfig<
  Preset extends QueryParamPreset,
> = Omit<
  QueryParamsFieldModelConfig<PresetValueFromObject<Preset>>,
  'serialize' | 'deserialize'
> & {
  preset: Preset;
};
