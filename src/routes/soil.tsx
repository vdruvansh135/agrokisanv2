import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { FlaskConical, MapPin, PhoneCall, BadgeCheck } from 'lucide-react'

export const Route = createFileRoute('/soil')({
  component: SoilTestDashboard,
})

// Mock Data featuring local areas for the demo
const mockAgents = [
  { id: 1, labName: "AgroLab Direct", agent: "K. Sharma", location: "Moinabad Center", distance: "2.5 km", phone: "+91 98765 43210", certified: true },
  { id: 2, labName: "Kisan Soil Care", agent: "P. Reddy", location: "Chevella Road", distance: "5.1 km", phone: "+91 87654 32109", certified: true },
  { id: 3, labName: "GreenEarth Tests", agent: "V. Kumar", location: "Himayatnagar Zone", distance: "8.0 km", phone: "+91 76543 21098", certified: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
};

function SoilTestDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-agro-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Animated Header */}
        <div className="mb-8 text-center md:text-left border-b border-gray-200 dark:border-gray-800 pb-6">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-agro-soil dark:text-orange-400 flex items-center justify-center md:justify-start gap-3"
          >
            <div className="p-2 bg-orange-100 dark:bg-gray-800 rounded-lg text-orange-600">
              <FlaskConical size={28} />
            </div>
            Soil Testing Agents
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-500 font-medium mt-2">
            Contact verified local labs to analyze your soil health before the next harvest.
          </motion.p>
        </div>

        {/* Agent Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mockAgents.map((agent) => (
            <motion.div 
              key={agent.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-agro-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {agent.labName}
                    {agent.certified && <BadgeCheck size={18} className="text-blue-500" />}
                  </h3>
                  <p className="text-agro-green font-medium mt-1">Agent: {agent.agent}</p>
                </div>
                {agent.certified && (
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-bold">Govt Certified</span>
                )}
              </div>
              
              <div className="space-y-3 mt-2 mb-6">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full"><MapPin size={16} /></div>
                  <span className="text-sm">{agent.location} • {agent.distance}</span>
                </div>
              </div>

              {/* Push button to bottom */}
              <div className="mt-auto">
                <button className="w-full py-3 flex items-center justify-center gap-2 bg-agro-soil text-white rounded-xl hover:bg-opacity-90 transition-all font-bold shadow-md">
                  <PhoneCall size={18} /> {agent.phone}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  )
}