import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ChevronLeft, Bell, CloudLightning, Landmark, CheckCircle2 } from 'lucide-react';
import { PhoneShell } from '@/components/agro/PhoneShell';

export const Route = createFileRoute('/alerts')({
  component: AlertsScreen,
});

const alertsData = [
  { id: 1, type: "weather", title: "Heavy Rain Warning", time: "2 hours ago", desc: "Expect thunderstorms in Moinabad region tonight. Delay fertilizer application.", icon: CloudLightning, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: 2, type: "scheme", title: "Rythu Bandhu Disbursed", time: "1 day ago", desc: "Your Kharif installment has been credited to your registered bank account.", icon: Landmark, color: "text-green-500", bg: "bg-green-500/10" },
  { id: 3, type: "system", title: "Soil Test Complete", time: "3 days ago", desc: "Your latest soil health card is ready. Tap to view nitrogen recommendations.", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500/10" },
];

function AlertsScreen() {
  return (
    <PhoneShell>
      <div className="min-h-screen bg-background font-sans pb-24">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-md border-b border-border/40 px-5 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors">
              <ChevronLeft size={24} className="text-foreground" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                <Bell size={20} />
              </div>
              <h1 className="text-lg font-bold text-foreground">Notifications</h1>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="space-y-4">
            {alertsData.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 120 }}
                className="bg-card/80 backdrop-blur-md border border-border/40 rounded-3xl p-5 shadow-sm relative overflow-hidden group"
              >
                {/* Subtle side accent line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${alert.bg.replace('/10', '')} opacity-80`} />
                
                <div className="flex gap-4">
                  <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${alert.bg} ${alert.color}`}>
                    <alert.icon size={24} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-foreground truncate pr-2">{alert.title}</h3>
                      <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap shrink-0 mt-1">{alert.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{alert.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}