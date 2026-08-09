# `isObservableHistory`   

Detects whether a history instance is observable.


Example:   

```ts
import {
  createBrowserHistory as createOriginalHistory,
} from "history";
import {
  createBrowserHistory as createObservableHistory,
  isObservableHistory
} from "mobx-location-history";


isObservableHistory(createOriginalHistory()); // false
isObservableHistory(createObservableHistory()); // true
```