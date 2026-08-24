import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ChevronLeft, User, MapPin, Award, Phone, Sprout } from 'lucide-react';
import { PhoneShell } from '@/components/agro/PhoneShell';
import { useApp } from '@/lib/app-store';

export const Route = createFileRoute('/profile')({
  component: ProfileScreen,
});

// Added a farmer network as requested!
const farmerNetwork = [
  { id: 1, name: "Verayya", village: "Moinabad", acres: 4.5, crop: "Paddy", img: "/farmer1.png" },
  { id: 2, name: "Ram Babu", village: "Chilkur", acres: 2.0, crop: "Cotton", img: "/farmer2.png" },
  { id: 3, name: "Miya Bhai", village: "Chevella", acres: 6.2, crop: "Maize", img: "/farmer3.png" },
];

function ProfileScreen() {
  const { profile } = useApp();

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
              <User size={20} />
            </div>
            <h1 className="text-lg font-bold text-foreground">Farmer Profile</h1>
          </div>
        </div>

        <div className="p-5">
          {/* Main User Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/40 rounded-3xl p-6 shadow-md mb-8 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center text-3xl font-black mb-4 border-4 border-background shadow-sm z-10">
              {profile.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-black text-foreground z-10">{profile.name}</h2>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 mt-1 z-10">
              <MapPin size={14} /> {profile.village}
            </p>
            
            <div className="flex gap-4 mt-6 w-full z-10">
              <div className="flex-1 bg-surface p-3 rounded-2xl border border-border/50">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Land</p>
                <p className="text-lg font-black text-foreground mt-0.5">{profile.acres} Acres</p>
              </div>
              <div className="flex-1 bg-surface p-3 rounded-2xl border border-border/50">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Main Crop</p>
                <p className="text-lg font-black text-foreground mt-0.5">{profile.crop || "Mixed"}</p>
              </div>
            </div>
          </motion.div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Your Farmer Network</h3>
          
          {/* The Network List */}
          <div className="space-y-3">
            {farmerNetwork.map((farmer, i) => (
              <motion.div
                key={farmer.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/40 rounded-2xl p-4 shadow-sm flex items-center gap-4 transition-all hover:shadow-md"
              >
                {/* INSERT IMAGE URLS HERE */}
                <div className="w-14 h-14 shrink-0 rounded-full bg-muted overflow-hidden border-2 border-primary/20 flex items-center justify-center relative">
                  {farmer.img ? (
                    <img src={farmer.img} alt={farmer.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground">{farmer.name.charAt(0)}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground text-base truncate">{farmer.name}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {farmer.village}
                  </p>
                  <p className="text-[10px] font-semibold text-primary flex items-center gap-1 mt-1 bg-primary/10 w-fit px-2 py-0.5 rounded-full">
                    <Sprout size={10} /> {farmer.acres} Acres • {farmer.crop}
                  </p>
                </div>

                <button className="w-10 h-10 rounded-full bg-secondary/20 text-secondary-foreground flex items-center justify-center hover:bg-secondary/40 transition-colors shrink-0">
                  <Phone size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}