# Overview   

This package is **MobX** charged version of the [**history** npm package](https://www.npmjs.com/package/history) _(version: `{packageJson.dependencies.history}`)_ created by [Remix](https://remix.run/)   

So {packageJson.name} has all identical exports as provided in [**history** npm package](https://www.npmjs.com/package/history) because:  

```ts
export * from 'history';
```  

Modified exports:   
- [`createBrowserHistory`](/core/BrowserHistory)  
- [`createHashHistory`](/core/HashHistory)  
- [`createMemoryHistory`](/core/MemoryHistory)  


Also this package has additional location and history utilities like [`QueryParams`](/utilities/QueryParams) (See sidebar)   

