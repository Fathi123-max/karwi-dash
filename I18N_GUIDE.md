# Internationalization (i18n) Guide

This project uses `next-intl` for internationalization without locale routing. Here's how to use it:

## How it works

1. Language is stored in a cookie (`NEXT_LOCALE`)
2. Default language is English (`en`)
3. Supported languages are English (`en`) and Arabic (`ar`)
4. Language can be switched using the language switcher components

## Using translations in components

### Client Components

For client components, use the `useTranslations` hook:

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');
  
  return (
    <div>
      <h1>{t('dashboard')}</h1>
      <button>{tCommon('save')}</button>
    </div>
  );
}
```

### Server Components

For server components, use the `getTranslations` function:

```tsx
import { getTranslations } from 'next-intl/server';

export default async function MyServerComponent() {
  const t = await getTranslations('navigation');
  const tCommon = await getTranslations('common');
  
  return (
    <div>
      <h1>{t('dashboard')}</h1>
      <button>{tCommon('save')}</button>
    </div>
  );
}
```

## Adding new translations

1. Add new keys to both `src/messages/en.json` and `src/messages/ar.json`
2. Use nested objects to organize translations by section
3. Keep translations consistent between languages

## Using the language switcher

Import and use one of the language switcher components:

```tsx
import { LanguageSwitcherButtons } from '@/components/i18n/language-switcher-buttons';

export function Header() {
  return (
    <header>
      <LanguageSwitcherButtons />
    </header>
  );
}
```

## Setting page titles

Use `generateMetadata` with `getTranslations` to set page titles:

```tsx
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('dashboard');
  return {
    title: t('welcome'),
  };
}
```