import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key-for-build',
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

// Batch embeddings for performance
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
      encoding_format: 'float',
    });

    return response.data.map((item) => item.embedding);
  } catch (error) {
    console.error('Error generating batch embeddings:', error);
    throw new Error('Failed to generate batch embeddings');
  }
}

// For caching/reuse validation
export function validateEmbedding(embedding: unknown): boolean {
  return (
    Array.isArray(embedding) &&
    embedding.length === 1536 &&
    embedding.every((x) => typeof x === 'number')
  );
}

export function getEmbeddingDimensions(): number {
  return 1536; // text-embedding-3-small dimensions
}
