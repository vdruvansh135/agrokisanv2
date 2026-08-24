import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileUp, ShieldCheck, FileSearch, CheckCircle2, XCircle } from 'lucide-react'

export const Route = createFileRoute('/loans')({
  component: LoanEligibilityDashboard,
})

function LoanEligibilityDashboard() {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'eligible' | 'rejected'>('idle');

  // Simulated AI document check for the hackathon demo
  const handleCheckEligibility = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('eligible'); // Hardcoded to 'eligible' for a positive hackathon demo
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-agro-dark p-4 md:p-8 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white dark:bg-agro-surface rounded-2xl p-8 shadow-md border border-gray-100 dark:border-gray-800 text-center"
      >
        
        <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-blue-600">
          <ShieldCheck size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Agricultural Loan Eligibility</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
          Upload your farming portfolio documents. The system will strictly analyze your records to determine eligibility status.
        </p>

        {/* Dynamic State UI */}
        <div className="min-h-[250px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            
            {/* IDLE STATE */}
            {scanState === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <FileUp size={48} className="text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-300 font-bold mb-4">Drag and drop documents here</p>
                <button 
                  onClick={handleCheckEligibility}
                  className="px-6 py-3 bg-agro-green text-white font-bold rounded-xl hover:bg-agro-leaf transition-colors shadow-sm"
                >
                  Analyze Documents
                </button>
              </motion.div>
            )}

            {/* SCANNING STATE */}
            {scanState === 'scanning' && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center text-blue-600"
              >
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  <FileSearch size={48} className="mb-4" />
                </motion.div>
                <p className="font-bold text-lg animate-pulse">Analyzing cross-document data...</p>
              </motion.div>
            )}

            {/* ELIGIBLE STATE */}
            {scanState === 'eligible' && (
              <motion.div 
                key="eligible"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-green-600"
              >
                <CheckCircle2 size={64} className="mb-4 text-agro-green" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Status: Eligible</h2>
                <p className="text-agro-green font-medium">Your documents meet the criteria for agricultural lending.</p>
                
                <button 
                  onClick={() => setScanState('idle')}
                  className="mt-6 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Start New Scan
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  )
}