import { describe, expect, it } from 'vitest';
import { stringPreset } from './string.js';

describe('string preset', () => {
  it('deserializes a value and uses null for a missing value', () => {
    expect(stringPreset.deserialize('hello')).toBe('hello');
    expect(stringPreset.deserialize(undefined)).toBeNull();
  });

  it('serializes empty strings and omits missing values', () => {
    expect(stringPreset.serialize('hello')).toBe('hello');
    expect(stringPreset.serialize('')).toBe('');
    expect(stringPreset.serialize(undefined)).toBeUndefined();
  });
});
