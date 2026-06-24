import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Devuelve el usuario autenticado o null (sin lanzar). */
export async function getUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Devuelve el usuario o redirige a /ingresar. */
export async function requireUser(redirectTo = "/ingresar") {
  const user = await getUser();
  if (!user) redirect(redirectTo);
  return user;
}

/** Perfil extendido (rol, etc.) del usuario actual. */
export async function getProfile() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return data;
}
