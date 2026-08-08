const SAFE_ADMIN_MESSAGES = new Set([
  "The request could not be completed.",
  "The application could not be updated.",
  "Identity verification could not be updated.",
  "The ownership plan could not be created.",
  "The ownership plan could not be prepared.",
  "The ownership plan could not be activated.",
]);

export function safeAdminError(
  fallback: string,
  error?: { code?: string | null } | null,
) {
  if (!error) return fallback;

  // Keep database details, constraint names, and internal SQL out of the UI.
  if (error.code === "23505") {
    return "This record already has the required ownership plan.";
  }

  if (error.code === "42501") {
    return "You are not authorized to perform this operation.";
  }

  return SAFE_ADMIN_MESSAGES.has(fallback) ? fallback : "The request could not be completed.";
}
