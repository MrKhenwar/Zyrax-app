import { useState, useEffect, useCallback, useMemo } from 'react';
import { FiClock, FiCalendar, FiVideo, FiGrid, FiList, FiPlay, FiUsers, FiRefreshCw } from 'react-icons/fi';
import { fetchClasses } from '../services/api';
import TimezoneSelector from '../components/TimezoneSelector';
import useTimezone from '../hooks/useTimezone';
import { formatTimeWithTimezone, formatTimeRangeWithTimezone, getTimezoneAbbreviation, TIMEZONES } from '../utils/timezoneUtils';

export default function ClassesView() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDay, setSelectedDay] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { selectedTimezone, changeTimezone } = useTimezone();

  // Get current day and time in IST
  const getCurrentDayAndTime = () => {
    const istTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const now = new Date(istTime);
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.getHours() * 60 + now.getMinutes();
    return { currentDay, currentTime };
  };

  const timeToMinutes = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getClassDay = (cls) => {
    if (cls.day) return cls.day;
    if (cls.class_date) {
      return new Date(cls.class_date).toLocaleDateString('en-US', { weekday: 'long' });
    }
    return 'Monday';
  };

  const isClassLive = useCallback((cls) => {
    if (!cls?.time || !cls?.duration) return false;

    const { currentDay, currentTime } = getCurrentDayAndTime();
    const classDay = getClassDay(cls);

    if (classDay !== currentDay) return false;

    const classStartTime = timeToMinutes(cls.time);
    const classEndTime = classStartTime + (cls.duration || 60);

    return currentTime >= classStartTime && currentTime <= classEndTime;
  }, []);

  const isUpcomingClass = useCallback((cls) => {
    if (!cls?.time) return false;

    const { currentDay, currentTime } = getCurrentDayAndTime();
    const classDay = getClassDay(cls);
    const classStartTime = timeToMinutes(cls.time);

    const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayIndex = daysOrder.indexOf(currentDay);
    const classDayIndex = daysOrder.indexOf(classDay);

    if (classDay === currentDay) {
      return classStartTime > currentTime;
    }

    let daysUntil = classDayIndex - currentDayIndex;
    if (daysUntil <= 0) {
      daysUntil += 7;
    }

    return daysUntil <= 7;
  }, []);

  const loadClasses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchClasses();
      setClasses(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error loading classes:', err);
      setError('Failed to load classes. Please try again.');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadClasses();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleJoinClass = (cls) => {
    if (cls.zoom_link) {
      window.open(cls.zoom_link, '_blank');
    } else {
      alert('Zoom link not available');
    }
  };

  const getCategorizedClasses = useMemo(() => {
    const liveClasses = classes.filter(isClassLive);
    const upcomingClasses = classes.filter(cls => !isClassLive(cls) && isUpcomingClass(cls));
    const allClasses = classes;

    return {
      live: liveClasses,
      upcoming: upcomingClasses,
      all: allClasses
    };
  }, [classes, isClassLive, isUpcomingClass]);

  const getFilteredClasses = useMemo(() => {
    const categorized = getCategorizedClasses;
    let targetClasses = [];

    switch (activeTab) {
      case 'live':
        targetClasses = categorized.live;
        break;
      case 'upcoming':
        targetClasses = categorized.upcoming;
        break;
      default:
        targetClasses = categorized.all;
    }

    if (selectedDay !== 'all') {
      targetClasses = targetClasses.filter(cls => getClassDay(cls) === selectedDay);
    }

    return targetClasses;
  }, [getCategorizedClasses, activeTab, selectedDay]);

  if (loading && !isRefreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-red-400 max-w-md px-4">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={loadClasses}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pb-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Zyrax Classes
            </h1>
            <p className="text-gray-400 text-sm">Times shown in {TIMEZONES[selectedTimezone]?.fullName || 'your timezone'}</p>
          </div>

          <div className="flex flex-col gap-3">
            <TimezoneSelector selectedTimezone={selectedTimezone} onTimezoneChange={changeTimezone} />
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-all ${isRefreshing ? 'opacity-50' : ''}`}
            >
              <FiRefreshCw className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/40 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-300 mb-2">
              {getCategorizedClasses.live.length}
            </div>
            <div className="text-green-200">Live Classes</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border border-yellow-500/40 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-300 mb-2">
              {getCategorizedClasses.upcoming.length}
            </div>
            <div className="text-yellow-200">Upcoming Classes</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/40 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-300 mb-2">
              {getCategorizedClasses.all.length}
            </div>
            <div className="text-purple-200">Total Classes</div>
          </div>
        </div>

        {/* Tabs and View Mode */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="bg-gray-800/60 rounded-xl p-1 border border-gray-600/50">
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setActiveTab('live')}
                className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 text-sm ${
                  activeTab === 'live'
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FiPlay /> Live ({getCategorizedClasses.live.length})
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 text-sm ${
                  activeTab === 'upcoming'
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FiClock /> Upcoming ({getCategorizedClasses.upcoming.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 text-sm ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FiCalendar /> All ({getCategorizedClasses.all.length})
              </button>
            </div>
          </div>

          <div className="bg-gray-800/60 rounded-xl p-1 border border-gray-600/50">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 text-sm ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FiGrid /> Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 text-sm ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FiList /> List
              </button>
            </div>
          </div>
        </div>

        {/* Classes Grid/List */}
        {getFilteredClasses.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50">
            <p className="text-xl text-gray-400 mb-4">No classes found</p>
            <button
              onClick={() => setActiveTab('all')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all"
            >
              View All Classes
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredClasses.map((cls, index) => {
              const isLive = isClassLive(cls);

              return (
                <div
                  key={`${cls.id || index}`}
                  className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-6 border ${
                    isLive ? 'border-green-400/50 shadow-green-500/20' : 'border-purple-500/30'
                  } hover:scale-105 transition-all duration-300`}
                >
                  {isLive && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white mb-3 animate-pulse">
                      <FiPlay className="mr-1.5" /> LIVE
                    </span>
                  )}

                  <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    {cls.title || 'Untitled Class'}
                  </h3>

                  <div className="space-y-3 text-gray-300 mb-6">
                    <div className="flex items-center gap-3">
                      <FiClock className="text-purple-400" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {formatTimeRangeWithTimezone(cls.time, cls.duration, selectedTimezone)}
                        </div>
                        <div className="text-xs text-purple-300">
                          {getTimezoneAbbreviation(selectedTimezone)} time
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiCalendar className="text-purple-400" />
                      <span className="text-sm">{cls.duration || 'N/A'} minutes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiUsers className="text-purple-400" />
                      <span className="text-sm">Every {getClassDay(cls)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinClass(cls)}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold transition-all ${
                      isLive
                        ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg shadow-green-500/30'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    }`}
                  >
                    <FiVideo />
                    {isLive ? 'Join Live Class' : 'Join Class'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredClasses.map((cls, index) => {
              const isLive = isClassLive(cls);

              return (
                <div
                  key={`${cls.id || index}`}
                  className={`bg-gray-800 rounded-lg p-6 border-l-4 ${
                    isLive ? 'border-green-500 bg-green-900/10' : 'border-purple-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-purple-300">{cls.title || 'Untitled Class'}</h3>
                        {isLive && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-bold animate-pulse">LIVE</span>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiClock />
                          {formatTimeRangeWithTimezone(cls.time, cls.duration, selectedTimezone)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiCalendar />
                          {cls.duration || 'N/A'} min
                        </span>
                        <span className="flex items-center gap-1">
                          <FiUsers />
                          Every {getClassDay(cls)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinClass(cls)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                        isLive
                          ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/25'
                          : 'bg-purple-700 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      }`}
                    >
                      <FiVideo />
                      {isLive ? 'Join Live' : 'Join Class'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
