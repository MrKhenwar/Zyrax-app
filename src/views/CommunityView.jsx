import { motion } from 'framer-motion';

export default function CommunityView() {
  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent"
        >
          Community
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-2xl p-8 border border-pink-500/30"
          >
            <h2 className="text-2xl font-bold mb-4">Success Stories</h2>
            <p className="text-gray-300 mb-6">Read inspiring transformations from our community members</p>
            <button className="px-6 py-3 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors">
              View Stories
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-2xl p-8 border border-blue-500/30"
          >
            <h2 className="text-2xl font-bold mb-4">Community Forum</h2>
            <p className="text-gray-300 mb-6">Connect with other members and share tips</p>
            <button className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
              Join Discussion
            </button>
          </motion.div>
        </div>

        {/* Recent Posts */}
        <h2 className="text-3xl font-bold mb-6">Recent Posts</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full"></div>
                <div>
                  <p className="font-semibold">Member {i}</p>
                  <p className="text-sm text-gray-400">2 hours ago</p>
                </div>
              </div>
              <p className="text-gray-300">
                Just completed my 30-day challenge! Feeling amazing and already seeing results.
                Thanks to the amazing community for the support! 💪
              </p>
              <div className="flex gap-4 mt-4">
                <button className="text-pink-400 hover:text-pink-300">❤️ Like</button>
                <button className="text-blue-400 hover:text-blue-300">💬 Comment</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
