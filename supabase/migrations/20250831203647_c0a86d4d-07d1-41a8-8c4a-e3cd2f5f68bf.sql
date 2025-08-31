-- Create role type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- User roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role),
  created_at timestamptz not null default now()
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Role check helper function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete user_roles" ON public.user_roles;

-- Policies for user_roles (only admins can manage)
CREATE POLICY "Admins can view user_roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert user_roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user_roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user_roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Logs table for site content
CREATE TABLE IF NOT EXISTS public.logs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on logs
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Timestamp updater
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Automatically set created_by from auth
CREATE OR REPLACE FUNCTION public.set_created_by_on_insert()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trg_logs_set_created_by ON public.logs;
DROP TRIGGER IF EXISTS trg_logs_updated_at ON public.logs;

-- Triggers
CREATE TRIGGER trg_logs_set_created_by
  BEFORE INSERT ON public.logs
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by_on_insert();

CREATE TRIGGER trg_logs_updated_at
  BEFORE UPDATE ON public.logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view logs" ON public.logs;
DROP POLICY IF EXISTS "Admins can insert logs" ON public.logs;
DROP POLICY IF EXISTS "Admins can update logs" ON public.logs;
DROP POLICY IF EXISTS "Admins can delete logs" ON public.logs;

-- RLS policies for logs
CREATE POLICY "Public can view logs"
  ON public.logs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert logs"
  ON public.logs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update logs"
  ON public.logs
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete logs"
  ON public.logs
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));