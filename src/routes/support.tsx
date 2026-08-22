import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PhoneCall, TicketPlus, Siren } from "lucide-react";
import { toast } from "sonner";
import { PhoneShell } from "@/components/agro/PhoneShell";
import { PageHeader } from "@/components/agro/PageHeader";
import { officers } from "@/lib/agro-data";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & Emergency Directory — Agro Kisan" },
      {
        name: "description",
        content: "Call support, raise a ticket, or reach local agricultural officers and emergency helplines instantly.",
      },
      { property: "og:title", content: "Farmer support and emergency helplines" },
      { property: "og:description", content: "Direct lines to agriculture officers, vets and insurance grievance cells." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <PhoneShell>
      <PageHeader title="Support Center" subtitle="Help in your language, 7 AM – 9 PM" />
      <div className="space-y-4 p-4">
        <motion.a
          whileTap={{ scale: 0.97 }}
          href="tel:18001801551"
          className="flex items-center gap-3 rounded-3xl bg-primary p-5 text-primary-foreground"
        >
          <PhoneCall className="h-6 w-6 shrink-0" />
          <span className="min-w-0">
            <span className="block text-lg font-bold leading-tight">Call Support</span>
            <span className="block text-xs opacity-85">Toll free • 1800 180 1551</span>
          </span>
        </motion.a>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => toast.success("Ticket #AK-3391 created", { description: "We will call you within 2 hours." })}
          className="flex w-full items-center gap-3 rounded-3xl bg-accent p-5 text-accent-foreground"
        >
          <TicketPlus className="h-6 w-6 shrink-0" />
          <span className="min-w-0 text-left">
            <span className="block text-lg font-bold leading-tight">Create Ticket</span>
            <span className="block text-xs opacity-80">Get a written response on your issue</span>
          </span>
        </motion.button>

        <div className="soft-shadow rounded-3xl bg-card p-5">
          <h2 className="flex items-center gap-2 text-base text-destructive">
            <Siren className="h-5 w-5" /> Emergency Directory
          </h2>
          <div className="mt-3 space-y-2">
            {officers.map((o, i) => (
              <motion.a
                key={o.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                href={`tel:${o.phone.replace(/\s/g, "")}`}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-muted p-4"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{o.name}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {o.person} • {o.phone}
                  </span>
                </span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <PhoneCall className="h-4 w-4" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
