-- MANDEM store schema
-- Run this once against your Supabase project (SQL editor, or `supabase db push`).

create extension if not exists "pgcrypto";

-- Live stock per variant SKU. Product descriptive content (name, price,
-- images, description) lives in the app's catalog (src/data/products.json);
-- this table is the single source of truth for real, decrementing inventory.
create table if not exists product_stock (
  sku text primary key,
  product_slug text not null,
  size text not null,
  color text not null,
  stock int not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists product_stock_slug_idx on product_stock (product_slug);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment','paid','processing','shipped','delivered','cancelled','failed')),
  payment_method text not null default 'bkash' check (payment_method in ('bkash','cod')),
  subtotal int not null,
  shipping_fee int not null default 0,
  discount_amount int not null default 0,
  promo_code text,
  total int not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  division text not null,
  district text not null,
  address_line text not null,
  notes text,
  bkash_payment_id text,
  bkash_trx_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_order_number_idx on orders (order_number);
create index if not exists orders_phone_idx on orders (customer_phone);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_slug text not null,
  variant_sku text not null,
  product_name text not null,
  size text not null,
  color text not null,
  unit_price int not null,
  qty int not null
);

create index if not exists order_items_order_idx on order_items (order_id);

-- Row Level Security: lock everything down by default. The app talks to
-- these tables from server-side API routes using the service role key,
-- which bypasses RLS. We only open a narrow public read on stock so the
-- storefront can show live "X left" / sold-out state.
alter table product_stock enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists "public can read stock" on product_stock;
create policy "public can read stock" on product_stock
  for select using (true);

-- No public policies on orders / order_items: only the service role
-- (server) can read or write these, which keeps customer PII private.

-- Keep updated_at fresh.
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at before update on orders
  for each row execute function set_updated_at();

drop trigger if exists stock_set_updated_at on product_stock;
create trigger stock_set_updated_at before update on product_stock
  for each row execute function set_updated_at();

-- Atomically decrement stock for one SKU, never going below zero.
-- Returns the row actually updated (empty result = sold out / race lost).
create or replace function decrement_stock(p_sku text, p_qty int)
returns setof product_stock as $$
begin
  return query
  update product_stock
    set stock = stock - p_qty
    where sku = p_sku and stock >= p_qty
    returning *;
end;
$$ language plpgsql;

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;
-- No public policies: signups are inserted by the server (service role) via
-- /api/newsletter, which also enforces the unique-email de-dupe itself.
