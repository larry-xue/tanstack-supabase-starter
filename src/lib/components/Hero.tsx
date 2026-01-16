import { Link } from "@tanstack/react-router";
import { useAuthUser } from "~/lib/store/auth";
import * as m from "~/paraglide/messages";
import { Button } from "./ui/button";

export function Hero() {
  const user = useAuthUser();
  return (
    <section className="flex flex-col items-center justify-center gap-16 py-16 text-center animate-rise lg:py-24">
      <div className="flex max-w-3xl flex-col items-center space-y-8">
        <h1 className="type-display text-foreground">
          {m.hero_title_start()}{" "}
          <span className="bg-linear-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            {m.hero_title_highlight()}
          </span>
        </h1>

        <p className="max-w-2xl text-lg text-muted-foreground/90 leading-relaxed md:text-xl">
          {m.hero_description()}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {user ? (
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full px-10 text-base font-bold shadow-xl shadow-primary/20 transition-[background-color,color,border-color,box-shadow,translate,scale,rotate] hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 active:scale-95"
            >
              <Link to="/dashboard">{m.hero_start_learning()}</Link>
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full px-10 text-base font-bold shadow-xl shadow-primary/20 transition-[background-color,color,border-color,box-shadow,translate,scale,rotate] hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 active:scale-95"
            >
              <Link to="/signin">{m.hero_get_started()}</Link>
            </Button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2 rounded-full bg-surface-container-high/30 border border-border/40 px-4 py-1.5 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            {m.feature_any_language()}
          </div>
          <div className="flex items-center gap-2 rounded-full bg-surface-container-high/30 border border-border/40 px-4 py-1.5 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            {m.feature_ai_chat()}
          </div>
          <div className="flex items-center gap-2 rounded-full bg-surface-container-high/30 border border-border/40 px-4 py-1.5 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            {m.feature_vocabulary()}
          </div>
        </div>
      </div>
    </section>
  );
}
