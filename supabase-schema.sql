create table if not exists public.shop_config (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  owner_key text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.bulk_requests (
  id text primary key,
  owner_key text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.artwork (
  id text primary key,
  print text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.shop_config enable row level security;
alter table public.orders enable row level security;
alter table public.bulk_requests enable row level security;
alter table public.artwork enable row level security;
alter table public.admin_users enable row level security;

create policy "Anyone can read shop config"
  on public.shop_config for select using (true);
create policy "Admins can write shop config"
  on public.shop_config for all using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Customers can create orders" on public.orders;
drop policy if exists "Customers can read their orders" on public.orders;
drop policy if exists "Admins can update orders" on public.orders;
drop policy if exists "Customers can create their own orders" on public.orders;
drop policy if exists "Customers can read their own orders" on public.orders;
drop policy if exists "Customers and admins can update orders" on public.orders;

create policy "Customers can create their own orders"
  on public.orders for insert
  with check (owner_key = auth.uid()::text);
create policy "Customers can read their own orders"
  on public.orders for select
  using (owner_key = auth.uid()::text or exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Customers and admins can update orders"
  on public.orders for update
  using (owner_key = auth.uid()::text or exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (owner_key = auth.uid()::text or exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Customers can create bulk requests" on public.bulk_requests;
drop policy if exists "Customers can read bulk requests" on public.bulk_requests;
drop policy if exists "Admins can update bulk requests" on public.bulk_requests;
drop policy if exists "Customers can create their own bulk requests" on public.bulk_requests;
drop policy if exists "Customers and admins can read bulk requests" on public.bulk_requests;

create policy "Customers can create their own bulk requests"
  on public.bulk_requests for insert
  with check (owner_key = auth.uid()::text);
create policy "Customers and admins can read bulk requests"
  on public.bulk_requests for select
  using (owner_key = auth.uid()::text or exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can update bulk requests"
  on public.bulk_requests for update using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Customers can save artwork"
  on public.artwork for insert with check (true);
create policy "Anyone can read artwork"
  on public.artwork for select using (true);
create policy "Admins can update artwork"
  on public.artwork for update using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Users can check their admin access"
  on public.admin_users for select using (auth.uid() = user_id);

insert into public.shop_config (id, data)
values ('default', '{}'::jsonb)
on conflict (id) do nothing;

alter publication supabase_realtime add table public.shop_config;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.bulk_requests;
alter publication supabase_realtime add table public.artwork;
