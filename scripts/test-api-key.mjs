import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('🧪 Testing OpenAI API Key...\n');

try {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ERROR: OPENAI_API_KEY not found in .env.local');
    process.exit(1);
  }

  console.log('📝 API Key found:', process.env.OPENAI_API_KEY.substring(0, 15) + '...');
  console.log('💾 Testing embedding generation...\n');

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: 'Test: What does Ayat ul Kursi mean?',
    encoding_format: 'float',
  });

  if (response.data && response.data[0]?.embedding) {
    console.log('✅ SUCCESS! API Key is VALID\n');
    console.log('📊 Embedding Details:');
    console.log(`   - Dimensions: ${response.data[0].embedding.length}`);
    console.log(`   - Format: Float array`);
    console.log(`   - Sample values: [${response.data[0].embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
    console.log('\n✨ Ready to generate embeddings for all Surahs!');
    process.exit(0);
  }
} catch (error) {
  console.error('❌ ERROR:', error.message);
  console.error('\n🔍 Troubleshooting:');
  console.error('1. Check if API key is valid at https://platform.openai.com/account/api-keys');
  console.error('2. Check if project has credits: https://platform.openai.com/account/billing/overview');
  console.error('3. Verify embeddings model is enabled in project');
  if (error.status) console.error(`4. HTTP Status: ${error.status}`);
  process.exit(1);
}
