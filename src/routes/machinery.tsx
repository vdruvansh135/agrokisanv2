import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Tractor, Droplets, Wrench } from 'lucide-react'

export const Route = createFileRoute('/machinery')({
  component: MachineryDashboard,
})

// Mock JSON data (Mahesh will move this to the backend later)
const mockMachinery = [
  { id: 1, name: 'Mahindra Tractor', type: 'Heavy Vehicle', price: '₹500/hr', status: 'Available', icon: Tractor },
  { id: 2, name: 'High-Power Motor', type: 'Water Pump', price: '₹150/hr', status: 'In Use', icon: Droplets },
  { id: 3, name: 'Rotavator', type: 'Attachment', price: '₹200/hr', status: 'Available', icon: Wrench },
  { id: 4, name: 'Mini Harvester', type: 'Harvesting', price: '₹800/hr', status: 'Available', icon: Tractor },
];

function MachineryDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-agro-dark p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Animated Header */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-agro-green mb-2"
        >
          Machinery Rentals
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-agro-soil mb-8 font-medium"
        >
          Rent equipment from your local farming community.
        </motion.p>

        {/* Animated Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMachinery.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-agro-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-agro-sky dark:bg-gray-800 rounded-lg text-agro-green">
                  <item.icon size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{item.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{item.type}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-lg font-bold text-agro-green">{item.price}</span>
                <button 
                  disabled={item.status !== 'Available'}
                  className="px-4 py-2 bg-agro-green text-white rounded-lg hover:bg-agro-leaf transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {item.status === 'Available' ? 'Rent Now' : 'Unavailable'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}