-- Rate limiting for sensitive server actions (messaging, applications,
-- document uploads).
--
-- Implemented in Postgres rather than an external service (Redis /
-- Upstash) deliberately: this app is already fully built on Supabase,
-- and this app's deployment target (serverless) means a plain in-memory
-- limiter wouldn't persist across invocations anyway. This follows the
-- same SECURITY DEFINER RPC pattern already used by is_admin() —
-- clients call a function, never the underlying table directly.
--
-- Usage from a server action:
--   const { data: allowed } = await supabase.rpc("check_rate_limit", {
--     p_action: "send_message",
--     p_max_hits: 30,
--     p_window_seconds: 60,
--   });
--   if (!allowed) { /* reject */ }

create table if not exists public.rate_limit_hits (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_hits_lookup_idx
  on public.rate_limit_hits (user_id, action, created_at desc);

alter table public.rate_limit_hits enable row level security;

-- No direct client access at all — authenticated/anon can call the
-- SECURITY DEFINER function below, but cannot read or write this table
-- directly. There are intentionally no RLS policies granting access;
-- combined with the revoke below, this table is reachable only through
-- check_rate_limit().
revoke all on public.rate_limit_hits from authenticated, anon;

create or replace function public.check_rate_limit(
  p_action text,
  p_max_hits int,
  p_window_seconds int
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_count int;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if p_max_hits <= 0 or p_window_seconds <= 0 then
    raise exception 'p_max_hits and p_window_seconds must be positive';
  end if;

  -- Opportunistically clear this user+action's expired hits. Cheap
  -- (indexed), and keeps the table from growing unbounded between
  -- any future scheduled cleanup job.
  delete from public.rate_limit_hits
  where user_id = v_user_id
    and action = p_action
    and created_at < now() - make_interval(secs => p_window_seconds);

  select count(*) into v_count
  from public.rate_limit_hits
  where user_id = v_user_id
    and action = p_action
    and created_at >= now() - make_interval(secs => p_window_seconds);

  if v_count >= p_max_hits then
    return false;
  end if;

  insert into public.rate_limit_hits (user_id, action)
  values (v_user_id, p_action);

  return true;
end;
$$;

grant execute on function public.check_rate_limit(text, int, int) to authenticated;

comment on function public.check_rate_limit is
  'Sliding-window rate limiter. Returns true and records the call if the '
  'caller has made fewer than p_max_hits calls for p_action in the last '
  'p_window_seconds; returns false (without recording) otherwise. '
  'SECURITY DEFINER so it can read/write rate_limit_hits despite that '
  'table granting no direct access to authenticated/anon.';
