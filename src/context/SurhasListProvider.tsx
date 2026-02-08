'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react';

import useSurahList from '@/hooks/useSurahList';
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
  surahLikes: Record<number, number>;
  getSurahLikesCount: (surahId: number) => number;

  lastRead: LastReadEntry | null;
  setLastRead: (entry: LastReadEntry) => void;

  language: 'ar' | 'tr';
  addLanguage: (len: 'ar' | 'tr') => void;
  handleLanguageChange: (lang: 'ar' | 'tr') => void;
  handleSetPlaying: (playing?: boolean) => void;
  isPlaying: boolean;
}

const SurhasList = createContext<SurahListContext | null>(null);

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

interface SessionPayload {
  user: {
    id: string;
  } | null;
}

interface QuranStatePayload {
  favoriteSurahIds?: number[];
  bookmarkedAyahs?: AyahBookmark[];
  lastRead?: LastReadEntry | null;
}

interface SurahLikesPayload {
  likes?: Record<string, number>;
}

const MIN_SURAH_ID = 1;
const MAX_SURAH_ID = 114;
const MAX_AYAH_NUMBER = 286;
const OPEN_AUTH_MODAL_EVENT = 'alhuda:open-auth-modal';

interface OpenAuthModalDetail {
  tab?: 'signin' | 'signup';
  reason?: string;
}

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

function normalizeFavoriteSurahIds(input: number[]) {
  return Array.from(
    new Set(
      input.filter(
        (surahId) =>
          Number.isInteger(surahId) &&
          surahId >= MIN_SURAH_ID &&
          surahId <= MAX_SURAH_ID
      )
    )
  ).sort((left, right) => left - right);
}

function normalizeBookmarks(input: AyahBookmark[]) {
  const byId = new Map<string, AyahBookmark>();

  input.forEach((bookmark) => {
    if (
      !bookmark ||
      !Number.isInteger(bookmark.surahId) ||
      bookmark.surahId < MIN_SURAH_ID ||
      bookmark.surahId > MAX_SURAH_ID ||
      !Number.isInteger(bookmark.ayahNumber) ||
      bookmark.ayahNumber < 1 ||
      bookmark.ayahNumber > MAX_AYAH_NUMBER
    ) {
      return;
    }

    const id = buildBookmarkId(bookmark.surahId, bookmark.ayahNumber);
    byId.set(id, {
      id,
      surahId: bookmark.surahId,
      ayahNumber: bookmark.ayahNumber,
      text: String(bookmark.text ?? ''),
      createdAt: String(bookmark.createdAt ?? new Date().toISOString()),
    });
  });

  return Array.from(byId.values()).sort((left, right) => {
    return right.createdAt.localeCompare(left.createdAt);
  });
}

function normalizeLastReadEntry(input: LastReadEntry | null | undefined) {
  if (!input) {
    return null;
  }

  if (
    !Number.isInteger(input.surahId) ||
    input.surahId < MIN_SURAH_ID ||
    input.surahId > MAX_SURAH_ID ||
    !Number.isInteger(input.ayahNumber) ||
    input.ayahNumber < 1 ||
    input.ayahNumber > MAX_AYAH_NUMBER
  ) {
    return null;
  }

  const updatedAtRaw = String(input.updatedAt ?? new Date().toISOString());
  const updatedAtDate = new Date(updatedAtRaw);
  const updatedAt = Number.isNaN(updatedAtDate.getTime())
    ? new Date().toISOString()
    : updatedAtDate.toISOString();

  return {
    surahId: input.surahId,
    ayahNumber: input.ayahNumber,
    updatedAt,
  } satisfies LastReadEntry;
}

function serializeQuranState(
  favorites: number[],
  bookmarks: AyahBookmark[],
  lastRead: LastReadEntry | null
) {
  return JSON.stringify({
    favoriteSurahIds: normalizeFavoriteSurahIds(favorites),
    bookmarkedAyahs: normalizeBookmarks(bookmarks).map((bookmark) => ({
      id: bookmark.id,
      surahId: bookmark.surahId,
      ayahNumber: bookmark.ayahNumber,
      text: bookmark.text,
      createdAt: bookmark.createdAt,
    })),
    lastRead: normalizeLastReadEntry(lastRead),
  });
}

