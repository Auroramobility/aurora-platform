"use server";

import { redirect } from "next/navigation";
import { logout } from "@/lib/auth/logout";

export async function signOutAction() {
  await logout();
  redirect("/login");
}
