export const COMPARE_STORAGE_KEY = "aurora-compare-vehicles";
export const COMPARE_EVENT = "aurora:compare-changed";
export const MAX_COMPARE_VEHICLES = 4;

function normalizeIds(ids: string[]): string[] {
  return [...new Set(ids.filter((id) => typeof id === "string" && id.trim()))].slice(
    0,
    MAX_COMPARE_VEHICLES,
  );
}

export function readCompareIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const value = JSON.parse(
      window.localStorage.getItem(COMPARE_STORAGE_KEY) ?? "[]",
    );

    return Array.isArray(value)
      ? normalizeIds(value.filter((id): id is string => typeof id === "string"))
      : [];
  } catch {
    return [];
  }
}

export function writeCompareIds(ids: string[]) {
  if (typeof window === "undefined") return;

  const normalized = normalizeIds(ids);
  window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event(COMPARE_EVENT));
}

export function toggleCompareId(vehicleId: string): string[] {
  const ids = readCompareIds();

  if (ids.includes(vehicleId)) {
    const next = ids.filter((id) => id !== vehicleId);
    writeCompareIds(next);
    return next;
  }

  if (ids.length >= MAX_COMPARE_VEHICLES) return ids;

  const next = [...ids, vehicleId];
  writeCompareIds(next);
  return next;
}

export function clearCompareIds() {
  writeCompareIds([]);
}
