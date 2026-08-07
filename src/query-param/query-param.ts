import { action, computed } from 'mobx';
import { applyObservable } from 'yummies/mobx';
import type {
  DefinePresetByType,
  PresetValueFromObject,
  QueryParamPreset,
  QueryParamsFieldModelConfig,
  QueryParamsFieldModelPresetConfig,
  QueryParamsFieldModelPresetObjectConfig,
} from './query-param.types.js';
import { queryParamPresets } from './query-param-presets.js';

const identityFn = (value: any) => value;

/**
 * Create get\set value, which is synchronized with the query parameter
 * Manual handling of the query parameter
 */
export class QueryParam<T> {
  name: string;

  private config: QueryParamsFieldModelConfig<T> &
    Required<Pick<QueryParamsFieldModelConfig<T>, 'serialize' | 'deserialize'>>;

  constructor(config: QueryParamsFieldModelConfig<T>) {
    this.config = {
      ...config,
      serialize: config.serialize ?? identityFn,
      deserialize: config.deserialize ?? identityFn,
    };
    this.name = this.config.name;

    applyObservable(this, [
      [computed.struct, 'rawValue', 'value'],
      [action, 'set'],
    ]);
  }

  get rawValue() {
    return this.config.queryParams.data[this.name];
  }

  get value(): T {
    return (
      this.config.deserialize(this.rawValue, this.config.queryParams) ??
      this.config.defaultValue
    );
  }

  set = async (value: T | undefined) => {
    if (value === this.value) {
      return;
    }

    const serializedValue = this.config.serialize(
      value,
      this.config.queryParams,
    );

    this.config.queryParams.update(
      {
        [this.name]: serializedValue,
      },
      this.config.strategy !== 'push',
    );
  };

  buildUrl = (value?: T) => {
    const serializedValue = this.config.serialize(
      value ?? this.value,
      this.config.queryParams,
    );

    return this.config.queryParams.createUrl({
      [this.name]: serializedValue,
    });
  };
}

/**
 * Create get\set value, which is synchronized with the query parameter
 * Manual handling of the query parameter
 */
export function createQueryParam<T>(
  config: QueryParamsFieldModelConfig<T>,
): QueryParam<T>;
export function createQueryParam<Preset extends QueryParamPreset>(
  config: QueryParamsFieldModelPresetObjectConfig<Preset>,
): QueryParam<PresetValueFromObject<Preset>>;
export function createQueryParam<T>(
  config:
    | QueryParamsFieldModelConfig<T>
    | QueryParamsFieldModelPresetObjectConfig<QueryParamPreset>,
): QueryParam<T> {
  if ('preset' in config) {
    return new QueryParam<any>({
      ...config,
      ...config.preset,
    });
  }

  return new QueryParam<any>(config);
}

/**
 * Create get\set value, which is synchronized with the query parameter
 * Create by preset
 *
 * @deprecated Use `createQueryParam` with an object preset instead.
 */
export const createQueryParamFromPreset = <T>(
  config: QueryParamsFieldModelPresetConfig<DefinePresetByType<T>, T>,
): QueryParam<T> => {
  const { serialize, deserialize } = queryParamPresets[config.preset]!;

  return new QueryParam<any>({
    ...config,
    serialize,
    deserialize,
  });
};
