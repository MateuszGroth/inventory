# Inventory Monorepo

This repository contains a **full-stack monorepo** managed with **Nx**, consisting of a backend API and a frontend web application.

---

## 🧱 Monorepo

- **Nx** is used as the repository manager to orchestrate builds, caching, and development workflows across applications and libraries. It uses pnpm as the package manager

---

## 🔧 Backend

- **Runtime:** Node.js
- **Framework:** Express
- **ORM:** Prisma
- **Database:** PostgreSQL

The backend exposes a REST API for working with stores and products. It runs on localhost:4002 by default

---

## 🎨 Frontend

- **Framework:** React
- **UI Library:** Material UI (MUI)
- **Routing:** React Router DOM
- **Data Fetching & Caching:** TanStack React Query

The frontend consumes the backend API and provides a UI for browsing stores and products.

### Available Routes

- `GET /stores`
- `GET /stores/:id`
- `GET /stores/:id/products`
- `GET /products`

---

## ▶️ Running the Application

To build and run the application locally using Docker:

```bash
docker-compose build && docker compose up -d
```

## 🚀 Improvements With More Time

If more development time were available, the following improvements would be made:

- Work on the frontend a bit more - improve UI and overall user experience, add better error handling and cleaner loading states, Implement lazy loading for pages, Use React Hook Form + Zod for forms and filters, Refactor and split code into smaller, reusable pieces (DRY), Define stricter and more consistent ESLint rules

- Add unit and integration tests

- Introduce structured logging

- Add scripts to improve developer experience (DX)

## 🏭 Production Readiness

All improvements listed above

- A production-ready Dockerfile for the Node.js backend

- CI/CD pipeline for automated testing, building, and deployment

## 📁 Project Structure

```
├── apps/
│ ├── inventory/ [scope:inventory] - React e-commerce app
│ └── api/ [scope:api] - Backend API
├── libs/
│ ├── ui/ [scope:inventory,type:ui] - UI components
│ ├── api/
│ │ └── products/ [scope:api] - Product service
│ │ └── stores/ [scope:api] - Stores service
│ │ └── db/ [scope:api] - Db service
│ └── shared/
│ ├── models/ [scope:shared,type:data] - Shared models
├── nx.json - Nx configuration
├── tsconfig.json - TypeScript configuration
└── eslint.config.mjs - ESLint with module boundary rules

```

## 📚 Useful Commands

```bash
# Project exploration
npx nx graph                                    # Interactive dependency graph
npx nx list                                     # List installed plugins
npx nx show project inventory --web             # View project details

# Development
npx nx serve inventory                         # Serve React app
npx nx serve api                               # Serve backend API
npx nx build inventory                         # Build React app
npx nx test ui                                 # Test a specific library

# Running multiple tasks
npx nx run-many -t build                       # Build all projects
npx nx run-many -t test --parallel=3          # Test in parallel
npx nx run-many -t lint test build            # Run multiple targets

# Affected commands (great for CI)
npx nx affected -t build                       # Build only affected projects
npx nx affected -t test                        # Test only affected projects
```
