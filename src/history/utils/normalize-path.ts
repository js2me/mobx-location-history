import { Path } from '../history.types.js';

/**
 * normalize a string URL path from the given pathname, search, and hash components.
 */
export const normalizePath = (path: string | URL | Partial<Path>) => {
  if (typeof path === 'string') {
    return path;
  }

  if (path instanceof URL) {
    return path.toString();
  }

  // eslint-disable-next-line prefer-const
  let { pathname = '/', search = '', hash = '' } = path;

  if (search && search !== '?') {
    pathname += search.startsWith('?') ? search : '?' + search;
  }
  if (hash && hash !== '#') {
    pathname += hash.startsWith('#') ? hash : '#' + hash;
  }

  return pathname;
};
