import { bench, describe } from 'vitest';
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  isObservableHistory,
} from './index.js';

describe('Observable history', () => {
  bench('createMemoryHistory', () => {
    const history = createMemoryHistory();
    history.destroy();
  });

  bench('createBrowserHistory', () => {
    const history = createBrowserHistory();
    history.destroy();
  });

  bench('createHashHistory', () => {
    const history = createHashHistory();
    history.destroy();
  });

  bench('isObservableHistory', () => {
    const history = createMemoryHistory();
    isObservableHistory(history);
    history.destroy();
  });

  bench('push and update observable location', () => {
    const history = createMemoryHistory();
    history.push('/items?page=2#results');
    history.destroy();
  });

  bench('replace and update observable location', () => {
    const history = createMemoryHistory();
    history.replace('/items?page=2#results');
    history.destroy();
  });

  bench('block and unblock', () => {
    const history = createMemoryHistory();
    const unblock = history.block(() => {});
    unblock();
    history.destroy();
  });
});
