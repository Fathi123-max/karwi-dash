/**
 * Utility functions for working with date-specific branch hours
 */

/**
 * Get the date range for the next 2 weeks
 * @returns Object with startDate and endDate
 */
export const getNextTwoWeeksRange = (): { startDate: Date; endDate: Date } => {
  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 13); // 14 days = 2 weeks (0-indexed)
  return { startDate, endDate };
};

/**
 * Check if a date falls within the next 2 weeks
 * @param date The date to check
 * @returns boolean
 */
export const isDateInNextTwoWeeks = (date: Date): boolean => {
  const { startDate, endDate } = getNextTwoWeeksRange();
  return date >= startDate && date <= endDate;
};

/**
 * Get the date for a specific day of the week relative to today
 * @param dayOfWeek 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 * @param weekOffset 0 for current week, 1 for next week
 * @returns Date
 */
export const getDateForDayOfWeek = (dayOfWeek: number, weekOffset: number = 0): Date => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate days to add to get to the target day of week
  let daysToAdd = dayOfWeek - currentDay;

  // If target day has already passed this week, move to next week
  if (daysToAdd < 0) {
    daysToAdd += 7;
  }

  // Add week offset
  daysToAdd += weekOffset * 7;

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysToAdd);
  return targetDate;
};

/**
 * Format a date as YYYY-MM-DD string
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};
