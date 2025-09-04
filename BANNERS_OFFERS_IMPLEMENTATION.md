# Banners and Offers Implementation

This document describes the implementation of the banners and offers management system for the admin panel.

## Database Schema

The implementation includes two new tables:

### Banners Table
```sql
CREATE TABLE public.banners (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  link_url text,
  start_date date,
  end_date date,
  priority integer DEFAULT 0,
  target_audience text,
  metadata JSONB DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT banners_pkey PRIMARY KEY (id)
);
```

### Offers Table
```sql
CREATE TABLE public.offers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  link_url text,
  start_date date,
  end_date date,
  code text UNIQUE,
  discount_type text CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric,
  terms text,
  target_audience text,
  metadata JSONB DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT offers_pkey PRIMARY KEY (id)
);
```

## File Structure

```
src/
├── app/(main)/admin/banners-offers/
│   ├── page.tsx
│   └── _components/
│       ├── banner-form.tsx
│       ├── banner-list.tsx
│       ├── offer-form.tsx
│       └── offer-list.tsx
├── components/banners-offers/
│   ├── banner-carousel.tsx
│   ├── offer-grid.tsx
│   └── index.ts
├── server/banners-offers-actions.ts
├── sql/migrations/20250903_add_banners_offers.sql
└── types/banners-offers.ts
```

## Features

1. **Admin Panel**:
   - Create, read, update, and delete banners and offers
   - Image upload functionality with Supabase Storage
   - Tab-based interface for managing banners and offers separately
   - Priority system for banners
   - Active/inactive status toggle
   - Discount management for offers

2. **Frontend Components**:
   - Banner carousel for displaying banners on the client side
   - Offer grid for displaying offers on the client side
   - Responsive design for all screen sizes

3. **Server Actions**:
   - CRUD operations for banners and offers
   - Automatic date filtering for active items
   - Error handling and validation

## Usage

### Admin Panel
Navigate to `/admin/banners-offers` to manage banners and offers.

### Client-Side Components
Import and use the components in your frontend:

```tsx
import { BannerCarousel, OfferGrid } from "@/components/banners-offers";

export default function HomePage() {
  return (
    <div>
      <BannerCarousel />
      <OfferGrid />
    </div>
  );
}
```

## Extensibility

The schema includes additional fields for future enhancements:
- `link_url` for clickable banners/offers
- `start_date` and `end_date` for time-based visibility
- `priority` for banner ordering
- `target_audience` for audience segmentation
- `metadata` JSONB field for flexible data storage
- `code`, `discount_type`, and `discount_value` for offers
- `terms` for offer terms and conditions