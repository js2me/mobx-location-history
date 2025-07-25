# `HashHistory`  
Hash history stores the location in window.location.hash. This makes it ideal
for situations where you don't want to send the location to the server for
some reason, either because you do cannot configure it or the URL space is
reserved for something else.

The full documentation for `HashHistory` can be found [here](https://github.com/remix-run/history/blob/main/docs/api-reference.md#history)   

[Reference to source code](/src/history/index.ts)   


## Usage   
```ts
import { createHashHistory } from "mobx-location-history";
import { reaction } from "mobx";

export const history = createHashHistory();

reaction(
  () => history.location.pathname,
  pathname => {
    console.log(pathname);
  }
)

history.push()
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
This method is needed for destroy all subscriptions and reactions created inside function `createHashHistory`   

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