# mobx-location-history  

## Observable browser History and Location interfaces + other utilities   

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

