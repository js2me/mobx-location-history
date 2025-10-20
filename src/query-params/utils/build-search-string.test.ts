import { describe, expect, it } from 'vitest';

import { buildSearchString } from './build-search-string.js';

export const buildSearchStringTestCases = [
  {
    description: 'should convert an object to a URL search string',
    input: { foo: 'bar', baz: 'qux', emptyString: '' },
    expected: '?foo=bar&baz=qux&emptyString=',
  },
  {
    description: 'should filter out null values',
    input: { foo: 'bar', baz: null, qux: 'quux' },
    expected: '?foo=bar&qux=quux',
  },
  {
    description: 'should filter out undefined values',
    input: { foo: 'bar', baz: undefined, qux: 'quux' },
    expected: '?foo=bar&qux=quux',
  },
  { description: 'should handle empty object', input: {}, expected: '' },
  {
    description: 'should convert different data types to strings',
    input: {
      str: 'string',
      num: 42,
      bool: true,
      arr: [1, 2, 3],
      obj: { nested: 'value' },
    },
    expected:
      '?str=string&num=42&bool=true&arr=1%2C2%2C3&obj%5Bnested%5D=value',
  },
  {
    description: 'should handle empty string values',
    input: { foo: '', bar: 'baz' },
    expected: '?foo=&bar=baz',
  },
  {
    description: 'should handle zero values',
    input: { foo: 0, bar: 'baz' },
    expected: '?foo=0&bar=baz',
  },
  {
    description: 'should handle boolean values correctly',
    input: {
      trueVal: true,
      falseVal: false,
      nullVal: null,
    },
    expected: '?trueVal=true&falseVal=false',
  },
  {
    description: 'should handle special characters in values',
    input: {
      special: 'hello world',
      encoded: 'a&b=c+d',
    },
    expected: '?special=hello%20world&encoded=a%26b%3Dc%2Bd',
  },
  {
    description: 'should handle array values by converting to string',
    input: {
      arr: ['a', 'b', 'c'],
      num: 123,
    },
    expected: '?arr=a%2Cb%2Cc&num=123',
  },
  {
    description: 'should handle nested object values by converting to string',
    input: {
      obj: { nested: 'value' },
      str: 'simple',
    },
    expected: '?obj%5Bnested%5D=value&str=simple',
  },
  {
    description: 'should handle complex scenario with mixed values',
    input: {
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
    },
    expected:
      '?name=John%20Doe&age=30&active=true&score=95.5&hobbies=reading%2Cswimming&counts=1%2C2%2C3%2C4%2C5&email=&weight=0&verified=false',
  },
];

describe('buildSearchString', () => {
  buildSearchStringTestCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      const result = buildSearchString(input);
      expect(result).toBe(expected);
    });
  });
});
