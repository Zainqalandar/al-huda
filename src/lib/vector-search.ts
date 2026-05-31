import { connectToMongoDatabase } from './db/mongodb';
import { generateEmbedding } from './embeddings';

export interface SemanticSearchResult {
  surahId: number;
  surahName: string;
  surahNameArabic?: string;
  surahNameTranslation?: string;
  similarity: number;
  relevance: 'very-high' | 'high' | 'medium';
}

export interface AyahSearchResult {
  surahId: number;
  ayahNumber: number;
  arabicText: string;
  urduTranslation?: string;
  engTranslation?: string;
  similarity: number;
}

/**
 * Feature 1: Semantic Search - Find similar Surahs by meaning
 * Usage: "Surahs about patience" → Returns Surahs with similar themes
 */
export async function searchSurahsBySemantic(
  query: string,
  limit: number = 5
): Promise<SemanticSearchResult[]> {
  try {
    const mongoose = await connectToMongoDatabase();
    const queryEmbedding = await generateEmbedding(query);

    const collection = mongoose.connection.db!.collection('quran_surahs');

    const results = await collection
      .aggregate<any>([
        {
          $search: {
            cosmosSearch: {
              vector: queryEmbedding,
              k: limit,
            },
            returnStoredSource: true,
          },
        },
        {
          $project: {
            surahId: 1,
            surahName: 1,
            surahNameArabic: 1,
            surahNameTranslation: 1,
            similarity: { $meta: 'searchScore' },
          },
        },
        {
          $limit: limit,
        },
      ])
      .toArray();

    return results.map((doc) => ({
      surahId: doc.surahId || doc.id,
      surahName: doc.surahName,
      surahNameArabic: doc.surahNameArabic,
      surahNameTranslation: doc.surahNameTranslation,
      similarity: doc.similarity || 0.7,
      relevance:
        (doc.similarity || 0.7) > 0.8
          ? 'very-high'
          : (doc.similarity || 0.7) > 0.6
            ? 'high'
            : 'medium',
    }));
  } catch (error) {
    console.error('Semantic search error:', error);
    // Fallback: return empty array instead of throwing
    return [];
  }
}

/**
 * Feature 3: Search Ayahs by meaning
 * Usage: Find ayahs semantically similar to user query
 */
export async function searchAyahsBySemantic(
  query: string,
  surahId?: number,
  limit: number = 10
): Promise<AyahSearchResult[]> {
  try {
    const mongoose = await connectToMongoDatabase();
    const queryEmbedding = await generateEmbedding(query);

    const collection = mongoose.connection.db!.collection('quran_ayahs');

    const pipeline: any[] = [
      {
        $search: {
          cosmosSearch: {
            vector: queryEmbedding,
            k: limit,
          },
          returnStoredSource: true,
        },
      },
    ];

    // Filter by surah if provided
    if (surahId) {
      pipeline.push({
        $match: { surahId },
      });
    }

    pipeline.push({
      $project: {
        surahId: 1,
        ayahNumber: 1,
        arabicText: 1,
        urduTranslation: 1,
        engTranslation: 1,
        similarity: { $meta: 'searchScore' },
      },
    });

    pipeline.push({
      $limit: limit,
    });

    const results = await collection.aggregate<any>(pipeline).toArray();

    return results.map((doc) => ({
      surahId: doc.surahId,
      ayahNumber: doc.ayahNumber,
      arabicText: doc.arabicText,
      urduTranslation: doc.urduTranslation,
      engTranslation: doc.engTranslation,
      similarity: doc.similarity || 0.7,
    }));
  } catch (error) {
    console.error('Ayah semantic search error:', error);
    return [];
  }
}

/**
 * Feature 4: Get Related Ayahs (for recommendations)
 * When viewing one ayah, show similar ones
 */
export async function getRelatedAyahs(
  surahId: number,
  ayahNumber: number,
  limit: number = 5
): Promise<AyahSearchResult[]> {
  try {
    const mongoose = await connectToMongoDatabase();
    const collection = mongoose.connection.db!.collection('quran_ayahs');

    // Get the current ayah's embedding
    const currentAyah = await collection.findOne({
      surahId,
      ayahNumber,
    });

    if (!currentAyah?.embedding) {
      return [];
    }

    const similarAyahs = await collection
      .aggregate<any>([
        {
          $search: {
            cosmosSearch: {
              vector: currentAyah.embedding,
              k: limit + 1, // +1 to exclude itself
            },
            returnStoredSource: true,
          },
        },
        {
          $match: {
            $or: [
              { surahId: { $ne: surahId } },
              { ayahNumber: { $ne: ayahNumber } },
            ],
          },
        },
        {
          $limit: limit,
        },
        {
          $project: {
            surahId: 1,
            ayahNumber: 1,
            arabicText: 1,
            urduTranslation: 1,
            engTranslation: 1,
            similarity: { $meta: 'searchScore' },
          },
        },
      ])
      .toArray();

    return similarAyahs.map((doc) => ({
      surahId: doc.surahId,
      ayahNumber: doc.ayahNumber,
      arabicText: doc.arabicText,
      urduTranslation: doc.urduTranslation,
      engTranslation: doc.engTranslation,
      similarity: doc.similarity || 0.7,
    }));
  } catch (error) {
    console.error('Related ayahs error:', error);
    return [];
  }
}
