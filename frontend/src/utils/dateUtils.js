/**
 * Date utility functions to replace date-fns
 */

/**
 * Format a date to YYYY-MM-DD format for input fields
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
export const formatDateForInput = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Format a date for display (DD MMM YYYY)
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
export const formatDate = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  
  const options = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  };
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Check if a date is valid
 * @param {Date} date - The date to check
 * @returns {boolean} Whether the date is valid
 */
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Compare if date1 is after date2
 * @param {Date} date1 - The first date
 * @param {Date} date2 - The second date
 * @returns {boolean} Whether date1 is after date2
 */
export const isAfterDate = (date1, date2) => {
  if (!isValidDate(date1) || !isValidDate(date2)) return false;
  return date1.getTime() > date2.getTime();
};

/**
 * Compare if date1 is before date2
 * @param {Date} date1 - The first date
 * @param {Date} date2 - The second date
 * @returns {boolean} Whether date1 is before date2
 */
export const isBeforeDate = (date1, date2) => {
  if (!isValidDate(date1) || !isValidDate(date2)) return false;
  return date1.getTime() < date2.getTime();
};

/**
 * Get the start of day for a date
 * @param {Date} date - The date
 * @returns {Date} The date set to the start of the day
 */
export const startOfDay = (date) => {
  if (!isValidDate(date)) return new Date();
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Check if a date is in the past
 * @param {Date} date - The date to check
 * @returns {boolean} Whether the date is in the past
 */
export const isPastDate = (date) => {
  if (!isValidDate(date)) return false;
  const today = startOfDay(new Date());
  return isBeforeDate(date, today);
};

/**
 * Check if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} Whether the date is today
 */
export const isTodayDate = (date) => {
  if (!isValidDate(date)) return false;
  const today = startOfDay(new Date());
  date = startOfDay(date);
  return date.getTime() === today.getTime();
};

/**
 * Get a human-readable relative time string (e.g., "2 days ago", "just now")
 * @param {string|Date} dateInput - The date to format
 * @returns {string} The relative time string
 */
export const getRelativeTime = (dateInput) => {
  if (!dateInput) return '';
  
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (!isValidDate(date)) return '';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  // Minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Days
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  // Weeks
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  // Months
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  // Years
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
}; 