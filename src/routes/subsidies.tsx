import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Landmark, Search, CheckCircle2, ChevronRight, Tag } from 'lucide-react'

export const Route = createFileRoute('/subsidies')({
  component: SubsidiesDashboard,
})

// Mock Data tailored for local judges
const mockSubsidies = [
  { id: 1, name: "Rythu Bandhu Scheme", agency: "Telangana State Govt", amount: "₹5,000/acre", season: "Kharif & Rabi", status: "Active", tags: ["Cash Transfer"] },
  { id: 2, name: "PM-KISAN Samman Nidhi", agency: "Central Govt", amount: "₹6,000/year", season: "Annual", status: "Active", tags: ["Income Support"] },
  { id: 3, name: "Micro-Irrigation Subsidy", agency: "Horticulture Dept", amount: "Up to 90%", season: "Year-round", status: "Closing Soon", tags: ["Equipment", "Water"] }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

function SubsidiesDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-agro-dark p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Search */}
        <div className="bg-white dark:bg-agro-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-agro-green flex items-center gap-3 mb-4"
          >
            <Landmark size={32} /> Government Subsidies
          </motion.h1>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by scheme name, crop, or equipment..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agro-green transition-all text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <button className="px-4 py-1.5 bg-agro-green text-white text-sm font-bold rounded-full whitespace-nowrap">All Schemes</button>
            <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-full hover:bg-gray-200 whitespace-nowrap">Central Govt</button>
            <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-full hover:bg-gray-200 whitespace-nowrap">State Govt</button>
            <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-full hover:bg-gray-200 whitespace-nowrap">Equipment</button>
          </div>
        </div>

        {/* Subsidy List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {mockSubsidies.map((subsidy) => (
            <motion.div 
              key={subsidy.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-white dark:bg-agro-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-agro-green transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{subsidy.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    subsidy.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {subsidy.status}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3">{subsidy.agency} • {subsidy.season}</p>
                
                <div className="flex gap-2">
                  {subsidy.tags.map((tag, index) => (
                    <span key={index} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                      <Tag size={12} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between md:flex-col md:items-end gap-4 md:gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Benefit Amount</div>
                  <div className="text-xl font-bold text-agro-green">{subsidy.amount}</div>
                </div>
                <button className="flex items-center gap-1 text-agro-green font-bold hover:text-agro-leaf transition-colors">
                  Check Eligibility <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  )
}