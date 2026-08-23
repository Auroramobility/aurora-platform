-- =========================
-- ADMIN APPLICATION DELETE
-- =========================

drop policy if exists "Admins can delete applications"
on public.applications;

create policy "Admins can delete applications"
on public.applications
for delete
to authenticated
using (
  public.is_admin()
);