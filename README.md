<img src="assets/logo-temp.png" align="right" height="156" alt="logo" />

# mobx-location-history  

_MobX charged [`history` NPM package](https://www.npmjs.com/package/history) + other utilities_   

```ts
import { reaction } from "mobx"
import {
  createQueryParams,
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
} from "mobx-location-history";

const history = createBrowserHistory();
// const history = createHashHistory();
// const history = createMemoryHistory();
const queryParams = createQueryParams({ history });

reaction(() => history.location, location => {
  // do things
})

history.push('/home')

queryParams.set({
  foo: 11,
  bar: 'kek',
  willBeRemoved: undefined,
})

history.destroy();
```
