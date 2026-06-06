## 2024-06-06 - Replace O(N) client.find calls in map/filter loops with O(1) Map lookup
**Learning:** Calling `clients.find()` inside a `cases.filter()` or `cases.map()` loop creates an O(N*M) runtime complexity which causes noticeable lag on every re-render when the case and client directories grow.
**Action:** Always pre-compute a `new Map(clients.map(c => [c.id, c.name]))` inside a `React.useMemo` block, and perform an O(1) `.get(id)` lookup inside any subsequent array iterations like `cases.filter()` or `cases.map()`. This reduces the complexity to O(N + M).
