import { describe, expect, it } from 'vitest';

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
});
