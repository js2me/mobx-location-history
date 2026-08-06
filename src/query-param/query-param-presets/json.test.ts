import { describe, expect, it } from 'vitest';
import { jsonPreset } from './json.js';

describe('json preset', () => {
  it('deserializes valid JSON', () => {
    expect(jsonPreset.deserialize('{"page":2,"tags":["a","b"]}')).toEqual({
      page: 2,
      tags: ['a', 'b'],
    });
  });

  it('returns null for missing or invalid JSON', () => {
    expect(jsonPreset.deserialize('')).toBeNull();
    expect(jsonPreset.deserialize(undefined)).toBeNull();
    expect(jsonPreset.deserialize('{invalid')).toBeNull();
  });

  it('serializes non-empty objects', () => {
    expect(jsonPreset.serialize({ page: 2 })).toBe('{"page":2}');
    expect(jsonPreset.serialize({})).toBeUndefined();
    expect(jsonPreset.serialize(undefined)).toBeUndefined();
  });
});
