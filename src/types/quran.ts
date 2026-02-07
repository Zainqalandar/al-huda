export interface SurahAudioOption {
  reciter?: string;
  url?: string;
  originalUrl?: string;
}

export interface SurahListItem {
  id: number;
  surahName: string;
  surahNameArabic: string;
  surahNameArabicLong?: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
  surahNo: number;
  audio?: Record<string, SurahAudioOption>;
}

export interface SurahAyah {
  number: number;
  numberInSurah: number;
  text: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: SurahAyah[];
}

export interface SurahMeta {
  surahName: string;
  surahNameArabic: string;
  surahNameArabicLong?: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
  surahNo: number;
  english?: string[];
  arabic1?: string[];
  audio?: Record<string, SurahAudioOption>;
}

export interface AyahBookmark {
  id: string;
  surahId: number;
  ayahNumber: number;
  text: string;
  createdAt: string;
}

export interface LastReadEntry {
  surahId: number;
  ayahNumber: number;
  updatedAt: string;
}

export type SurahSortBy = 'id' | 'surahName' | 'totalAyah';
export type SortOrder = 'asc' | 'desc';
