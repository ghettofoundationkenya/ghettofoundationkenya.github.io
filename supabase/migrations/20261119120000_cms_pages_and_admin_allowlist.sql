-- Universal page CMS and strict admin email allowlist for Ghetto Foundation.
-- Apply after the existing migrations that create app_role, user_roles and has_role().

create table if not exists public.site_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  hero_image text,
  sections jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists site_pages_status_slug_idx
  on public.site_pages (status, slug);

alter table public.site_pages enable row level security;

drop policy if exists "Public can read published pages" on public.site_pages;
create policy "Public can read published pages"
  on public.site_pages for select
  using (status = 'published');

drop policy if exists "Admins can manage pages" on public.site_pages;
create policy "Admins can manage pages"
  on public.site_pages for all
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

create or replace function public.set_site_pages_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists set_site_pages_updated_at on public.site_pages;
create trigger set_site_pages_updated_at
  before update on public.site_pages
  for each row execute function public.set_site_pages_updated_at();

-- Only the two explicitly authorised addresses may create Auth accounts
-- in this project. This is enforced by the database, not just the login UI.
create or replace function public.enforce_gf_admin_email_allowlist()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if lower(coalesce(new.email, '')) not in (
    'sndambuki155@gmail.com',
    'management@ghettofoundationkenya.org'
  ) then
    raise exception 'This email address is not authorised for Ghetto Foundation website access.';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_gf_admin_email_allowlist on auth.users;
create trigger enforce_gf_admin_email_allowlist
  before insert or update of email on auth.users
  for each row execute function public.enforce_gf_admin_email_allowlist();

-- Automatically grant admin role to either allowlisted account when it is
-- invited/created. Existing accounts are handled by the idempotent insert below.
create or replace function public.grant_gf_admin_role()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if lower(coalesce(new.email, '')) in (
    'sndambuki155@gmail.com',
    'management@ghettofoundationkenya.org'
  ) then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin'::public.app_role)
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists grant_gf_admin_role on auth.users;
create trigger grant_gf_admin_role
  after insert on auth.users
  for each row execute function public.grant_gf_admin_role();

insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where lower(email) in (
  'sndambuki155@gmail.com',
  'management@ghettofoundationkenya.org'
)
on conflict (user_id, role) do nothing;

comment on table public.site_pages is
  'Editable page content for the Ghetto Foundation website; sections are JSON blocks.';
