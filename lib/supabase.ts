import { createClient } from "@supabase/supabase-js";
import { sampleFatalities } from "@/lib/sample-data";
import { CommentInput, Fatality } from "@/lib/types";

function isPlaceholder(value?: string) {
  if (!value) return true;
  const lowered = value.toLowerCase();
  return (
    lowered.includes("your-project-ref") ||
    lowered.includes("your-anon-key") ||
    lowered.includes("your-service-role-key")
  );
}

function getRuntimeEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const hasSupabase = Boolean(url && anonKey) && !isPlaceholder(url) && !isPlaceholder(anonKey);
  const hasServiceRole =
    Boolean(url && serviceRoleKey) && !isPlaceholder(url) && !isPlaceholder(serviceRoleKey);

  return { url, anonKey, serviceRoleKey, hasSupabase, hasServiceRole };
}

function createNoStoreClient(url: string, key: string) {
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}

function getClient() {
  const { hasSupabase, url, anonKey } = getRuntimeEnv();
  if (!hasSupabase || !url || !anonKey) {
    return null;
  }
  return createNoStoreClient(url, anonKey);
}

function getAdminClient() {
  const { hasServiceRole, url, serviceRoleKey } = getRuntimeEnv();
  if (!hasServiceRole || !url || !serviceRoleKey) {
    return null;
  }
  return createNoStoreClient(url, serviceRoleKey);
}

export async function getFatalities(): Promise<Fatality[]> {
  const client = getClient();
  if (!client) {
    return sampleFatalities;
  }

  const { data, error } = await client
    .from("fatalities")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  if (!data?.length) {
    return [];
  }

  return data as Fatality[];
}

export async function getDraftFatalities(): Promise<Fatality[]> {
  const adminClient = getAdminClient();
  if (!adminClient) {
    return [];
  }

  const { data, error } = await adminClient
    .from("fatalities")
    .select("*")
    .eq("status", "draft")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.length) {
    return [];
  }

  return data as Fatality[];
}

export async function getFatalityById(id: number): Promise<Fatality | null> {
  const client = getClient();
  if (!client) {
    return sampleFatalities.find((item) => item.id === id) ?? null;
  }

  const { data, error } = await client
    .from("fatalities")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Fatality;
}

export async function createFatality(input: Partial<Fatality>) {
  const client = getClient();
  if (!client) {
    return { ok: true, mode: "local-fallback" as const };
  }

  const { error } = await client.from("fatalities").insert(input);
  if (error) {
    throw new Error(error.message);
  }
  return { ok: true, mode: "supabase" as const };
}

export async function createComment(input: CommentInput) {
  const client = getClient();
  if (!client) {
    return { ok: true, mode: "local-fallback" as const };
  }

  const { error } = await client.from("community_comments").insert(input);
  if (error) {
    throw new Error(error.message);
  }
  return { ok: true, mode: "supabase" as const };
}

export async function publishFatality(id: number) {
  const adminClient = getAdminClient();
  if (!adminClient) {
    throw new Error("Missing valid SUPABASE_SERVICE_ROLE_KEY in server environment.");
  }

  const { error } = await adminClient
    .from("fatalities")
    .update({ status: "published" })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { ok: true, mode: "service-role" as const };
}

export function isSupabaseConfigured() {
  return getRuntimeEnv().hasSupabase;
}

export function isSupabaseAdminConfigured() {
  return getRuntimeEnv().hasServiceRole;
}
