import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, UploadCloud, FileText, Scan, CheckCircle2, ChevronLeft, ShieldCheck, Wallet, RefreshCw } from 'lucide-react'
import { PhoneShell } from '@/components/agro/PhoneShell'

export const Route = createFileRoute('/loans')({
  component: LoanEligibilityDashboard,
})

function LoanEligibilityDashboard() {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'eligible' | 'rejected'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      startOCRScan(file);
    }
  };

  const handleWalletSync = () => {
    setFileName("Pattadar_Passbook.pdf");
    startOCRScan(null);
  };

  const startOCRScan = (file: File | null) => {
    setScanState('scanning');
    
    // Simulating the Python backend processing delay for the UI demo
    setTimeout(() => {
      setScanState('eligible'); 
    }, 4000);
  };

  return (
    <PhoneShell>
      <div className="min-h-screen bg-background flex flex-col font-sans pb-24">
        
        {/* Hidden Inputs for Native Device Features */}
        <input type="file" accept="image/*,application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
        <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleFileSelect} />

        {/* Header */}
        <div className="bg-card/80 backdrop-blur-md border-b border-border/40 px-5 py-4 flex items-center justify-between sticky top-0 z-50">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors">
            <ChevronLeft size={24} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">Loan Eligibility</h1>
          <div className="w-8" />
        </div>

        <div className="flex-1 p-5 flex flex-col w-full">
          
          <div className="mb-8 text-center mt-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary border border-primary/20 shadow-sm">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Smart Document Scan</h2>
            <p className="text-sm font-medium text-muted-foreground">
              Upload your land records or identity proofs. Our AI will instantly extract the details to verify eligibility.
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              
              {scanState === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-4">
                  <button onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all group">
                    <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500 group-hover:scale-110 transition-transform"><Camera size={24} /></div>
                    <div className="text-left flex-1"><h3 className="font-bold text-foreground">Open Camera</h3><p className="text-xs text-muted-foreground font-medium">Take a clear photo of your document</p></div>
                  </button>

                  <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all group">
                    <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform"><UploadCloud size={24} /></div>
                    <div className="text-left flex-1"><h3 className="font-bold text-foreground">Upload File</h3><p className="text-xs text-muted-foreground font-medium">Select a PDF, PNG, or JPG</p></div>
                  </button>

                  <div className="relative py-4 flex items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink-0 mx-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Or</span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>

                  <button onClick={handleWalletSync} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90 transition-all active:scale-[0.98]">
                    <Wallet size={20} /> Sync from Document Wallet
                  </button>
                </motion.div>
              )}

              {scanState === 'scanning' && (
                <motion.div key="scanning" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-12">
                  <div className="relative w-32 h-32 mb-8">
                    <motion.div animate={{ y: [0, 128, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] z-10" />
                    <FileText size={128} className="text-muted-foreground/30" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 animate-pulse">Extracting Data...</h3>
                  <p className="text-sm font-medium text-muted-foreground text-center">Running OCR on <br/><span className="text-primary font-bold">{fileName}</span></p>
                </motion.div>
              )}

              {scanState === 'eligible' && (
                <motion.div key="eligible" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6">
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <h2 className="text-3xl font-black text-foreground mb-2">Eligible!</h2>
                  <div className="bg-card border border-border p-4 rounded-2xl w-full text-left mb-6 shadow-sm">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Extracted from {fileName}</h4>
                    <div className="space-y-2 text-sm font-medium">
                      <div className="flex justify-between"><span className="text-muted-foreground">Name Match:</span><span className="text-foreground">98% (Verified)</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Land Holding:</span><span className="text-foreground">4.5 Acres</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Risk Profile:</span><span className="text-green-500 font-bold">Low</span></div>
                    </div>
                  </div>
                  
                  <button onClick={() => setScanState('idle')} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                    <RefreshCw size={16} /> Scan another document
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </PhoneShell>
  )
}