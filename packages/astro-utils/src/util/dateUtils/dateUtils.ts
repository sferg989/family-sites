/**
 * Formats a date string for display on soccer game pages.
 * Returns a localized date string with weekday, month, day, and year.
 *
 * @param dateString - ISO date string to format
 * @returns Formatted date string (e.g., "Saturday, March 15, 2026")
 */
export function formatGameDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
