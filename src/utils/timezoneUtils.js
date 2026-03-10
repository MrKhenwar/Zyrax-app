// Timezone utilities for Zyrax Wrapper App

export const TIMEZONES = {
  IST: {
    name: 'IST',
    fullName: 'India Standard Time',
    offset: 'UTC+5:30',
    flag: '🇮🇳',
    tzIdentifier: 'Asia/Kolkata'
  },
  PST: {
    name: 'PST',
    fullName: 'Pacific Standard Time',
    offset: 'UTC-8:00',
    flag: '🇺🇸',
    tzIdentifier: 'America/Los_Angeles'
  },
  EST: {
    name: 'EST',
    fullName: 'Eastern Standard Time',
    offset: 'UTC-5:00',
    flag: '🇺🇸',
    tzIdentifier: 'America/New_York'
  },
  GMT: {
    name: 'GMT',
    fullName: 'Greenwich Mean Time',
    offset: 'UTC+0:00',
    flag: '🇬🇧',
    tzIdentifier: 'Europe/London'
  },
  AEST: {
    name: 'AEST',
    fullName: 'Australian Eastern Standard Time',
    offset: 'UTC+10:00',
    flag: '🇦🇺',
    tzIdentifier: 'Australia/Sydney'
  },
  JST: {
    name: 'JST',
    fullName: 'Japan Standard Time',
    offset: 'UTC+9:00',
    flag: '🇯🇵',
    tzIdentifier: 'Asia/Tokyo'
  },
  CST: {
    name: 'CST',
    fullName: 'China Standard Time',
    offset: 'UTC+8:00',
    flag: '🇨🇳',
    tzIdentifier: 'Asia/Shanghai'
  },
  GST: {
    name: 'GST',
    fullName: 'Gulf Standard Time',
    offset: 'UTC+4:00',
    flag: '🇦🇪',
    tzIdentifier: 'Asia/Dubai'
  }
};

// Get preferred timezone from localStorage
export const getPreferredTimezone = () => {
  const saved = localStorage.getItem('preferredTimezone');
  return saved && TIMEZONES[saved] ? saved : 'IST';
};

// Save preferred timezone to localStorage
export const setPreferredTimezone = (timezone) => {
  if (TIMEZONES[timezone]) {
    localStorage.setItem('preferredTimezone', timezone);
  }
};

// Get timezone abbreviation
export const getTimezoneAbbreviation = (timezone) => {
  return TIMEZONES[timezone]?.name || 'IST';
};

// Convert IST time string (HH:MM) to another timezone
export const convertTimeToTimezone = (istTimeString, targetTimezone) => {
  if (!istTimeString || !TIMEZONES[targetTimezone]) {
    return istTimeString;
  }

  try {
    // Create a date object for today in IST with the given time
    const [hours, minutes] = istTimeString.split(':').map(Number);

    // Create date in IST timezone
    const istDate = new Date();
    istDate.setHours(hours, minutes, 0, 0);

    // Format in target timezone
    const targetTz = TIMEZONES[targetTimezone].tzIdentifier;
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: targetTz
    };

    return new Intl.DateTimeFormat('en-US', options).format(istDate);
  } catch (error) {
    console.error('Error converting time:', error);
    return istTimeString;
  }
};

// Format time with AM/PM
export const formatTimeWithTimezone = (istTimeString, timezone, use24Hour = false) => {
  const convertedTime = convertTimeToTimezone(istTimeString, timezone);

  if (!convertedTime || use24Hour) {
    return convertedTime;
  }

  // Convert to 12-hour format with AM/PM
  const [hours, minutes] = convertedTime.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Calculate end time with timezone
export const calculateEndTimeWithTimezone = (startTime, durationMinutes, timezone) => {
  if (!startTime || !durationMinutes) return '';

  try {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    const endTimeString = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

    return formatTimeWithTimezone(endTimeString, timezone);
  } catch (error) {
    console.error('Error calculating end time:', error);
    return '';
  }
};

// Format time range with timezone
export const formatTimeRangeWithTimezone = (startTime, duration, timezone) => {
  const formattedStart = formatTimeWithTimezone(startTime, timezone);
  const formattedEnd = calculateEndTimeWithTimezone(startTime, duration, timezone);
  return `${formattedStart} - ${formattedEnd}`;
};

// Get current time in a specific timezone
export const getCurrentTimeInTimezone = (timezone) => {
  if (!TIMEZONES[timezone]) return '00:00';

  try {
    const targetTz = TIMEZONES[timezone].tzIdentifier;
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: targetTz
    };

    return new Intl.DateTimeFormat('en-US', options).format(new Date());
  } catch (error) {
    console.error('Error getting current time:', error);
    return '00:00';
  }
};
