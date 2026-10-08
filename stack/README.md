# Portfolio stack (FastAPI + product SPA)

This folder groups the **hiring-portfolio** API and Vite product UI. It sits beside the main product (Next.js site, Prisma DB, etc.) in the repo root.

| Path | Role |
|------|------|
| **`../backend/`** | FastAPI service — quotes, bookings/orders, `GET /integrations/status`, Stripe checkout |
| **`product-web/`** | Vite + Mantine SPA (domain profile from `frontend-scaffold/profiles/`) |

## Run locally

```bash
# API (from api/)
python -m venv .venv && .venv\Scripts\pip install -r requirements.txt
.venv\Scripts\uvicorn src.main:backend_app --reload --port 8010

# Product UI (from product-web/)
npm install && npm run dev
```

Main customer site (Next.js) uses root `package.json` — see repo root **README.md**.
