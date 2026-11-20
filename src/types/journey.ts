export enum ExpenseCategory {
  FOOD = '餐飲',
  TRANSPORT = '交通',
  SHOPPING = '購物',
  ATTRACTION = '景點',
  ACCOMMODATION = '住宿',
  OTHER = '其他',
}

export interface TimelineEntry {
  phase: string;
  title: string;
  detail: string;
}

export interface SpotItem {
  id: string;
  name: string;
  englishName: string;
  category: '海洋生態' | '原民文化' | '永續產業' | '陸域生態' | '交流據點';
  dateLabel: string;
  dayIndex: number;
  sdgs: string[];
  summary: string;
  details: string;
  image: string;
  mapQuery: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  shortDate: string;
  weekday: string;
  title: string;
  theme?: string;
  summary: string;
  activities: string[];
  timeline: TimelineEntry[];
  sdgs: string[];
  spotIds: string[];
  image: string;
  mapQuery: string;
  locationName: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: string;
  image: string;
  relatedDays: number[];
  relatedSdg: string;
}

export interface SDGItem {
  number: number;
  code: string;
  title: string;
  englishTitle: string;
  color: string;
  summary: string;
  detailedExplanation: string;
  palauActions: string[];
  relatedDays: number[];
  image: string;
}

export interface ChecklistItemData {
  id: string;
  label: string;
  note?: string;
}

export interface ChecklistCategoryData {
  id: string;
  title: string;
  description: string;
  items: ChecklistItemData[];
}

export interface GalleryPhoto {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  date?: string;
  isUserUploaded?: boolean;
  createdAt?: number;
}

export interface ExpenseRecord {
  id: string;
  name: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  note: string;
  createdAt: number;
}
