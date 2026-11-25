/**
 * Utility functions for date and time manipulation and formatting
 */

export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getOffsetDateString = (offsetDays) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateString) => {
  if (!dateString) return 'No due date';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTimeDisplay = (timeString) => {
  if (!timeString) return '';
  const parts = timeString.split(':');
  if (parts.length < 2) return timeString;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  return `${hours}:${minutes} ${ampm}`;
};

export const splitTimeTo12Hour = (time24) => {
  if (!time24) return { hour: '09', minute: '00', period: 'AM', hasTime: false };
  const parts = time24.split(':');
  if (parts.length < 2) return { hour: '09', minute: '00', period: 'AM', hasTime: false };
  let h = parseInt(parts[0], 10);
  const m = parts[1].slice(0, 2);
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  const hourStr = String(h).padStart(2, '0');
  return { hour: hourStr, minute: m, period, hasTime: true };
};

export const joinTimeTo24Hour = (hour, minute, period) => {
  let h = parseInt(hour, 10);
  if (isNaN(h)) h = 9;
  if (period === 'PM' && h < 12) {
    h += 12;
  } else if (period === 'AM' && h === 12) {
    h = 0;
  }
  const hourStr = String(h).padStart(2, '0');
  const minStr = String(minute).padStart(2, '0');
  return `${hourStr}:${minStr}`;
};

export const getDateStatus = (dueDateString, isCompleted, dueTimeString) => {
  const formattedTime = formatTimeDisplay(dueTimeString);
  const timeSuffix = formattedTime ? ` • ${formattedTime}` : '';

  if (!dueDateString || isCompleted) {
    return { 
      status: 'normal', 
      label: dueDateString ? `${formatDateDisplay(dueDateString)}${timeSuffix}` : 'No due date' 
    };
  }

  const todayStr = getTodayDateString();
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;
  
  if (dueDateString < todayStr) {
    return { 
      status: 'overdue', 
      label: `Overdue (${formatDateDisplay(dueDateString)}${timeSuffix})`,
      badgeClass: 'bg-danger-subtle text-danger border-danger-subtle'
    };
  } else if (dueDateString === todayStr) {
    // If due today, check whether the time has already passed
    if (dueTimeString && dueTimeString < currentTimeStr) {
      return {
        status: 'overdue',
        label: `Overdue (Today${timeSuffix})`,
        badgeClass: 'bg-danger-subtle text-danger border-danger-subtle'
      };
    }
    return { 
      status: 'today', 
      label: `Due Today${timeSuffix}`,
      badgeClass: 'bg-warning-subtle text-warning-emphasis border-warning-subtle'
    };
  } else if (dueDateString === getOffsetDateString(1)) {
    return { 
      status: 'tomorrow', 
      label: `Due Tomorrow${timeSuffix}`,
      badgeClass: 'bg-info-subtle text-info-emphasis border-info-subtle'
    };
  }

  return { 
    status: 'upcoming', 
    label: `${formatDateDisplay(dueDateString)}${timeSuffix}`,
    badgeClass: 'bg-light text-secondary border'
  };
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getFormattedCurrentDate = () => {
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
};
