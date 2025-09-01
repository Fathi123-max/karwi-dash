# PNPM Migration Guide

This project has been migrated from npm to pnpm for better performance and disk space usage.

## Why pnpm?

1. **Faster installation**: pnpm uses a content-addressable store and hardlinks to avoid redundant downloads.
2. **Disk space efficiency**: Multiple projects share the same store, reducing disk usage.
3. **Strict dependency resolution**: Prevents access to dependencies that aren't explicitly declared.

## Migration Steps

1. Install pnpm globally:

   ```bash
   npm install -g pnpm
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run development server:
   ```bash
   pnpm run dev
   ```

## Configuration Changes

- Updated all documentation to reference pnpm instead of npm
- Modified husky pre-commit hook to use pnpm
- Added pnpm workspace configuration
- Updated Vercel configuration to explicitly use pnpm
- Updated .prettierignore to ignore pnpm-lock.yaml instead of package-lock.json

## Benefits

- Faster CI builds
- Reduced node_modules size
- Better dependency management
- Improved installation speed
