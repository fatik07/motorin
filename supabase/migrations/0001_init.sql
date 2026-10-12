-- MotorTrack: initial schema
-- Mirrors src/types/index.ts (Motor, Component, ServiceLog, KmLog).
-- Auth: Supabase anonymous auth. user_id = auth.uid(); no profiles table —
-- edit-profile fields (name/email/phone) stay local-only, never synced.
--
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query),
-- or via `supabase db push` if you set up the CLI later.

create extension if not exists "pgcrypto";

-- Shared trigger: keeps updated_at current on every UPDATE, so the client
-- never has to remember to set it (used by the last-write-wins sync).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- MOTORS ----------------------------------------------------------------

create table public.motors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  fuel_type text not null check (fuel_type in ('bensin', 'listrik')),
  transmission text check (transmission is null or transmission in ('manual', 'matic')),
  current_km integer not null check (current_km >= 0),
  photo_uri text,
  brand text,
  model text,
  year integer,
  plate_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index motors_user_id_idx on public.motors (user_id);

create trigger motors_set_updated_at
  before update on public.motors
  for each row execute function public.set_updated_at();

-- COMPONENTS --------------------------------------------------------------

create table public.components (
  id uuid primary key default gen_random_uuid(),
  motor_id uuid not null references public.motors(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  interval_km integer not null check (interval_km > 0),
  last_service_km integer not null check (last_service_km >= 0),
  last_service_date timestamptz,
  is_pinned boolean not null default false,
  is_hidden boolean not null default false,
  is_custom boolean not null default false,
  is_muted boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index components_motor_id_idx on public.components (motor_id);
create index components_user_id_idx on public.components (user_id);

create trigger components_set_updated_at
  before update on public.components
  for each row execute function public.set_updated_at();

-- SERVICE LOGS ------------------------------------------------------------

create table public.service_logs (
  id uuid primary key default gen_random_uuid(),
  component_id uuid not null references public.components(id) on delete cascade,
  motor_id uuid not null references public.motors(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  service_km integer not null check (service_km >= 0),
  service_date timestamptz not null,
  notes text,
  brand_used text,
  cost integer check (cost is null or cost >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index service_logs_component_id_idx on public.service_logs (component_id);
create index service_logs_motor_id_idx on public.service_logs (motor_id);
create index service_logs_user_id_idx on public.service_logs (user_id);

create trigger service_logs_set_updated_at
  before update on public.service_logs
  for each row execute function public.set_updated_at();

-- KM LOGS -------------------------------------------------------------------

create table public.km_logs (
  id uuid primary key default gen_random_uuid(),
  motor_id uuid not null references public.motors(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  km_value integer not null check (km_value >= 0),
  logged_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index km_logs_motor_id_idx on public.km_logs (motor_id);
create index km_logs_user_id_idx on public.km_logs (user_id);

create trigger km_logs_set_updated_at
  before update on public.km_logs
  for each row execute function public.set_updated_at();

-- ROW LEVEL SECURITY --------------------------------------------------------
-- Every row is only visible/writable by the anonymous-auth user that owns it.

alter table public.motors enable row level security;
alter table public.components enable row level security;
alter table public.service_logs enable row level security;
alter table public.km_logs enable row level security;

create policy "Users manage their own motors"
  on public.motors for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own components"
  on public.components for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own service logs"
  on public.service_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own km logs"
  on public.km_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
