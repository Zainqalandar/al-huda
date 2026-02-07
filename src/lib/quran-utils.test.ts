import { describe, expect, it } from 'vitest';

import {
  buildBookmarkId,
  clampRange,
  formatAudioTime,
  isValidSurahId,
} from './quran-utils';

describe('quran-utils', () => {
  it('clamps values inside boundaries', () => {
    expect(clampRange(10, 1, 5)).toBe(5);
    expect(clampRange(-2, 1, 5)).toBe(1);
    expect(clampRange(3, 1, 5)).toBe(3);
  });

  it('validates surah id boundaries', () => {
    expect(isValidSurahId(1)).toBe(true);
    expect(isValidSurahId(114)).toBe(true);
    expect(isValidSurahId(0)).toBe(false);
    expect(isValidSurahId(115)).toBe(false);
    expect(isValidSurahId(2.2)).toBe(false);
  });

  it('formats audio time', () => {
    expect(formatAudioTime(0)).toBe('0:00');
    expect(formatAudioTime(61)).toBe('1:01');
    expect(formatAudioTime(3600 + 5)).toBe('60:05');
  });

  it('creates stable bookmark identifiers', () => {
    expect(buildBookmarkId(2, 255)).toBe('2:255');
  });
});
