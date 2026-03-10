import { useAppStore } from '@/services/store';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../services/api';
import AttendanceCalendar from '../components/AttendanceCalendar';

export default function ProfileView() {
  const navigate = useNavigate();
  const { authenticated, setUserProfile } = useAppStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    if (authenticated) {
      loadProfile();
    }
  }, [authenticated]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await fetchUserProfile();
      setProfile(data);
      setUserProfile(data);
      // Set attendance data if available in profile
      if (data.attendance_history) {
        setAttendanceData(data.attendance_history);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fullName = profile ?
    `${profile.first_name || ''} ${profile.last_name || ''}`.trim() :
    'User';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2"
          >
            Welcome, {fullName}
          </motion.h1>
          <p className="text-gray-400">Manage your profile and track your progress</p>
        </div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-2xl p-8 border border-pink-500/30 mb-8"
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold">
              {profile?.first_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                {fullName}
              </h2>
              <p className="text-gray-400">{profile?.email || profile?.phone || profile?.phone_number}</p>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Membership Status</p>
              <p className="text-xl font-bold text-pink-400">{profile?.membership_status || 'Active'}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Member Since</p>
              <p className="text-xl font-bold">
                {profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Classes Attended</p>
              <p className="text-xl font-bold text-green-400">{profile?.total_attendance || profile?.classes_attended || 0}</p>
            </div>
          </div>
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

        {/* Attendance Calendar */}
        <div className="mt-8">
          <AttendanceCalendar attendanceData={attendanceData} />
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
