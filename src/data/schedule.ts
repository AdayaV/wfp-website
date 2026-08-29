export interface ScheduleItem {
  date: string;
  title: string;
  phase: 'DEVELOPMENT' | 'TEST' | 'EVENT';
  image?: string;
  isNext?: boolean;
}

// 日程が確定した項目だけを追加します。
export const scheduleItems: ScheduleItem[] = [];
