"use client";

import { useCallback, useEffect, useState } from "react";
import {
  COMPARE_EVENT,
  clearCompareIds,
  MAX_COMPARE_VEHICLES,
  readCompareIds,
  toggleCompareId,
} from "./compare-storage";

export function useCompareSelection() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setIds(readCompareIds());
    sync();
    window.addEventListener(COMPARE_EVENT, sync);
    return () => window.removeEventListener(COMPARE_EVENT, sync);
  }, []);

  const toggle = useCallback((vehicleId: string) => {
    const next = toggleCompareId(vehicleId);
    setIds(next);
    return next;
  }, []);

  const clear = useCallback(() => {
    clearCompareIds();
    setIds([]);
  }, []);

  return {
    ids,
    count: ids.length,
    max: MAX_COMPARE_VEHICLES,
    isSelected: (vehicleId: string) => ids.includes(vehicleId),
    isFull: ids.length >= MAX_COMPARE_VEHICLES,
    toggle,
    clear,
  };
}
