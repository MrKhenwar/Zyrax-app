import { useState, useEffect } from 'react';
import { getPreferredTimezone, setPreferredTimezone as saveTimezone } from '../utils/timezoneUtils';

const useTimezone = () => {
  const [selectedTimezone, setSelectedTimezone] = useState(getPreferredTimezone());

  const changeTimezone = (timezone) => {
    setSelectedTimezone(timezone);
    saveTimezone(timezone);
  };

  useEffect(() => {
    // Load preferred timezone on mount
    const preferred = getPreferredTimezone();
    if (preferred !== selectedTimezone) {
      setSelectedTimezone(preferred);
    }
  }, []);

  return {
    selectedTimezone,
    changeTimezone
  };
};

export default useTimezone;
