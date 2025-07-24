# `blockHistoryWhile()`   

Blocks history while passed function `whileTrueFn` returns `true`.   

::: tip This function creates MobX `reaction()` and works like `reaction` 
:::


**API Signature**  

```ts
blockHistoryWhile(
  history: ObservableHistory,
  whileTrueFn: () => boolean,
  reactionOptions?: IReactionOptions
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
  history,
  () => this.form.isDirty,
  {
    signal: this.abortSignal,
  }
)
...

const val = observable.box(0);

const disposer = blockHistoryWhile(history, () => val > 50);

val.set(10); // not blocks

val.set(100); // blocks

disposer();
```