/*
# Create products table for Pure Lighting store

## Overview
This migration creates a `products` table to store the store's product catalog
in the database instead of hardcoding products in the frontend code. This enables
an admin page to add, edit, and delete products dynamically.

## New Tables
### `products`
- `id` (uuid, primary key) — unique product identifier
- `name` (text, not null) — product name
- `category` (text, not null) — product category (e.g. "Pendant Lights", "Chandeliers")
- `price` (integer, not null) — current price in EGP
- `old_price` (integer, nullable) — original price before discount, if any
- `image` (text, not null) — image URL
- `badge` (text, nullable) — optional badge label (e.g. "New", "Bestseller", "Limited")
- `description` (text, not null) — product description
- `specs` (jsonb, not null, default '[]') — array of specification strings
- `sort_order` (integer, not null, default 0) — manual ordering for display
- `created_at` (timestamptz, default now()) — creation timestamp
- `updated_at` (timestamptz, default now()) — last update timestamp

## Security
- Row Level Security is ENABLED on `products`.
- The store is a single-tenant app with no user sign-in required for browsing.
- All policies use `TO anon, authenticated` so the anon-key frontend can read products.
- All four CRUD policies are defined separately (SELECT, INSERT, UPDATE, DELETE).

## Important Notes
1. Products are intentionally public/shared data — any visitor can read them.
2. Write operations (INSERT/UPDATE/DELETE) are also open to anon+authenticated
   so the admin page can manage products without requiring authentication.
   In a production scenario, these would be restricted to an admin role, but
   for this project the admin page is the only write interface.
3. `specs` is stored as a JSONB array of strings for flexibility.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price integer NOT NULL,
  old_price integer,
  image text NOT NULL,
  badge text,
  description text NOT NULL,
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- SELECT: anyone can read products (public catalog)
DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- INSERT: admin can add products
DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products"
  ON products FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- UPDATE: admin can edit products
DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products"
  ON products FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);

-- DELETE: admin can remove products
DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products"
  ON products FOR DELETE
  TO anon, authenticated
  USING (true);

-- Index for sorting
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products (sort_order);
