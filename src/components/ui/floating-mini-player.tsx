'use client';

import Link from 'next/link';
import { Loader2, Pause, Play, X } from 'lucide-react';

import { useGlobalQuranAudio } from '@/components/providers/global-quran-audio-provider';
import { Button } from '@/components/ui/button';
import { formatAudioTime } from '@/lib/quran-utils';

export default function FloatingMiniPlayer() {
  const { isReaderMounted, session, controls, dismissSession } = useGlobalQuranAudio();

  if (isReaderMounted || !session?.audioSrc || !controls) {
    return null;
  }

  const progress =
    session.duration > 0
      ? Math.min((session.currentTime / session.duration) * 100, 100)
      : 0;

  return (
    <div className="fixed inset-x-2 bottom-2 z-[80] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[min(24rem,calc(100vw-1rem))]">
      <div className="rounded-2xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_50%)] bg-[linear-gradient(150deg,color-mix(in_oklab,var(--color-surface),white_12%),color-mix(in_oklab,var(--color-accent),var(--color-surface)_90%))] p-3 shadow-[var(--shadow-card)] backdrop-blur-xl">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-text)]">
              Now Playing
            </p>
            <Link
              href={session.surahPath}
              className="block truncate font-display text-base text-[var(--color-heading)] hover:text-[var(--color-accent-soft)]"
            >
              {session.surahName}
            </Link>
            <p className="truncate text-[11px] text-[var(--color-muted-text)]">
              {session.activeAyahNumber
                ? `Ayah ${session.activeAyahNumber} • ${session.reciterName}`
                : session.reciterName}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="size-8 rounded-xl border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_58%)] bg-[color-mix(in_oklab,var(--color-surface),white_18%)]"
              onClick={dismissSession}
              aria-label="Close audio player"
              title="Close player"
            >
              <X className="size-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              className="size-9 rounded-xl"
              onClick={() => void controls.togglePlay()}
              aria-label={session.isPlaying ? 'Pause audio' : 'Play audio'}
            >
              {session.isPlaying ? (
                <Pause className="size-4" />
              ) : session.isPlayPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Play className="size-4" />
              )}
            </Button>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={session.duration > 0 ? session.duration : 1}
          step={0.1}
          value={session.duration > 0 ? session.currentTime : 0}
          onChange={(event) => controls.seek(Number(event.target.value))}
          className="app-range h-1.5 cursor-pointer"
          aria-label="Mini player seek"
        />

        <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--color-muted-text)]">
          <span>{formatAudioTime(session.currentTime)}</span>
          <span>{formatAudioTime(session.duration)}</span>
        </div>

        <div
          className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-surface-3)]"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-[var(--color-accent)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
