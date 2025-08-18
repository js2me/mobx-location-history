import { Blocker, History } from 'history';
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
  whileTrueFn: () => boolean,
  optsOrHistory:
    | THistory
    | (Partial<IReactionOptions<boolean, FireImmediately>> & {
        history: THistory;
        blocker?: Blocker;
      }),
) => {
  const opts =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    optsOrHistory.go
      ? { history: optsOrHistory as THistory }
      : (optsOrHistory as Partial<
          IReactionOptions<boolean, FireImmediately>
        > & {
          history: THistory;
          blocker?: Blocker;
        });

  const abortController = new LinkedAbortController();

  let historyBlocker: VoidFunction | undefined;

  abortController.signal.addEventListener('abort', () => {
    historyBlocker?.();
    historyBlocker = undefined;
  });

  reaction(
    () => whileTrueFn(),
    (isNeedToBlock) => {
      if (isNeedToBlock) {
        if (historyBlocker) {
          return;
        }
        historyBlocker = opts.history.block(opts?.blocker ?? (() => {}));
      } else {
        historyBlocker?.();
        historyBlocker = undefined;
      }
    },
    {
      ...opts,
      fireImmediately: true,
      signal: abortController.signal,
    },
  );

  if (opts?.signal) {
    opts?.signal?.addEventListener?.('abort', () => abortController.abort());
  }

  return () => {
    abortController.abort();
  };
};
