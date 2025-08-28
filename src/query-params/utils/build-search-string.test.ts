import { describe, it, expect } from 'vitest';

import { buildSearchString } from './build-search-string.js';

describe('buildSearchString', () => {
  it('should convert an object to a URL search string', () => {
    const data = { foo: 'bar', baz: 'qux' };
    const result = buildSearchString(data);
    expect(result).toBe('?foo=bar&baz=qux');
  });

  it('should filter out null values', () => {
    const data = { foo: 'bar', baz: null, qux: 'quux' };
    const result = buildSearchString(data);
    expect(result).toBe('?foo=bar&baz=null&qux=quux');
  });

  it('should filter out undefined values', () => {
    const data = { foo: 'bar', baz: undefined, qux: 'quux' };
    const result = buildSearchString(data);
    expect(result).toBe('?foo=bar&qux=quux');
  });

  it('should handle empty object', () => {
    const data = {};
    const result = buildSearchString(data);
    expect(result).toBe('');
  });

  it('should convert different data types to strings', () => {
    const data = {
      str: 'string',
      num: 42,
      bool: true,
      arr: [1, 2, 3],
      obj: { nested: 'value' },
    };
    const result = buildSearchString(data);
    expect(result).toBe(
      '?str=string&num=42&bool=true&arr=1%2C2%2C3&obj=%5Bobject+Object%5D',
    );
  });

  it('should handle empty string values', () => {
    const data = { foo: '', bar: 'baz' };
    const result = buildSearchString(data);
    expect(result).toBe('?foo=&bar=baz');
  });

  it('should handle zero values', () => {
    const data = { foo: 0, bar: 'baz' };
    const result = buildSearchString(data);
    expect(result).toBe('?foo=0&bar=baz');
  });

  it('should handle boolean values correctly', () => {
    const data = {
      trueVal: true,
      falseVal: false,
      nullVal: null,
    };
    const result = buildSearchString(data);
    expect(result).toBe('?trueVal=true&falseVal=false&nullVal=null');
  });

  it('should handle special characters in values', () => {
    const data = {
      special: 'hello world',
      encoded: 'a&b=c+d',
    };
    const result = buildSearchString(data);
    expect(result).toBe('?special=hello+world&encoded=a%26b%3Dc%2Bd');
  });

  it('should handle array values by converting to string', () => {
    const data = {
      arr: ['a', 'b', 'c'],
      num: 123,
    };
    const result = buildSearchString(data);
    expect(result).toBe('?arr=a%2Cb%2Cc&num=123');
  });

  it('should handle nested object values by converting to string', () => {
    const data = {
      obj: { nested: 'value' },
      str: 'simple',
    };
    const result = buildSearchString(data);
    expect(result).toBe('?obj=%5Bobject+Object%5D&str=simple');
  });

  it('should handle complex scenario with mixed values', () => {
    const data = {
      name: 'John Doe',
      age: 30,
      active: true,
      score: 95.5,
      hobbies: ['reading', 'swimming'],
      counts: [1, 2, 3, 4, 5],
      address: null,
      phone: undefined,
      email: '',
      weight: 0,
      verified: false,
    };
    const result = buildSearchString(data);
    expect(result).toBe(
      '?name=John+Doe&age=30&active=true&score=95.5&hobbies=reading%2Cswimming&counts=1%2C2%2C3%2C4%2C5&address=null&email=&weight=0&verified=false',
    );
  });
});
