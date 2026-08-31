export type SchedulePhase = 'DEVELOPMENT' | 'TEST' | 'EVENT';

export interface MicroCMSImage {
  url: string;
  width: number;
  height: number;
}

export interface MicroCMSEventEntry {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  phase: SchedulePhase | SchedulePhase[];
  location?: string;
  summary?: string;
  image?: MicroCMSImage;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  revisedAt: string;
}

interface MicroCMSListResponse {
  contents: MicroCMSEventEntry[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  phase: SchedulePhase;
  image?: string;
  location?: string;
  summary?: string;
  startDateIso: string;
  endDateIso?: string;
  isNext?: boolean;
}

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;
const eventsEndpoint = import.meta.env.MICROCMS_EVENTS_ENDPOINT || 'events';

function formatDate(value: string) {
  const parts = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(value));
  const datePart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return [datePart('year'), datePart('month'), datePart('day')].join('.');
}

function formatDateRange(startDate: string, endDate?: string) {
  if (!endDate) return formatDate(startDate);
  return formatDate(startDate) + '–' + formatDate(endDate);
}

export async function getScheduleItems(): Promise<ScheduleItem[]> {
  if (!serviceDomain || !apiKey) {
    console.warn('microCMS is not configured. Schedule pages will be built without events.');
    return [];
  }

  const url = new URL('https://' + serviceDomain + '.microcms.io/api/v1/' + eventsEndpoint);
  url.searchParams.set('limit', '100');
  url.searchParams.set('orders', 'startDate');

  const response = await fetch(url, {
    headers: {
      'X-MICROCMS-API-KEY': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error('microCMS events request failed: ' + response.status + ' ' + response.statusText);
  }

  const data = await response.json() as MicroCMSListResponse;
  const now = Date.now();
  const nextEventIndex = data.contents.findIndex((entry) => {
    const finalDate = entry.endDate || entry.startDate;
    return new Date(finalDate).getTime() >= now;
  });

  return data.contents.map((entry, index) => ({
    id: entry.id,
    date: formatDateRange(entry.startDate, entry.endDate),
    title: entry.title,
    phase: Array.isArray(entry.phase) ? (entry.phase[0] || 'EVENT') : entry.phase,
    image: entry.image?.url,
    location: entry.location,
    summary: entry.summary,
    startDateIso: entry.startDate,
    endDateIso: entry.endDate,
    isNext: index === (nextEventIndex >= 0 ? nextEventIndex : Math.max(0, data.contents.length - 1)),
  }));
}
