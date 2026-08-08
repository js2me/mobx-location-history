# Overview

This package is **MobX** charged version of the [**history** npm package](https://www.npmjs.com/package/history) _(version: `@{packageJson.dependencies.history}`)_ created by [Remix](https://remix.run/)

So @{packageJson.name} has all identical exports as provided in [**history** npm package](https://www.npmjs.com/package/history) because:

```ts
export * from "history";
```

Modified exports:

- [`createBrowserHistory`](/v9/core/BrowserHistory)
- [`createHashHistory`](/v9/core/HashHistory)
- [`createMemoryHistory`](/v9/core/MemoryHistory)

Also this package has additional location and history utilities like [`QueryParams`](/v9/utilities/QueryParams) (See sidebar)
