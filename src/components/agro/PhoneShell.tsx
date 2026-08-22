import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, Users, ShieldCheck, Landmark, Mic } from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "@/lib/app-store";
import { KrishiAI } from "./KrishiAI";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/labor", label: "Labor", icon: Users },
  { to: "/risk", label: "Risk", icon: ShieldCheck },
  { to: "/schemes", label: "Schemes", icon: Landmark },
] as const;

export function PhoneShell({ children }: { children: ReactNode }) {
  const { setAiOpen } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative mx-auto min-h-screen max-w-md overflow-hidden bg-background">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="pb-36"
      >
        {children}
      </motion.main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md">
        <nav className="pointer-events-auto glass-pane relative mt-9 flex items-end justify-between gap-1 rounded-t-3xl px-4 pb-5 pt-4">
          {navItems.slice(0, 2).map((item) => (
            <NavLink key={item.to} {...item} active={pathname === item.to} />
          ))}
          <span className="w-14 shrink-0" />
          {navItems.slice(2).map((item) => (
            <NavLink key={item.to} {...item} active={pathname === item.to} />
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setAiOpen(true)}
          aria-label="Open Krishi AI assistant"
          className="pointer-events-auto absolute bottom-14 left-1/2 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-8px_var(--primary)]"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
          <span className="absolute -inset-2 animate-pulse rounded-full bg-primary/15" />
          <Mic className="relative h-7 w-7" />
        </button>
      </div>


      <KrishiAI />
    </div>
  );
}

function NavLink({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-semibold transition-colors ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${active ? "scale-110" : ""} transition-transform`} />
      <span className="truncate">{label}</span>
    </Link>
  );
}
