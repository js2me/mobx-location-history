# `parseSearchString()`

Converts a URL search string into an object.

Example:

```ts
parseSearchString("?foo=bar&baz=qux");
// returns { foo: 'bar', baz: 'qux' }

parseSearchString("foo=bar&baz=qux");
// returns { foo: 'bar', baz: 'qux' }
```
