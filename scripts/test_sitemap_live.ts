import { GET } from '../src/app/hadith/sitemap.xml/route';

async function test() {
  console.log('Executing Hadith Sitemap GET...');
  try {
    const response = await GET();
    const text = await response.text();
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response Body Length:', text.length);
    console.log('Sitemaps found in index:');
    
    // Count matches of <loc>
    const matches = text.match(/<loc>(.*?)<\/loc>/g) || [];
    console.log(`Found ${matches.length} sitemaps:`);
    matches.forEach((m, i) => {
      console.log(`  [${i + 1}] ${m}`);
    });
  } catch (err) {
    console.error('Error executing GET:', err);
  }
}

test();
