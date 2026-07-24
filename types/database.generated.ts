/**
 * Placeholder Database type. Replaced at build time by:
 *   npx supabase gen types typescript --local > src/types/database.generated.ts
 *
 * This stub lets the app compile and TypeScript-check before the Supabase
 * project is provisioned. It mirrors the shape of the generated type for the
 * tables we know exist; additional tables appear after regeneration.
 */
export type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
