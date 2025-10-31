# mobx-location-history

## 9.1.0

### Minor Changes

- [`daf9f05`](https://github.com/js2me/mobx-location-history/commit/daf9f056cc212d4f4572a9f01a1d65646c65548e) Thanks [@js2me](https://github.com/js2me)! - [internal] migration to yummies 6.x

## 9.0.0

### Major Changes

- [`36de827`](https://github.com/js2me/mobx-location-history/commit/36de82704271df0ffa50509e59d851ffe1b08168) Thanks [@js2me](https://github.com/js2me)! - `buildSearchString` and `parseSearchString` now works via `qs` package

### Minor Changes

- [`46b7b66`](https://github.com/js2me/mobx-location-history/commit/46b7b6685ba5590a7e2455e018d19af927a596ab) Thanks [@js2me](https://github.com/js2me)! - mark `abortSignal` and `abortContoller` as deprecated in `QueryParams`

- [`36de827`](https://github.com/js2me/mobx-location-history/commit/36de82704271df0ffa50509e59d851ffe1b08168) Thanks [@js2me](https://github.com/js2me)! - added `TData` generic type to override type of `data` property in `QueryParams` and `IQueryParams`

### Patch Changes

- [`36de827`](https://github.com/js2me/mobx-location-history/commit/36de82704271df0ffa50509e59d851ffe1b08168) Thanks [@js2me](https://github.com/js2me)! - [internal] unify bundle (vite) + unify docs build (vitepress + sborshik)

## 8.1.2

### Patch Changes

- [`0d61990`](https://github.com/js2me/mobx-location-history/commit/0d619909081086013f8818a9b1ac1a78534bc6ed) Thanks [@js2me](https://github.com/js2me)! - refactored build (switch tsc -> zshy for more compatibility)

## 8.1.1

### Patch Changes

- [`a244fdf`](https://github.com/js2me/mobx-location-history/commit/a244fdf5f43dbaae8b13c961c23095040e06234f) Thanks [@js2me](https://github.com/js2me)! - added unit tests for `buildSearchString` and `parseSearchString`

- [`a244fdf`](https://github.com/js2me/mobx-location-history/commit/a244fdf5f43dbaae8b13c961c23095040e06234f) Thanks [@js2me](https://github.com/js2me)! - `buildSearchString` writes nullish values

## 8.1.0

### Minor Changes

- [`32f1ed9`](https://github.com/js2me/mobx-location-history/commit/32f1ed968184fe13e8c76365369c35fc84a9979f) Thanks [@js2me](https://github.com/js2me)! - added docs for parseSearchString buildSearchString

### Patch Changes

- [`32f1ed9`](https://github.com/js2me/mobx-location-history/commit/32f1ed968184fe13e8c76365369c35fc84a9979f) Thanks [@js2me](https://github.com/js2me)! - update docs for blockHistoryWhile

## 8.0.2

### Patch Changes

- [`724cd85`](https://github.com/js2me/mobx-location-history/commit/724cd856c4a9ee1de243d4683eadc1ab0b0fba56) Thanks [@js2me](https://github.com/js2me)! - fixed typings in `blockHistoryWhile` operator

## 8.0.1

### Patch Changes

- [`e687f9e`](https://github.com/js2me/mobx-location-history/commit/e687f9ede500cd9c2c627ba3b63910ba17bd5f04) Thanks [@js2me](https://github.com/js2me)! - fixed `blockHistoryWhile` method with unsubscriptions

## 8.0.0

### Major Changes

- [`0e006fb`](https://github.com/js2me/mobx-location-history/commit/0e006fbd938c79c592edb900de566262b7e50711) Thanks [@js2me](https://github.com/js2me)! - modified `blockHistoryWhile` input arguments (3 args -> 2 args, history passing in second arg, first arg is trueFn blocker)

  PREVIOUS:

  ```ts
  blockHistoryWhile(history, () => true, {
    blocker: () => {},
  });
  ```

  CURRENT:

  ```ts
  blockHistoryWhile(() => true, {
    history,
    blocker: () => {},
  });
  ```

### Minor Changes

- [`0e006fb`](https://github.com/js2me/mobx-location-history/commit/0e006fbd938c79c592edb900de566262b7e50711) Thanks [@js2me](https://github.com/js2me)! - added `lastBlockedTx` for history to detect dynamically last blocked transition

## 7.3.0

### Minor Changes

- [`bd98ba1`](https://github.com/js2me/mobx-location-history/commit/bd98ba18a7815a8a9fc9cbfba460c85333f56557) Thanks [@js2me](https://github.com/js2me)! - added `blockHistoryWhile` utility function based on MobX reaction

## 7.2.0

### Minor Changes

- [`35285f8`](https://github.com/js2me/mobx-location-history/commit/35285f8d1d43201c73e1a3207fa8e88b5b6d5c23) Thanks [@js2me](https://github.com/js2me)! - ci: added update npm and gh release automation

## 7.1.2

### Patch Changes

- fix logo size

## 7.1.1

### Patch Changes

- fix link for `locationUrl` in documentation

## 7.1.0

### Minor Changes

- added `locationUrl` computed.struct property

## 7.0.0

### Major Changes

- added documentation github website
