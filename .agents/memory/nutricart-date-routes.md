---
name: NutriCart date handling in routes
description: Orval/Zod coerces date strings to Date objects; Drizzle date(mode:"string") needs string conversion
---

OpenAPI fields with `format: date` are generated as `zod.coerce.date()` by Orval. After `safeParse`, these values are JS `Date` objects.

Drizzle `date("col", { mode: "string" })` columns expect ISO date strings (`YYYY-MM-DD`), not Date objects — Drizzle will reject Date objects with a TypeScript overload error.

**Fix:** Add a `toDateStr(d: Date | string): string` helper in each route and call it before inserting:
```ts
function toDateStr(d: Date | string): string {
  if (typeof d === "string") return d;
  return d.toISOString().split("T")[0];
}
```

**How to apply:** Any route that handles date fields (purchaseDate, refillDate, startDate, endDate) must use this conversion before inserting or updating.
