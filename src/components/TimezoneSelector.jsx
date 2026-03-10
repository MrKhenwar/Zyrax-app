import { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiClock, FiGlobe } from 'react-icons/fi';
import { TIMEZONES, getCurrentTimeInTimezone, getTimezoneAbbreviation, setPreferredTimezone } from '../utils/timezoneUtils';

export default function TimezoneSelector({ selectedTimezone, onTimezoneChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTimes, setCurrentTimes] = useState({});
  const dropdownRef = useRef(null);

  // Update current times every minute
  useEffect(() => {
    const updateTimes = () => {
      const times = {};
      Object.keys(TIMEZONES).forEach(code => {
        times[code] = getCurrentTimeInTimezone(code);
      });
      setCurrentTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTimezoneSelect = (timezoneCode) => {
    setPreferredTimezone(timezoneCode);
    onTimezoneChange(timezoneCode);
    setIsOpen(false);
  };

  const selectedTz = TIMEZONES[selectedTimezone];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20
          backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-lg
          hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300
          text-white min-w-[160px] group"
      >
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">{selectedTz.flag}</span>
          <div className="flex flex-col items-start">
            <span className="font-medium text-sm">{selectedTz.name}</span>
            <span className="text-xs text-gray-300">
              {getTimezoneAbbreviation(selectedTimezone)}
            </span>
          </div>
        </div>
        <FiChevronDown
          className={`text-purple-400 transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''} group-hover:text-purple-300`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 max-w-sm
          bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl
          border border-purple-500/30 rounded-xl shadow-2xl z-50
          overflow-hidden">

          {/* Header */}
          <div className="px-4 py-3 border-b border-purple-500/20 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
            <div className="flex items-center gap-2 text-purple-300">
              <FiGlobe className="text-sm" />
              <span className="font-medium text-sm">Select Timezone</span>
            </div>
          </div>

          {/* Timezone Options */}
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(TIMEZONES).map(([code, timezone]) => {
              const isSelected = code === selectedTimezone;
              const currentTime = currentTimes[code] || '00:00';

              return (
                <button
                  key={code}
                  onClick={() => handleTimezoneSelect(code)}
                  className={`w-full px-4 py-3 text-left hover:bg-purple-600/20
                    transition-all duration-200 border-b border-gray-700/50 last:border-b-0
                    ${isSelected ? 'bg-purple-600/30 border-l-4 border-l-purple-400' : ''}
                    group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{timezone.flag}</span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isSelected ? 'text-purple-200' : 'text-white'}`}>
                            {timezone.name}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded
                            ${isSelected ? 'bg-purple-500/30 text-purple-200' : 'bg-gray-700 text-gray-300'}`}>
                            {getTimezoneAbbreviation(code)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 group-hover:text-gray-300">
                          {timezone.fullName}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className={`flex items-center gap-1 ${isSelected ? 'text-purple-200' : 'text-gray-300'}`}>
                        <FiClock className="text-xs" />
                        <span className="font-mono text-sm">{currentTime}</span>
                      </div>
                      <span className="text-xs text-gray-500">{timezone.offset}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-purple-500/20 bg-gradient-to-r from-purple-600/5 to-pink-600/5">
            <p className="text-xs text-gray-400 text-center">
              Times are automatically adjusted for daylight saving
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
