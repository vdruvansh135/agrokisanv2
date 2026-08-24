import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ChevronLeft, Droplets, MapPin, ArrowRight } from 'lucide-react';
import { PhoneShell } from '@/components/agro/PhoneShell';

export const Route = createFileRoute('/water')({
  component: WaterScreen,
});

function WaterScreen() {
  return (
    <PhoneShell>
      <div className="min-h-screen bg-background font-sans pb-24">
        <div className="bg-card/80 backdrop-blur-md border-b border-border/40 px-5 py-4 flex items-center gap-4 sticky top-0 z-50">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors">
            <ChevronLeft size={24} className="text-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-blue-500/10 p-1.5 rounded-lg text-blue-500">
              <Droplets size={20} />
            </div>
            <h1 className="text-lg font-bold text-foreground">Water Sharing</h1>
          </div>
        </div>

        <div className="p-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-500 text-white rounded-3xl p-6 shadow-lg mb-6 relative overflow-hidden">
             <Droplets size={120} className="absolute -right-6 -bottom-6 opacity-20" />
             <h2 className="text-xl font-black mb-2 relative z-10">Peer-to-Peer Irrigation</h2>
             <p className="text-sm font-medium text-white/80 mb-4 relative z-10">Share borewell resources with neighbors in low-yield zones to split costs and save crops.</p>
             <button className="bg-white text-blue-500 px-5 py-2 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-transform relative z-10">
               Offer Water Resource
             </button>
          </motion.div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Nearby Offers (0.5km)</h3>
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border/40 p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <h4 className="font-bold text-foreground">Borewell 2 (4-inch)</h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin size={10} /> Near South Edge Field</p>
            </div>
            <button className="bg-blue-500/10 text-blue-500 p-2 rounded-xl hover:bg-blue-500/20 transition-colors">
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </div>
    </PhoneShell>
  );
}