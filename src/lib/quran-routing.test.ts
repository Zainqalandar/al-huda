import { describe, expect, it } from 'vitest';

import {
  buildAyahPath,
  buildSurahPath,
  buildSurahSlug,
  buildTafsirPath,
  parseSurahIdFromParam,
} from './quran-routing';

describe('quran-routing', () => {
  it('creates stable surah slug', () => {
    expect(buildSurahSlug(2, 'Al-Baqara')).toBe('2-al-baqara');
    expect(buildSurahSlug(112, 'Al-Ikhlaas')).toBe('112-al-ikhlaas');
  });

  it('parses numeric and slug params', () => {
    expect(parseSurahIdFromParam('2')).toBe(2);
    expect(parseSurahIdFromParam('2-al-baqara')).toBe(2);
    expect(parseSurahIdFromParam('999-invalid')).toBeNull();
  });

  it('builds canonical paths', () => {
    expect(buildSurahPath(1, 'Al-Faatiha')).toBe('/surah/1-al-faatiha');
    expect(buildAyahPath(2, 'Al-Baqara', 255)).toBe('/surah/2-al-baqara/ayah/255');
    expect(buildTafsirPath(2, 'Al-Baqara', 255)).toBe('/tafsir/2-al-baqara/255');
  });
});
