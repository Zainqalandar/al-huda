/**
 * MongoDB Collection Schemas for Vector Search
 * These are the expected document structures
 */

/**
 * Collection: quran_surahs
 * Purpose: Stores Surah data with embeddings for semantic search
 */
export interface QuranSurahDocument {
  id: number; // 1-114
  surahName: string; // "Al-Faatiha"
  surahNameArabic: string; // "الفاتحة"
  surahNameArabicLong: string; // "سُورَةُ ٱلْفَاتِحَةِ"
  surahNameTranslation: string; // "The Opening"
  revelationPlace: 'Mecca' | 'Madina';
  totalAyah: number;
  embedding: number[]; // 1536-dimensional vector from OpenAI
  content?: string; // Text content for reference
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Collection: quran_ayahs
 * Purpose: Stores individual Ayahs with embeddings for semantic search
 */
export interface QuranAyahDocument {
  surahId: number; // 1-114
  ayahNumber: number; // 1 to totalAyah of that Surah
  arabicText: string;
  urduTranslation?: string;
  engTranslation?: string;
  tafseer?: string; // Optional Tafseer/interpretation
  embedding: number[]; // 1536-dimensional vector
  keywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Collection: quran_qa_cache
 * Purpose: Caches AI-generated answers to common questions
 */
export interface QuranQACacheDocument {
  question: string;
  answer: string;
  relatedAyahs: Array<{
    surahId: number;
    ayahNumber: number;
    ayahText: string;
  }>;
  embedding: number[]; // Vector of the question
  confidence?: number;
  views?: number; // Track popular questions
  createdAt: Date;
  ttl?: Date; // TTL index for auto-deletion (optional)
}

/**
 * MongoDB Vector Search Index Configuration
 * Run this in MongoDB Compass or Atlas UI
 */

/**
 * For collection: quran_surahs
 * Index name: vector_search_surahs
 */
export const VectorSearchSurahsIndex = {
  fields: [
    {
      type: 'vector',
      path: 'embedding',
      similarity: 'cosine',
      dimensions: 1536,
    },
    {
      type: 'filter',
      path: 'id',
    },
  ],
};

/**
 * For collection: quran_ayahs
 * Index name: vector_search_ayahs
 */
export const VectorSearchAyahsIndex = {
  fields: [
    {
      type: 'vector',
      path: 'embedding',
      similarity: 'cosine',
      dimensions: 1536,
    },
    {
      type: 'filter',
      path: 'surahId',
    },
    {
      type: 'filter',
      path: 'ayahNumber',
    },
  ],
};

/**
 * For collection: quran_qa_cache
 * Index name: vector_search_qa
 */
export const VectorSearchQAIndex = {
  fields: [
    {
      type: 'vector',
      path: 'embedding',
      similarity: 'cosine',
      dimensions: 1536,
    },
  ],
};
