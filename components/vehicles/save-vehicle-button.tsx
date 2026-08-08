"use client";

import { useTransition } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleSavedVehicle } from "@/features/saved-vehicles/actions/toggle-saved-vehicle";

type Props = {
  vehicleId: string;
  saved: boolean;
};

export function SaveVehicleButton({ vehicleId, saved }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant={saved ? "default" : "outline"}
      disabled={pending}
      onClick={() =>
        startTransition(() => {
          toggleSavedVehicle(vehicleId);
        })
      }
    >
      <Heart className={`mr-2 h-4 w-4 ${saved ? "fill-current" : ""}`} />

      {saved ? "Saved" : "Save Vehicle"}
    </Button>
  );
}
