import { OpenAI } from 'openai';
import { connectToMongoDatabase } from './db/mongodb';
import { generateEmbedding } from './embeddings';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface QAResult {
  question: string;
  answer: string;
  sources: Array<{
    surahId: number;
    ayahNumber: number;
    ayahText: string;
  }>;
  confidence: number;
}

/**
 * Feature 2: AI Q&A - Answer questions about Quran
 * Uses RAG (Retrieval-Augmented Generation) pattern
 */
export async function answerQuranQuestion(
  question: string,
  useCache: boolean = true
): Promise<QAResult> {
  try {
    const mongoose = await connectToMongoDatabase();

    // Check cache first
    if (useCache) {
      const qaCollection = mongoose.connection.db!.collection('quran_qa_cache');
      const cached = await qaCollection.findOne({ question });

      if (cached?.answer) {
        return {
          question: cached.question,
          answer: cached.answer,
          sources: cached.relatedAyahs || [],
          confidence: 0.95,
        };
      }
    }

    // Retrieve relevant ayahs using semantic search
    const queryEmbedding = await generateEmbedding(question);
    const ayahCollection = mongoose.connection.db!.collection('quran_ayahs');

    const relevantAyahs = await ayahCollection
      .aggregate<any>([
        {
          $search: {
            cosmosSearch: {
              vector: queryEmbedding,
              k: 5,
            },
            returnStoredSource: true,
          },
        },
        {
          $limit: 5,
        },
      ])
      .toArray();

    // Build context for AI
    const context = relevantAyahs
      .map(
        (ayah: any) =>
          `[Surah ${ayah.surahId}:${ayah.ayahNumber}]\nArabic: ${ayah.arabicText}\nTranslation: ${ayah.engTranslation}\n${ayah.tafseer ? `Tafseer: ${ayah.tafseer}` : ''}`
      )
      .join('\n\n');

    // Generate answer using GPT-4
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an Islamic scholar helping people understand the Quran. 
Use the provided Quranic context to answer questions accurately and thoughtfully. 
Always cite the relevant Ayahs. Be respectful and accurate. Keep responses concise and clear.`,
        },
        {
          role: 'user',
          content: `Based on these Quranic verses:\n\n${context}\n\nAnswer this question: ${question}

Please provide a clear, concise answer with references to the verses used.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const answer = response.choices[0].message.content || 'Unable to generate answer';

    // Cache the result
    const qaCollection = mongoose.connection.db!.collection('quran_qa_cache');
    await qaCollection.insertOne({
      question,
      answer,
      relatedAyahs: relevantAyahs.map((a: any) => ({
        surahId: a.surahId,
        ayahNumber: a.ayahNumber,
        ayahText: a.arabicText,
      })),
      embedding: queryEmbedding,
      createdAt: new Date(),
    });

    return {
      question,
      answer,
      sources: relevantAyahs.map((a: any) => ({
        surahId: a.surahId,
        ayahNumber: a.ayahNumber,
        ayahText: a.arabicText,
      })),
      confidence: 0.85,
    };
  } catch (error) {
    console.error('QA error:', error);
    throw new Error('Unable to answer question at this time');
  }
}

/**
 * Clear QA cache (useful for testing/maintenance)
 */
export async function clearQACache(): Promise<void> {
  try {
    const mongoose = await connectToMongoDatabase();
    const qaCollection = mongoose.connection.db!.collection('quran_qa_cache');
    await qaCollection.deleteMany({});
  } catch (error) {
    console.error('Error clearing QA cache:', error);
  }
}
