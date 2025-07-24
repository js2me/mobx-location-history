import { History, Transition } from 'history';
import { LinkedAbortController } from 'linked-abort-controller';
import { IReactionOptions, reaction } from 'mobx';

import { ObservableHistory } from '../history/index.js';

/**
 * Blocks history while passed function `whileTrueFn` returns `true`.
 *
 * [**Documentation**](https://js2me.github.io/mobx-location-history/utilities/blockHistoryWhile)
 *
 */
export const blockHistoryWhile = <
  THistory extends ObservableHistory<History>,
  FireImmediately extends boolean,
>(
  history: THistory,
  whileTrueFn: () => boolean,
  opts?: IReactionOptions<boolean, FireImmediately> & {
    blocker?: (tx: Transition) => void;
  },
) => {
  const abortController = new LinkedAbortController();

  let historyBlocker: VoidFunction | undefined;

  abortController.signal.addEventListener('abort', () => {
    historyBlocker?.();
    historyBlocker = undefined;
  });

  const dispose = reaction(
    () => whileTrueFn(),
    (isNeedToBlock) => {
      if (isNeedToBlock) {
        if (historyBlocker) {
          return;
        }
        historyBlocker = history.block(opts?.blocker ?? (() => {}));
      } else {
        historyBlocker?.();
        historyBlocker = undefined;
      }
    },
    {
      ...opts,
      signal: abortController.signal,
    },
  );

  if (opts?.signal) {
    opts?.signal?.addEventListener?.('abort', () => abortController.abort());
  }

  return dispose;
};
