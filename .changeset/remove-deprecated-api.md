---
"mobx-location-history": major
---

Removed all deprecated APIs:

- `QueryParams.buildUrl` — use `QueryParams.createUrl` instead
- `QueryParams.destroy` and the `abortController` / `abortSignal` options — no longer needed
- `createQueryParamFromPreset` — use `createQueryParam` with an object preset instead
- `queryParamPresets` export — use `presets` instead
- `'string[]'`, `'number[]'`, `'boolean[]'` and `'json[]'` presets — use `stringArray`, `numberArray`, `booleanArray` and `jsonArray` instead
- `DefinePresetByType` and `QueryParamsFieldModelPresetConfig` types
