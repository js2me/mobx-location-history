# `BrowserHistory`  
Browser history stores the location in regular URLs. This is the standard for
most web apps, but it requires some configuration on the server to ensure you
serve the same app at multiple URLs.   

The full documentation for `BrowserHistory` can be found [here](https://github.com/remix-run/history/blob/main/docs/api-reference.md#history)   

[Reference to source code](/src/history/index.ts)   


## Creation   
```ts
import { createBrowserHistory } from "mobx-location-history";

export const history = createBrowserHistory();
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
