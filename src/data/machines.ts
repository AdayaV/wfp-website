export interface MachineSpecification { label: string; value: string; }
interface MicroCMSImage { url?: string; width?: number; height?: number; }
export interface MicroCMSMachineEntry {
  id: string;
  year: number;
  name?: string;
  image?: MicroCMSImage | null;
  imageAlt?: string;
  description?: string;
  specifications?: string | MachineSpecification[];
  awards?: string | string[];
  competitionResult?: string;
  sortOrder?: number;
}
interface MicroCMSListResponse { contents: MicroCMSMachineEntry[]; totalCount: number; }

export interface Machine {
  id: string;
  year: number;
  name: string;
  image?: string;
  imageAlt?: string;
  width?: number;
  height?: number;
  description?: string;
  specifications: MachineSpecification[];
  awards: string[];
  competitionResult?: string;
}

// Text areas: one specification/award per line. Empty values stay empty.
export function normalizeMachine(entry: MicroCMSMachineEntry): Machine | null {
  const year = Number(entry.year);
  if (!Number.isInteger(year) || year < 1900 || year > 2199 || !entry.id) return null;
  const specifications = typeof entry.specifications === 'string'
    ? entry.specifications.split(/\r?\n/).flatMap(line => {
        const separator = line.search(/[：:]/);
        if (separator < 0) return [];
        const label = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim();
        return label && value ? [{ label, value }] : [];
      })
    : (entry.specifications ?? []).filter(item => item?.label?.trim() && item?.value?.trim())
      .map(item => ({ label: item.label.trim(), value: item.value.trim() }));
  const awards = (typeof entry.awards === 'string' ? entry.awards.split(/\r?\n/) : entry.awards ?? [])
    .map(award => award.trim()).filter(Boolean);
  const storedName = entry.name?.trim();
  // Older entries only contained a year; retain genuine historical exceptions.
  const name = !storedName || /^\d{4}$/.test(storedName) ? `WFP${year}` : storedName;
  const image = entry.image?.url?.trim();
  return {
    id: entry.id, year, name,
    ...(image ? { image, width: entry.image?.width, height: entry.image?.height } : {}),
    imageAlt: entry.imageAlt?.trim() || `${name}の車両写真`,
    description: entry.description?.trim() || undefined,
    specifications, awards,
    competitionResult: entry.competitionResult?.trim() || undefined,
  };
}

export async function getMachines(): Promise<Machine[]> {
  const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = import.meta.env.MICROCMS_API_KEY;
  const endpoint = import.meta.env.MICROCMS_MACHINES_ENDPOINT || 'machines';
  if (!serviceDomain || !apiKey) return [];
  const entries: MicroCMSMachineEntry[] = [];
  let totalCount = Infinity;
  while (entries.length < totalCount) {
    const url = new URL(`https://${serviceDomain}.microcms.io/api/v1/${endpoint}`);
    url.searchParams.set('limit', '100');
    url.searchParams.set('offset', String(entries.length));
    url.searchParams.set('orders', '-year,sortOrder');
    const response = await fetch(url, { headers: { 'X-MICROCMS-API-KEY': apiKey } });
    if (!response.ok) throw new Error(`microCMS machines request failed: ${response.status} ${response.statusText}`);
    const data = await response.json() as MicroCMSListResponse;
    if (!Array.isArray(data.contents)) throw new Error('microCMS machines response has no content list');
    entries.push(...data.contents);
    totalCount = data.totalCount ?? entries.length;
    if (!data.contents.length) break;
  }
  return entries.map(normalizeMachine).filter((machine): machine is Machine => machine !== null);
}
