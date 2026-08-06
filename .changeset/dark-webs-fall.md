---
"mobx-location-history": patch
---

Fixed `QueryParams.createUrl` query parameter merging. Values from `data` now
override duplicate parameters in the provided path.
