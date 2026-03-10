import { motion } from 'framer-motion';

export default function AttendanceCalendar({ attendanceData = [] }) {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Get first day of the current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const getAttendanceStatus = (day) => {
    if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
      return 'Unknown';
    }

    const matchingAttendance = attendanceData.find(item => {
      const itemDate = new Date(item.date);
      return itemDate.getDate() === day &&
        itemDate.getMonth() === currentMonth &&
        itemDate.getFullYear() === currentYear;
    });

    return matchingAttendance ? matchingAttendance.status : 'Unknown';
  };

  // Calculate attendance stats for current month
  const calculateStats = () => {
    if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
      return { present: 0, absent: 0, total: currentDay };
    }

    let presentCount = 0;
    let absentCount = 0;

    for (let day = 1; day <= currentDay; day++) {
      const status = getAttendanceStatus(day);
      if (status === 'Present') presentCount++;
      else if (status === 'Absent') absentCount++;
    }

    return {
      present: presentCount,
      absent: absentCount,
      total: currentDay
    };
  };

  const stats = calculateStats();
  const attendancePercentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Attendance Calendar
        </h3>
        <p className="text-gray-400 text-sm">
          {today.toLocaleString('default', { month: 'long' })} {currentYear}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="mb-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 text-sm">Attendance Rate</span>
          <span className="font-bold text-purple-400">{attendancePercentage}%</span>
        </div>
        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${attendancePercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <div>Present: <span className="text-green-400 font-medium">{stats.present}</span></div>
          <div>Absent: <span className="text-red-400 font-medium">{stats.absent}</span></div>
          <div>Days: <span className="text-gray-300 font-medium">{stats.total}</span></div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day labels */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="font-bold text-center text-gray-400 text-xs pb-2">
            {day}
          </div>
        ))}

        {/* Empty cells for alignment */}
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Days */}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const status = day <= currentDay ? getAttendanceStatus(day) : 'Future';

          let statusClasses;
          if (status === 'Absent') {
            statusClasses = 'bg-red-900/30 border-red-700 text-red-400';
          } else if (status === 'Present') {
            statusClasses = 'bg-green-900/30 border-green-700 text-green-400';
          } else if (day > currentDay) {
            statusClasses = 'bg-gray-800/50 border-gray-700 text-gray-500';
          } else {
            statusClasses = 'bg-gray-800 border-gray-700 text-gray-400';
          }

          return (
            <div
              key={day}
              className={`
                py-2 text-center text-xs rounded-md border transition-all
                ${statusClasses}
                ${day === currentDay ? 'ring-2 ring-purple-500 font-bold' : ''}
              `}
            >
              <p>{day}</p>
              {status === 'Present' && day <= currentDay && (
                <div className="mt-1 w-1.5 h-1.5 mx-auto rounded-full bg-green-400" />
              )}
              {status === 'Absent' && day <= currentDay && (
                <div className="mt-1 w-1.5 h-1.5 mx-auto rounded-full bg-red-400" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-6 text-xs gap-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-400 mr-1.5" />
          <span className="text-gray-300">Present</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-400 mr-1.5" />
          <span className="text-gray-300">Absent</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-600 mr-1.5" />
          <span className="text-gray-300">Unknown</span>
        </div>
      </div>
    </motion.div>
  );
}
