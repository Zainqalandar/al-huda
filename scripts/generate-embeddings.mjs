import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/al-huda';
const BATCH_SIZE = 10;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error(`Error generating embedding:`, error);
    return null;
  }
}

async function seedSurahEmbeddings() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('al-huda');

    // Load surah data
    const surahPath = path.join(__dirname, '../src/data/surah-index.json');
    const surahData = JSON.parse(fs.readFileSync(surahPath, 'utf8'));

    console.log(`📚 Loaded ${surahData.length} Surahs`);
    console.log('🔄 Generating embeddings for Surahs...');

    const surahsCollection = db.collection('quran_surahs');

    // Create index if it doesn't exist
    try {
      await surahsCollection.createIndex({ id: 1 }, { unique: true });
    } catch (error) {
      // Index might already exist
    }

    let processed = 0;
    for (const surah of surahData) {
      const content = `${surah.surahName} - ${surah.surahNameTranslation}. Revealed in ${surah.revelationPlace}. This Surah contains ${surah.totalAyah} verses and is number ${surah.id} in the Quran.`;

      const embedding = await generateEmbedding(content);

      if (!embedding) {
        console.warn(`⚠️  Failed to embed Surah ${surah.id}`);
        continue;
      }

      await surahsCollection.updateOne(
        { id: surah.id },
        {
          $set: {
            id: surah.id,
            surahName: surah.surahName,
            surahNameArabic: surah.surahNameArabic,
            surahNameArabicLong: surah.surahNameArabicLong,
            surahNameTranslation: surah.surahNameTranslation,
            revelationPlace: surah.revelationPlace,
            totalAyah: surah.totalAyah,
            embedding,
            content,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      processed++;
      if (processed % 10 === 0) {
        console.log(`✓ Processed ${processed}/${surahData.length} Surahs`);
      }
    }

    console.log(`✅ Surah embeddings complete! (${processed} total)`);

    // Create vector search index
    try {
      await db.collection('quran_surahs').createSearchIndex({
        name: 'quran_surahs_vector',
        definition: {
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
        },
      });
      console.log('✅ Created vector search index for Surahs');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Vector search index already exists');
      } else {
        console.error('⚠️  Error creating index:', error.message);
      }
    }

    return processed;
  } catch (error) {
    console.error('❌ Error in seedSurahEmbeddings:', error);
    throw error;
  } finally {
    await client.close();
  }
}

async function main() {
  console.log('🚀 Starting embedding generation...\n');

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is not set');
    process.exit(1);
  }

  try {
    const surahCount = await seedSurahEmbeddings();

    console.log('\n✅ Embedding generation complete!');
    console.log(`   - Surahs: ${surahCount}`);
    console.log('\n📝 Next steps:');
    console.log('   1. Embeddings are now stored in MongoDB');
    console.log('   2. Vector search indexes are created');
    console.log('   3. You can now use the Vector Search APIs');
    console.log('   4. Start your dev server: npm run dev');
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
