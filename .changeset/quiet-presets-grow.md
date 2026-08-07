---
"mobx-location-history": patch
---

Added typed query parameter presets for dates, enums, boolean arrays, and JSON
arrays. Array presets now also have camelCase aliases such as `numberArray`.

Deprecated `createQueryParamFromPreset`, `queryParamPresets`, and array preset
names with `[]` in favor of the new APIs.
