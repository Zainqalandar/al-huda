'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type RefObject,
} from 'react';

export interface GlobalAudioSession {
  surahId: number;
  surahName: string;
  surahPath: string;
  audioSrc: string;
  isPlaying: boolean;
  isPlayPending: boolean;
  currentTime: number;
  duration: number;
  reciterName: string;
  activeAyahNumber: number | null;
}

export interface GlobalAudioControls {
  togglePlay: () => void | Promise<void>;
  seek: (seconds: number) => void;
  skipBack: () => void;
  skipForward: () => void;
}

interface GlobalQuranAudioContextValue {
  audioRef: RefObject<HTMLAudioElement | null>;
  isReaderMounted: boolean;
  session: GlobalAudioSession | null;
  controls: GlobalAudioControls | null;
  registerReader: (controls: GlobalAudioControls) => void;
  unregisterReader: () => void;
  updateSession: (session: GlobalAudioSession | null) => void;
  dismissSession: () => void;
}

const GlobalQuranAudioContext = createContext<GlobalQuranAudioContextValue | null>(null);

export function GlobalQuranAudioProvider({ children }: PropsWithChildren) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isReaderMounted, setIsReaderMounted] = useState(false);
  const [session, setSession] = useState<GlobalAudioSession | null>(null);
  const [controls, setControls] = useState<GlobalAudioControls | null>(null);

  const registerReader = useCallback((nextControls: GlobalAudioControls) => {
    setControls(nextControls);
    setIsReaderMounted(true);
  }, []);

  const unregisterReader = useCallback(() => {
    setIsReaderMounted(false);
  }, []);

  const updateSession = useCallback((nextSession: GlobalAudioSession | null) => {
    setSession(nextSession);
  }, []);

  const dismissSession = useCallback(() => {
    audioRef.current?.pause();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      audioRef,
      isReaderMounted,
      session,
      controls,
      registerReader,
      unregisterReader,
      updateSession,
      dismissSession,
    }),
    [
      controls,
      dismissSession,
      isReaderMounted,
      registerReader,
      session,
      unregisterReader,
      updateSession,
    ]
  );

  return (
    <GlobalQuranAudioContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
    </GlobalQuranAudioContext.Provider>
  );
}

export function useGlobalQuranAudio() {
  const context = useContext(GlobalQuranAudioContext);
  if (!context) {
    throw new Error('useGlobalQuranAudio must be used within GlobalQuranAudioProvider');
  }
  return context;
}
