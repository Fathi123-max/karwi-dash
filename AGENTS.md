# AGENTS.md

## Quick Start

- `pnpm run dev` - Start dev server
- `pnpm run build` - Production build
- `pnpm run lint` - ESLint check
- `pnpm run format` - Prettier fix
- `pnpm run format:check` - Prettier validation

## Code Style

- **Prettier**: 2-space tabs, 120 char width, trailing commas
- **Imports**: React → Next → External → Internal → Parent → Sibling
- **Naming**: kebab-case files, PascalCase components
- **Types**: Use TypeScript strict mode, avoid `any`
- **React**: No nested components, memoize context values
- **Line limits**: 300 max lines, 4 max depth

## Testing

- No test framework configured - add Jest/Vitest if needed
- Use `pnpm run lint` and `pnpm run format:check` before commits

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (external)/        # Landing pages
│   └── (main)/            # Authenticated routes
├── components/            # Reusable UI components
├── lib/                   # Utilities and helpers
├── stores/                # State management
└── types/                 # TypeScript definitions
```

## Key Features

- **Authentication**: Multi-version auth flows (v1/v2)
- **Dashboard**: CRM, Finance, and Default views
- **UI Components**: Shadcn/ui with custom styling
- **Responsive**: Mobile-first design with sidebar navigation
