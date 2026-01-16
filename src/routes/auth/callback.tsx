import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Footer } from "~/lib/components/Footer";
import { Header } from "~/lib/components/Header";
import { Loading } from "~/lib/components/ui/loading";
import { setAuthUser } from "~/lib/store/auth";
import * as m from "~/paraglide/messages";

const searchSchema = z.object({
  code: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/auth/callback")({
  validateSearch: (search) => searchSchema.parse(search),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const router = useRouter();
  const { code } = Route.useSearch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!code) {
        setError(m.auth_callback_missing_code());
        return;
      }

      try {
        const { default: supabaseClient } = await import("~/lib/auth-client");
        const { data, error } = await supabaseClient.auth.exchangeCodeForSession(code);
        if (error) {
          setError(error.message || m.auth_callback_error_generic());
          return;
        }

        if (data.user) {
          const { id, email, user_metadata, app_metadata } = data.user;
          setAuthUser(router.options.context.authStore, {
            id,
            email,
            user_metadata: user_metadata as Record<string, unknown>,
            app_metadata: app_metadata as Record<string, unknown>,
          });
          await router.invalidate();
        }

        router.navigate({ to: "/dashboard", replace: true });
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(m.auth_callback_error_unexpected());
      }
    };

    run();
  }, [code, router]);

  const handleSignOut = async () => {};

  return (
    <div className="flex min-h-screen flex-col">
      <Header onSignOut={handleSignOut} />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        {error ? (
          <div className="w-full max-w-md rounded-2xl bg-destructive/15 p-4 text-destructive">
            <div className="text-sm font-medium">{error}</div>
          </div>
        ) : (
          <Loading text={m.auth_callback_loading()} size="md" />
        )}
      </main>
      <Footer />
    </div>
  );
}
