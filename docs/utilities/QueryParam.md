# `QueryParam`   

Utility to watch\change **ONLY ONE** query parameter   

## Usage   

```ts
import {
  createQueryParams,
  createBrowserHistory,
  createQueryParam,
  createQueryParamFromPreset,
} from "mobx-locatin-history"

const queryParams = createQueryParams({
  history: createBrowserHistory(),
});

createQueryParam({
  queryParams,
  defaultValue: false,
  name: 'isVisible',
  deserialize: (isVisible) => isVisible === '1',
  serialize: (value) => (value === true ? '1' : undefined),
  strategy: 'push', // 'replace'
});

createQueryParamFromPreset({
  queryParams,
  preset: 'boolean',
  defaultValue: false,
  name: 'isVisible',
  strategy: 'push', // 'replace'
});

```

