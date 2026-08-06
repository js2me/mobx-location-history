import { describe, expect, it } from 'vitest';
import { numberPreset } from './number.js';

describe('number preset', () => {
  it('deserializes valid numbers and rejects invalid values', () => {
    expect(numberPreset.deserialize('42.5')).toBe(42.5);
    expect(numberPreset.deserialize('')).toBeNull();
    expect(numberPreset.deserialize('not-a-number')).toBeNull();
  });

  it('serializes zero and other numbers', () => {
    expect(numberPreset.serialize(42)).toBe(42);
    expect(numberPreset.serialize(0)).toBe(0);
    expect(numberPreset.serialize(undefined)).toBeUndefined();
  });
});
