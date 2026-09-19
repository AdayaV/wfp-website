export type SponsorTierId = 'platinum' | 'gold' | 'silver';

export interface Sponsor {
  id?: string;
  name: string;
  logo?: string;
  logoAlt?: string;
  website?: string;
  websites?: { name: string; url: string }[];
  displayOrder?: number;
}

export interface SponsorTier {
  id: SponsorTierId;
  label: string;
  labelEn: string;
  sponsors: Sponsor[];
}

interface MicroCMSSponsorEntry {
  id: string;
  name: string;
  tier: string | string[];
  logo?: { url: string; width: number; height: number };
  logoAlt?: string;
  website?: string;
  displayOrder?: number;
}

interface MicroCMSListResponse {
  contents: MicroCMSSponsorEntry[];
}

// Verified official sites. CMS URLs remain authoritative when supplied.
const silverWebsites: Record<string, string> = {
  '鷺宮製作所': 'https://www.saginomiya.co.jp/',
  'アネブル': 'https://www.enable-os.co.jp/',
  'デュポン・スタイロ': 'https://www.dupontstyro.co.jp/',
  'オーゼットジャパン': 'https://www.ozracing.com/jp/',
  'ミネベアミツミ': 'https://www.minebeamitsumi.com/',
  '協永産業': 'https://www.kyoei-ind.co.jp/',
  'ipgautomotive': 'https://www.ipg-automotive.com/jp/',
  'ディクセル': 'https://www.dixcel.co.jp/',
  '協和工業': 'https://www.kyowa-uj.com/',
  'ネクト・プロ・レーシング': 'https://e-necto.com/',
  '新栄': 'https://shinei-p.co.jp/',
  'イグス': 'https://www.igus.co.jp/',
  'エステック': 'https://s-tec.kanagawa.jp/',
  '石原ラジエーター工業所': 'https://ishihara-radiator.com/',
  'プロト': 'https://www.plotonline.com/',
  'キノクニエンタープライズ': 'https://www.kinokuni-e.com/',
  '七福金属': 'https://www.shichifuku.com/',
  '住友電装': 'https://www.sws.co.jp/',
  'shoraijapan': 'https://shoraipower.jp/',
  '三研工業': 'https://sanken-mo.co.jp/',
  'エフ・シー・シー': 'https://www.fcc-net.co.jp/',
  'rushfactory': 'https://rushfactory.jp/',
  'ハイレックスコーポレーション': 'https://www.hi-lex.co.jp/',
  'totohouse': 'https://toto-house.jp/',
  '小野測器': 'https://www.onosokki.com/',
  'モトリティ': 'https://motolity.com/',
  'スパルジャパン': 'https://www.spalautomotive.com/',
};

function normalizeSponsorName(name: string): string {
  return name.normalize('NFKC').replace(/株式会社|有限会社|\s/g, '').toLowerCase();
}

// Official company logos; keep each partner in its own grid cell.
const individualPartners: Sponsor[] = [
  { name: '株式会社JHI', website: 'https://www.jhi.co.jp/', logo: 'https://www.jhi.co.jp/assets/img/common/logo.png' },
  { name: '富士加飾株式会社', website: 'https://fuji-d.jp/', logo: 'https://fuji-d.jp/wp/wp-content/uploads/2019/08/logo.png' },
  { name: '三菱ガス化学株式会社', website: 'https://www.mgc.co.jp/', logo: 'https://www.mgc.co.jp/shared/img/hdr-logo.svg' },
];

export function withSponsorWebsite(sponsor: Sponsor): Sponsor {
  const key = normalizeSponsorName(sponsor.name);
  const partner = individualPartners.find((item) => normalizeSponsorName(item.name) === key);
  if (partner) {
    return { ...sponsor, logo: sponsor.logo || partner.logo, website: sponsor.website?.trim() || partner.website };
  }
  if (sponsor.website?.trim()) return sponsor;
  return { ...sponsor, website: silverWebsites[key] };
}

export function expandJointSponsors(sponsors: Sponsor[]): Sponsor[] {
  const existingNames = new Set(sponsors.map((sponsor) => normalizeSponsorName(sponsor.name)));
  return sponsors.flatMap((sponsor) => {
    if (normalizeSponsorName(sponsor.name) !== 'jhi/富士加飾/三菱ガス化学') {
      return [withSponsorWebsite(sponsor)];
    }
    // Support the legacy CMS record without duplicating future individual records.
    return individualPartners
      .filter((partner) => !existingNames.has(normalizeSponsorName(partner.name)))
      .map((partner) => ({ ...partner, id: `${sponsor.id || 'partner'}-${normalizeSponsorName(partner.name)}`, displayOrder: sponsor.displayOrder }));
  });
}

