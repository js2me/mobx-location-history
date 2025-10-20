import { describe, expect, it } from 'vitest';
import { buildSearchStringTestCases } from './build-search-string.test.js';
import { parseSearchString } from './parse-search-string.js';

describe('parseSearchString', () => {
  it('should handle complex scenario with mixed values', () => {
    const data = {
      name: 'John Doe',
      age: '30',
      active: 'true',
      score: '95.5',
      email: '',
      counts: '1,2,3,4,5',
      hobbies: 'reading,swimming',
      verified: 'false',
      weight: '0',
    };
    const result = parseSearchString(
      '?name=John+Doe&age=30&active=true&score=95.5&hobbies=reading%2Cswimming&counts=1%2C2%2C3%2C4%2C5&email=&weight=0&verified=false',
    );
    expect(result).toStrictEqual(data);
  });

  buildSearchStringTestCases.forEach(({ description, input, expected }) => {
    it(`test-case-from-builder<(${description})`, () => {
      const result = parseSearchString(expected);

      const transformValue = (value: any): any => {
        if (Array.isArray(value)) {
          return value.join(',');
        } else if (typeof value === 'object') {
          return Object.fromEntries(
            Object.entries(value)
              .filter((entry) => {
                return entry[1] != null;
              })
              .map(([k, v]) => [k, transformValue(v)]),
          );
        } else {
          return `${value}`;
        }
      };

      console.info('expected', transformValue(input));

      expect(result).toStrictEqual(transformValue(input));
    });
  });
});
