import { action, computed, makeObservable } from 'mobx';

import { queryParamPresets } from './query-param-presets.js';
import {
  DefinePresetByType,
  QueryParamsFieldModelConfig,
  QueryParamsFieldModelPresetConfig,
} from './query-param.types.js';

/**
 * Create get\set value, which is synchronized with the query parameter
 * Manual handling of the query parameter
 */
export class QueryParam<T> {
  name: string;

  constructor(private config: QueryParamsFieldModelConfig<T>) {
    this.name = this.config.name;

    computed(this, 'rawValue');
    computed(this, 'value');
    action(this, 'set');

    makeObservable(this);
  }

  get rawValue() {
    return this.config.queryParams.data[this.name];
  }

  get value(): T {
    return this.config.deserialize(this.rawValue) ?? this.config.defaultValue;
  }

  set = async (value: T | undefined) => {
    if (value === this.value) {
      return;
    }

    const serializedValue = this.config.serialize(value);

    this.config.queryParams.update(
      {
        [this.name]: serializedValue,
      },
      this.config.strategy !== 'push',
    );
  };

  buildUrl = (value?: T) => {
    const serializedValue = this.config.serialize(value ?? this.value);

    return this.config.queryParams.buildUrl({
      [this.name]: serializedValue,
    });
  };

  /**
   * @deprecated
   * use {createQueryParamFromPreset}
   */
  static fromPreset<T>(
    config: QueryParamsFieldModelPresetConfig<DefinePresetByType<T>, T>,
  ): QueryParam<T> {
    const { serialize, deserialize } = queryParamPresets[config.preset]!;

    return new QueryParam<any>({
      ...config,
      serialize,
      deserialize,
    });
  }

  /**
   * @deprecated
   * use {createQueryParam}
   */
  static create<T>(config: QueryParamsFieldModelConfig<T>): QueryParam<T> {
    return new QueryParam<any>(config);
  }
}

/**
 * Create get\set value, which is synchronized with the query parameter
 * Manual handling of the query parameter
 */
/*#__PURE__*/
export const createQueryParam = <T>(
  config: QueryParamsFieldModelConfig<T>,
): QueryParam<T> => {
  return new QueryParam<any>(config);
};

/**
 * Create get\set value, which is synchronized with the query parameter
 * Create by preset
 */
/*#__PURE__*/
export const createQueryParamFromPreset = <T>(
  config: QueryParamsFieldModelPresetConfig<DefinePresetByType<T>, T>,
  // eslint-disable-next-line sonarjs/no-identical-functions
): QueryParam<T> => {
  const { serialize, deserialize } = queryParamPresets[config.preset]!;

  return new QueryParam<any>({
    ...config,
    serialize,
    deserialize,
  });
};
