create extension if not exists pgcrypto;

create table if not exists public.strategy_library_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  summary text not null default '',
  fit_for text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
