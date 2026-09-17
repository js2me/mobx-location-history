import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import type { IQueryParams } from '../query-params/index.js';
import { createQueryParam, QueryParam } from './query-param.js';
import { presets } from './query-param-presets.js';

describe('createQueryParam preset types', () => {
  const queryParams = {} as IQueryParams;

  it('infers scalar preset types', () => {
    const booleanParam = createQueryParam({
      queryParams,
      name: 'enabled',
      preset: presets.boolean,
      defaultValue: false,
    });
    const dateParam = createQueryParam({
      queryParams,
      name: 'createdAt',
      preset: presets.date,
      defaultValue: new Date(),
    });
    const numberParam = createQueryParam({
      queryParams,
      name: 'page',
      preset: presets.number,
      defaultValue: 1,
    });
    const stringParam = createQueryParam({
      queryParams,
      name: 'search',
      preset: presets.string,
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
      preset: presets.booleanArray,
      defaultValue: [],
    });
    const jsonParam = createQueryParam({
      queryParams,
      name: 'filters',
      preset: presets.json,
      defaultValue: {},
    });
    const jsonArrayParam = createQueryParam({
      queryParams,
      name: 'items',
      preset: presets.jsonArray,
      defaultValue: [],
    });
    const numberArrayParam = createQueryParam({
      queryParams,
      name: 'ids',
      preset: presets.numberArray,
      defaultValue: [],
    });
    const stringArrayParam = createQueryParam({
      queryParams,
      name: 'tags',
      preset: presets.stringArray,
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
      preset: presets.enum(['draft', 'published'] as const),
      defaultValue: 'draft',
    });

    expectTypeOf<typeof statusParam>().toEqualTypeOf<
      QueryParam<'draft' | 'published'>
    >();
  });
});

describe('QueryParam', () => {
  const createQueryParams = (data: Record<string, unknown> = {}) =>
    ({
      data,
      update: vi.fn(),
      createUrl: vi.fn((value) => `/?${Object.values(value)[0]}`),
    }) as any;

  it('reads defaults, serializes updates, and builds URLs', async () => {
    const queryParams = createQueryParams();
    const param = new QueryParam({
      queryParams,
      name: 'page',
      defaultValue: 1,
      serialize: (value) => String(value),
      deserialize: (value) => (value ? Number(value) : null),
    });

    expect(param.rawValue).toBeUndefined();
    expect(param.value).toBe(1);
    await param.set(2);
    expect(queryParams.update).toHaveBeenCalledWith({ page: '2' }, true);
    expect(param.buildUrl(3)).toBe('/?3');
  });

  it('skips unchanged values and supports push strategy', async () => {
    const queryParams = createQueryParams({ page: '2' });
    const param = new QueryParam({
      queryParams,
      name: 'page',
      defaultValue: 1,
      strategy: 'push',
      serialize: Number,
      deserialize: Number,
    });

    await param.set(2);
    expect(queryParams.update).not.toHaveBeenCalled();
    await param.set(3);
    expect(queryParams.update).toHaveBeenCalledWith({ page: 3 }, false);
    expect(param.buildUrl()).toBe('/?2');
  });

  it('supports object presets', () => {
    const queryParams = createQueryParams();
    const objectParam = createQueryParam({
      queryParams,
      name: 'enabled',
      preset: presets.boolean,
      defaultValue: false,
    });

    expect(objectParam.value).toBe(false);
  });

  it('creates a parameter without a preset', () => {
    const queryParams = createQueryParams();
    const param = createQueryParam({
      queryParams,
      name: 'value',
      defaultValue: 'default',
    });

    expect(param.value).toBe('default');
  });
});
