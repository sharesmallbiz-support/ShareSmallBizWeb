# ShareSmallBizWeb

A React single-page application for the ShareSmallBiz platform — a social network designed for small businesses to connect, share insights, and grow together.

All data is served by the hosted REST API at **`https://api.sharesmallbiz.com`**. This repository contains only the frontend; there is no local backend to run or deploy.

---

## Project Structure

```
ShareSmallBizWeb/
├── web/
│   ├── client/              # React application source
│   │   └── src/
│   │       ├── components/  # UI components (Radix UI / Shadcn)
│   │       ├── contexts/    # AuthContext (JWT)
│   │       ├── hooks/       # Custom React hooks
│   │       ├── lib/         # api.ts — API client, queryClient
│   │       └── pages/       # Route-level pages
│   ├── shared/
│   │   └── schema.ts        # TypeScript types matching API models
│   ├── vite.config.ts
│   └── package.json
├── publish/                 # Build output (auto-generated)
│   └── web/                 # Production-ready static files
├── build.sh                 # Linux / macOS build script
├── build.ps1                # Windows build script
└── package.json             # Root convenience scripts
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| UI components | Radix UI / Shadcn, Tailwind CSS |
| Data fetching | TanStack Query v5 |
| Routing | Wouter |
| Authentication | JWT (stored in `localStorage`, sent as `Authorization: Bearer`) |
| Charts | Recharts |
| Animation | Framer Motion |

---

## API

All data is provided by `https://api.sharesmallbiz.com`.

| Resource | Description |
|---|---|
| `POST /api/auth/login` | Obtain a JWT |
| `POST /api/auth/register` | Create an account |
| `GET /api/discussion/paged` | Paginated discussions (public feed) |
| `POST /api/discussion` | Create a discussion (authenticated) |
| `POST /api/discussion/{id}/like` | Toggle like (authenticated) |
| `GET /api/profiles/{slug}` | Public profile + analytics |
| `GET /api/users/{userId}` | User record (authenticated) |
| `PUT /api/users/{userId}` | Update profile (authenticated) |
| `GET /api/comments?postId=` | Comments for a discussion |
| `GET /api/keywords` | Tags / keywords |
| `GET /api/media` | User media library (authenticated) |

Full API reference: [`.specify/api-developer-guide.md`](.specify/api-developer-guide.md)
Interactive docs (non-production): `https://api.sharesmallbiz.com/scalar/v1`

---

## Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org/)

No .NET SDK, no database, no Docker required.

---

## Quick Start

```bash
cd web
npm install
npm run dev
# App available at http://localhost:5173
```

---

## Build

```bash
# From repo root
./build.sh          # Linux / macOS
./build.ps1         # Windows PowerShell

# Or directly
cd web
npm run build       # Output → publish/web/
```

---

## Environment

Create `web/.env` (optional — defaults to the production API):

```env
VITE_API_BASE_URL=https://api.sharesmallbiz.com
```

Override `VITE_API_BASE_URL` to point at a local or staging instance during development.

---

## Authentication

The app uses **JWT Bearer tokens**.

1. User submits credentials via the Sign In dialog.
2. A `POST /api/auth/login` request returns `{ token, userId, displayName }`.
3. The token is stored in `localStorage` under the key `ssb_token`.
4. Every authenticated API call includes `Authorization: Bearer <token>`.
5. On page load, `AuthContext` decodes the stored token to restore the session.

Tokens expire after the time configured in the API (default: 1 hour). Sign in again to obtain a new token.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-change`)
3. Make your changes
4. Build and verify (`cd web && npm run build`)
5. Submit a pull request

---

## License

MIT
