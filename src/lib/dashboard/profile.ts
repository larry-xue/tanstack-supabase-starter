import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseAndUser } from "~/lib/dashboard/utils.server";

export type Profile = {
  userId: string;
  email: string | null;
  displayName: string | null;
};

export const getProfileFn = createServerFn({ method: "GET" }).handler(async () => {
  const { supabase, user } = await getSupabaseAndUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const { error: insertError } = await supabase.from("profiles").insert({
      user_id: user.id,
      display_name: null,
    });

    if (insertError) throw insertError;

    return {
      userId: user.id,
      email: user.email ?? null,
      displayName: null,
    } satisfies Profile;
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    displayName: data.display_name,
  } satisfies Profile;
});

const updateProfileInputSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

export const updateProfileFn = createServerFn({ method: "POST" })
  .inputValidator(updateProfileInputSchema)
  .handler(async ({ data }) => {
    const input = data;
    const { supabase, user } = await getSupabaseAndUser();

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        display_name: input.displayName,
      },
      {
        onConflict: "user_id",
      },
    );

    if (error) throw error;

    return { ok: true } as const;
  });
