"use client";

import { useFormStatus } from "react-dom";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { DocumentUpload } from "@/components/ui/document-upload";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  employmentOptions,
  countryOptions,
  currencyOptions,
} from "@/lib/constants/profile-options";
import { CardSection } from "@/components/ui/card-section";
import { SectionTitle } from "@/components/ui/section-title";
import { updateProfile } from "@/app/profile/actions/update-profile";

type Profile = {
  full_name: string | null;
  phone: string | null;
  country: string | null;
  state: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  employment_status: string | null;
  monthly_income: number | null;
  currency: string | null;
  preferred_language: string | null;
  timezone: string | null;
  drivers_license: string | null;
  drivers_license_front: string | null;
  drivers_license_back: string | null;
  profile_photo_url: string | null;
};

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-primary px-6 py-3 text-primary-foreground disabled:opacity-50"
    >
      {pending ? "Saving..." : "Save Profile"}
    </button>
  );
}

export function ProfileForm({ profile }: { profile: Profile | null }) {
  return (
    <form action={updateProfile} className="space-y-6">
      <p className="text-muted-foreground">
        Complete your information to unlock financing and vehicle ownership.
      </p>

      <CardSection>
        <SectionTitle
          title="Profile Photo"
          description="Upload a clear profile picture."
        />

        <div className="flex flex-col items-center gap-4">
          <AvatarUpload
  currentUrl={profile?.profile_photo_url}
/>
        </div>
      </CardSection>

      <Input
        name="full_name"
        defaultValue={profile?.full_name ?? ""}
        placeholder="Full Name"
      />

      <Input
        name="phone"
        defaultValue={profile?.phone ?? ""}
        placeholder="Phone"
      />

      <Select
        name="country"
        defaultValue={profile?.country ?? ""}
        options={countryOptions}
      />

      <Input
        name="state"
        defaultValue={profile?.state ?? ""}
        placeholder="State"
      />

      <Input
        name="address"
        defaultValue={profile?.address ?? ""}
        placeholder="Street Address"
      />

      <Input
        name="city"
        defaultValue={profile?.city ?? ""}
        placeholder="City"
      />

      <Input
        name="postal_code"
        defaultValue={profile?.postal_code ?? ""}
        placeholder="Postal Code"
      />

      <Select
        name="employment_status"
        defaultValue={profile?.employment_status ?? ""}
        options={employmentOptions}
      />

      <Select
        name="currency"
        defaultValue={profile?.currency ?? ""}
        options={currencyOptions}
      />

      <Input
        name="monthly_income"
        type="number"
        defaultValue={profile?.monthly_income ?? ""}
        placeholder="Monthly Income"
      />

      <CardSection>
        <SectionTitle
          title="Identity"
          description="Upload both sides of your driver's license."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <DocumentUpload
  label="Upload Front"
  name="drivers_license_front"
  accept="image/*,application/pdf"
  currentPath={profile?.drivers_license_front ?? null}
/>

<DocumentUpload
  label="Upload Back"
  name="drivers_license_back"
  accept="image/*,application/pdf"
  currentPath={profile?.drivers_license_back ?? null}
/>
        </div>
      </CardSection>

      <SaveButton />
    </form>
  );
}