-- Migration to add banners and offers tables
-- This migration adds tables for managing banners and offers in the admin panel

-- Banners table
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

COMMENT ON TABLE public.banners IS 'Banners with image, title and description.';

-- Offers table
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

COMMENT ON TABLE public.offers IS 'Offers with image, title and description.';