import { Blocker, History } from 'history';
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
  const { signal, ...opts } =
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

  let historyBlocker: VoidFunction | undefined;

  const disposeFn = reaction(
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
    },
  );

  const cleanup = () => {
    historyBlocker?.();
    historyBlocker = undefined;
    disposeFn();
  };

  signal?.addEventListener?.('abort', cleanup);

  return cleanup;
};
