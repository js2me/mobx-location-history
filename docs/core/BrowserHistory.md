# `BrowserHistory`

Browser history stores the location in regular URLs. This is the standard for
most web apps, but it requires some configuration on the server to ensure you
serve the same app at multiple URLs.

The full documentation for `BrowserHistory` can be found [here](https://github.com/remix-run/history/blob/main/docs/api-reference.md#history)

[Reference to source code](/src/history/index.ts)

## Usage

```ts
import { createBrowserHistory } from "mobx-location-history";
import { reaction } from "mobx";

export const history = createBrowserHistory();

reaction(
  () => history.location.pathname,
  (pathname) => {
    console.log(pathname);
  }
);

history.push();
```

## MobX modifications

### `location: Location` <Badge type="tip" text="observable.deep" />

Original location property wrapped in _observable_  
See documentation [here](https://github.com/remix-run/history/blob/main/docs/api-reference.md#location)

### `action: Action` <Badge type="tip" text="observable.ref" />

Original action property wrapped in _observable_  
See documentation [here](https://github.com/remix-run/history/blob/main/docs/api-reference.md#historyaction)

### `isBlocked: boolean` <Badge type="warning" text="computed.struct" />

This property is needed to detect block statement [provided by original history package](https://github.com/remix-run/history/blob/main/docs/api-reference.md#historyblockblocker-blocker)

### `blockersCount: number` <Badge type="tip" text="observable.ref" />

This property is needed to detect block statement [provided by original history package](https://github.com/remix-run/history/blob/main/docs/api-reference.md#historyblockblocker-blocker)

### `destroy()`

This method is needed for destroy all subscriptions and reactions created inside function `createBrowserHistory`

### `locationUrl` <Badge type="warning" text="computed.struct" />

This property represents stringified version of the `location` property

Example:

```ts
/*
{ // location
  pathname: '/en-US/docs/Location.search',
  hash: '',
  search: '?q=123'
}
*/
history.locationUrl; // '/en-US/docs/Location.search?q=123'
```

### `lastBlockedTx: Transition | null` <Badge type="tip" text="observable.ref" />

Last blocked transition.  
This property is helpful if you want to watch about blocked history transitions while history is blocked.  
More information about blocking history you can find [here](https://github.com/remix-run/history/blob/main/docs/api-reference.md#historyblockblocker-blocker)

::: tip will be `null` if history is not blocked
:::

Example:

```ts
import { createBrowserHistory } from "mobx-location-history";

const history = createBrowserHistory();

...
const unblock = history.block(() => {
  //
})
...

history.push('/foo/bar');

history.lastBlockedTx; // { // Transition

unblock();

history.lastBlockedTx; // null
```
