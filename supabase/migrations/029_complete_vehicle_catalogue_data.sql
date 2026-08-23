-- ============================================================
-- Aurora Mobility
-- Migration 029: Complete vehicle catalogue comparison data
-- ============================================================
--
-- The vehicles table is a catalogue of vehicle configurations,
-- not necessarily individual used inventory units.
--
-- Therefore:
--   mileage       = 0 for new catalogue vehicles
--   color         = "Multiple" when no specific inventory color
--                   has been selected
--   battery_health = 100 for new catalogue vehicles
--   charging_time = "Varies by charger" where a verified
--                   vehicle-specific charging-time value is not
--                   currently stored.
--
-- We intentionally do NOT invent vehicle-specific specifications.
-- ============================================================


-- ============================================================
-- 1. Catalogue mileage
-- ============================================================
--
-- A catalogue vehicle without an individual inventory unit has
-- no accumulated mileage. Zero therefore represents "new
-- catalogue vehicle" rather than an unknown used-vehicle mileage.
--
update public.vehicles
set mileage = 0
where mileage is null
  and published = true;


-- ============================================================
-- 2. Catalogue color
-- ============================================================
--
-- These rows represent vehicle configurations rather than a
-- particular physical vehicle with a selected exterior color.
-- "Multiple" is more accurate than inventing a color.
--
update public.vehicles
set color = 'Multiple'
where color is null
  and published = true;


-- ============================================================
-- 3. Battery health
-- ============================================================
--
-- Catalogue entries represent new vehicles unless actual
-- inventory history has been recorded.
--
-- 100 represents expected new-vehicle battery health.
--
update public.vehicles
set battery_health = 100
where battery_health is null
  and published = true;


-- ============================================================
-- 4. Charging time
-- ============================================================
--
-- Do not fabricate a charging duration.
--
-- Where Aurora does not currently have a verified charging-time
-- value for the exact vehicle configuration, explicitly state
-- that charging time varies according to charger, battery
-- conditions, temperature and other factors.
--
update public.vehicles
set charging_time = 'Varies by charger'
where charging_time is null
  and published = true;


-- ============================================================
-- 5. Verification
-- ============================================================

do $$
declare
  v_total integer;
  v_missing_mileage integer;
  v_missing_color integer;
  v_missing_battery_health integer;
  v_missing_charging integer;
begin

  select count(*)
  into v_total
  from public.vehicles
  where published = true;

  select count(*)
  into v_missing_mileage
  from public.vehicles
  where published = true
    and mileage is null;

  select count(*)
  into v_missing_color
  from public.vehicles
  where published = true
    and color is null;

  select count(*)
  into v_missing_battery_health
  from public.vehicles
  where published = true
    and battery_health is null;

  select count(*)
  into v_missing_charging
  from public.vehicles
  where published = true
    and charging_time is null;

  raise notice 'Published vehicles: %', v_total;
  raise notice 'Missing mileage: %', v_missing_mileage;
  raise notice 'Missing color: %', v_missing_color;
  raise notice 'Missing battery health: %', v_missing_battery_health;
  raise notice 'Missing charging time: %', v_missing_charging;

end $$;