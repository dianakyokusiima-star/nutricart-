---
name: replit-auth-web lib vite types
description: How to make import.meta.env typecheck in the replit-auth-web shared lib
---

The `lib/replit-auth-web` package uses `import.meta.env.BASE_URL` (Vite-specific). Without Vite's types, TypeScript errors with "Property 'env' does not exist on type 'ImportMeta'".

**Fix:**
1. Add `vite` as a devDependency to `lib/replit-auth-web` (`pnpm --filter @workspace/replit-auth-web add -D vite`)
2. Add `/// <reference types="vite/client" />` as the first line of `use-auth.ts`

Do NOT add `"types": ["vite/client"]` to tsconfig.json without vite installed — that will cause a different TS2688 error.
