# `QueryParams`   

Utility to watch\change query parameters   


::: tip  
In most cases is needed to create only one instance for your applicaton
:::

## Usage   

```ts
import {
  createQueryParams,
  createBrowserHistory,
  QueryParams,
} from "mobx-location-history";
import { reaction } from "mobx";

const history = createBrowserHistory();

// export const queryParams = new QueryParams({
export const queryParams = createQueryParams({
  history,
  abortSignal: new AbortController().signal,
});


console.log(queryParams.data);

reaction(
  () => queryParams.data,
  queryParams => {
    console.log(queryParams); // Record<string, string>
  }
);

queryParams.set({
  foo: 11,
  bar: 'kek',
  willBeRemoved: undefined,
});

queryParams.update({
  foo: 11,
  bar: 'kek',
  willBeRemoved: undefined,
})
```

