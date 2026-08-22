import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Phone, MessageSquare, Star, MapPin, X, SignalLow } from "lucide-react";
import { toast } from "sonner";
import { PhoneShell } from "@/components/agro/PhoneShell";
import { PageHeader } from "@/components/agro/PageHeader";
import { useApp } from "@/lib/app-store";
import { jobs, workers } from "@/lib/agro-data";

export const Route = createFileRoute("/labor")({
  head: () => ({
    meta: [
      { title: "Hire Farm Labor Near You — Agro Kisan" },
      {
        name: "description",
        content:
          "Zero-commission labor marketplace: browse verified farm workers nearby with skills, ratings and daily wages, or find work.",
      },
      { property: "og:title", content: "Zero-commission farm labor marketplace" },
      { property: "og:description", content: "Find workers or find work in your village with direct calling." },
    ],
  }),
  component: LaborPage,
});

function LaborPage() {
  const { laborTab, setLaborTab, laborFilter, setLaborFilter } = useApp();
  const list = laborFilter ? workers.filter((w) => w.skills.includes(laborFilter)) : workers;

  return (
    <PhoneShell>
      <PageHeader title="Labor Marketplace" subtitle="Zero commission • direct contact" />
      <div className="p-4">
        <div className="flex rounded-full bg-muted p-1">
          {(
            [
              { key: "hire", label: "Hire Laborers" },
              { key: "work", label: "Find Work" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setLaborTab(t.key)}
              className={`relative flex-1 rounded-full py-2.5 text-sm font-semibold ${
                laborTab === t.key ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {laborTab === t.key && (
                <motion.span
                  layoutId="labor-tab"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-primary"
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        {laborFilter && laborTab === "hire" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 rounded-full bg-primary/12 px-4 py-2 text-xs font-semibold text-primary"
          >
            <span className="min-w-0 flex-1 truncate">Krishi AI filter: {laborFilter} • available today</span>
            <button onClick={() => setLaborFilter(null)} aria-label="Clear filter">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        <div className="mt-4 space-y-3">
          {laborTab === "hire"
            ? list.map((w, i) => (
                <motion.article
                  key={w.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 240, damping: 24 }}
                  whileTap={{ scale: 0.98 }}
                  className="soft-shadow rounded-3xl bg-card p-4"
                >
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-soil/15 font-bold text-soil">
                      {w.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{w.name}</p>
                      <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {w.distanceKm} km away • {w.village}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold">
                        <Star className="h-3.5 w-3.5 fill-harvest text-harvest" />
                        {w.rating} <span className="font-normal text-muted-foreground">({w.jobs} jobs)</span>
                      </p>
                    </div>
                    <span className="shrink-0 text-right">
                      <span className="block text-base font-bold text-primary">₹{w.wage}</span>
                      <span className="block text-[10px] text-muted-foreground">per day</span>
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {w.skills.map((s) => (
                      <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium">
                        {s}
                      </span>
                    ))}
                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        w.availableToday ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${w.availableToday ? "bg-primary" : "bg-muted-foreground"}`}
                      />
                      {w.availableToday ? "Available Today" : "Busy"}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${w.phone.replace(/\s/g, "")}`}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
                    >
                      <Phone className="h-4 w-4" /> Call Directly
                    </a>
                    <button
                      onClick={() =>
                        toast.success("Message queued", {
                          description: "No internet? It will be sent as an SMS automatically.",
                        })
                      }
                      className="flex items-center justify-center gap-2 rounded-2xl border border-primary py-3 text-sm font-semibold text-primary"
                    >
                      <MessageSquare className="h-4 w-4" /> Message
                    </button>
                  </div>
                </motion.article>
              ))
            : jobs.map((j, i) => (
                <motion.article
                  key={j.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="soft-shadow rounded-3xl bg-card p-4"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{j.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {j.farmer} • {j.village} • {j.distanceKm} km
                      </p>
                      <p className="mt-1 text-xs font-medium text-soil">
                        {j.date} • {j.workers} workers needed
                      </p>
                    </div>
                    <span className="shrink-0 text-right">
                      <span className="block text-base font-bold text-primary">₹{j.wage}</span>
                      <span className="block text-[10px] text-muted-foreground">per day</span>
                    </span>
                  </div>
                  <button
                    onClick={() => toast.success("Interest sent to " + j.farmer)}
                    className="mt-3 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
                  >
                    Apply for this work
                  </button>
                </motion.article>
              ))}
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <SignalLow className="h-4 w-4" /> Works on low network — messages fall back to SMS
        </p>
      </div>
    </PhoneShell>
  );
}
