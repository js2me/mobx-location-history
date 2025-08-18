# mobx-location-history

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
