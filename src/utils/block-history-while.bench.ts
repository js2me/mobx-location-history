import { action, observable } from 'mobx';
import { bench, describe } from 'vitest';
import { createMemoryHistory } from '../history/index.js';
import { blockHistoryWhile } from './block-history-while.js';

describe('blockHistoryWhile', () => {
  bench('create and dispose', () => {
    const state = observable({ blocked: true });
    const history = createMemoryHistory();
    const cleanup = blockHistoryWhile(() => state.blocked, history);
    cleanup();
    history.destroy();
  });

  bench('react to state change', () => {
    const state = observable({ blocked: true });
    const history = createMemoryHistory();
    const cleanup = blockHistoryWhile(() => state.blocked, history);
    action(() => {
      state.blocked = false;
    })();
    cleanup();
    history.destroy();
  });
});
