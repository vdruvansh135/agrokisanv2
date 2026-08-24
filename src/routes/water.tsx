import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Droplets, MapPin, Clock, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/water')({
  component: WaterShareDashboard,
})

// Mock JSON data 
const mockWaterList = [
  { id: 1, provider: "Suresh Patel", type: "Offering", capacity: "5000L", distance: "1.2 km", time: "Available Now" },
  { id: 2, provider: "Anil Kumar", type: "Requesting", capacity: "2000L", distance: "0.8 km", time: "Urgent" },
  { id: 3, provider: "Venkat Rao", type: "Offering", capacity: "10000L", distance: "3.5 km", time: "Tomorrow Morning" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
};

function WaterShareDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-agro-dark p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2"
            >
              <Droplets size={32} /> Water Sharing Network
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-agro-soil font-medium mt-1">
              Connect with nearby farms to share or request irrigation water.
            </motion.p>
          </div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
            <button className="px-5 py-2.5 bg-blue-100 text-blue-700 font-bold rounded-xl hover:bg-blue-200 transition-colors">
              Request Water
            </button>
            <button className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md">
              Offer Water
            </button>
          </motion.div>
        </div>

        {/* Listings Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mockWaterList.map((item) => (
            <motion.div 
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-agro-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 w-full h-1.5 ${item.type === 'Offering' ? 'bg-blue-500' : 'bg-orange-500'}`} />
              
              <div className="flex justify-between items-start mb-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.type === 'Offering' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                }`}>
                  {item.type}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 font-medium">
                  <MapPin size={14} /> {item.distance}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{item.provider}</h3>
              
              <div className="flex items-center gap-2 mt-4 text-gray-700 dark:text-gray-300">
                <Droplets size={18} className="text-blue-500" />
                <span className="font-bold">{item.capacity}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400 text-sm">
                <Clock size={16} />
                <span>{item.time}</span>
              </div>

              <button className="w-full mt-6 py-2.5 flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-bold border border-gray-200 dark:border-gray-700">
                Connect <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  )
}