'use client';

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react';

import useSurahList from '@/hooks/useSurahList';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { useAppSettings } from '@/components/providers/app-settings-provider';
import type {
  AyahBookmark,
  LastReadEntry,
  SortOrder,
  SurahListItem,
  SurahSortBy,
} from '@/types/quran';
import { buildBookmarkId } from '@/lib/quran-utils';

interface SurahListContext {
  pageNo: number;
  setPageNo: Dispatch<SetStateAction<number>>;
  surahs: SurahListItem[];
  loading: boolean;
  error: string | null;

  filterSurahs: SurahListItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SurahSortBy;
  setSortBy: (value: SurahSortBy) => void;
  order: SortOrder;
  setOrder: (value: SortOrder) => void;
  resetFilters: () => void;

  favorites: number[];
  toggleFavoriteSurah: (surahId: number) => void;
  isFavoriteSurah: (surahId: number) => boolean;

  bookmarks: AyahBookmark[];
  toggleBookmark: (bookmark: Omit<AyahBookmark, 'id' | 'createdAt'>) => void;
  isBookmarked: (surahId: number, ayahNumber: number) => boolean;
  removeBookmark: (bookmarkId: string) => void;

  lastRead: LastReadEntry | null;
  setLastRead: (entry: LastReadEntry) => void;

  language: 'ar' | 'tr';
  addLanguage: (len: 'ar' | 'tr') => void;
  handleLanguageChange: (lang: 'ar' | 'tr') => void;
  handleSetPlaying: (playing?: boolean) => void;
  isPlaying: boolean;
}

const SurhasList = createContext<SurahListContext | null>(null);

const SORT_STORAGE_KEY = 'alhuda.quran.sort.v1';
const FAVORITES_STORAGE_KEY = 'alhuda.quran.favorites.v1';
const BOOKMARKS_STORAGE_KEY = 'alhuda.quran.bookmarks.v1';
const LAST_READ_STORAGE_KEY = 'alhuda.quran.last-read.v1';

interface PersistedSort {
  sortBy: SurahSortBy;
  order: SortOrder;
  searchQuery: string;
}

const defaultSort: PersistedSort = {
  sortBy: 'id',
  order: 'asc',
  searchQuery: '',
};

function sortSurahs(list: SurahListItem[], sortBy: SurahSortBy, order: SortOrder) {
  return [...list].sort((a, b) => {
    if (sortBy === 'surahName') {
      const value = a.surahName.localeCompare(b.surahName);
      return order === 'asc' ? value : -value;
    }

    const left = sortBy === 'id' ? a.id : a.totalAyah;
    const right = sortBy === 'id' ? b.id : b.totalAyah;

    return order === 'asc' ? left - right : right - left;
  });
}

