'use client';

import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
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

const TOTAL_SURAHS: number = 114;
// 'ar' -> archive.org Urdu translation (.ogg)
// 'tr' -> quranapi.pages.dev (JSON -> audio[].originalUrl)
// const quranListen = 'tr'; // <— yahan apni desired value set karna

// ============ TYPES ============
type Language = 'tr' | 'ar';

interface AudioTrack {
	originalUrl: string;
}

interface QuranAPIResponse {
	audio?: AudioTrack[];
	[key: string]: any;
}

interface QuranAudioBottomBarProps {
	initialSurah?: number;
	srcPattern?: (surahNum: number) => string;
}

export default function QuranAudioBottomBar({ initialSurah = 1, srcPattern }: QuranAudioBottomBarProps) {
	const router = useRouter();
	const context = useContext(SurhasList);
	if (!context) {
		throw new Error('QuranAudioUI must be used within SurhasListProvider');
	}

	const { pageNo, setPageNo, language: quranListen, handleSetPlaying, isPlaying } = context;

	// ---------------- HELPERS (moved before `src` state) ----------------
	const buildDefault = (n: number): string =>
		`https://ia801503.us.archive.org/28/items/quran_urdu_audio_only/${String(n).padStart(3, '0')}.ogg`;

	const getSeekableEnd = (el: HTMLAudioElement | null): number => {
		try {
			if (el?.seekable && el.seekable.length > 0) {
				return el.seekable.end(el.seekable.length - 1);
			}
		} catch (error) {
			// Ignore seekable access errors
		}
		return 0;
	};

	const audioRef = useRef<HTMLAudioElement>(null);
	const rafIdRef = useRef<number | null>(null);
	const lastFetchedSurahRef = useRef<number | null>(null);

	// IMPORTANT: keep null when src not available (avoid empty-string warning)
	const [src, setSrc] = useState<string | null>(() => {
		const start = pageNo || initialSurah;
		return String(quranListen).toLowerCase() === 'ar'
			? null
			: srcPattern
			? srcPattern(start)
			: buildDefault(start);
	});

	// Auto-play audio when language, surah, or src changes and isPlaying is true
	useEffect(() => {
		const el = audioRef.current;
		if (!el || !src) return;
		if (isPlaying) {
			el.play().catch(() => {}); // ignore autoplay block
		}
	}, [quranListen, pageNo, src, isPlaying]);

	console.log('language: ', quranListen);



	// ---------------- INIT SURAH VALIDATION ----------------
	useEffect(() => {
		if (!pageNo || pageNo < 1 || pageNo > TOTAL_SURAHS) {
			setPageNo(initialSurah);
			router.push(`/quran/${initialSurah}`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// ---------------- STATES ----------------
	const [duration, setDuration] = useState(0);
	const [current, setCurrent] = useState(0);
	const [volume, setVolume] = useState(0.9);
	const [showVolume, setShowVolume] = useState(false);
	// TR api data
	const [surahTwo, setSurahTwo] = useState<QuranAPIResponse | null>(null);
	const [loadingTwo, setLoadingTwo] = useState<boolean>(false);
	const [errorTwo, setErrorTwo] = useState<string | null>(null);
	const [playLoading, setPlayLoading] = useState(false);

	const resolveSrcForSurah = useCallback((surahNum: number, surahTwoState: QuranAPIResponse | null): string | null => {
		if (String(quranListen).toLowerCase() === 'ar') {
			return (
				surahTwoState?.audio?.[1]?.originalUrl ??
				surahTwoState?.audio?.[0]?.originalUrl ??
				null
			);
		} else {
			return srcPattern ? srcPattern(surahNum) : buildDefault(surahNum);
		}
	}, [quranListen, srcPattern]);

	// ---------------- FETCH + SRC SYNC ----------------
	useEffect(() => {
		const mode = String(quranListen).toLowerCase();

		if (mode !== 'ar') {
			// archive.org
			const surahNum = pageNo || initialSurah;
			const newUrl = srcPattern
				? srcPattern(surahNum)
				: buildDefault(surahNum);
			if (newUrl !== src) {
				setSrc(newUrl);
				const el = audioRef.current;
				if (el) {
					el.src = newUrl;
					el.load();
					setCurrent(0);
					setDuration(0);
				}
			}
			return;
		}

		// QuranAPI fetch for TR
		const surahNum = pageNo || initialSurah;
		if (lastFetchedSurahRef.current === surahNum && quranListen === 'tr')
			return;

		const controller = new AbortController();
		lastFetchedSurahRef.current = surahNum;

		(async () => {
			setLoadingTwo(true);
			setErrorTwo(null);
			try {
				const res = await fetch(
					`https://quranapi.pages.dev/api/${surahNum}.json`,
					{
						signal: controller.signal,
					}
				);
				if (!res.ok)
					throw new Error('HTTP Error! status: ' + res.status);
				const data = await res.json();
				setSurahTwo(data);
				setLoadingTwo(false);

				const audioUrl = resolveSrcForSurah(surahNum, data) || null;
				if (audioUrl !== src) {
					setSrc(audioUrl);
					const el = audioRef.current;
					if (el) {
						if (audioUrl) {
							el.src = audioUrl;
							el.load();
						} else {
							el.removeAttribute('src');
							el.load();
						}
						setCurrent(0);
						setDuration(0);
					}
				}
			} catch (err) {
				if (err.name === 'AbortError') return;
				setErrorTwo(err.message || String(err));
				setSurahTwo(null);
				setLoadingTwo(false);
				if (src !== null) {
					setSrc(null);
					const el = audioRef.current;
					if (el) {
						el.removeAttribute('src');
						el.load();
						setCurrent(0);
						setDuration(0);
					}
				}
			}
		})();

		return () => controller.abort();
	}, [pageNo, initialSurah, srcPattern, quranListen, resolveSrcForSurah, src]);

	// ---------------- AUDIO EVENTS + RAF TICK ----------------
	// keep UI in sync even if 'timeupdate' is flaky (common on some OGG/CORS cases)
	const startRaf = (): void => {
		cancelRaf();
		const step = (): void => {
			const el = audioRef.current;
			if (el) {
				setCurrent(el.currentTime || 0);
				// keep duration fresh; some browsers only firm it up during playback
				const d = Number.isFinite(el.duration) ? el.duration : 0;
				if (d && d !== duration) setDuration(d);
			}
			rafIdRef.current = requestAnimationFrame(step);
		};
		rafIdRef.current = requestAnimationFrame(step);
	};

	const cancelRaf = (): void => {
		if (rafIdRef.current) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}
	};

	useEffect(() => {
		const el = audioRef.current;
		if (!el) return;

		const onLoaded = () => {
			const d = Number.isFinite(el.duration) ? el.duration : 0;
			setDuration(d);
		};
		const onDurationChange = () => {
			const d = Number.isFinite(el.duration) ? el.duration : 0;
			setDuration(d);
		};
		const onProgress = () => {
			if (!duration) setCurrent(el.currentTime || 0);
		};
		const onTime = (): void => setCurrent(el.currentTime || 0);
		const onPlay = (): void => { startRaf(); };
		const onPause = (): void => { cancelRaf(); };
		const onEnded = (): void => { cancelRaf(); };
		const onError = (): void => { };

		el.addEventListener('loadedmetadata', onLoaded);
		el.addEventListener('durationchange', onDurationChange);
		el.addEventListener('progress', onProgress);
		el.addEventListener('timeupdate', onTime);
		el.addEventListener('play', onPlay);
		el.addEventListener('pause', onPause);
		el.addEventListener('ended', onEnded);
		el.addEventListener('error', onError);

		return () => {
			cancelRaf();
			el.removeEventListener('loadedmetadata', onLoaded);
			el.removeEventListener('durationchange', onDurationChange);
			el.removeEventListener('progress', onProgress);
			el.removeEventListener('timeupdate', onTime);
			el.removeEventListener('play', onPlay);
			el.removeEventListener('pause', onPause);
			el.removeEventListener('ended', onEnded);
			el.removeEventListener('error', onError);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// keep volume in sync
	useEffect(() => {
		const el = audioRef.current;
		if (el) el.volume = volume;
	}, [volume]);

	// ---------------- CONTROLS ----------------
	const togglePlay = async (): Promise<void> => {
		const el = audioRef.current;
		if (!el || !src) return;
		if (isPlaying) {
			el.pause();
			handleSetPlaying();
			return;
		}
		// If audio is not ready, show loading
		if (el.readyState < 3) { // HAVE_FUTURE_DATA
			setPlayLoading(true);
			const onCanPlay = () => {
				el.play().catch(() => {});
				handleSetPlaying();
				setPlayLoading(false);
				el.removeEventListener('canplaythrough', onCanPlay);
			};
			el.addEventListener('canplaythrough', onCanPlay);
			el.load();
			return;
		}
		try {
			await el.play();
			handleSetPlaying();
		} catch (error) {
			// autoplay blocked — ignore
		}
	};

	const getEffectiveDuration = (): number => {
		const el = audioRef.current;
		const d = Number.isFinite(duration) && duration > 0 ? duration : 0;
		if (d) return d;
		// fallback: seekable end if duration unavailable (helps with OGG/CORS)
		return el ? getSeekableEnd(el) : 0;
	};

	const seekToPercent = (pct: number): void => {
		const el = audioRef.current;
		if (!el) return;
		const effDur = getEffectiveDuration();
		if (!effDur) return;
		const t = Math.max(0, Math.min(1, pct)) * effDur;
		el.currentTime = t;
		setCurrent(t);
	};

	const changePage = (newPage: number): void => {
		if (newPage < 1 || newPage > TOTAL_SURAHS) return;
		if (pageNo === newPage) {
			router.push(`/quran/${newPage}`);
			return;
		}
		lastFetchedSurahRef.current = null;
		setPageNo(newPage);
		router.push(`/quran/${newPage}`);
	};

	const prev = (): void => {
		const cur = pageNo || initialSurah;
		changePage(Math.max(1, cur - 1));
	};

	const next = (): void => {
		const cur = pageNo || initialSurah;
		changePage(Math.min(TOTAL_SURAHS, cur + 1));
	};

	const fmt = (t: number): string => {
		if (!isFinite(t)) return '0:00';
		const m = Math.floor(t / 60);
		const s = Math.floor(t % 60)
			.toString()
			.padStart(2, '0');
		return `${m}:${s}`;
	};

	// Use effectiveDuration to compute percent (works for AR/OGG too)
	const effDuration = getEffectiveDuration();
	const percent = effDuration
		? Math.min(100, (current / effDuration) * 100)
		: 0;
	const currentSurah = pageNo || initialSurah;

	// ---------------- UI ----------------
	return (
		<div className="fixed bottom-0 left-0 right-0 z-50">
			<div className="w-full bg-emerald-700 text-white border-t border-emerald-600">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex flex-col md:flex-row items-center gap-3 py-3">
						{/* Left: Surah info */}
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-3">
								<div className="text-sm font-semibold">
									Surah {currentSurah}
								</div>
								<div className="hidden sm:block text-xs text-emerald-100/90">
									{String(quranListen).toLowerCase() === 'ar'
										? 'Turkish Translation (audio)'
										: 'Urdu Translation (audio)'}
								</div>
							</div>
						</div>

						{/* Middle: Controls */}
						<div className="flex-1 flex flex-col md:flex-row items-center gap-3">
							<div className="flex items-center gap-2">
								<button
									disabled={currentSurah === 1}
									onClick={prev}
									className={`${
										currentSurah === 1
											? 'p-2 text-gray-600 rounded hover:bg-emerald-600/60'
											: 'p-2 rounded hover:bg-emerald-600/60'
									}`}
									aria-label="Previous"
								>
									<SkipBack className="w-5 h-5" />
								</button>

								<button
									onClick={togglePlay}
									disabled={!src || loadingTwo || playLoading}
									className="inline-flex items-center gap-2 bg-emerald-900 px-3 py-1.5 rounded text-sm font-medium hover:bg-emerald-800 disabled:opacity-50"
									aria-label="Play / Pause"
								>
									{loadingTwo || playLoading ? (
										<svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
									) : isPlaying ? (
										<Pause className="w-4 h-4" />
									) : (
										<Play className="w-4 h-4" />
									)}
									<span className="hidden sm:inline">
										{loadingTwo || playLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
									</span>
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

							{/* Progress bar */}
							<div className="flex-1 px-3 w-full">
								<div
									className="relative h-2 bg-emerald-600/30 rounded-full cursor-pointer"
								onClick={(e: React.MouseEvent<HTMLDivElement>): void => {
									const rect =
										e.currentTarget.getBoundingClientRect();
									const pct =
										(e.clientX - rect.left) /
										rect.width;
									seekToPercent(pct);
								}}
								>
									<div
										className="absolute left-0 top-0 bottom-0 bg-white rounded-full"
										style={{ width: `${percent}%` }}
									/>
								</div>

								<div className="flex justify-between text-xs text-emerald-100 mt-1">
									<span>{fmt(current)}</span>
									<span>{fmt(effDuration || duration)}</span>
								</div>
							</div>
						</div>

						{/* Right: volume */}
						<div className="flex items-center gap-2">
							<div className="relative">
								<button
									onClick={() => setShowVolume((s) => !s)}
									className="p-2 rounded hover:bg-emerald-600/60"
									aria-label="Toggle volume"
								>
									{volume > 0 ? (
										<Volume className="w-5 h-5" />
									) : (
										<VolumeX className="w-5 h-5" />
									)}
								</button>

								{showVolume && (
									<div className="absolute right-0 bottom-12 w-40 bg-emerald-50 text-emerald-900 rounded shadow p-2">
										<input
											type="range"
											min={0}
											max={1}
											step={0.01}
											value={volume}
											onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
												setVolume(
													Number(e.target.value)
												)
											}
											className="w-full"
											aria-label="Volume"
										/>
									</div>
								)}
							</div>
						</div>
					</div>

					{String(quranListen).toLowerCase() === 'ar' && (
						<div className="text-xs text-emerald-100/80 px-4 pb-2">
							{loadingTwo && 'Loading audio...'}
							{errorTwo && `Audio load error: ${errorTwo}`}
							{!loadingTwo &&
								!errorTwo &&
								!surahTwo &&
								'No audio metadata available.'}
						</div>
					)}
				</div>
			</div>

			{/* Hidden audio element */}
			<audio
				ref={audioRef}
				src={src || undefined}
				preload="metadata"
				crossOrigin="anonymous"
			/>
		</div>
	);
}
