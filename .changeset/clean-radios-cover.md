---
"mobx-location-history": major
---

modified `blockHistoryWhile` input arguments (3 args -> 2 args, history passing in second arg, first arg is trueFn blocker)

PREVIOUS:

```ts
blockHistoryWhile(history, () => true, {
  blocker: () => {},
});
```

CURRENT:

```ts
blockHistoryWhile(() => true, {
  history,
  blocker: () => {},
});
```
