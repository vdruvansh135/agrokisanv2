import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ChevronLeft, FlaskConical, FileText, CheckCircle2 } from 'lucide-react';
import { PhoneShell } from '@/components/agro/PhoneShell';

export const Route = createFileRoute('/soil')({
  component: SoilScreen,
});

function SoilScreen() {
  return (
    <PhoneShell>
      <div className="min-h-screen bg-background font-sans pb-24">
        <div className="bg-card/80 backdrop-blur-md border-b border-border/40 px-5 py-4 flex items-center gap-4 sticky top-0 z-50">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors">
            <ChevronLeft size={24} className="text-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-500">
              <FlaskConical size={20} />
            </div>
            <h1 className="text-lg font-bold text-foreground">Soil Health</h1>
          </div>
        </div>

        <div className="p-5">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-emerald-500/30 rounded-3xl p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Latest Report</h3>
                <p className="text-lg font-black text-foreground">Kharif Prep 2026</p>
              </div>
              <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle2 size={14} /> Normal
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface p-3 rounded-2xl text-center border border-border/50">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Nitrogen</p>
                <p className="text-xl font-black text-foreground mt-1">L</p>
              </div>
              <div className="bg-surface p-3 rounded-2xl text-center border border-border/50">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Phosphorus</p>
                <p className="text-xl font-black text-foreground mt-1">M</p>
              </div>
              <div className="bg-surface p-3 rounded-2xl text-center border border-border/50">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Potassium</p>
                <p className="text-xl font-black text-foreground mt-1">H</p>
              </div>
            </div>
          </motion.div>

          <motion.button 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-md hover:bg-primary/90 transition-colors"
          >
            <FileText size={18} /> Request New Lab Test
          </motion.button>
        </div>
      </div>
    </PhoneShell>
  );
}