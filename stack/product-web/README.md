# Product `web-react` scaffold

Structure aligned with [kombai-io/webbuilder](https://github.com/kombai-io/webbuilder):

- **Vite** + **React 19** + **TypeScript**
- **`main.tsx`** at package root (webbuilder style)
- **`src/pages/`** — route-level screens
- **`src/components/`** — reusable UI
- **`src/hooks/`**, **`src/services/`**, **`src/store/`**, **`src/utils/`**, **`src/types/`**
- **Mantine v7** + **Redux Toolkit**

Use for marketing sites, booking flows, and storefront UIs. Pair with a separate API backend.

```powershell
.\scripts\bootstrap-web-react.ps1 -ProductRoot "github-six\templates\booking-api" -Kind product -DevPort 3000
```

Note: **Next.js + Prisma** repos in `github-six` keep `app/` for SSR/API routes; add or migrate customer UI to `web-react/` when the UI is a pure SPA.
