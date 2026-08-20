import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Sparkle, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <Sparkle className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold text-sidebar-foreground">Workplace AI</span>
        <span className="block text-[11px] text-sidebar-foreground/60">Productivity Assistant</span>
      </span>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className: "bg-sidebar-accent text-sidebar-accent-foreground",
          }}
        >
          <item.icon className="size-4 shrink-0" />
          <span className="truncate">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = NAV_ITEMS.find((i) => i.to === pathname);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="hidden bg-sidebar lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-sidebar-border">
        <div className="px-5 py-5">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <NavLinks />
        </div>
        <div className="border-t border-sidebar-border px-5 py-4 text-[11px] leading-relaxed text-sidebar-foreground/60">
          AI-generated content may require human review.
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/85 px-4 backdrop-blur sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="px-5 py-5">
                <Brand />
              </div>
              <div className="px-3">
                <NavLinks onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold sm:text-base">
              {current?.label ?? "Workplace AI"}
            </h2>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {current?.blurb ?? "AI productivity tools for the modern workplace."}
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:flex">
            <UserRound className="size-3.5" />
            Demo user
          </div>
        </header>

        <main className={cn("flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8")}>
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>

        <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
          Prototype for demonstration purposes — AI-generated content may require human review.
        </footer>
      </div>
    </div>
  );
}
