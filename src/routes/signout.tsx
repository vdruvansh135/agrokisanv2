import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/app-store';

export const Route = createFileRoute('/signout')({
  component: SignOutScreen,
});

function SignOutScreen() {
  const { signOut } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the state and redirect back to Onboarding after 2.5 seconds
    const timer = setTimeout(() => {
      signOut();
      navigate({ to: '/' });
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [signOut, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-5 font-sans">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="flex flex-col items-center text-center"
      >
        <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-500/20">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black text-foreground mb-3 tracking-tight">Signed Out</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Your profile has been securely logged out. <br /> See you next time on AgroKisan!
        </p>
      </motion.div>
    </div>
  );
}