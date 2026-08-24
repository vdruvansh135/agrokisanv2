import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ChevronLeft, Tractor, Clock, Star } from 'lucide-react';
import { PhoneShell } from '@/components/agro/PhoneShell';

export const Route = createFileRoute('/machinery')({
  component: MachineryScreen,
});

const machines = [
  { id: 1, name: "Mahindra 575 DI", type: "Tractor", rate: "₹800/hr", owner: "Ramesh K.", rating: 4.8, available: true },
  { id: 2, name: "John Deere 5050", type: "Tractor with Rotavator", rate: "₹1200/hr", owner: "Suresh P.", rating: 4.9, available: true },
  { id: 3, name: "Kartar 4000", type: "Harvester", rate: "₹2500/hr", owner: "Venkat R.", rating: 4.5, available: false },
];

function MachineryScreen() {
  return (
    <PhoneShell>
      <div className="min-h-screen bg-background font-sans pb-24">
        <div className="bg-card/80 backdrop-blur-md border-b border-border/40 px-5 py-4 flex items-center gap-4 sticky top-0 z-50">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors">
            <ChevronLeft size={24} className="text-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-orange-500/10 p-1.5 rounded-lg text-orange-500">
              <Tractor size={20} />
            </div>
            <h1 className="text-lg font-bold text-foreground">Rent Machinery</h1>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {machines.map((machine, i) => (
            <motion.div
              key={machine.id}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="bg-card/80 backdrop-blur-md border border-border/40 rounded-3xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-foreground">{machine.name}</h3>
                  <p className="text-xs font-medium text-muted-foreground">{machine.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-orange-500 text-lg">{machine.rate}</p>
                  <p className="text-[10px] flex items-center justify-end gap-1 font-bold text-muted-foreground"><Star size={10} className="text-yellow-500 fill-yellow-500"/> {machine.rating}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock size={12} /> Owner: {machine.owner}
                </span>
                <button className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${machine.available ? 'bg-orange-500 text-white shadow-md hover:scale-105' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}>
                  {machine.available ? 'Request Now' : 'Currently Rented'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}