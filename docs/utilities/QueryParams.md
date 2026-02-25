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
export const queryParams = createQueryParams({ history });


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

## Methods and properties

### `data`

Current parsed query params from URL search string.

```ts
console.log(queryParams.data); // e.g. { page: '2', filter: 'active' }
```

### `set(data, replace?)`

Replaces query params with passed `data`.
If `replace` is `true`, uses `history.replace`; otherwise uses `history.push`.

```ts
queryParams.set({ page: 1, filter: 'active' });
queryParams.set({ page: 2 }, true); // replace current history entry
```

### `update(data, replace?)`

Merges passed `data` into current query params.
If `replace` is `true`, uses `history.replace`; otherwise uses `history.push`.

```ts
queryParams.update({ page: 3 });
queryParams.update({ filter: undefined }); // remove key from query
```

### `toString(data?, addQueryPrefix?)`

Builds a query string from passed data.  
If `data` is not passed, uses current `queryParams.data`.  
You can override `addQueryPrefix` (`true` adds `?`, `false` builds without it).

```ts
queryParams.toString({ foo: 1 }); // '?foo=1'
queryParams.toString({ foo: 1 }, false); // 'foo=1'
queryParams.toString(); // from current queryParams.data
```

### `createUrl(data, path?)`

Builds full URL string using provided `data` and `path`.  
If `path` is not provided, current `history.location.pathname` is used.

```ts
queryParams.createUrl({ page: 2 }); // '/current-path?page=2'
queryParams.createUrl({ page: 2 }, '/users'); // '/users?page=2'
```

