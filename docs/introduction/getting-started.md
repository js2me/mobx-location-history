---
title: Getting started
---

# Getting started

## Installation

::: code-group

```bash [npm]
npm install {packageJson.name}
```

```bash [yarn]
yarn add {packageJson.name}
```

```bash [pnpm]
pnpm add {packageJson.name}
```

:::


## Usage   

```ts
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  createQueryParams,
} from "mobx-location-history";
import { reaction } from "mobx";

const history = createBrowserHistory();

reaction(
  () => history.location,
  location => {
    console.log(location)
  }
);

const queryParams = createQueryParams({
  history
});

reaction(
  () => queryParams.data,
  queryParams => {
    console.log(queryParams)
  }
);
```