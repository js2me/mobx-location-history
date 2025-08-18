# `blockHistoryWhile()`   

Blocks history while passed function `whileTrueFn` returns `true`.   

::: tip This function creates MobX `reaction()` and works like `reaction` 
:::


**API Signature**  

```ts
blockHistoryWhile(
  whileTrueFn: () => boolean,
  opts: Partial<IReactionOptions<boolean, FireImmediately>> & {
    history: THistory;
    blocker?: Blocker;
  },
): IReactionDesposer
```

## Examples   

```ts
import {
  createBrowserHistory,
  blockHistoryWhile,
} from "mobx-location-history";
import { observable } from "mobx";

const history = createBrowserHistory();

...
blockHistoryWhile(
  () => this.form.isDirty,
  {
    history,
    signal: this.abortSignal,
  }
)
...

const val = observable.box(0);

const disposer = blockHistoryWhile(() => val > 50, { history });

val.set(10); // not blocks

val.set(100); // blocks

disposer();
```