import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, User, CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { languages } from "@/lib/agro-data";

export function Onboarding() {
  const { profile, setProfile, setOnboarded } = useApp();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = () => {
    setIsSubmitting(true);
    // Pause for a nice success animation before entering the app
    setTimeout(() => {
      setOnboarded(true);
    }, 1800);
  };

  // Dynamic progress bar calculation
  const calculateProgress = () => {
    let progress = 0;
    if (profile.name) progress += 33;
    if (profile.village) progress += 33;
    if (profile.language) progress += 34;
    return progress;
  };

  const progress = calculateProgress();

  return (
    // THE FIX: Added 'mx-auto max-w-md overflow-hidden shadow-2xl' to lock it to mobile width!
    <div className="relative mx-auto min-h-screen max-w-md bg-background flex flex-col font-sans overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: CINEMATIC SPLASH SCREEN (Using raithu.jpg) */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }} // Smooth exit transition
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col items-center justify-end p-6 text-center relative bg-black"
          >
            {/* The Image with a subtle zoom-in effect */}
            <motion.img
              src="/raithu.png"
              alt="Agro Kisan Farmer"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover opacity-90 object-top"
            />
            
            {/* Dark gradient overlay so the text pops */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <motion.div 
               initial={{ y: 30, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.5, duration: 0.8 }}
               className="relative z-10 w-full flex flex-col items-center pb-8"
            >
              <h1 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-2xl">Agro Kisan</h1>
              <p className="text-lg text-white/80 font-medium mb-10 drop-shadow-md">
                Your complete farming ecosystem.
              </p>
              <button
                onClick={() => setStep(2)}
                className="bg-primary text-primary-foreground flex items-center justify-center gap-2 w-full max-w-sm py-4 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                Get Started <ArrowRight size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 2: PROFILE SETUP */}
        {step === 2 && !isSubmitting && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="flex-1 flex flex-col p-6 pt-12 w-full"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-black text-foreground mb-2 tracking-tight">Set up your profile</h1>
              <p className="text-muted-foreground font-medium">Almost done</p>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-primary tracking-wider">Profile {progress}% Complete</span>
              </div>
              <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary rounded-full" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progress}%` }} 
                  transition={{ type: "spring", damping: 20 }}
                />
              </div>
            </div>

            <div className="space-y-6 flex-1">
              {/* Full Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-card border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Village Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Village / District</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={profile.village}
                    onChange={(e) => setProfile({ village: e.target.value })}
                    placeholder="e.g. Kotapalli"
                    className="w-full bg-card border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preferred Language</label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setProfile({ language: l.code })}
                      className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                        profile.language === l.code
                          ? "bg-primary text-primary-foreground shadow-md scale-105"
                          : "bg-card border border-border/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 pb-8">
              <button
                disabled={progress < 100}
                onClick={handleComplete}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg transition-all ${
                  progress === 100 
                  ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-[0.98]" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Enter Agro Kisan <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: SUCCESS ANIMATION */}
        {isSubmitting && (
          <motion.div
            key="submitting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-500/20 shadow-sm"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">Profile Created!</h2>
            <p className="text-muted-foreground font-medium">Preparing your digital farm...</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}