<img src="docs/public/logo.png" align="right" width="176" alt="logo" />

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

_MobX charged [`history` NPM package](https://www.npmjs.com/package/history) + other utilities_   

## Documentaion is [here](https://js2me.github.io/mobx-location-history/)  

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

## Contribution Guide    

Want to contribute ? [Follow this guide](https://github.com/js2me/mobx-location-history/blob/master/CONTRIBUTING.md)  