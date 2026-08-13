"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleSavedVehicle } from "@/features/saved-vehicles/actions/toggle-saved-vehicle";

type Props = {
  vehicleId: string;
  saved: boolean;
  isAuthenticated: boolean;
};

export function SaveVehicleButton({ vehicleId, saved, isAuthenticated }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <Button variant="outline" asChild>
        <Link href="/login">
          <Heart className="mr-2 h-4 w-4" />
          Sign in to save
        </Link>
      </Button>
    );
  }

  function handleClick() {
    setError(null);

    startTransition(async () => {
      try {
        await toggleSavedVehicle(vehicleId);
      } catch {
        setError("Couldn't update your saved vehicles. Please try again.");
      }
    });
  }

  return (
    <div>
      <Button
        variant={saved ? "default" : "outline"}
        disabled={pending}
        onClick={handleClick}
      >
        <Heart className={`mr-2 h-4 w-4 ${saved ? "fill-current" : ""}`} />
        {saved ? "Saved" : "Save Vehicle"}
      </Button>

      {error ? (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
