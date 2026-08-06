import { describe, expect, it } from 'vitest';
import { createEnumPreset } from './enum.js';

const statusPreset = createEnumPreset(['draft', 'published'] as const);

describe('enum preset', () => {
  it('serializes and deserializes allowed values', () => {
    expect(statusPreset.serialize('draft')).toBe('draft');
    expect(statusPreset.deserialize('published')).toBe('published');
  });

  it('rejects values outside the enum', () => {
    expect(statusPreset.serialize('archived' as never)).toBeUndefined();
    expect(statusPreset.deserialize('archived')).toBeNull();
  });
});
