-- Baseline schema for the starter template.
-- Keep Supabase Auth (auth.users) and add a minimal app-level profiles table.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Profiles are readable by owner"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
