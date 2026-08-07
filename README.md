<img src="docs/public/logo.png" align="right" width="156" alt="logo" />

# mobx-location-history

[![NPM version][npm-image]][npm-url] [![test status][github-test-actions-image]][github-actions-url] [![build status][github-build-actions-image]][github-actions-url] [![npm download][download-image]][download-url] [![bundle size][bundlephobia-image]][bundlephobia-url]

[npm-image]: http://img.shields.io/npm/v/mobx-location-history.svg
[npm-url]: http://npmjs.org/package/mobx-location-history
[github-test-actions-image]: https://github.com/js2me/mobx-location-history/workflows/Test/badge.svg
[github-build-actions-image]: https://github.com/js2me/mobx-location-history/workflows/Build/badge.svg
[github-actions-url]: https://github.com/js2me/mobx-location-history/actions
[download-image]: https://img.shields.io/npm/dm/mobx-location-history.svg
[download-url]: https://npmjs.org/package/mobx-location-history
[bundlephobia-url]: https://bundlephobia.com/result?p=mobx-location-history
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/mobx-location-history

🚀 MobX-powered [`history`](https://www.npmjs.com/package/history) with typed query parameter utilities 🚀

### [📖 Read the docs →](https://js2me.github.io/mobx-location-history/)

---

## Quick Start

```ts
import { reaction } from "mobx";
import {
  createBrowserHistory,
  createQueryParams,
} from "mobx-location-history";

const history = createBrowserHistory();
const queryParams = createQueryParams({ history });

reaction(
  () => history.location,
  (location) => console.log(location),
);

reaction(
  () => queryParams.data,
  (data) => console.log(data),
);

history.push("/home");
queryParams.set({ page: 1, filter: "active" });
```

---

## ✨ Features

### ⚡ Observable History

Use the familiar `history` API with MobX-observable location and navigation state:

```ts
const history = createBrowserHistory();

history.location;    // observable location
history.action;      // observable navigation action
history.locationUrl; // /users?page=1
history.isBlocked;   // computed blocker state

history.push("/users?page=1");
history.replace("/users?page=2");
```

The package re-exports the original `history` types and utilities, while adding `destroy`, `blockersCount` and `lastBlockedTx` to created histories.

### 🌐 Browser, Hash & Memory History

Choose the location strategy for your application:

```ts
const browserHistory = createBrowserHistory(); // regular URLs
const hashHistory = createHashHistory();       // window.location.hash
const memoryHistory = createMemoryHistory();   // tests and React Native
```

All three factories return the same MobX-enhanced history interface.

### 🔎 Query Parameters

Read, replace, merge and remove query parameters while keeping navigation under your control:

```ts
const queryParams = createQueryParams({ history });

queryParams.set({ page: 1, search: "mobx" });
queryParams.update({ page: 2 }); // keeps search
queryParams.delete(["search"]);

queryParams.data; // raw parsed query data
queryParams.createUrl({ page: 3 });
```

Values set to `null` or `undefined` are omitted from the URL. Pass `true` as the second argument to use `replace` instead of `push`.

### 🎯 Typed Query Parameters

Synchronize one query parameter with a typed value using a custom serializer or a built-in preset:

> `createQueryParamFromPreset` is deprecated. Use `createQueryParam` with an object preset instead.

```ts
import {
  createQueryParams,
  createQueryParam,
  presets,
} from "mobx-location-history";

const queryParams = createQueryParams({ history });
const isVisible = createQueryParam({
  queryParams,
  name: "isVisible",
  preset: presets.boolean,
  defaultValue: false,
  strategy: "replace",
});

isVisible.value;       // boolean
await isVisible.set(true);
isVisible.rawValue;     // string | undefined
isVisible.buildUrl(false);
```

Available presets include `string`, `number`, `boolean`, `json`, `stringArray`, `numberArray`, `booleanArray` and `jsonArray`.

`queryParamPresets['number[]']` is deprecated. Use `presets.numberArray` instead.
The `string[]`, `boolean[]` and `json[]` presets are also deprecated; use their `*Array` aliases instead.

Additional examples:

```ts
const ids = createQueryParam({
  queryParams,
  name: "ids",
  preset: presets.numberArray,
  defaultValue: [],
});

const status = createQueryParam({
  queryParams,
  name: "status",
  preset: presets.enum(["draft", "published"] as const),
  defaultValue: "draft",
});
```

### 🛡️ Reactive Navigation Blocking

Block navigation while a MobX predicate is true, for example when a form has unsaved changes:

```ts
import { blockHistoryWhile } from "mobx-location-history";

const stopBlocking = blockHistoryWhile(
  () => form.isDirty,
  {
    history,
    blocker: (transition) => {
      console.log("Navigation blocked", transition);
    },
  },
);

stopBlocking();
```

---

## Installation

```bash
npm install mobx-location-history
# or
pnpm add mobx-location-history
# or
yarn add mobx-location-history
```

Peer dependency:

```bash
npm install mobx
```

---

## Contribution Guide

Want to contribute? [Follow this guide](https://github.com/js2me/mobx-location-history/blob/master/CONTRIBUTING.md)

---

## License

[MIT](https://github.com/js2me/mobx-location-history/blob/master/LICENSE)
