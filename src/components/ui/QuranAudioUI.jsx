'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume,
  VolumeX,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SurhasList } from '@/context/SurhasListProvider';

const TOTAL_SURAHS = 114;

export default function QuranAudioBottomBar({ initialSurah = 1, srcPattern }) {
  const router = useRouter();
  const { pageNo, setPageNo } = useContext(SurhasList);

  // Ensure pageNo is valid on mount (single source of truth)
  useEffect(() => {
    if (!pageNo || pageNo < 1 || pageNo > TOTAL_SURAHS) {
      setPageNo(initialSurah);
      // optional: push route once to keep URL in sync on first load
      router.push(`/quran/${initialSurah}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // build audio src
  const buildDefault = (n) =>
    `https://ia801503.us.archive.org/28/items/quran_urdu_audio_only/${String(
      n
    ).padStart(3, '0')}.ogg`;

  const getSrc = (n) => (srcPattern ? srcPattern(n) : buildDefault(n));

  // local UI state
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [showVolume, setShowVolume] = useState(false);
  const [src, setSrc] = useState(getSrc(pageNo || initialSurah));

  // Sync audio element src whenever pageNo (== surah) changes
  useEffect(() => {
    const surahNum = pageNo || initialSurah;
    const url = getSrc(surahNum);
    setSrc(url);

    const el = audioRef.current;
    if (el) {
      el.src = url;
      el.load();
      setCurrent(0);
      setDuration(0);
      // if already playing, try to continue (may be blocked by browser autoplay)
      if (isPlaying) {
        el.play().catch(() => {});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  // wire audio events
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onLoaded = () => setDuration(el.duration || 0);
    const onTime = () => setCurrent(el.currentTime || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    el.addEventListener('loadedmetadata', onLoaded);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);

    return () => {
      el.removeEventListener('loadedmetadata', onLoaded);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
    };
  }, []);

  // volume sync
  useEffect(() => {
    const el = audioRef.current;
    if (el) el.volume = volume;
  }, [volume]);

  // controls
  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      if (el.paused) await el.play();
      else el.pause();
    } catch {
      // autoplay blocked — ignore
    }
  };

  const seekToPercent = (pct) => {
    const el = audioRef.current;
    if (!el || !isFinite(duration) || duration <= 0) return;
    const t = Math.max(0, Math.min(1, pct)) * duration;
    el.currentTime = t;
    setCurrent(t);
  };

  // single function to change page (and push route) — prevents double updates
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > TOTAL_SURAHS) return;

    // avoid redundant updates
    if (pageNo === newPage) {
      // still ensure URL is consistent
      router.push(`/quran/${newPage}`);
      return;
    }

    // update context and push route once
    setPageNo(newPage);
    router.push(`/quran/${newPage}`);
  };

  const prev = () => {
    const cur = pageNo || initialSurah;
    changePage(Math.max(1, cur - 1));
  };

  const next = () => {
    const cur = pageNo || initialSurah;
    changePage(Math.min(TOTAL_SURAHS, cur + 1));
  };

  // simple time format mm:ss
  const fmt = (t) => {
    if (!isFinite(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  const percent = duration ? Math.min(100, (current / duration) * 100) : 0;
  const currentSurah = pageNo || initialSurah;

  return (
    // fixed bottom, full-width bar
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="w-full bg-emerald-700 text-white border-t border-emerald-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-3 py-3">
            {/* Left: Surah info (compact) */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold">Surah {currentSurah}</div>
                <div className="hidden sm:block text-xs text-emerald-100/90">
                  Urdu Translation (audio)
                </div>
              </div>
            </div>

            {/* Middle: Play controls + progress (grow) */}
            <div className="flex-1 flex flex-col md:flex-row items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="p-2 rounded hover:bg-emerald-600/60"
                  aria-label="Previous"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="inline-flex items-center gap-2 bg-emerald-900 px-3 py-1.5 rounded text-sm font-medium hover:bg-emerald-800"
                  aria-label="Play / Pause"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={next}
                  disabled={currentSurah === TOTAL_SURAHS}
                  className={`${
                    currentSurah === TOTAL_SURAHS
                      ? 'p-2 text-gray-600 rounded hover:bg-emerald-600/60'
                      : 'p-2 rounded hover:bg-emerald-600/60'
                  }`}
                  aria-label="Next"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Progress bar: full responsive */}
              <div className="flex-1 px-3 w-full">
                <div
                  className="relative h-2 bg-emerald-600/30 rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = e.clientX - rect.left;
                    seekToPercent(pct / rect.width);
                  }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-white rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* times */}
                <div className="flex justify-between text-xs text-emerald-100 mt-1">
                  <span>{fmt(current)}</span>
                  <span>{fmt(duration)}</span>
                </div>
              </div>
            </div>

            {/* Right: volume (compact) */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowVolume((s) => !s)}
                  className="p-2 rounded hover:bg-emerald-600/60"
                  aria-label="Toggle volume"
                >
                  {volume > 0 ? <Volume className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>

                {showVolume && (
                  <div className="absolute right-0 bottom-12 w-40 bg-emerald-50 text-emerald-900 rounded shadow p-2">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full"
                      aria-label="Volume"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}
