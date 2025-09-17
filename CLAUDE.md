# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Package Manager**: Uses PNPM (required version >=9.6.0)
- **Node Version**: >=22.14.0

### Core Commands

```bash
# Development
pnpm dev                    # Start all apps in watch mode
pnpm dev:next              # Start only Next.js app
pnpm dev -F @acme/expo...  # Start only Expo app

# Building & Testing
pnpm build                 # Build all packages
pnpm typecheck            # Type check all packages
pnpm lint                 # Lint all packages
pnpm lint:fix             # Auto-fix linting issues
pnpm format               # Check formatting
pnpm format:fix           # Auto-fix formatting

# Database
pnpm db:generate          # Generate Prisma schemas
pnpm db:push              # Push schema to database
pnpm db:migrate           # Run migrations
pnpm db:studio            # Open Prisma Studio

# Package Management
pnpm clean                # Clean all node_modules
pnpm clean:workspaces     # Clean all workspace build artifacts
```

## Architecture Overview

This is a **T3 Turbo monorepo** with the following structure:

### Apps (`apps/`)

- **`nextjs/`**: Next.js 15 web application with React 19, Tailwind CSS, tRPC client
- **`expo/`**: React Native mobile app using Expo SDK 53 (experimental), Expo Router, NativeWind
- **`ws-server/`**: WebSocket server for real-time features

### Packages (`packages/`)

- **`api/`**: tRPC v11 router definitions and API logic
- **`auth/`**: Authentication using better-auth (supports OAuth, sessions)
- **`db/`**: Database layer with Prisma ORM
- **`validators/`**: Zod validation schemas shared across packages
- **`ui/`**: Shared UI components using shadcn/ui
- **`shared/`**: Shared utilities and types

### Tooling (`tooling/`)

- **`eslint/`**: Shared ESLint configurations
- **`prettier/`**: Shared Prettier configuration
- **`tailwind/`**: Shared Tailwind CSS configuration
- **`typescript/`**: Shared TypeScript configurations

## Key Technologies

- **Frontend**: Next.js 15, React 19, Expo/React Native
- **Styling**: Tailwind CSS, NativeWind (for React Native)
- **API**: tRPC v11 for end-to-end type safety
- **Database**: Prisma ORM
- **Auth**: better-auth with OAuth support
- **State**: Zustand for client state
- **Validation**: Zod v4 schemas
- **Monorepo**: Turborepo with PNPM workspaces

## tRPC Router Development

This project follows a strict modular tRPC router structure defined in `.cursor/rules/trpc.mdc`:

### Structure

```
packages/api/src/router/{entity}/
├── _router.ts              # Router aggregator
├── {action}.route.ts       # Individual routes
packages/validators/src/router/{entity}/
├── {action}.schema.ts      # Validation schemas
```

### Naming Conventions

- **Entities**: Singular form (`post/`, `user/`, `organization/`)
- **Routes**: `{action}.route.ts` (e.g., `create.route.ts`, `byId.route.ts`)
- **Schemas**: `{action}.schema.ts` with exports `Z{Entity}{Action}Schema` and `T{Entity}{Action}Schema`
- **Router exports**: `{entity}Router` (e.g., `postRouter`)

### Development Workflow

1. Create schema in `validators` package
2. Implement route in `api` package
3. Update `_router.ts` aggregator
4. Export schema in `validators/src/index.ts`

## Common Patterns

### Package Dependencies

- **Production apps**: Only Next.js includes `@acme/api` as production dependency
- **Development**: Expo and other apps use `@acme/api` as dev dependency for type safety
- **Shared code**: Use `@acme/shared` for runtime code shared between client/server
