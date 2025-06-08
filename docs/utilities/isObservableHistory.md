# `isObservableHistory`   

Allows to detect is history observable (created using this package)   


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