export interface NewsArticle {
  title: string;
  publishedAt: string;
  category: 'EVENT' | 'DEVELOPMENT' | 'TEAM' | 'SPONSOR';
  href: string;
  image?: string;
}

// 記事を公開すると、HOMEのメインニュースとNEWS一覧に反映されます。
export const newsArticles: NewsArticle[] = [];
