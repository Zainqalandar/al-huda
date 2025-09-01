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
import { QuranData } from '@/app/DataProvider';
import { useRouter } from 'next/navigation';

let totalPages = 114; // ❌❌

export default function QuranAudioBottomBar({ initialSurah = 1, srcPattern }) {
	// chosen surah (1..114)
	const [surah, setSurah] = useState(initialSurah);
	const { pageNo, setPageNo } = useContext(QuranData);

	const router = useRouter();

	// computed audio source URL (you can pass custom pattern via props)
	const buildDefault = (n) =>
		`https://ia801503.us.archive.org/28/items/quran_urdu_audio_only/${String(
			n
		).padStart(3, '0')}.ogg`;

	const getSrc = (n) => (srcPattern ? srcPattern(n) : buildDefault(n));
	const [src, setSrc] = useState(getSrc(initialSurah));

	// audio refs & state
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [current, setCurrent] = useState(0);
	const [volume, setVolume] = useState(0.9);
	const [showVolume, setShowVolume] = useState(false);

	// update src when surah changes
	useEffect(() => {
		const url = getSrc(surah);
		setSrc(url);
		setCurrent(0);
		setDuration(0);

		const el = audioRef.current;
		if (el) {
			el.src = url;
			el.load();
			// if previously playing, attempt to continue (may be blocked)
			if (isPlaying) {
				el.play().catch(() => {});
			}
		}
	}, [surah]);

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

	// controls
	const togglePlay = async () => {
		const el = audioRef.current;
		if (!el) return;
		try {
			if (el.paused) await el.play();
			else el.pause();
		} catch {
			// ignore autoplay blocked
		}
	};

	const seekToPercent = (pct) => {
		const el = audioRef.current;
		if (!el || !isFinite(duration) || duration <= 0) return;
		const t = Math.max(0, Math.min(1, pct)) * duration;
		el.currentTime = t;
		setCurrent(t);
	};

	const nextVerse = () => {
		if (pageNo < totalPages) {
			const nextPage = pageNo + 1;
			setPageNo(nextPage);
			router.push(`/quran/${nextPage}`);
		}
	};

	const prevVerse = () => {
       console.log("pageNo ", pageNo)
		if (pageNo > 0) {
			const prevPage = pageNo - 1;
			setPageNo(prevPage);
			router.push(`/quran/${prevPage}`);
		}
	};

	const prev = () => {
		setSurah((s) => Math.max(1, s - 1));
        prevVerse();
	};
	const next = () => {
		setSurah((s) => Math.min(114, s + 1));
        nextVerse();
	};

	// volume sync
	useEffect(() => {
		const el = audioRef.current;
		if (el) el.volume = volume;
	}, [volume]);

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

	return (
		// fixed bottom, full-width bar
		<div className="fixed bottom-0 left-0 right-0 z-50">
			{/* container centers content but bar spans full width visually */}
			<div className="w-full bg-emerald-700 text-white border-t border-emerald-600">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex flex-col md:flex-row items-center gap-3 py-3">
						{/* Left: Surah info (compact) */}
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-3">
								<div className="text-sm font-semibold">
									Surah {surah}
								</div>
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
									{isPlaying ? (
										<Pause className="w-4 h-4" />
									) : (
										<Play className="w-4 h-4" />
									)}
									<span className="hidden sm:inline">
										{isPlaying ? 'Pause' : 'Play'}
									</span>
								</button>

								<button
									onClick={next}
                                    disabled={pageNo === totalPages}
									className={`
                                        ${
                                            pageNo === totalPages
                                            ? 'p-2 text-gray-600 rounded hover:bg-emerald-600/60'
                                            : 'p-2 rounded hover:bg-emerald-600/60'
                                        }
                                        `}
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
										const rect =
											e.target.getBoundingClientRect();
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
											onChange={(e) =>
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
				</div>
			</div>

			{/* hidden audio element */}
			<audio ref={audioRef} src={src} preload="metadata" />
		</div>
	);
}
