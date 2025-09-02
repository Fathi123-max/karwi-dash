# Gemini Customization: Karwi-Dash Project

This file provides context and instructions for Gemini to act as a senior frontend developer for the Karwi-Dash project.

## Project Overview

This is a Next.js 15+ application using the App Router, managed as a pnpm workspace. The primary focus is on building and extending feature-rich dashboards for a franchise management system. The project is built with TypeScript, utilizes Tailwind CSS for styling, and integrates Supabase for backend services. Internationalization (i18n) is handled using `next-intl`.

## Key Technologies

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Backend & DB:** Supabase (Authentication, Database)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (located in `src/components/ui`)
- **Linting/Formatting:** ESLint, Prettier

## Key Libraries

- **Data Tables:** TanStack Table (`@tanstack/react-table`) is used for all data grid implementations. See `src/components/data-table`.
- **State Management:** Zustand is the primary client-side state management solution. See `src/stores`.
- **Forms:** React Hook Form (`react-hook-form`) with Zod (`zod`) for schema validation.
- **Internationalization (i18n):** `next-intl` for localization.
- **Drag & Drop:** `@dnd-kit` for drag-and-drop functionality.
- **Charts:** `recharts` for data visualization.
- **Icons:** `lucide-react`.

## Data Flow & State Management

- **Server State:** Server-side data fetching and mutations are handled through Next.js Server Actions. See `src/server/server-actions.ts`.
- **Client State:** Global client-side state is managed with Zustand. Stores are organized by feature inside `src/stores` (e.g., `franchise-dashboard`, `admin-dashboard`).
- **Database:** The database schema is defined in `src/sql/schema.sql` and types are generated via Supabase CLI, located in `src/types/supabase.ts`.

## Authentication

Authentication is handled by Supabase Auth. The logic is implemented using Next.js middleware (`src/middleware.ts`) and the Supabase SSR package.

## Internationalization (i18n)

The project uses `next-intl` for i18n.
- Locale-based message files are stored in `src/messages`.
- Configuration and middleware for i18n can be found in `src/i18n` and `src/middleware.ts`.

## General Conventions

- Follow the existing file structure and naming conventions.
- Use absolute imports relative to the `src` directory.
- All components should be functional components using hooks.
- For any new feature, check the existing `_components` directory pattern. Create a `_components` directory for page-specific components (e.g., `src/app/(main)/dashboard/_components`).
- Ensure all code is properly typed with TypeScript.

## Scripts & Commands

- **Development:** `pnpm run dev`
- **Linting:** `pnpm run lint`
- **Formatting:** `pnpm run format`

After any code modifications, run `pnpm run lint` and `pnpm run format` to ensure the changes adhere to the project's standards before committing.