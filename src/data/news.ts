import { getCollection, type CollectionEntry } from 'astro:content';

export type NewsCategory = 'EVENT' | 'DEVELOPMENT' | 'TEAM' | 'SPONSOR';

export interface NewsArticle {
  id: string;
  title: string;
  publishedAt: string;
  publishedAtIso: string;
  category: NewsCategory;
  summary: string;
  href: string;
  image?: string;
  imageAlt: string;
}

const base = import.meta.env.BASE_URL;

export function newsAssetPath(path?: string) {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path) || path.startsWith(base)) return path;
  return base + path.replace(/^\//, '');
}

export function toNewsArticle(entry: CollectionEntry<'news'>): NewsArticle {
  return {
    id: entry.id,
    title: entry.data.title,
    publishedAt: entry.data.publishedAt.toISOString().slice(0, 10).replaceAll('-', '.'),
    publishedAtIso: entry.data.publishedAt.toISOString().slice(0, 10),
    category: entry.data.category,
    summary: entry.data.summary,
    href: base + 'news/' + entry.id + '/',
    image: newsAssetPath(entry.data.image),
    imageAlt: entry.data.imageAlt,
  };
}

export async function getNewsEntries() {
  const entries = await getCollection('news', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export async function getNewsArticles() {
  return (await getNewsEntries()).map(toNewsArticle);
}
export type NewsCategory = 'EVENT' | 'DEVELOPMENT' | 'TEAM' | 'SPONSOR';

export interface MicroCMSImage {
  url: string;
  width: number;
  height: number;
}

export interface MicroCMSNewsEntry {
  id: string;
  title: string;
  category: NewsCategory;
  summary: string;
  body: string;
  image?: MicroCMSImage;
  imageAlt?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  revisedAt: string;
}

interface MicroCMSListResponse {
  contents: MicroCMSNewsEntry[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  publishedAt: string;
  publishedAtIso: string;
  category: NewsCategory;
  summary: string;
  href: string;
  image?: string;
  imageAlt: string;
}

const base = import.meta.env.BASE_URL;
const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;
const newsEndpoint = import.meta.env.MICROCMS_NEWS_ENDPOINT || 'news';

export function toNewsArticle(entry: MicroCMSNewsEntry): NewsArticle {
  const publishedAtIso = entry.publishedAt.slice(0, 10);
  return {
    id: entry.id,
    title: entry.title,
    publishedAt: publishedAtIso.replaceAll('-', '.'),
    publishedAtIso,
    category: entry.category,
    summary: entry.summary,
    href: base + 'news/' + entry.id + '/',
    image: entry.image?.url,
    imageAlt: entry.imageAlt || '',
  };
}

export async function getNewsEntries(): Promise<MicroCMSNewsEntry[]> {
  if (!serviceDomain || !apiKey) {
    console.warn('microCMS is not configured. News pages will be built without articles.');
    return [];
  }

  const url = new URL('https://' + serviceDomain + '.microcms.io/api/v1/' + newsEndpoint);
  url.searchParams.set('limit', '100');
  url.searchParams.set('orders', '-publishedAt');

  const response = await fetch(url, {
    headers: {
      'X-MICROCMS-API-KEY': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error('microCMS news request failed: ' + response.status + ' ' + response.statusText);
  }

  const data = await response.json() as MicroCMSListResponse;
  return data.contents;
}

export async function getNewsArticles() {
  return (await getNewsEntries()).map(toNewsArticle);
}
export type NewsCategory = 'EVENT' | 'DEVELOPMENT' | 'TEAM' | 'SPONSOR';

export interface MicroCMSImage {
  url: string;
  width: number;
  height: number;
}

export interface MicroCMSNewsEntry {
  id: string;
  title: string;
  category: NewsCategory;
  summary: string;
  body: string;
  image?: MicroCMSImage;
  imageAlt?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  revisedAt: string;
}

interface MicroCMSListResponse {
  contents: MicroCMSNewsEntry[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  publishedAt: string;
  publishedAtIso: string;
  category: NewsCategory;
  summary: string;
  href: string;
  image?: string;
  imageAlt: string;
}

// 段階的な移行中も既存ページを生成できるよう残す互換用データです。
export const newsArticles: NewsArticle[] = [];

const base = import.meta.env.BASE_URL;
const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;
const newsEndpoint = import.meta.env.MICROCMS_NEWS_ENDPOINT || 'news';

export function toNewsArticle(entry: MicroCMSNewsEntry): NewsArticle {
  const publishedAtIso = entry.publishedAt.slice(0, 10);
  return {
    id: entry.id,
    title: entry.title,
    publishedAt: publishedAtIso.replaceAll('-', '.'),
    publishedAtIso,
    category: entry.category,
    summary: entry.summary,
    href: base + 'news/' + entry.id + '/',
    image: entry.image?.url,
    imageAlt: entry.imageAlt || '',
  };
}

export async function getNewsEntries(): Promise<MicroCMSNewsEntry[]> {
  if (!serviceDomain || !apiKey) {
    console.warn('microCMS is not configured. News pages will be built without articles.');
    return [];
  }

  const url = new URL('https://' + serviceDomain + '.microcms.io/api/v1/' + newsEndpoint);
  url.searchParams.set('limit', '100');
  url.searchParams.set('orders', '-publishedAt');

  const response = await fetch(url, {
    headers: {
      'X-MICROCMS-API-KEY': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error('microCMS news request failed: ' + response.status + ' ' + response.statusText);
  }

  const data = await response.json() as MicroCMSListResponse;
  return data.contents;
}

export async function getNewsArticles() {
  return (await getNewsEntries()).map(toNewsArticle);
}
