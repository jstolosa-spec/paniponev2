# Cloudflare Workers Full-Stack Chat App Template

[![[cloudflarebutton]]](https://deploy.workers.cloudflare.com)

A production-ready full-stack chat application template built on Cloudflare Workers. Features a reactive React frontend with Shadcn/UI components, Tanstack Query for data fetching, and a serverless backend powered by Hono routing and Durable Objects for stateful entities (Users, Chats, Messages). Includes automatic seeding, pagination, CRUD operations, and real-time message handling.

## 🚀 Key Features

- **Serverless Backend**: Hono-based API routes with CORS, logging, and error handling.
- **Durable Objects**: Per-entity storage for Users and ChatBoards with indexing for efficient listing/pagination.
- **Reactive Frontend**: React 18, TypeScript, Tanstack Query, React Router, with dark mode and theme toggle.
- **Modern UI**: Shadcn/UI components, Tailwind CSS with custom animations, responsive design.
- **Data Management**: Automatic mock data seeding, batched deletes, optimistic updates via Tanstack Query.
- **Development Workflow**: Hot module replacement (HMR), Bun-powered fast builds, Cloudflare type generation.
- **Production-Ready**: Error boundaries, client error reporting, health checks, SPA routing.
- **Zero Config Deployment**: Deploy to Cloudflare Workers/Pages with one command.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn/UI, Tanstack Query, React Router, Lucide Icons, Sonner (toasts), Framer Motion.
- **Backend**: Cloudflare Workers, Hono, Durable Objects (SQLite-backed).
- **State & Data**: Immer, Zustand (optional), Date-fns.
- **Dev Tools**: Bun, Wrangler, ESLint, TypeScript 5.
- **UI Libraries**: Radix UI primitives, Class Variance Authority (CVA), Tailwind Merge.

## ⚡ Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (package manager & runtime)
- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/) (`npm i -g wrangler`)
- Cloudflare account (free tier sufficient)

### Installation

```bash
bun install
```

### Development

Start the dev server with HMR:

```bash
bun dev
```

- Frontend: http://localhost:3000
- API: http://localhost:3000/api/health
- Wrangler types: `bun run cf-typegen`

### Build & Preview

```bash
bun run build
bun run preview
```

## 📖 Usage

### API Endpoints

All routes under `/api/`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | List users (?cursor=&limit=) |
| POST | `/api/users` | Create user `{name}` |
| DELETE | `/api/users/:id` | Delete user |
| POST | `/api/users/deleteMany` | Bulk delete `{ids: []}` |
| GET | `/api/chats` | List chats |
| POST | `/api/chats` | Create chat `{title}` |
| GET | `/api/chats/:chatId/messages` | List messages |
| POST | `/api/chats/:chatId/messages` | Send message `{userId, text}` |

Example (fetch users):

```ts
// src/lib/api-client.ts helper
const users = await api<User[]>('/api/users?limit=10');
```

### Frontend Customization

- **HomePage**: `src/pages/HomePage.tsx` – Replace with your app UI.
- **Routes**: `src/main.tsx` – Add via React Router.
- **API Integration**: Use `api()` from `src/lib/api-client.ts` with Tanstack Query.
- **Sidebar**: `src/components/layout/AppLayout.tsx` – Optional, toggle via `container` prop.
- **Theme**: Automatic dark/light mode with `useTheme()` hook.
- **Error Handling**: Global `ErrorBoundary` and route-level boundaries.

Mock data auto-seeds on first API call.

## ☁️ Deployment

Deploy to Cloudflare Workers (free, global edge network):

```bash
bun run deploy
```

Or via Wrangler:

```bash
wrangler deploy
```

- Config: `wrangler.jsonc` (Durable Objects pre-configured).
- Assets: SPA fallback routing.
- Custom Domain: `wrangler deploy --var ASSETS_URL=https://your-pages-project.pages.dev`.

[![[cloudflarebutton]]](https://deploy.workers.cloudflare.com)

## 🏗 Project Structure

```
├── src/                 # React app
│   ├── components/ui/   # Shadcn/UI components
│   ├── pages/           # Page components
│   └── lib/             # Utilities, API client
├── worker/              # Cloudflare Workers backend
│   ├── index.ts         # Main entry (DO NOT EDIT)
│   ├── user-routes.ts   # YOUR API ROUTES
│   ├── core-utils.ts    # Entity system (DO NOT EDIT)
│   └── entities.ts      # User/Chat entities
├── shared/              # Shared types/mock data
├── vite.config.ts       # Vite + Cloudflare plugin
└── wrangler.jsonc       # Workers config
```

**Key Files to Edit**:
- `worker/user-routes.ts`: Add API routes.
- `worker/entities.ts`: Extend entities.
- `src/pages/HomePage.tsx`: Your app UI.

## 🤝 Contributing

1. Fork & clone.
2. `bun install && bun dev`.
3. Add features/PRs.
4. Follow ESLint/TypeScript rules.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Hono](https://hono.dev/)
- [Shadcn/UI](https://ui.shadcn.com/)

Built with ❤️ for Cloudflare Workers.