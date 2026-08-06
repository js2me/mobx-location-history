import { describe, expectTypeOf, it } from 'vitest';
import type { IQueryParams } from '../query-params/index.js';
import { createQueryParam, type QueryParam } from './query-param.js';
import { queryParamPresets } from './query-param-presets.js';

describe('createQueryParam preset types', () => {
  const queryParams = {} as IQueryParams;

  it('infers scalar preset types', () => {
    const booleanParam = createQueryParam({
      queryParams,
      name: 'enabled',
      preset: queryParamPresets.boolean,
      defaultValue: false,
    });
    const dateParam = createQueryParam({
      queryParams,
      name: 'createdAt',
      preset: queryParamPresets.date,
      defaultValue: new Date(),
    });
    const numberParam = createQueryParam({
      queryParams,
      name: 'page',
      preset: queryParamPresets.number,
      defaultValue: 1,
    });
    const stringParam = createQueryParam({
      queryParams,
      name: 'search',
      preset: queryParamPresets.string,
      defaultValue: '',
    });

    expectTypeOf<typeof booleanParam>().toEqualTypeOf<QueryParam<boolean>>();
    expectTypeOf<typeof dateParam>().toEqualTypeOf<QueryParam<Date>>();
    expectTypeOf<typeof numberParam>().toEqualTypeOf<QueryParam<number>>();
    expectTypeOf<typeof stringParam>().toEqualTypeOf<QueryParam<string>>();
  });

  it('infers array and JSON preset types', () => {
    const booleanArrayParam = createQueryParam({
      queryParams,
      name: 'flags',
      preset: queryParamPresets.booleanArray,
      defaultValue: [],
    });
    const jsonParam = createQueryParam({
      queryParams,
      name: 'filters',
      preset: queryParamPresets.json,
      defaultValue: {},
    });
    const jsonArrayParam = createQueryParam({
      queryParams,
      name: 'items',
      preset: queryParamPresets.jsonArray,
      defaultValue: [],
    });
    const numberArrayParam = createQueryParam({
      queryParams,
      name: 'ids',
      preset: queryParamPresets.numberArray,
      defaultValue: [],
    });
    const stringArrayParam = createQueryParam({
      queryParams,
      name: 'tags',
      preset: queryParamPresets.stringArray,
      defaultValue: [],
    });

    expectTypeOf<typeof booleanArrayParam>().toEqualTypeOf<
      QueryParam<boolean[]>
    >();
    expectTypeOf<typeof jsonParam>().toEqualTypeOf<
      QueryParam<Record<string, any>>
    >();
    expectTypeOf<typeof jsonArrayParam>().toEqualTypeOf<
      QueryParam<Record<string, any>[]>
    >();
    expectTypeOf<typeof numberArrayParam>().toEqualTypeOf<
      QueryParam<number[]>
    >();
    expectTypeOf<typeof stringArrayParam>().toEqualTypeOf<
      QueryParam<string[]>
    >();
  });

  it('infers a literal union from an enum preset', () => {
    const statusParam = createQueryParam({
      queryParams,
      name: 'status',
      preset: queryParamPresets.createEnumPreset([
        'draft',
        'published',
      ] as const),
      defaultValue: 'draft',
    });

    expectTypeOf<typeof statusParam>().toEqualTypeOf<
      QueryParam<'draft' | 'published'>
    >();
  });
});