const SurhasListProvider = ({ children }: PropsWithChildren) => {
  const { surahList, loading, error } = useSurahList();

  const [pageNo, setPageNo] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const [sortState, setSortState] = useLocalStorageState<PersistedSort>(
    SORT_STORAGE_KEY,
    defaultSort
  );
  const [favorites, setFavorites] = useLocalStorageState<number[]>(
    FAVORITES_STORAGE_KEY,
    []
  );
  const [bookmarks, setBookmarks] = useLocalStorageState<AyahBookmark[]>(
    BOOKMARKS_STORAGE_KEY,
    []
  );
  const [lastRead, saveLastRead] = useLocalStorageState<LastReadEntry | null>(
    LAST_READ_STORAGE_KEY,
    null
  );

  const {
    settings,
    setAudioPreference,
  } = useAppSettings();

  const setSearchQuery = useCallback(
    (query: string) => {
      setSortState((prev) => ({ ...prev, searchQuery: query }));
    },
    [setSortState]
  );

  const setSortBy = useCallback(
    (value: SurahSortBy) => {
      setSortState((prev) => ({ ...prev, sortBy: value }));
    },
    [setSortState]
  );

  const setOrder = useCallback(
    (value: SortOrder) => {
      setSortState((prev) => ({ ...prev, order: value }));
    },
    [setSortState]
  );

  const resetFilters = useCallback(() => {
    setSortState(defaultSort);
  }, [setSortState]);

  const filterSurahs = useMemo(() => {
    const query = sortState.searchQuery.trim().toLowerCase();
    const scoped = query
      ? surahList.filter((surah) => {
          return (
            surah.surahName.toLowerCase().includes(query) ||
            surah.surahNameArabic.toLowerCase().includes(query) ||
            surah.surahNameTranslation.toLowerCase().includes(query) ||
            String(surah.id).includes(query)
          );
        })
      : surahList;

    return sortSurahs(scoped, sortState.sortBy, sortState.order);
  }, [sortState.order, sortState.searchQuery, sortState.sortBy, surahList]);

  const toggleFavoriteSurah = useCallback(
    (surahId: number) => {
      setFavorites((prev) =>
        prev.includes(surahId)
          ? prev.filter((id) => id !== surahId)
          : [...prev, surahId]
      );
    },
    [setFavorites]
  );

  const isFavoriteSurah = useCallback(
    (surahId: number) => favorites.includes(surahId),
    [favorites]
  );

  const toggleBookmark = useCallback(
    ({ surahId, ayahNumber, text }: Omit<AyahBookmark, 'id' | 'createdAt'>) => {
      const id = buildBookmarkId(surahId, ayahNumber);
      setBookmarks((prev) => {
        const exists = prev.some((bookmark) => bookmark.id === id);
        if (exists) {
          return prev.filter((bookmark) => bookmark.id !== id);
        }

        return [
          {
            id,
            surahId,
            ayahNumber,
            text,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    },
    [setBookmarks]
  );

  const isBookmarked = useCallback(
    (surahId: number, ayahNumber: number) =>
      bookmarks.some(
        (bookmark) =>
          bookmark.surahId === surahId && bookmark.ayahNumber === ayahNumber
      ),
    [bookmarks]
  );

  const removeBookmark = useCallback(
    (bookmarkId: string) => {
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId));
    },
    [setBookmarks]
  );

  const setLastRead = useCallback(
    (entry: LastReadEntry) => {
      saveLastRead(entry);
    },
    [saveLastRead]
  );

  const addLanguage = useCallback(
    (language: 'ar' | 'tr') => {
      setAudioPreference(language);
    },
    [setAudioPreference]
  );

  const handleLanguageChange = useCallback(
    (language: 'ar' | 'tr') => {
      setAudioPreference(language);
    },
    [setAudioPreference]
  );

  const handleSetPlaying = useCallback((playing?: boolean) => {
    setIsPlaying((prev) => (typeof playing === 'boolean' ? playing : !prev));
  }, []);

  const value = useMemo(
    () => ({
      pageNo,
      setPageNo,
      surahs: surahList,
      loading,
      error,

      filterSurahs,
      searchQuery: sortState.searchQuery,
      setSearchQuery,
      sortBy: sortState.sortBy,
      setSortBy,
      order: sortState.order,
      setOrder,
      resetFilters,

      favorites,
      toggleFavoriteSurah,
      isFavoriteSurah,

      bookmarks,
      toggleBookmark,
      isBookmarked,
      removeBookmark,

      lastRead,
      setLastRead,

      language: settings.audioPreference,
      addLanguage,
      handleLanguageChange,
      handleSetPlaying,
      isPlaying,
    }),
    [
      addLanguage,
      bookmarks,
      error,
      favorites,
      filterSurahs,
      handleLanguageChange,
      handleSetPlaying,
      isBookmarked,
      isFavoriteSurah,
      isPlaying,
      lastRead,
      loading,
      pageNo,
      removeBookmark,
      resetFilters,
      setLastRead,
      setOrder,
      setPageNo,
      setSearchQuery,
      setSortBy,
      settings.audioPreference,
      sortState.order,
      sortState.searchQuery,
      sortState.sortBy,
      surahList,
      toggleBookmark,
      toggleFavoriteSurah,
    ]
  );

  return <SurhasList.Provider value={value}>{children}</SurhasList.Provider>;
};

export { SurhasList, SurhasListProvider };
