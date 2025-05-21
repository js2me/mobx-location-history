import { Path } from '../history.types.js';

/**
 * Creates a string URL path from the given pathname, search, and hash components.
 */
export const createPath = ({
  pathname = '/',
  search = '',
  hash = '',
}: Partial<Path>) => {
  if (search && search !== '?') {
    pathname += search.startsWith('?') ? search : '?' + search;
  }
  if (hash && hash !== '#') {
    pathname += hash.startsWith('#') ? hash : '#' + hash;
  }
  return pathname;
};
