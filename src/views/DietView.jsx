import { motion } from 'framer-motion';

export default function DietView() {
  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
        >
          Your Diet Plan
        </motion.h1>

        {/* Meal Plan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {['Breakfast', 'Lunch', 'Dinner'].map((meal, index) => (
            <motion.div
              key={meal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30"
            >
              <h2 className="text-2xl font-bold mb-4">{meal}</h2>
              <ul className="space-y-2 text-gray-300">
                <li>• Oatmeal with fruits</li>
                <li>• Protein shake</li>
                <li>• Green smoothie</li>
              </ul>
              <div className="mt-6 pt-6 border-t border-green-500/30">
                <p className="text-sm text-gray-400">Calories: 450</p>
                <p className="text-sm text-gray-400">Protein: 25g</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nutrition Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 rounded-xl p-8 border border-gray-700"
        >
          <h2 className="text-3xl font-bold mb-6">Nutrition Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <span className="text-3xl">💧</span>
              <div>
                <h3 className="font-semibold mb-2">Stay Hydrated</h3>
                <p className="text-gray-400">Drink at least 8 glasses of water daily</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">🥗</span>
              <div>
                <h3 className="font-semibold mb-2">Eat More Vegetables</h3>
                <p className="text-gray-400">Include greens in every meal</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">🍗</span>
              <div>
                <h3 className="font-semibold mb-2">Lean Protein</h3>
                <p className="text-gray-400">Choose chicken, fish, and plant proteins</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">⏰</span>
              <div>
                <h3 className="font-semibold mb-2">Regular Meals</h3>
                <p className="text-gray-400">Eat every 3-4 hours to boost metabolism</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
