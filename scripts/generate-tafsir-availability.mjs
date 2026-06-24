import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const OUTPUT_PATH = resolve(process.cwd(), 'src/data/tafsir-availability.json');
const TAFSIR_IDS = [160, 159, 818, 157];
const TOTAL_SURAHS = 114;

function extractAyahNumber(verseKey) {
  const value = String(verseKey ?? '');
  const ayahPart = value.split(':')[1];
  const ayahNumber = Number(ayahPart);

  if (!Number.isInteger(ayahNumber) || ayahNumber < 1) {
    return null;
  }

  return ayahNumber;
}

async function fetchTafsirAyahsBySurah(surahId) {
  const ayahSet = new Set();
  let firstSourceId = null;

  for (const tafsirId of TAFSIR_IDS) {
    const response = await fetch(
      `https://api.quran.com/api/v4/tafsirs/${tafsirId}/by_chapter/${surahId}?limit=300`,
      {
        headers: { Accept: 'application/json' },
      }
    );

    if (!response.ok) {
      continue;
    }

    const payload = await response.json();
    const tafsirs = Array.isArray(payload?.tafsirs) ? payload.tafsirs : [];
    if (tafsirs.length === 0) {
      continue;
    }

    if (firstSourceId === null) {
      firstSourceId = tafsirId;
    }

    tafsirs
      .map((entry) => extractAyahNumber(entry?.verse_key))
      .filter((ayahNumber) => ayahNumber !== null)
      .forEach((ayahNumber) => ayahSet.add(ayahNumber));
  }

  const ayahs = Array.from(ayahSet).sort((left, right) => left - right);

  return {
    sourceId: firstSourceId,
    ayahs,
  };
}

async function main() {
  const availability = [];

  for (let surahId = 1; surahId <= TOTAL_SURAHS; surahId += 1) {
    const item = await fetchTafsirAyahsBySurah(surahId);
    availability.push({
      surahId,
      sourceId: item.sourceId,
      ayahs: item.ayahs,
    });
    process.stdout.write(`Processed surah ${surahId}/${TOTAL_SURAHS}\n`);
  }

  await writeFile(OUTPUT_PATH, `${JSON.stringify(availability, null, 2)}\n`, 'utf8');
  process.stdout.write(`Tafsir availability updated: ${OUTPUT_PATH}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
