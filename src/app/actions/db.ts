"use server";

import { isAuthenticatedAction } from "./auth";
import { createAdminClient } from "@/utils/supabase/admin";

export async function adminDbInsert(table: string, data: any) {
  if (!(await isAuthenticatedAction())) throw new Error("Unauthorized");
  const supabase = createAdminClient();
  const { data: result, error } = await supabase.from(table).insert(data).select();
  if (error) throw error;
  return result;
}

export async function adminDbUpdate(table: string, id: string | number, data: any, idField: string = "id") {
  if (!(await isAuthenticatedAction())) throw new Error("Unauthorized");
  const supabase = createAdminClient();
  const { data: result, error } = await supabase.from(table).update(data).eq(idField, id).select();
  if (error) throw error;
  return result;
}

export async function adminDbDelete(table: string, id: string | number, idField: string = "id") {
  if (!(await isAuthenticatedAction())) throw new Error("Unauthorized");
  const supabase = createAdminClient();
  const { error } = await supabase.from(table).delete().eq(idField, id);
  if (error) throw error;
  return true;
}
