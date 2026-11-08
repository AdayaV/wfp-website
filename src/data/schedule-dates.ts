const dayMs = 24 * 60 * 60 * 1000;
const jstOffsetMs = 9 * 60 * 60 * 1000;

// Shift into JST before rounding to the next local midnight.
export function endOfScheduleDay(iso: string): number {
  const jstDay = Math.floor((Date.parse(iso) + jstOffsetMs) / dayMs);
  return (jstDay + 1) * dayMs - jstOffsetMs;
}

// End times follow the schedule's start-date order, including overlapping events.
export function nextScheduleIndex(endTimes: number[], now: number): number {
  return endTimes.findIndex(end => now < end);
}
