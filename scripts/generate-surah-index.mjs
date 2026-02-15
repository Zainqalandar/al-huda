import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SOURCE_URL = 'https://quranapi.pages.dev/api/surah.json';
const OUTPUT_PATH = resolve(process.cwd(), 'src/data/surah-index.json');

async function main() {
  const response = await fetch(SOURCE_URL, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch surah index (${response.status})`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload) || payload.length !== 114) {
    throw new Error('Unexpected surah index payload.');
  }

  const normalized = payload.map((entry, index) => ({
    id: index + 1,
    surahName: String(entry?.surahName ?? ''),
    surahNameArabic: String(entry?.surahNameArabic ?? ''),
    surahNameArabicLong:
      entry?.surahNameArabicLong !== undefined
        ? String(entry.surahNameArabicLong)
        : undefined,
    surahNameTranslation: String(entry?.surahNameTranslation ?? ''),
    revelationPlace: String(entry?.revelationPlace ?? ''),
    totalAyah: Number(entry?.totalAyah ?? 0),
  }));

  await writeFile(OUTPUT_PATH, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  process.stdout.write(`Surah index updated: ${OUTPUT_PATH}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
