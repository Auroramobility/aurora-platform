/*
 * Aurora Application Deletion
 *
 * Admin application deletion removes:
 *
 * - application
 * - application financing request
 * - ownership plans
 * - financing terms
 * - payment schedules
 * - payments
 * - payment allocations
 * - application/ownership-plan conversations
 * - messages belonging to those conversations
 *
 * The customer/profile is NOT deleted.
 *
 * The customer's unrelated general conversation is NOT deleted.
 */

create or replace function public.delete_application_cascade(
  p_application_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conversation_ids uuid[];
  v_deleted boolean := false;
begin

  /*
   * Only admins may perform this operation.
   */
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  /*
   * Verify the application exists.
   */
  if not exists (
    select 1
    from public.applications
    where id = p_application_id
  ) then
    return false;
  end if;

  /*
   * Collect every conversation directly associated with:
   *
   * 1. the application
   * 2. an ownership plan belonging to the application
   *
   * These conversations are application-specific and therefore
   * are part of the application deletion.
   */
  select coalesce(array_agg(c.id), '{}'::uuid[])
  into v_conversation_ids
  from public.conversations c
  where c.application_id = p_application_id
     or c.ownership_plan_id in (
       select op.id
       from public.ownership_plans op
       where op.application_id = p_application_id
     );

  /*
   * Delete messages first.
   *
   * This is explicit so application-specific communication history
   * is removed with the application instead of becoming orphaned.
   */
  if cardinality(v_conversation_ids) > 0 then
    delete from public.messages
    where conversation_id = any(v_conversation_ids);

    /*
     * Delete the application-specific conversations.
     *
     * General customer conversations are untouched.
     */
    delete from public.conversations
    where id = any(v_conversation_ids);
  end if;

  /*
   * Delete the application.
   *
   * Existing CASCADE relationships now remove:
   *
   * application_financing_requests
   * ownership_plans
   * financing_terms
   * payment_schedule
   * payments
   * payment_allocations
   */
  delete from public.applications
  where id = p_application_id;

  v_deleted := found;

  return v_deleted;
end;
$$;

revoke all on function public.delete_application_cascade(uuid) from public;

grant execute
on function public.delete_application_cascade(uuid)
to authenticated;

comment on function public.delete_application_cascade(uuid)
is 'Admin-only permanent deletion of an application and all application-owned business, payment, ownership, and messaging records. Customer account/profile remains.';