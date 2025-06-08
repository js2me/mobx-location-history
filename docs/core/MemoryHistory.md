# `MemoryHistory`  
Memory history stores the current location in memory. It is designed for use
in stateful non-browser environments like tests and React Native.

The full documentation for `MemoryHistory` can be found [here](https://github.com/remix-run/history/blob/main/docs/api-reference.md#history)   

[Reference to source code](/src/history/index.ts)   


## Usage   
```ts
import { createMemoryHistory } from "mobx-location-history";
import { reaction } from "mobx";

export const history = createMemoryHistory();

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
This method is needed for destroy all subscriptions and reactions created inside function `createMemoryHistory`   
