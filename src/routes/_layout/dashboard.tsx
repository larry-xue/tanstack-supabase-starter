import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
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
import { Loading } from "~/lib/components/ui/loading";
import { getProfileFn, updateProfileFn } from "~/lib/dashboard/profile";
import * as m from "~/paraglide/messages";

export const Route = createFileRoute("/_layout/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfileFn(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (displayName: string | null) =>
      updateProfileFn({ data: { displayName } }),
    onSuccess: async () => {
      await profileQuery.refetch();
    },
  });

  const displayNameRef = useRef<HTMLInputElement>(null);

  if (profileQuery.isLoading) {
    return <Loading text={m.dashboard_loading()} size="md" />;
  }

  if (profileQuery.error) {
    return (
      <div className="rounded-2xl bg-destructive/15 p-4 text-destructive">
        <div className="text-sm font-medium">{m.dashboard_error_generic()}</div>
      </div>
    );
  }

  const profile = profileQuery.data;

  if (!profile) {
    return (
      <div className="rounded-2xl bg-destructive/15 p-4 text-destructive">
        <div className="text-sm font-medium">{m.dashboard_error_generic()}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="type-h1 text-foreground">{m.dashboard_title()}</h1>
        <p className="mt-1 type-body text-muted-foreground">
          {m.dashboard_description()}
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>{m.dashboard_profile_title()}</CardTitle>
          <CardDescription>{m.dashboard_profile_description()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">{m.dashboard_email_label()}</Label>
            <Input id="email" value={profile.email ?? ""} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">{m.dashboard_display_name_label()}</Label>
            <Input
              ref={displayNameRef}
              id="displayName"
              defaultValue={profile.displayName ?? ""}
              placeholder={m.dashboard_display_name_placeholder()}
            />
          </div>

          <Button
            className="rounded-full"
            onClick={() => {
              const raw = displayNameRef.current?.value ?? "";
              updateProfileMutation.mutate(raw || null);
            }}
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending
              ? m.dashboard_saving()
              : m.dashboard_save_changes()}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