export const sponsorTiers: SponsorTier[] = [
  {
    id: 'platinum',
    label: 'プラチナスポンサー',
    labelEn: 'PLATINUM PARTNERS',
    sponsors: [
      '株式会社 小松製作所(コマツ)',
      '関根運送',
      '機友会',
      '株式会社 重松製作所',
      'ダッソー・システムズ株式会社SORIDWORKS 事業',
      '沖エンジニアリング株式会社',
      '株式会社 亨通国際開発',
      '株式会社 葵製作所',
      '株式会社木村鋳造所',
      'カヤバ株式会社',
      'タマチ工業株式会社',
      'SPK株式会社',
      '株式会社ブリッツ',
      '畑野自動車',
      '有限会社ヤマダ',
      'スズキ株式会社',
      '所沢軽合金株式会社',
      '株式会社三五',
      '有限会社馬場製作所',
      '株式会社スリーボンド',
    ].map((name) => ({ name })),
  },
  {
    id: 'gold',
    label: 'ゴールドスポンサー',
    labelEn: 'GOLD PARTNERS',
    sponsors: [
      '株式会社サイマコーポレーション',
      'クイック羽生',
      'ブリーズブロンズ',
      '株式会社ジーテクト',
      '日本ドライケミカル株式会社',
      'SimScale',
      '三菱ガス化学ネクスト株式会社',
      '米島フエルト産業株式会社',
      '株式会社イケヤフォーミュラ',
      '株式会社LINK JAPAN',
      'MOTUL Japan株式会社',
      '株式会社ソリノ',
    ].map((name) => ({ name })),
  },
  {
    id: 'silver',
    label: 'シルバースポンサー',
    labelEn: 'SILVER PARTNERS',
    sponsors: [
      '株式会社鷺宮製作所',
      'アネブル',
      'デュポン・スタイロ株式会社',
      '株式会社JHI',
      '富士加飾株式会社',
      '三菱ガス化学株式会社',
      'オーゼットジャパン株式会社',
      'ミネベアミツミ株式会社',
      '協永産業株式会社',
      'IPG Automotive株式会社',
      '株式会社ディクセル',
      '協和工業株式会社',
      'ネクト・プロ・レーシング',
      '新栄',
      'イグス株式会社',
      '株式会社 エステック',
      '石原ラジエーター工業所',
      '株式会社プロト',
      '株式会社キノクニエンタープライズ',
      '七福金属株式会社',
      '住友電装株式会社',
      'SHORAI JAPAN',
      '三研工業株式会社',
      '株式会社エフ・シー・シー',
      '株式会社Rush Factory',
      '株式会社ハイレックスコーポレーション',
      'totohouse',
      '株式会社小野測器',
      '株式会社モトリティ',
      'スパルジャパン株式会社',
    ].map((name) => withSponsorWebsite({ name })),
  },
];

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;
const sponsorsEndpoint = import.meta.env.MICROCMS_SPONSORS_ENDPOINT || 'sponsors';

function normalizeTier(value: MicroCMSSponsorEntry['tier']): SponsorTierId {
  const raw = (Array.isArray(value) ? value[0] : value || 'silver').toLowerCase();
  return raw === 'platinum' || raw === 'gold' ? raw : 'silver';
}

export async function getSponsorTiers(): Promise<SponsorTier[]> {
  if (!serviceDomain || !apiKey) return sponsorTiers;

  try {
    const url = new URL('https://' + serviceDomain + '.microcms.io/api/v1/' + sponsorsEndpoint);
    url.searchParams.set('limit', '100');
    url.searchParams.set('orders', 'displayOrder');

    const response = await fetch(url, { headers: { 'X-MICROCMS-API-KEY': apiKey } });
    if (!response.ok) throw new Error(String(response.status));

    const data = await response.json() as MicroCMSListResponse;
    if (!data.contents.length) return sponsorTiers;

    return sponsorTiers.map((tier) => ({
      ...tier,
      sponsors: expandJointSponsors(data.contents
        .filter((entry) => normalizeTier(entry.tier) === tier.id)
        .map((entry) => withSponsorWebsite({
          id: entry.id,
          name: entry.name,
          logo: entry.logo?.url,
          logoAlt: entry.logoAlt || entry.name,
          website: entry.website,
          displayOrder: entry.displayOrder,
        }))),
    }));
  } catch (error) {
    console.warn('microCMS sponsors request failed. Static sponsors will be used.', error);
    return sponsorTiers;
  }
}

