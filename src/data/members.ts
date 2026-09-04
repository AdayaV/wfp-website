export interface MicroCMSImage {
  url: string;
  width: number;
  height: number;
}

interface MicroCMSMemberEntry {
  id: string;
  name: string;
  role: string;
  division: string;
  additionalDivisions?: string[] | string;
  unit?: string[] | string;
  grade?: string;
  department?: string;
  sortOrder: number;
  photo?: MicroCMSImage;
  profile?: string;
}

interface MicroCMSListResponse {
  contents: MicroCMSMemberEntry[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  divisions: string[];
  units: string[];
  grade?: string;
  department?: string;
  sortOrder: number;
  photo?: string;
  profile?: string;
}

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;
const membersEndpoint = import.meta.env.MICROCMS_MEMBERS_ENDPOINT || 'members';

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!serviceDomain || !apiKey) {
    console.warn('microCMS is not configured. Team pages will be built without members.');
    return [];
  }

  const url = new URL('https://' + serviceDomain + '.microcms.io/api/v1/' + membersEndpoint);
  url.searchParams.set('limit', '100');
  url.searchParams.set('orders', 'sortOrder');

  const response = await fetch(url, {
    headers: { 'X-MICROCMS-API-KEY': apiKey },
  });

  if (!response.ok) {
    throw new Error('microCMS members request failed: ' + response.status + ' ' + response.statusText);
  }

  const data = await response.json() as MicroCMSListResponse;
  return data.contents.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    divisions: [
      member.division,
      ...(Array.isArray(member.additionalDivisions)
        ? member.additionalDivisions
        : member.additionalDivisions
          ? [member.additionalDivisions]
          : []),
    ].filter((division, index, all) => division && all.indexOf(division) === index),
    units: Array.isArray(member.unit) ? member.unit : member.unit ? [member.unit] : [],
    grade: member.grade,
    department: member.department,
    sortOrder: member.sortOrder,
    photo: member.photo?.url,
    profile: member.profile,
  }));
}
