import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Download, Upload, Lock } from "lucide-react";
import { toast } from "sonner";
import { PhoneShell } from "@/components/agro/PhoneShell";
import { PageHeader } from "@/components/agro/PageHeader";
import { documents } from "@/lib/agro-data";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Document Wallet — Agro Kisan" },
      {
        name: "description",
        content: "Keep land receipts, pattadar passbook, soil health card and certificates safely in one digital folder.",
      },
      { property: "og:title", content: "Digital document wallet for farmers" },
      { property: "og:description", content: "Land records, identity proofs and certificates in one secure place." },
    ],
  }),
  component: WalletPage,
});

const folders = ["Land", "Identity", "Certificate", "Receipt"];

function WalletPage() {
  return (
    <PhoneShell>
      <PageHeader title="Document Wallet" subtitle="Encrypted on your device" />
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-xs font-semibold text-secondary-foreground">
          <Lock className="h-4 w-4 shrink-0" /> 5 documents stored • last backup 19 Aug 2026
        </div>

        <div className="grid grid-cols-4 gap-2">
          {folders.map((f) => (
            <div key={f} className="rounded-2xl bg-accent p-3 text-center text-accent-foreground">
              <FileText className="mx-auto h-5 w-5" />
              <p className="mt-1 truncate text-[10px] font-semibold">{f}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {documents.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-card p-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soil/15 text-soil">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{d.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {d.type} • {d.size} • {d.updated}
                </p>
              </div>
              <button
                aria-label={`Download ${d.name}`}
                onClick={() => toast.success(`${d.name} saved to your phone`)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
              >
                <Download className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => toast.success("Camera opened", { description: "Scan and store a new document." })}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary py-4 text-sm font-semibold text-primary"
        >
          <Upload className="h-4 w-4" /> Add Document
        </button>
      </div>
    </PhoneShell>
  );
}
