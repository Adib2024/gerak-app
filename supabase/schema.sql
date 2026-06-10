-- ============================================================
-- gerak app — Supabase schema
-- Run this in: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- 1. Profiles (extends auth.users)
create table public.profiles (
  id          uuid        references auth.users(id) on delete cascade primary key,
  name        text        not null,
  matric_no   text        not null,
  email       text        not null,
  balance     numeric(10,2) not null default 10.00,
  points      integer     not null default 100,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- 2. Rides history
create table public.rides (
  id             text        primary key,
  user_id        uuid        references auth.users(id) on delete cascade,
  pickup         text        not null,
  destination    text        not null,
  fare           numeric(10,2) not null,
  status         text        not null default 'completed',
  driver_name    text,
  driver_rating  numeric(3,1),
  driver_vehicle text,
  driver_plate   text,
  driver_phone   text,
  created_at     timestamptz default now()
);

alter table public.rides enable row level security;

create policy "Users can read own rides"
  on public.rides for select using (auth.uid() = user_id);

create policy "Users can insert own rides"
  on public.rides for insert with check (auth.uid() = user_id);

-- 3. Jubah bookings
create table public.jubah_bookings (
  id                 uuid    default gen_random_uuid() primary key,
  user_id            uuid    references auth.users(id) on delete cascade,
  full_name          text    not null,
  ic_number          text    not null,
  hp_number          text    not null,
  university         text    not null,
  faculty            text    not null,
  matric_id          text    not null,
  payment_mode       text    not null check (payment_mode in ('pickup', 'postage')),
  remark             text    not null check (remark in ('Master', 'PHD', 'Degree', 'Diploma')),
  combined_file_name text,
  cost               numeric(10,2) not null,
  status             text    not null default 'ordered',
  return_scheduled   boolean not null default false,
  return_method      text,
  return_date        text,
  return_time        text,
  created_at         timestamptz default now()
);

alter table public.jubah_bookings enable row level security;

create policy "Users can read own jubah bookings"
  on public.jubah_bookings for select using (auth.uid() = user_id);

create policy "Users can insert own jubah bookings"
  on public.jubah_bookings for insert with check (auth.uid() = user_id);

create policy "Users can update own jubah bookings"
  on public.jubah_bookings for update using (auth.uid() = user_id);

-- 4. Food orders
create table public.food_orders (
  id         text    primary key,
  user_id    uuid    references auth.users(id) on delete cascade,
  total      numeric(10,2) not null,
  status     text    not null default 'completed',
  created_at timestamptz default now()
);

alter table public.food_orders enable row level security;

create policy "Users can read own food orders"
  on public.food_orders for select using (auth.uid() = user_id);

create policy "Users can insert own food orders"
  on public.food_orders for insert with check (auth.uid() = user_id);

-- 5. Food order items
create table public.food_order_items (
  id         uuid  default gen_random_uuid() primary key,
  order_id   text  references public.food_orders(id) on delete cascade,
  item_name  text  not null,
  price      numeric(10,2) not null,
  quantity   integer not null,
  stall_name text
);

alter table public.food_order_items enable row level security;

create policy "Users can read own food order items"
  on public.food_order_items for select
  using (exists (
    select 1 from public.food_orders
    where food_orders.id = food_order_items.order_id
    and food_orders.user_id = auth.uid()
  ));

create policy "Users can insert food order items"
  on public.food_order_items for insert
  with check (exists (
    select 1 from public.food_orders
    where food_orders.id = food_order_items.order_id
    and food_orders.user_id = auth.uid()
  ));

-- ============================================================
-- Trigger: auto-create profile row when a new user registers
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, matric_no, email, balance, points)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Student'),
    coalesce(new.raw_user_meta_data->>'matric_no', ''),
    new.email,
    10.00,
    100
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
