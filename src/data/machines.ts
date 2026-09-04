interface MicroCMSImage { url: string; width: number; height: number; }
interface MicroCMSMachineEntry { id: string; year: number; image: MicroCMSImage; sortOrder: number; }
interface MicroCMSListResponse { contents: MicroCMSMachineEntry[]; }

export interface Machine { id: string; year: number; image: string; width: number; height: number; }

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;
const endpoint = import.meta.env.MICROCMS_MACHINES_ENDPOINT || 'machines';

export async function getMachines(): Promise<Machine[]> {
  if (!serviceDomain || !apiKey) return [];
  const url = new URL(`https://${serviceDomain}.microcms.io/api/v1/${endpoint}`);
  url.searchParams.set('limit', '100');
  url.searchParams.set('orders', '-year,sortOrder');
  const response = await fetch(url, { headers: { 'X-MICROCMS-API-KEY': apiKey } });
  if (!response.ok) throw new Error(`microCMS machines request failed: ${response.status} ${response.statusText}`);
  const data = await response.json() as MicroCMSListResponse;
  return data.contents.map(({ id, year, image }) => ({ id, year, image: image.url, width: image.width, height: image.height }));
}
