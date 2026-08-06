import { describe, expect, it } from 'vitest';
import { booleanPreset } from './boolean.js';

describe('boolean preset', () => {
  it('deserializes supported true values', () => {
    expect(booleanPreset.deserialize('1')).toBe(true);
    expect(booleanPreset.deserialize('true')).toBe(true);
    expect(booleanPreset.deserialize('0')).toBe(false);
    expect(booleanPreset.deserialize(undefined)).toBe(false);
  });

  it('serializes only true as 1', () => {
    expect(booleanPreset.serialize(true)).toBe('1');
    expect(booleanPreset.serialize(false)).toBeUndefined();
    expect(booleanPreset.serialize(undefined)).toBeUndefined();
  });
});
