import { describe, expect, it, vi } from 'vitest';
import { createMemoryHistory } from '../history/index.js';
import { mockHistory } from '../history/index.test.js';
import { QueryParams } from './query-params.js';

describe('query params', () => {
  it('test', () => {
    const history = mockHistory(createMemoryHistory());

    history.push('/foo/bar?a=3&b=1%2C2%2C3');

    const qp = new QueryParams({ history });

    expect(qp.data).toEqual({ a: '3', b: '1,2,3' });

    qp.update({ bar: 1, baz: 2 });

    expect(qp.data).toEqual({ a: '3', b: '1,2,3', bar: '1', baz: '2' });

    qp.set({ bar: 1, baz: 2 });

    expect(qp.data).toEqual({
      bar: '1',
      baz: '2',
    });

    history.push('/baabba');

    expect(qp.data).toEqual({});

    qp.set({ kkee: null });

    expect(history.location.search).toBe('');
  });

  it('toString should use passed data and build options', () => {
    const history = mockHistory(createMemoryHistory());
    const buildOptions = { encode: false };
    const builder = vi.fn().mockReturnValue('?foo=1');
    const qp = new QueryParams({
      history,
      builder,
      buildOptions,
    });

    const result = qp.toString({ foo: 1 });

    expect(result).toBe('?foo=1');
    expect(builder).toHaveBeenCalledWith({ foo: 1 }, buildOptions);
  });

  it('toString should return empty string for empty object', () => {
    const history = mockHistory(createMemoryHistory());
    const qp = new QueryParams({ history });

    const result = qp.toString({});

    expect(result).toBe('');
  });

  it('toString should allow overriding addQueryPrefix', () => {
    const history = mockHistory(createMemoryHistory());
    const qp = new QueryParams({ history });

    const result = qp.toString({ foo: 1 }, false);

    expect(result).toBe('foo=1');
  });

  it('toString should use parsed data when called without args', () => {
    const history = mockHistory(createMemoryHistory());
    const parserResult = { fromSearch: '123' };
    const parser = vi.fn().mockReturnValue(parserResult);
    const builder = vi.fn().mockReturnValue('?fromSearch=123');
    const qp = new QueryParams({
      history,
      parser,
      builder,
    });

    history.push('/foo/bar?fromSearch=123');
    const result = qp.toString();

    expect(result).toBe('?fromSearch=123');
    expect(parser).toHaveBeenCalledWith('?fromSearch=123', undefined);
    expect(builder).toHaveBeenCalledWith(parserResult, undefined);
  });

  it('createUrl should use current pathname by default', () => {
    const history = mockHistory(createMemoryHistory());
    history.push('/foo/bar?x=1');
    const qp = new QueryParams({ history });

    const result = qp.createUrl({ a: 1 });

    expect(result).toBe('/foo/bar?a=1');
  });

  it('createUrl should use provided path', () => {
    const history = mockHistory(createMemoryHistory());
    const qp = new QueryParams({ history });

    const result = qp.createUrl({ a: 1 }, '/custom/path');

    expect(result).toBe('/custom/path?a=1');
  });

  it('toString should prefer explicit addQueryPrefix over buildOptions', () => {
    const history = mockHistory(createMemoryHistory());
    const qp = new QueryParams({
      history,
      buildOptions: {
        addQueryPrefix: false,
      },
    });

    const result = qp.toString({ foo: 1 }, true);

    expect(result).toBe('?foo=1');
  });

  it('set should use replace when replace flag is true', () => {
    const history = mockHistory(createMemoryHistory());
    const qp = new QueryParams({ history });

    qp.set({ foo: 1 }, true);

    expect(history.spies.replace).toHaveBeenCalledTimes(1);
    expect(history.spies.replace).toHaveBeenCalledWith('/?foo=1');
    expect(history.spies.push).not.toHaveBeenCalled();
  });

  it('set should use push by default', () => {
    const history = mockHistory(createMemoryHistory());
    const qp = new QueryParams({ history });

    qp.set({ foo: 1 });

    expect(history.spies.push).toHaveBeenCalledTimes(1);
    expect(history.spies.push).toHaveBeenCalledWith('/?foo=1');
    expect(history.spies.replace).not.toHaveBeenCalled();
  });

  it('update should merge with existing params and remove undefined keys', () => {
    const history = mockHistory(createMemoryHistory());
    history.push('/items?a=1&b=2');
    history.clearMocks();
    const qp = new QueryParams({ history });

    qp.update({ b: undefined, c: 3 });

    expect(history.location.search).toBe('?a=1&c=3');
  });

  it('createUrl should return path only for empty object', () => {
    const history = mockHistory(createMemoryHistory());
    const qp = new QueryParams({ history });

    const result = qp.createUrl({}, '/users');

    expect(result).toBe('/users');
  });

  describe('delete', () => {
    it('should remove specified keys', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1&b=2&c=3');
      const qp = new QueryParams({ history });

      qp.delete(['b', 'c']);

      expect(history.location.search).toBe('?a=1');
    });

    it('should remove a single key', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1&b=2');
      const qp = new QueryParams({ history });

      qp.delete(['a']);

      expect(history.location.search).toBe('?b=2');
    });

    it('should ignore keys that do not exist', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1&b=2');
      const qp = new QueryParams({ history });

      qp.delete(['c', 'd']);

      expect(history.location.search).toBe('?a=1&b=2');
    });

    it('should remove all keys', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1&b=2');
      const qp = new QueryParams({ history });

      qp.delete(['a', 'b']);

      expect(history.location.search).toBe('');
    });

    it('should use replace when replace flag is true', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1&b=2');
      history.clearMocks();
      const qp = new QueryParams({ history });

      qp.delete(['b'], true);

      expect(history.spies.replace).toHaveBeenCalledTimes(1);
      expect(history.spies.push).not.toHaveBeenCalled();
    });

    it('should use push by default', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1&b=2');
      history.clearMocks();
      const qp = new QueryParams({ history });

      qp.delete(['b']);

      expect(history.spies.push).toHaveBeenCalledTimes(1);
      expect(history.spies.replace).not.toHaveBeenCalled();
    });
  });

  describe('update with options', () => {
    it('should accept boolean replace as second argument (backward compat)', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1');
      history.clearMocks();
      const qp = new QueryParams({ history });

      qp.update({ b: 2 }, true);

      expect(history.location.search).toBe('?a=1&b=2');
      expect(history.spies.replace).toHaveBeenCalledTimes(1);
      expect(history.spies.push).not.toHaveBeenCalled();
    });

    it('should accept options object with replace', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1');
      history.clearMocks();
      const qp = new QueryParams({ history });

      qp.update({ b: 2 }, { replace: true });

      expect(history.location.search).toBe('?a=1&b=2');
      expect(history.spies.replace).toHaveBeenCalledTimes(1);
      expect(history.spies.push).not.toHaveBeenCalled();
    });

    it('should delete keys via options.delete', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1&b=2&c=3');
      const qp = new QueryParams({ history });

      qp.update({ d: 4 }, { delete: ['b', 'c'] });

      expect(history.location.search).toBe('?a=1&d=4');
    });

    it('should combine update and delete in one call', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1&b=2&c=3&d=4');
      const qp = new QueryParams({ history });

      qp.update({ e: 5, a: 10 }, { delete: ['b', 'c'] });

      expect(history.location.search).toBe('?a=10&d=4&e=5');
    });

    it('should ignore non-existent keys in options.delete', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1&b=2');
      const qp = new QueryParams({ history });

      qp.update({ c: 3 }, { delete: ['x', 'y'] });

      expect(history.location.search).toBe('?a=1&b=2&c=3');
    });

    it('should handle update with only delete (no data changes)', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1&b=2&c=3');
      const qp = new QueryParams({ history });

      qp.update({}, { delete: ['a', 'c'] });

      expect(history.location.search).toBe('?b=2');
    });

    it('should use push by default with options object', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1');
      history.clearMocks();
      const qp = new QueryParams({ history });

      qp.update({ b: 2 }, { delete: ['a'] });

      expect(history.spies.push).toHaveBeenCalledTimes(1);
      expect(history.spies.replace).not.toHaveBeenCalled();
    });

    it('should use replace when specified in options', () => {
      const history = mockHistory(createMemoryHistory());
      history.push('/items?a=1');
      history.clearMocks();
      const qp = new QueryParams({ history });

      qp.update({ b: 2 }, { replace: true, delete: ['a'] });

      expect(history.spies.replace).toHaveBeenCalledTimes(1);
      expect(history.spies.push).not.toHaveBeenCalled();
    });
  });
});
