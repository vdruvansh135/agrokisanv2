import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { User, MapPin, Award, Sprout, Star, ThumbsUp } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: FarmerProfile,
})

// Mock JSON data
const farmerData = {
  name: "Ramesh Reddy",
  location: "Kottapalli Village",
  trustScore: 4.8,
  landSize: "4.5 Acres",
  experience: "15 Years",
  endorsements: 24,
  crops: [
    { id: 1, name: "Paddy", season: "Kharif 2025", yield: "High" },
    { id: 2, name: "Cotton", season: "Rabi 2025", yield: "Medium" },
    { id: 3, name: "Maize", season: "Kharif 2026", yield: "Active" }
  ]
};

// Animation variants for smooth, staggered loading
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

function FarmerProfile() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-agro-dark p-4 md:p-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Profile Header Card */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-agro-surface rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-agro-sky dark:bg-gray-800 rounded-full flex items-center justify-center text-agro-green shadow-inner">
            <User size={48} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              {farmerData.name}
              <Award className="text-agro-wheat" size={24} />
            </h1>
            <p className="text-agro-soil flex items-center justify-center md:justify-start gap-1 mt-1 font-medium">
              <MapPin size={16} /> {farmerData.location}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Star size={14} className="fill-current" /> {farmerData.trustScore} Trust Score
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <ThumbsUp size={14} /> {farmerData.endorsements} Endorsements
              </span>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-agro-green text-white rounded-xl hover:bg-agro-leaf transition-colors font-bold shadow-md"
          >
            Connect
          </motion.button>
        </motion.div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div variants={itemVariants} className="bg-white dark:bg-agro-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Total Land</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{farmerData.landSize}</div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white dark:bg-agro-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Experience</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{farmerData.experience}</div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white dark:bg-agro-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Status</div>
            <div className="text-2xl font-bold text-agro-green">Verified</div>
          </motion.div>
        </div>

        {/* Crop History Timeline */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-agro-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sprout className="text-agro-green" size={24} /> Crop History
          </h2>
          <div className="space-y-4">
            {farmerData.crops.map((crop, index) => (
              <motion.div 
                key={crop.id}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{crop.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{crop.season}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  crop.yield === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {crop.yield} Yield
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}