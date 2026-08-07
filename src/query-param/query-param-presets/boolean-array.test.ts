import { describe, expect, it } from 'vitest';
import { booleanArrPreset } from './boolean-array.js';

describe('boolean[] preset', () => {
  it('serializes and deserializes boolean arrays', () => {
    expect(booleanArrPreset.serialize([true, false, true])).toBe('1,0,1');
    expect(booleanArrPreset.deserialize('1,0,1')).toEqual([true, false, true]);
  });

  it('returns null for invalid values', () => {
    expect(booleanArrPreset.deserialize('1,yes,0')).toBeNull();
    expect(booleanArrPreset.deserialize('')).toBeNull();
  });
});
