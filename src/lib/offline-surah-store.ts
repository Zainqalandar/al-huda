import type { SurahDetail, SurahMeta } from '@/types/quran';

const DB_NAME = 'alhuda-offline';
const DB_VERSION = 1;
const SURAH_STORE = 'surahs';
const AUDIO_STORE = 'audio';

export const OFFLINE_SURAH_CHANGED_EVENT = 'alhuda:offline-surah-changed';

export interface OfflineSurahRecord {
  surahId: number;
  detail: SurahDetail;
  meta: SurahMeta;
  downloadedAt: string;
  hasArabicAudio: boolean;
  hasUrduAudio: boolean;
  arabicReciterIndex: number;
}

interface OfflineAudioRecord {
  id: string;
  surahId: number;
  variant: 'ar' | 'tr';
  reciterIndex: number;
  blob: Blob;
  mimeType: string;
}

export interface OfflineDownloadProgress {
  surahId: number;
  stage: 'text' | 'arabic-audio' | 'urdu-audio' | 'done';
  percent: number;
}

function openOfflineDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SURAH_STORE)) {
        db.createObjectStore(SURAH_STORE, { keyPath: 'surahId' });
      }
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open offline database.'));
  });
}

function runTransaction<T>(
  storeName: string,
  mode: IDBTransactionMode,
  runner: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T | undefined> {
  return openOfflineDb().then(
    (db) =>
      new Promise<T | undefined>((resolve, reject) => {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const request = runner(store);

        transaction.oncomplete = () => {
          resolve(request.result);
        };
        transaction.onerror = () => reject(transaction.error ?? new Error('Offline transaction failed.'));
      })
  );
}

function runWriteTransaction(
  storeName: string,
  runner: (store: IDBObjectStore) => void
): Promise<void> {
  return openOfflineDb().then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        runner(store);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error ?? new Error('Offline transaction failed.'));
      })
  );
}

function buildAudioKey(surahId: number, variant: 'ar' | 'tr', reciterIndex = 0) {
  return `${surahId}-${variant}-${reciterIndex}`;
}

function notifyOfflineChanged() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(OFFLINE_SURAH_CHANGED_EVENT));
}

export async function isSurahOfflineAvailable(surahId: number) {
  try {
    const record = await runTransaction<OfflineSurahRecord | undefined>(
      SURAH_STORE,
      'readonly',
      (store) => store.get(surahId)
    );
    return Boolean(record);
  } catch {
    return false;
  }
}

export async function getOfflineSurahRecord(surahId: number) {
  try {
    return await runTransaction<OfflineSurahRecord | undefined>(
      SURAH_STORE,
      'readonly',
      (store) => store.get(surahId)
    );
  } catch {
    return undefined;
  }
}

export async function listOfflineSurahIds() {
  try {
    const records = await runTransaction<OfflineSurahRecord[]>(
      SURAH_STORE,
      'readonly',
      (store) => store.getAll()
    );
    return (records ?? []).map((record) => record.surahId).sort((left, right) => left - right);
  } catch {
    return [];
  }
}

export async function getOfflineAudioObjectUrl(
  surahId: number,
  variant: 'ar' | 'tr',
  reciterIndex = 0
) {
  try {
    const record = await runTransaction<OfflineAudioRecord | undefined>(
      AUDIO_STORE,
      'readonly',
      (store) => store.get(buildAudioKey(surahId, variant, reciterIndex))
    );

    if (!record?.blob) {
      return null;
    }

    return URL.createObjectURL(record.blob);
  } catch {
    return null;
  }
}

async function fetchAudioBlob(url: string, signal?: AbortSignal) {
  const response = await fetch(url, { mode: 'cors', signal });
  if (!response.ok) {
    throw new Error(`Audio request failed (${response.status}).`);
  }

  return response.blob();
}

export async function downloadSurahForOffline(options: {
  surahId: number;
  detail: SurahDetail;
  meta: SurahMeta;
  arabicAudioUrl?: string;
  urduAudioUrl?: string;
  arabicReciterIndex?: number;
  onProgress?: (progress: OfflineDownloadProgress) => void;
  signal?: AbortSignal;
}) {
  const {
    surahId,
    detail,
    meta,
    arabicAudioUrl,
    urduAudioUrl,
    arabicReciterIndex = 0,
    onProgress,
    signal,
  } = options;

  onProgress?.({ surahId, stage: 'text', percent: 10 });

  const surahRecord: OfflineSurahRecord = {
    surahId,
    detail,
    meta,
    downloadedAt: new Date().toISOString(),
    hasArabicAudio: Boolean(arabicAudioUrl),
    hasUrduAudio: Boolean(urduAudioUrl),
    arabicReciterIndex,
  };

  await runWriteTransaction(SURAH_STORE, (store) => {
    store.put(surahRecord);
  });

  if (arabicAudioUrl) {
    onProgress?.({ surahId, stage: 'arabic-audio', percent: 35 });
    const blob = await fetchAudioBlob(arabicAudioUrl, signal);
    await runWriteTransaction(AUDIO_STORE, (store) => {
      store.put({
        id: buildAudioKey(surahId, 'ar', arabicReciterIndex),
        surahId,
        variant: 'ar',
        reciterIndex: arabicReciterIndex,
        blob,
        mimeType: blob.type || 'audio/mpeg',
      } satisfies OfflineAudioRecord);
    });
  }

  if (urduAudioUrl) {
    onProgress?.({ surahId, stage: 'urdu-audio', percent: 75 });
    const blob = await fetchAudioBlob(urduAudioUrl, signal);
    await runWriteTransaction(AUDIO_STORE, (store) => {
      store.put({
        id: buildAudioKey(surahId, 'tr', 0),
        surahId,
        variant: 'tr',
        reciterIndex: 0,
        blob,
        mimeType: blob.type || 'audio/ogg',
      } satisfies OfflineAudioRecord);
    });
  }

  onProgress?.({ surahId, stage: 'done', percent: 100 });
  notifyOfflineChanged();
}

export async function removeOfflineSurah(surahId: number) {
  await runWriteTransaction(SURAH_STORE, (store) => {
    store.delete(surahId);
  });

  const audioRecords = await runTransaction<OfflineAudioRecord[]>(
    AUDIO_STORE,
    'readonly',
    (store) => store.getAll()
  );

  const matchingIds = (audioRecords ?? [])
    .filter((record) => record.surahId === surahId)
    .map((record) => record.id);

  if (matchingIds.length > 0) {
    await runWriteTransaction(AUDIO_STORE, (store) => {
      matchingIds.forEach((id) => store.delete(id));
    });
  }

  notifyOfflineChanged();
}

export function getTranslationAudioUrl(surahNumber: number) {
  return `https://ia801503.us.archive.org/28/items/quran_urdu_audio_only/${String(
    surahNumber
  ).padStart(3, '0')}.ogg`;
}
