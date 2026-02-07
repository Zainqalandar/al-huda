export function clampRange(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function isValidSurahId(value: number) {
  return Number.isInteger(value) && value >= 1 && value <= 114;
}

export function formatAudioTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${rest}`;
}

export function buildBookmarkId(surahId: number, ayahNumber: number) {
  return `${surahId}:${ayahNumber}`;
}
