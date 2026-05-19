export type TimeRemainingStyle = 'live' | 'sealed';

function parseEnd(endAt: Date | string): Date {
  return endAt instanceof Date ? endAt : new Date(String(endAt));
}

export function formatTimeRemaining(
  endAt: Date | string,
  style: TimeRemainingStyle = 'sealed'
): string {
  const end = parseEnd(endAt);
  const diff = end.getTime() - Date.now();
  if (Number.isNaN(diff) || diff <= 0) return 'Ended';

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  if (style === 'live') {
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function isUrgentTimeRemaining(
  endAt: Date | string,
  thresholdMinutes = 60
): boolean {
  const end = parseEnd(endAt);
  const diff = end.getTime() - Date.now();
  return diff > 0 && diff <= thresholdMinutes * 60 * 1000;
}

export function isLiveTimeHighlight(
  endAt: Date | string,
  style: TimeRemainingStyle
): boolean {
  if (style !== 'live') return false;
  const end = parseEnd(endAt);
  const diff = end.getTime() - Date.now();
  return diff > 0;
}
