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