const SurhasListProvider = ({ children }: PropsWithChildren) => {
  const { surahList, loading, error } = useSurahList();

  const [pageNo, setPageNo] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const [sortState, setSortState] = useState<PersistedSort>(defaultSort);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bookmarks, setBookmarks] = useState<AyahBookmark[]>([]);
  const [lastRead, setLastReadState] = useState<LastReadEntry | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [didLoadSession, setDidLoadSession] = useState(false);
  const [didHydrateRemoteState, setDidHydrateRemoteState] = useState(false);
  const [surahLikes, setSurahLikes] = useState<Record<number, number>>({});
  const syncedQuranStateRef = useRef('');

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

  const openAuthModal = useCallback((detail: OpenAuthModalDetail) => {
    if (typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(
      new CustomEvent<OpenAuthModalDetail>(OPEN_AUTH_MODAL_EVENT, {
        detail,
      })
    );
  }, []);

  const requireAuthentication = useCallback(
    (actionLabel: string) => {
      if (isAuthenticated) {
        return true;
      }

      openAuthModal({
        tab: 'signin',
        reason: didLoadSession ? actionLabel : 'access your Quran library',
      });
      return false;
    },
    [didLoadSession, isAuthenticated, openAuthModal]
  );

  const loadSurahLikes = useCallback(async () => {
    try {
      const response = await fetch('/api/quran/likes', {
        cache: 'no-store',
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as SurahLikesPayload;
      const source = payload.likes ?? {};
      const nextLikes: Record<number, number> = {};

      Object.entries(source).forEach(([surahIdRaw, likesRaw]) => {
        const surahId = Number(surahIdRaw);
        const likes = Math.max(0, Math.floor(Number(likesRaw) || 0));
        if (
          Number.isInteger(surahId) &&
          surahId >= MIN_SURAH_ID &&
          surahId <= MAX_SURAH_ID &&
          likes > 0
        ) {
          nextLikes[surahId] = likes;
        }
      });

      setSurahLikes(nextLikes);
    } catch {
      // keep previous likes state
    }
  }, []);

  useEffect(() => {
    void loadSurahLikes();
  }, [loadSurahLikes]);

  useEffect(() => {
    let ignore = false;

    const loadSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          cache: 'no-store',
        });

        if (!response.ok) {
          if (!ignore) {
            setIsAuthenticated(false);
          }
          return;
        }

        const payload = (await response.json()) as SessionPayload;
        if (!ignore) {
          setIsAuthenticated(Boolean(payload.user?.id));
        }
      } catch {
        if (!ignore) {
          setIsAuthenticated(false);
        }
      } finally {
        if (!ignore) {
          setDidLoadSession(true);
        }
      }
    };

    void loadSession();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!didLoadSession || didHydrateRemoteState) {
      return;
    }

    let ignore = false;

    const hydrateQuranState = async () => {
      if (!isAuthenticated) {
        if (!ignore) {
          setFavorites([]);
          setBookmarks([]);
          setLastReadState(null);
        }
        syncedQuranStateRef.current = serializeQuranState([], [], null);
        if (!ignore) {
          setDidHydrateRemoteState(true);
        }
        return;
      }

      try {
        const response = await fetch('/api/auth/quran-state', {
          cache: 'no-store',
        });

        if (!response.ok) {
          syncedQuranStateRef.current = serializeQuranState(favorites, bookmarks, lastRead);
          return;
        }

        const payload = (await response.json()) as QuranStatePayload;
        const nextFavorites = normalizeFavoriteSurahIds(
          Array.isArray(payload.favoriteSurahIds) ? payload.favoriteSurahIds : []
        );
        const nextBookmarks = normalizeBookmarks(
          Array.isArray(payload.bookmarkedAyahs) ? payload.bookmarkedAyahs : []
        );
        const nextLastRead = normalizeLastReadEntry(payload.lastRead ?? null);

        if (!ignore) {
          setFavorites(nextFavorites);
          setBookmarks(nextBookmarks);
          setLastReadState(nextLastRead);
        }
        syncedQuranStateRef.current = serializeQuranState(
          nextFavorites,
          nextBookmarks,
          nextLastRead
        );
      } catch {
        syncedQuranStateRef.current = serializeQuranState(favorites, bookmarks, lastRead);
      } finally {
        if (!ignore) {
          setDidHydrateRemoteState(true);
        }
      }
    };

    void hydrateQuranState();

    return () => {
      ignore = true;
    };
  }, [
    bookmarks,
    didHydrateRemoteState,
    didLoadSession,
    favorites,
    isAuthenticated,
    lastRead,
  ]);

  useEffect(() => {
    if (!didHydrateRemoteState || !isAuthenticated) {
      return;
    }

    const snapshot = serializeQuranState(favorites, bookmarks, lastRead);
    if (snapshot === syncedQuranStateRef.current) {
      return;
    }

    let ignore = false;
    syncedQuranStateRef.current = snapshot;

    const syncQuranState = async () => {
      try {
        const response = await fetch('/api/auth/quran-state', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            favoriteSurahIds: normalizeFavoriteSurahIds(favorites),
            bookmarkedAyahs: normalizeBookmarks(bookmarks),
            lastRead: normalizeLastReadEntry(lastRead),
          }),
        });

        if (!response.ok) {
          syncedQuranStateRef.current = '';
          return;
        }

        const payload = (await response.json()) as QuranStatePayload;
        const nextFavorites = normalizeFavoriteSurahIds(
          Array.isArray(payload.favoriteSurahIds) ? payload.favoriteSurahIds : favorites
        );
        const nextBookmarks = normalizeBookmarks(
          Array.isArray(payload.bookmarkedAyahs) ? payload.bookmarkedAyahs : bookmarks
        );
        const nextLastRead = normalizeLastReadEntry(payload.lastRead ?? lastRead);
        const nextSnapshot = serializeQuranState(nextFavorites, nextBookmarks, nextLastRead);

        syncedQuranStateRef.current = nextSnapshot;

        if (!ignore) {
          setFavorites(nextFavorites);
          setBookmarks(nextBookmarks);
          setLastReadState(nextLastRead);
        }

        await loadSurahLikes();
      } catch {
        syncedQuranStateRef.current = '';
      }
    };

    void syncQuranState();

    return () => {
      ignore = true;
    };
  }, [
    bookmarks,
    didHydrateRemoteState,
    favorites,
    isAuthenticated,
    lastRead,
    loadSurahLikes,
  ]);

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
      if (!requireAuthentication('like this surah')) {
        return;
      }

      setFavorites((prev) =>
        prev.includes(surahId)
          ? prev.filter((id) => id !== surahId)
          : [...prev, surahId]
      );
    },
    [requireAuthentication, setFavorites]
  );

  const isFavoriteSurah = useCallback(
    (surahId: number) => favorites.includes(surahId),
    [favorites]
  );

  const getSurahLikesCount = useCallback(
    (surahId: number) => surahLikes[surahId] ?? 0,
    [surahLikes]
  );

  const toggleBookmark = useCallback(
    ({ surahId, ayahNumber, text }: Omit<AyahBookmark, 'id' | 'createdAt'>) => {
      if (!requireAuthentication('save ayah bookmarks')) {
        return;
      }

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
    [requireAuthentication, setBookmarks]
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
      if (!requireAuthentication('manage saved bookmarks')) {
        return;
      }

      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId));
    },
    [requireAuthentication, setBookmarks]
  );

  const setLastRead = useCallback(
    (entry: LastReadEntry) => {
      if (!requireAuthentication('save reading progress')) {
        return;
      }

      const normalizedEntry = normalizeLastReadEntry(entry);
      if (!normalizedEntry) {
        return;
      }

      setLastReadState(normalizedEntry);
    },
    [requireAuthentication]
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
      surahLikes,
      getSurahLikesCount,

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
      getSurahLikesCount,
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
      surahLikes,
      surahList,
      toggleBookmark,
      toggleFavoriteSurah,
    ]
  );

  return <SurhasList.Provider value={value}>{children}</SurhasList.Provider>;
};

export { SurhasList, SurhasListProvider };
