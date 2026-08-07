import { describe, expect, it } from 'vitest';
import { jsonArrPreset } from './json-array.js';

describe('json[] preset', () => {
  it('serializes and deserializes arrays', () => {
    const value = [{ id: 1 }, { id: 2 }];

    expect(jsonArrPreset.serialize(value)).toBe('[{"id":1},{"id":2}]');
    expect(jsonArrPreset.deserialize('[{"id":1},{"id":2}]')).toEqual(value);
  });

  it('returns null for invalid or non-array JSON', () => {
    expect(jsonArrPreset.deserialize('{"id":1}')).toBeNull();
    expect(jsonArrPreset.deserialize('{invalid')).toBeNull();
  });

  it('returns undefined for an empty array', () => {
    expect(jsonArrPreset.serialize([])).toBeUndefined();
    expect(jsonArrPreset.deserialize(undefined)).toBeNull();
  });
});
