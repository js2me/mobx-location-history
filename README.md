<img src="assets/logo-temp.png" align="right" height="156" alt="logo" />

# mobx-location-history  

_Browser Location and History charged by MobX + other utilities_  

## Observable browser [History](src/history/history.ts) and [Location](src/location/location.ts) interfaces + other utilities (like [QueryParams](src/query-params/query-params.types.ts))   

```ts
import { reaction } from "mobx"
import { History, Location, QueryParams } from "mobx-location-history";

const history = new History()
const queryParams = new QueryParams({ location });


reaction(() => location.href, href => {
  // do things
})

history.pushState(null, '', '/home')

queryParams.set({
  foo: 11,
  bar: 'kek',
  willBeRemoved: undefined,
})
```

