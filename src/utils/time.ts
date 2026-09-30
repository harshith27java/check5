export interface ElapsedTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  formattedDays: string;
  formattedHours: string;
  formattedMinutes: string;
  formattedSeconds: string;
  isNegative: boolean;
}

/**
 * Calculates live elapsed time since the meeting date.
 * If meetingDate is in the past, returns elapsed time.
 * If meetingDate is in the future, returns countdown or zeroes gracefully.
 */
export function calculateElapsedTime(meetingDateIso: string, targetDate: Date = new Date()): ElapsedTime {
  const meetingTime = new Date(meetingDateIso).getTime();
  const currentTime = targetDate.getTime();
  const diffMs = currentTime - meetingTime;

  const isNegative = diffMs < 0;
  const absDiffSec = Math.floor(Math.abs(diffMs) / 1000);

  const days = Math.floor(absDiffSec / 86400);
  const hours = Math.floor((absDiffSec % 86400) / 3600);
  const minutes = Math.floor((absDiffSec % 3600) / 60);
  const seconds = absDiffSec % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds: absDiffSec,
    formattedDays: String(days).padStart(3, '0'),
    formattedHours: String(hours).padStart(2, '0'),
    formattedMinutes: String(minutes).padStart(2, '0'),
    formattedSeconds: String(seconds).padStart(2, '0'),
    isNegative,
  };
}

/**
 * Checks if current time is within the special HH:43 minute (e.g. 12:43:00 to 12:43:59).
 */
export function isMinute43(date: Date = new Date()): boolean {
  return date.getMinutes() === 43;
}

/**
 * Returns a unique key for the current hour-43 window (e.g. "2026-09-29-21-43")
 * so an event triggers exactly once per hour.
 */
export function getMinute43Key(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const h = date.getHours();
  return `${y}-${m}-${d}-${h}-43`;
}
