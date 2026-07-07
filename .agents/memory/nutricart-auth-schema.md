---
name: NutriCart auth schema contract
description: The sessions table schema required by the replit-auth lib template
---

The replit-auth template (`artifacts/api-server/src/lib/auth.ts`) expects `sessionsTable` to have exactly three columns:
- `sid` text PRIMARY KEY
- `sess` jsonb NOT NULL
- `expire` timestamptz NOT NULL

**Why:** The lib uses `sid` as the cookie value, `sess` to store the full SessionData JSON payload, and `expire` for TTL checks. Using a normalized schema (id/userId/expiresAt) breaks the session read/write contract.

**How to apply:** When setting up or resetting the sessions table, ensure these exact column names. If drizzle-kit push fails interactively (CI/TTY issues), use `executeSql` to drop+recreate the table directly.
