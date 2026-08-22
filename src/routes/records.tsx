import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { PhoneShell } from "@/components/agro/PhoneShell";
import { PageHeader } from "@/components/agro/PageHeader";
import { cropRecords, revenueData } from "@/lib/agro-data";

export const Route = createFileRoute("/records")({
  head: () => ({
    meta: [
      { title: "Farm Records & Season Income — Agro Kisan" },
      {
        name: "description",
        content: "Track harvest revenue against labour expenses, crop-wise acreage and season performance at a glance.",
      },
      { property: "og:title", content: "Farm records and season income" },
      { property: "og:description", content: "Revenue vs labour expenses for the Kharif 2026 season." },
    ],
  }),
  component: RecordsPage,
});

function RecordsPage() {
  const revenue = revenueData.reduce((a, b) => a + b.revenue, 0);
  const expense = revenueData.reduce((a, b) => a + b.expense, 0);
  const max = Math.max(...revenueData.map((d) => d.revenue));

  return (
    <PhoneShell>
      <PageHeader title="Farm Records" subtitle="Kharif 2026 • Mar – Aug" />
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Revenue" value={revenue} icon={TrendingUp} tone="text-primary" />
          <Stat label="Expenses" value={expense} icon={TrendingDown} tone="text-destructive" />
        </div>

        <div className="soft-shadow rounded-3xl bg-card p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <h2 className="min-w-0 truncate text-base">Revenue vs Labour Expense</h2>
            <span className="flex shrink-0 items-center gap-2 text-[10px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary" /> Rev
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-soil" /> Exp
              </span>
            </span>
          </div>
          <div className="mt-5 flex h-44 items-end justify-between gap-2">
            {revenueData.map((d, i) => (
              <div key={d.month} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <div className="flex h-36 w-full items-end justify-center gap-1">
                  <motion.span
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.revenue / max) * 100}%` }}
                    transition={{ delay: i * 0.07, type: "spring", stiffness: 160, damping: 20 }}
                    className="w-2.5 rounded-t-md bg-primary"
                  />
                  <motion.span
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.expense / max) * 100}%` }}
                    transition={{ delay: i * 0.07 + 0.05, type: "spring", stiffness: 160, damping: 20 }}
                    className="w-2.5 rounded-t-md bg-soil"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-3 text-xs font-semibold text-primary">
            <Wallet className="h-4 w-4 shrink-0" />
            <span className="min-w-0">Net profit this season: ₹{(revenue - expense).toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="soft-shadow rounded-3xl bg-card p-5">
          <h2 className="text-base">Crop Ledger</h2>
          <div className="mt-3 space-y-2">
            {cropRecords.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-muted p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{c.crop}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {c.acres} acres • sown {c.sown}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-card px-3 py-1 text-[11px] font-semibold">{c.stage}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof TrendingUp;
  tone: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card p-4">
      <Icon className={`h-5 w-5 ${tone}`} />
      <p className="mt-2 text-xl font-bold">₹{value.toLocaleString("en-IN")}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </motion.div>
  );
}
