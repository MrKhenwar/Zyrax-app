import { useAppStore } from '@/services/store';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchClasses } from '../services/api';
import { formatTimeWithTimezone, getPreferredTimezone } from '../utils/timezoneUtils';

export default function HomePage() {
  const navigate = useNavigate();
  const { authenticated, offersAvailable } = useAppStore();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedTimezone = getPreferredTimezone();

  useEffect(() => {
    if (authenticated) {
      loadClasses();
    }
  }, [authenticated]);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const data = await fetchClasses();
      setClasses(data || []);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent"
          >
            Zyrax Fitness
          </motion.h1>
          <motion.p
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Transform Your Fitness Journey
          </motion.p>
          {!authenticated && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => useAppStore.getState().toggleModal('login', true)}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </motion.button>
          )}
        </div>
      </motion.section>

      {/* Classes Section */}
      {authenticated && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Today's Classes</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                <p className="text-gray-400 mt-4">Loading classes...</p>
              </div>
            ) : classes.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classes.slice(0, 6).map((classItem, index) => (
                    <motion.div
                      key={classItem.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-pink-500 transition-all"
                    >
                      <h3 className="text-xl font-semibold mb-2 text-white">
                        {classItem.title || classItem.name || 'Fitness Class'}
                      </h3>
                      <div className="space-y-2 mb-4">
                        <p className="text-gray-400 text-sm">
                          <span className="text-purple-400">🕐</span> {formatTimeWithTimezone(classItem.time, selectedTimezone)}
                        </p>
                        {classItem.day && (
                          <p className="text-gray-400 text-sm">
                            <span className="text-purple-400">📅</span> {classItem.day}
                          </p>
                        )}
                        {classItem.duration && (
                          <p className="text-gray-400 text-sm">
                            <span className="text-purple-400">⏱️</span> {classItem.duration} min
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => classItem.zoom_link && window.open(classItem.zoom_link, '_blank')}
                        className="w-full py-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors"
                      >
                        Join Now
                      </button>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center mt-12">
                  <button
                    onClick={() => navigate('/classes')}
                    className="px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View All Classes
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No classes available at the moment</p>
                <button
                  onClick={loadClasses}
                  className="mt-4 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Offers Section */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offersAvailable.slice(0, 3).map((offer, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-2xl p-8 border border-pink-500/30"
              >
                <h3 className="text-2xl font-bold mb-4">{offer.title}</h3>
                <p className="text-gray-300 mb-6">{offer.description || offer.text}</p>
                <div className="text-3xl font-bold text-pink-400 mb-4">
                  ${offer.amount}
                  {offer.discount && <span className="text-sm text-gray-400 ml-2">Save {offer.discount}%</span>}
                </div>
                <button className="w-full py-3 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors">
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
