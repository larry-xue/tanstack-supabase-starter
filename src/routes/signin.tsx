import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Link, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Footer } from "~/lib/components/Footer";
import { Header } from "~/lib/components/Header";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import { Input } from "~/lib/components/ui/input";
import { Label } from "~/lib/components/ui/label";
import { setAuthUser } from "~/lib/store/auth";
import * as m from "~/paraglide/messages";

const REDIRECT_URL = "/dashboard";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

export const Route = createFileRoute("/signin")({
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: REDIRECT_URL });
    }
  },
  component: AuthPage,
});

function AuthPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignOut = async () => {};

  const handlePasswordSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError(m.auth_error_missing_email());
      return;
    }

    if (!password) {
      setError(m.auth_error_missing_password());
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const { default: supabaseClient } = await import("~/lib/auth-client");
      const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || m.signin_error_generic());
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

      router.navigate({ to: REDIRECT_URL, replace: true });
    } catch (err) {
      console.error("Auth error:", err);
      setError(m.signin_error_unexpected());
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      setError(m.signin_error_missing_credential());
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const { default: supabaseClient } = await import("~/lib/auth-client");
      const { data, error: authError } = await supabaseClient.auth.signInWithIdToken({
        provider: "google",
        token: credentialResponse.credential,
      });

      if (authError) {
        setError(authError.message || m.signin_error_generic());
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

      router.navigate({ to: REDIRECT_URL, replace: true });
    } catch (err) {
      console.error("Auth error:", err);
      setError(m.signin_error_unexpected());
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError(m.signin_cancelled());
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<string | undefined>(undefined);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Subtract padding if necessary, but offsetWidth is usually fine for the button width
        // Google button might need slightly less to be safe from overflow?
        // Let's settle on the container's inner width.
        setContainerWidth(containerRef.current.offsetWidth.toString());
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex min-h-screen flex-col">
        <Header onSignOut={handleSignOut} />
        <main className="flex flex-1 items-center justify-center px-6 py-12">
          <Card className="w-full max-w-md rounded-3xl border-none bg-card shadow-xl shadow-black/5 dark:shadow-black/20 ring-1 ring-border/5">
            <CardHeader className="space-y-1 pb-6 pt-8 text-center">
              <CardTitle className="text-3xl font-medium tracking-tight text-card-foreground">
                {m.signin_welcome()}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {m.signin_description()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pb-8">
              {error && (
                <div className="flex items-center gap-3 rounded-2xl bg-destructive/15 p-4 text-destructive">
                  <div className="text-sm font-medium">{error}</div>
                </div>
              )}

              {isLoading && (
                <div className="flex items-center gap-3 rounded-2xl bg-accent p-4 text-accent-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
                  <div className="text-sm font-medium">{m.signin_loading()}</div>
                </div>
              )}

              <form className="space-y-5" onSubmit={handlePasswordSignIn}>
                <div className="space-y-2">
                  <Label htmlFor="email">{m.auth_email_label()}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{m.auth_password_label()}</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full"
                  disabled={isLoading}
                >
                  {m.sign_in()}
                </Button>
              </form>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-xs text-muted-foreground">{m.auth_or()}</span>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              <div
                ref={containerRef}
                className="flex flex-col items-center justify-center min-h-[50px]"
              >
                {!isLoading && containerWidth && (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    size="large"
                    theme="outline"
                    shape="pill"
                    text="continue_with"
                    width={containerWidth}
                    use_fedcm_for_prompt
                  />
                )}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                {m.auth_no_account()}{" "}
                <Link
                  to="/signup"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  {m.auth_create_account()}
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
}
