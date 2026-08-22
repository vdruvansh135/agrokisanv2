import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ExternalLink, Clock, FileText, AlertTriangle, Sparkles } from "lucide-react";
import { useState } from "react";
import { PhoneShell } from "@/components/agro/PhoneShell";
import { PageHeader } from "@/components/agro/PageHeader";
import { daysUntil, schemes } from "@/lib/agro-data";
import { useApp } from "@/lib/app-store";

export const Route = createFileRoute("/schemes")({
  head: () => ({
    meta: [
      { title: "Matching Government Schemes for Your Farm — Agro Kisan" },
      {
        name: "description",
        content:
          "Smart scheme matching for Indian farmers: PM Kisan, PMFBY, Rythu Bharosa, KCC and more with documents, deadlines and mistakes to avoid.",
      },
      { property: "og:title", content: "Government schemes matched to your land" },
      { property: "og:description", content: "Deadlines, required documents and common mistakes, in one feed." },
    ],
  }),
  component: SchemesPage,
});

function SchemesPage() {
  const { profile } = useApp();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <PhoneShell>
      <PageHeader title="Govt Schemes" subtitle="Smart matched to your profile" />
      <div className="p-4">
        <div className="flex items-center gap-2 rounded-2xl bg-primary/12 px-4 py-3 text-xs font-semibold text-primary">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span className="min-w-0">
            Showing schemes matching {profile.acres} Acres {profile.crop}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {schemes.map((s, i) => {
            const isOpen = open === s.id;
            return (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 230, damping: 24 }}
                className="soft-shadow overflow-hidden rounded-3xl bg-card"
              >
                <div className="p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base leading-tight">{s.name}</h3>
                      <p className="truncate text-[11px] text-muted-foreground">{s.department}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
                      {s.match}% Relevant
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">{s.summary}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                      {s.benefit}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold text-destructive">
                      <Clock className="h-3 w-3" /> {daysUntil(s.deadline)} days left
                    </span>
                  </div>

                  <button
                    onClick={() => setOpen(isOpen ? null : s.id)}
                    className="mt-3 flex w-full items-center justify-between rounded-2xl bg-muted px-4 py-2.5 text-sm font-semibold"
                  >
                    Details
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="overflow-hidden border-t border-border bg-surface"
                    >
                      <div className="space-y-4 p-4">
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-bold text-primary">
                            <FileText className="h-3.5 w-3.5" /> Required Documents
                          </p>
                          <ul className="mt-2 space-y-1">
                            {s.documents.map((d) => (
                              <li key={d} className="flex gap-2 text-sm text-muted-foreground">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-bold text-destructive">
                            <AlertTriangle className="h-3.5 w-3.5" /> Mistakes to Avoid
                          </p>
                          <ul className="mt-2 space-y-1">
                            {s.mistakes.map((m) => (
                              <li key={m} className="flex gap-2 text-sm text-muted-foreground">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                                {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
                        >
                          Apply on Official Portal <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </PhoneShell>
  );
}
