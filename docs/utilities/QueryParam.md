# `QueryParam`

Utility to watch and change one query parameter.

## Usage

```ts
import {
  createBrowserHistory,
  createQueryParam,
  createQueryParams,
  presets,
} from 'mobx-location-history';

const queryParams = createQueryParams({
  history: createBrowserHistory(),
});

const page = createQueryParam({
  queryParams,
  name: 'page',
  preset: presets.number,
  defaultValue: 1,
  strategy: 'replace', // 'push'
});

page.value; // number
await page.set(2);
page.rawValue; // string | undefined
page.buildUrl(3);
```

## Presets

Built-in presets are passed as objects. The value type is inferred from the
preset.

```ts
const search = createQueryParam({
  queryParams,
  name: 'search',
  preset: presets.string,
  defaultValue: '',
});

const ids = createQueryParam({
  queryParams,
  name: 'ids',
  preset: presets.numberArray,
  defaultValue: [],
});

const enabled = createQueryParam({
  queryParams,
  name: 'enabled',
  preset: presets.boolean,
  defaultValue: false,
});

const filters = createQueryParam({
  queryParams,
  name: 'filters',
  preset: presets.json,
  defaultValue: {},
});

const createdAt = createQueryParam({
  queryParams,
  name: 'createdAt',
  preset: presets.date,
  defaultValue: new Date(),
});
```

Available presets: `string`, `number`, `boolean`, `json`, `date`,
`stringArray`, `numberArray`, `booleanArray` and `jsonArray`.

For a typed enum, use the enum preset factory:

```ts
const status = createQueryParam({
  queryParams,
  name: 'status',
  preset: presets.enum(['draft', 'published'] as const),
  defaultValue: 'draft',
});
// QueryParam<'draft' | 'published'>
```
