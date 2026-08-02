/**
 * Placeholder for Supabase's generated database types.
 *
 * Once the Supabase project has real tables, regenerate this file with:
 *
 *   npx supabase gen types typescript --project-id <project-id> > types/supabase.ts
 *
 * Keeping the `Database` type exported (even empty) lets the rest of the
 * codebase import `Database` from a stable path today and get full
 * type-safety automatically once the schema is generated.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
