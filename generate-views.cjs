/**
 * Auto-generate all view components for iOS app
 * Creates same UI with completely different code architecture
 */

const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'src', 'views');
const modulesDir = path.join(__dirname, 'src', 'modules');

// Ensure directories exist
[viewsDir, modulesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('Generating all view components...\n');

// 1. HomePage View
const homePageContent = `import { useAppStore } from '@/services/store';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const { authenticated, scheduleData, offersAvailable } = useAppStore();

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduleData.slice(0, 6).map((classItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-pink-500 transition-all"
                >
                  <h3 className="text-xl font-semibold mb-2">{classItem.name || 'Fitness Class'}</h3>
                  <p className="text-gray-400 mb-4">{classItem.time || 'TBD'}</p>
                  <button className="w-full py-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors">
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
                  \${offer.amount}
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
`;

// 2. ClassesView
const classesViewContent = `import { useAppStore } from '@/services/store';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ClassesView() {
  const { scheduleData, authenticated } = useAppStore();
  const [selectedDay, setSelectedDay] = useState('all');

  const days = ['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent"
        >
          Class Schedule
        </motion.h1>

        {/* Day Filter */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={\`px-6 py-2 rounded-full transition-all \${
                selectedDay === day
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }\`}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </button>
          ))}
        </div>

        {/* Weekly Schedule */}
        <div className="bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Weekly Schedule ✨
            </span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Morning Slots */}
            <div className="bg-gradient-to-br from-orange-500/15 via-yellow-600/10 to-orange-700/15 backdrop-blur-xl border border-orange-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 bg-orange-500/20 rounded-lg">🌅</span>
                <span className="text-orange-300">Morning Slots</span>
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 animate-pulse"></div>
                  <span>6 AM : ARPITA MAM</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 animate-pulse"></div>
                  <span>7 AM : SMRITI MAM, HARSHITA MAM</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 animate-pulse"></div>
                  <span>8 AM : SWAMINI MAM</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 animate-pulse"></div>
                  <span>9 AM : ARPITA MAM</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 animate-pulse"></div>
                  <span>10 AM : RISHIKA MAM, NIKITA MAM</span>
                </li>
              </ul>
            </div>

            {/* Evening Slots */}
            <div className="bg-gradient-to-br from-indigo-500/15 via-purple-600/10 to-indigo-700/15 backdrop-blur-xl border border-indigo-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 bg-indigo-500/20 rounded-lg">🌙</span>
                <span className="text-indigo-300">Evening Slots</span>
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3 animate-pulse"></div>
                  <span>5 PM : NIKITA MAM, RISHIKA MAM</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3 animate-pulse"></div>
                  <span>6 PM : NIKITA MAM, TUHINA MAM</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3 animate-pulse"></div>
                  <span>7 PM : SAPNA MAM, RISHIKA MAM</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3 animate-pulse"></div>
                  <span>8 PM : ARPITA MAM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Class Password */}
          <div className="bg-gradient-to-r from-pink-900/30 via-pink-800/20 to-pink-900/30 rounded-xl border border-pink-500/30 p-6 text-center">
            <p className="text-pink-300 text-sm font-semibold mb-2">Class Password</p>
            <div className="bg-black/40 rounded-lg px-4 py-3 border border-pink-500/20 inline-block">
              <code className="text-pink-200 font-mono text-2xl font-bold tracking-wider">
                45daysfit
              </code>
            </div>
            <p className="text-pink-400/80 text-xs mt-2">Use this password to join live classes</p>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scheduleData.map((classItem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-pink-500 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{classItem.name || 'Fitness Class'}</h3>
                <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm">
                  {classItem.status || 'Live'}
                </span>
              </div>
              <p className="text-gray-400 mb-4">{classItem.instructor || 'Instructor TBD'}</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{classItem.time || 'TBD'}</span>
                <button className="px-4 py-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors">
                  Join
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
`;

// 3. ProfileView
const profileViewContent = `import { useAppStore } from '@/services/store';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ProfileView() {
  const navigate = useNavigate();
  const { userProfile, membershipData, authenticated } = useAppStore();

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Please Login</h2>
          <button
            onClick={() => useAppStore.getState().toggleModal('login', true)}
            className="px-6 py-3 bg-pink-500 rounded-lg hover:bg-pink-600"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-2xl p-8 border border-pink-500/30 mb-8"
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-4xl">
              {userProfile?.first_name?.[0] || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {userProfile?.first_name} {userProfile?.last_name}
              </h1>
              <p className="text-gray-400">{userProfile?.email || userProfile?.phone}</p>
            </div>
          </div>

          {/* Membership Info */}
          {membershipData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Membership</p>
                <p className="text-xl font-bold text-pink-400">{membershipData.plan_name || 'Active'}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Expires</p>
                <p className="text-xl font-bold">{membershipData.end_date || 'N/A'}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Classes Attended</p>
                <p className="text-xl font-bold text-green-400">{userProfile?.classes_attended || 0}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/diet')}
            className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-500/30 rounded-xl p-6 text-left hover:border-green-400/50 transition-all"
          >
            <div className="flex items-center mb-3">
              <span className="p-2 rounded-lg bg-green-900/40 mr-3 text-2xl">🥗</span>
              <h3 className="text-xl font-bold text-green-300">Diet Plan</h3>
            </div>
            <p className="text-gray-300">Get personalized nutrition recommendations</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/classes')}
            className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 text-left hover:border-blue-400/50 transition-all"
          >
            <div className="flex items-center mb-3">
              <span className="p-2 rounded-lg bg-blue-900/40 mr-3 text-2xl">💪</span>
              <h3 className="text-xl font-bold text-blue-300">My Classes</h3>
            </div>
            <p className="text-gray-300">View your class schedule and history</p>
          </motion.button>
        </div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gray-800/30 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              Edit Profile
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              Change Password
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              Notification Settings
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('accessToken');
                useAppStore.getState().setAuthenticated(false);
                navigate('/');
              }}
              className="w-full text-left px-4 py-3 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors"
            >
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
`;

// 4. CommunityView
const communityViewContent = `import { motion } from 'framer-motion';

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
`;

// 5. DietView
const dietViewContent = `import { motion } from 'framer-motion';

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
`;

// Write all view files
const views = {
  'HomePage.jsx': homePageContent,
  'ClassesView.jsx': classesViewContent,
  'ProfileView.jsx': profileViewContent,
  'CommunityView.jsx': communityViewContent,
  'DietView.jsx': dietViewContent
};

console.log('Creating view components...\n');
Object.entries(views).forEach(([filename, content]) => {
  const filepath = path.join(viewsDir, filename);
  fs.writeFileSync(filepath, content);
  console.log(`✓ Created ${filename}`);
});

console.log('\n✅ All view components created successfully!\n');
console.log('Views created:');
console.log('  - HomePage.jsx (Landing page with hero, classes, offers)');
console.log('  - ClassesView.jsx (Schedule, class grid, weekly timetable)');
console.log('  - ProfileView.jsx (User profile, membership info, settings)');
console.log('  - CommunityView.jsx (Community posts and discussions)');
console.log('  - DietView.jsx (Meal plans and nutrition tips)\n');
