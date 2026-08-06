import { describe, expect, it } from 'vitest';
import { numberArrPreset } from './number[].js';

describe('number[] preset', () => {
  it('deserializes valid numbers', () => {
    expect(numberArrPreset.deserialize('1,2.5,3')).toEqual([1, 2.5, 3]);
    expect(numberArrPreset.deserialize('1,invalid,3')).toBeNull();
    expect(numberArrPreset.deserialize('1,,3')).toBeNull();
    expect(numberArrPreset.deserialize(undefined)).toBeNull();
  });

  it('uses string array serialization', () => {
    expect(numberArrPreset.serialize([1, 2.5, 3])).toBe('1,2.5,3');
    expect(numberArrPreset.serialize([])).toBeUndefined();
  });
});
