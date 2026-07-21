import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

/**
 * Read a boolean feature flag from the site_config table.
 * Returns `fallback` if the key doesn't exist or on error.
 */
export async function getFeatureFlag(
  key: string,
  fallback = false
): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) return fallback;
    return data.value === true || data.value === "true";
  } catch {
    return fallback;
  }
}
