import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ChevronLeft, TrendingUp, TrendingDown, Store, Search } from 'lucide-react';
import { PhoneShell } from '@/components/agro/PhoneShell';

export const Route = createFileRoute('/market')({
  component: MarketScreen,
});

const marketData = [
  { id: 1, crop: "Paddy (Common)", price: "₹2,203", unit: "per quintal", trend: "up", change: "+₹25" },
  { id: 2, crop: "Cotton (Long Staple)", price: "₹7,020", unit: "per quintal", trend: "down", change: "-₹150" },
  { id: 3, crop: "Maize", price: "₹2,090", unit: "per quintal", trend: "up", change: "+₹10" },
  { id: 4, crop: "Red Gram (Tur)", price: "₹10,500", unit: "per quintal", trend: "up", change: "+₹200" },
];

function MarketScreen() {
  return (
    <PhoneShell>
      <div className="min-h-screen bg-background font-sans pb-24">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-md border-b border-border/40 px-5 py-4 flex items-center gap-4 sticky top-0 z-50">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors">
            <ChevronLeft size={24} className="text-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
              <Store size={20} />
            </div>
            <h1 className="text-lg font-bold text-foreground">Local Mandi Prices</h1>
          </div>
        </div>

        <div className="p-5">
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-surface border border-border/50 rounded-2xl px-4 py-3 mb-6 shadow-sm focus-within:border-primary/50 transition-colors"
          >
            <Search size={20} className="text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search crops..." 
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
            />
          </motion.div>

          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Today's Rates (Telangana)</h2>

          {/* Animated Glassmorphism List */}
          <div className="space-y-3">
            {marketData.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02 }}
                className="bg-card/80 backdrop-blur-md border border-border/40 rounded-2xl p-4 shadow-sm flex items-center justify-between transition-all hover:shadow-md"
              >
                <div>
                  <h3 className="font-bold text-base text-foreground">{item.crop}</h3>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">{item.price} {item.unit}</p>
                </div>
                
                <div className={`flex flex-col items-end ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  <div className="flex items-center gap-1 font-black text-lg">
                    {item.trend === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    {item.price}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-current/10 mt-1">
                    {item.change} Today
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}