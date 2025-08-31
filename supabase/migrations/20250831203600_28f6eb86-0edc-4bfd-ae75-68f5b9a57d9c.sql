-- Roles enum
create type public.app_role as enum ('admin', 'moderator', 'user');

-- User roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role),
  created_at timestamptz not null default now()
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Role check helper function
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- Policies for user_roles (only admins can manage)
create policy "Admins can view user_roles"
  on public.user_roles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert user_roles"
  on public.user_roles
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update user_roles"
  on public.user_roles
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete user_roles"
  on public.user_roles
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Logs table for site content
create table public.logs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on logs
alter table public.logs enable row level security;

-- Timestamp updater
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Automatically set created_by from auth
create or replace function public.set_created_by_on_insert()
returns trigger
language plpgsql
as $$
begin
  if new.created_by is null then
    new.created_by = auth.uid();
  end if;
  return new;
end;
$$;

-- Triggers
create trigger trg_logs_set_created_by
  before insert on public.logs
  for each row execute function public.set_created_by_on_insert();

create trigger trg_logs_updated_at
  before update on public.logs
  for each row execute function public.update_updated_at_column();

-- RLS policies for logs
create policy "Public can view logs"
  on public.logs
  for select
  to public
  using (true);

create policy "Admins can insert logs"
  on public.logs
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update logs"
  on public.logs
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete logs"
  on public.logs
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));