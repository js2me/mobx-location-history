import { describe, expect, it } from 'vitest';
import { stringArrPreset } from './string[].js';

describe('string[] preset', () => {
  it('splits serialized values by commas', () => {
    expect(stringArrPreset.deserialize('one,two,three')).toEqual([
      'one',
      'two',
      'three',
    ]);
    expect(stringArrPreset.deserialize(undefined)).toBeNull();
  });

  it('joins non-empty arrays and omits empty arrays', () => {
    expect(stringArrPreset.serialize(['one', 'two'])).toBe('one,two');
    expect(stringArrPreset.serialize([])).toBeUndefined();
    expect(stringArrPreset.serialize(undefined)).toBeUndefined();
  });
});
