# `buildSearchString()`

The function takes an object as an argument and returns a URL search string. If the object contains any properties with `undefined` values, they will be excluded from the resulting string.

#### Example

```ts
buildSearchString({ foo: "bar", baz: "qux", unset: null });
// returns "?foo=bar&baz=qux"

buildSearchString({ kek: null, other: undefined });
// returns "?kek=null"
```
