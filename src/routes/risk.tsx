import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ScanLine, ShieldCheck, Check, Loader2, Circle, IdCard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PhoneShell } from "@/components/agro/PhoneShell";
import { PageHeader } from "@/components/agro/PageHeader";
import { claimTimeline } from "@/lib/agro-data";

export const Route = createFileRoute("/risk")({
  head: () => ({
    meta: [
      { title: "Crop Risk & Insurance Portal — Agro Kisan" },
      {
        name: "description",
        content:
          "Check groundwater status, crop risk assessment, estimate crop insurance and track your claim from submission to approval.",
      },
      { property: "og:title", content: "Crop risk and insurance tracking" },
      { property: "og:description", content: "Groundwater status, risk gauges and a live claim timeline." },
    ],
  }),
  component: RiskPage,
});

function RiskPage() {
  const [verified, setVerified] = useState(false);
  const [id, setId] = useState("");

  return (
    <PhoneShell>
      <PageHeader title="Risk & Insurance" subtitle="Government portal • secure" />
      {!verified ? (
        <div className="p-4">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card p-5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-xl">Verify to continue</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your government farmer ID to access the risk portal.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border px-4 py-3">
              <IdCard className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="AP-FRM-2026-XXXX"
                className="min-w-0 flex-1 bg-transparent outline-none"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setVerified(true)}
              className="mt-5 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground"
            >
              Verify Identity
            </motion.button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Demo mode — any ID (or none) will pass verification.
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="space-y-5 p-4">
          <div className="soft-shadow rounded-3xl bg-card p-5">
            <h2 className="text-base">Groundwater Status</h2>
            <div className="mt-4 flex items-center gap-5">
              <Gauge value={58} label="Moderate" />
              <p className="min-w-0 flex-1 text-xs text-muted-foreground">
                Water table at 42 ft in Kotapalli mandal. Safe for one more irrigation cycle this week.
              </p>
            </div>
            <div className="mt-5">
              <div className="mb-1 flex justify-between text-xs font-semibold">
                <span>Crop Risk Assessment</span>
                <span className="text-destructive">High — 72%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-harvest to-destructive"
                />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Pink bollworm alert in nearby mandals • unseasonal rain forecast next week.
              </p>
            </div>
          </div>

          <div className="soft-shadow rounded-3xl bg-card p-5">
            <h2 className="text-base">Estimate Crop Insurance</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <input defaultValue="Cotton" className="rounded-2xl border border-border px-3 py-3 text-sm outline-none" />
              <input defaultValue="3.5 acres" className="rounded-2xl border border-border px-3 py-3 text-sm outline-none" />
            </div>
            <div className="mt-3 rounded-2xl bg-primary/10 p-4">
              <p className="text-xs text-muted-foreground">Estimated sum insured</p>
              <p className="text-2xl font-bold text-primary">₹1,48,750</p>
              <p className="text-xs text-muted-foreground">Your premium (2% Kharif): ₹2,975</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => toast.success("Document scanned", { description: "Sowing certificate read via OCR." })}
                className="flex items-center justify-center gap-2 rounded-2xl border border-primary py-3 text-sm font-semibold text-primary"
              >
                <ScanLine className="h-4 w-4" /> Scan Document
              </button>
              <button
                onClick={() => toast.success("Application submitted for review")}
                className="rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
              >
                Apply Now
              </button>
            </div>
          </div>

          <div className="soft-shadow rounded-3xl bg-card p-5">
            <h2 className="text-base">Claim #PMFBY-2026-8842</h2>
            <ol className="mt-4 space-y-0">
              {claimTimeline.map((t, i) => (
                <motion.li
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-3"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                        t.state === "done"
                          ? "bg-primary text-primary-foreground"
                          : t.state === "active"
                            ? "bg-harvest text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t.state === "done" ? (
                        <Check className="h-4 w-4" />
                      ) : t.state === "active" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                    </span>
                    {i < claimTimeline.length - 1 && <span className="my-1 w-0.5 flex-1 bg-border" />}
                  </div>
                  <div className="min-w-0 pb-5">
                    <p className="truncate text-sm font-semibold">{t.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.date}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </PhoneShell>
  );
}

function Gauge({ value, label }: { value: number; label: string }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid h-28 w-28 shrink-0 place-items-center">
      <svg className="absolute -rotate-90" viewBox="0 0 100 100" width="112" height="112">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" className="stroke-muted" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          className="stroke-harvest"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * value) / 100 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="relative text-center">
        <p className="text-xl font-bold">{value}%</p>
        <p className="text-[10px] font-semibold text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
