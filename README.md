# mobx-location-history  

## Observable browser [History](src/mobx-history/mobx-history.types.ts) and [Location](src/mobx-location/mobx-location.types.ts) interfaces + other utilities (like [QueryParams](src/query-params/query-params.types.ts))   

```ts
import { reaction } from "mobx"
import { MobxHistory, MobxLocation, QueryParams } from "mobx-location-history";

const history = new MobxHistory()
const location = new MobxLocation(history);
const queryParams = new QueryParams(location, history);


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

