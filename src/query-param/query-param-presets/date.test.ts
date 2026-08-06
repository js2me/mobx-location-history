import { describe, expect, it } from 'vitest';
import { datePreset } from './date.js';

describe('date preset', () => {
  it('serializes and deserializes ISO dates', () => {
    const value = new Date('2026-08-07T12:00:00.000Z');

    expect(datePreset.serialize(value)).toBe('2026-08-07T12:00:00.000Z');
    expect(datePreset.deserialize('2026-08-07T12:00:00.000Z')).toEqual(value);
  });

  it('returns null for invalid dates', () => {
    expect(datePreset.deserialize('invalid')).toBeNull();
    expect(datePreset.serialize(new Date('invalid'))).toBeUndefined();
  });
});
