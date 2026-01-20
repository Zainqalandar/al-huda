
'use client';
import React, { useState, useRef } from 'react';
import { Info, Play, Pause } from 'lucide-react';

interface InfoDropDownProps {
    surah?: any;
}

const InfoDropDown: React.FC<InfoDropDownProps> = ({ surah }) => {
	const [open, setOpen] = useState<boolean>(false);
	const [currentAudio, setCurrentAudio] = useState<string | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const handlePlay = (url?: string) => {
		if (!url) return;
		if (currentAudio === url) {
			audioRef.current?.pause();
			setCurrentAudio(null);
		} else {
			if (audioRef.current) {
				audioRef.current.src = url;
				audioRef.current.play();
				setCurrentAudio(url);
			}
		}
	};


	return (
		<div className="relative">
			<button
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				aria-haspopup="true"
				className="flex items-center gap-2 rounded-xl bg-[var(--quran-emerald)] text-white px-4 py-2 shadow hover:bg-[var(--quran-emerald-deep)] transition"
			>
				<Info size={18} /> Info
			</button>

			{open && (
				<div className="absolute left-0 mt-3 z-20 w-[min(92vw,420px)] max-h-[80vh] overflow-y-auto rounded-2xl border border-emerald-200/70 bg-[var(--quran-paper)] shadow-2xl">
						{surah ? (
						<div className="p-4 space-y-4 text-sm text-[var(--quran-ink)]">
								<div>
									<div className="flex items-start justify-between gap-3">
										<div>
											<p className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--quran-emerald)] opacity-70">
												Surah Info
											</p>
											<h2 className="arabic-font text-2xl text-[var(--quran-ink)]">
												{surah.surahNameArabicLong}
											</h2>
											<p className="text-sm text-[color:var(--quran-emerald-deep)] opacity-80">
												{surah.surahName} - {surah.surahNameTranslation}
											</p>
										</div>
										<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
											#{surah.surahNo}
										</span>
									</div>
									<div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-emerald-900">
										<span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold">
											{surah.revelationPlace}
										</span>
										<span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-800">
											{surah.totalAyah} Ayahs
										</span>
									</div>
								</div>
								<div>
									<h3 className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--quran-emerald)] opacity-70 mb-2">
										Recitations
									</h3>
									<ul className="space-y-2">
										{(surah && surah.audio ? (Object.values(surah.audio) as Array<{ reciter?: string; url?: string }>) : []).map((reciter, idx) => {
											const active = currentAudio === reciter.url;
											return (
												<li
													key={idx}
													className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
														active
															? 'border-emerald-300 bg-emerald-50'
															: 'border-emerald-100/80 bg-white/80'
													}`}
												>
													<span className="text-sm text-[var(--quran-ink)]">
														{reciter.reciter || 'Reciter'}
													</span>
													<button
														onClick={() => handlePlay(reciter.url)}
														className="p-2 rounded-full bg-[var(--quran-emerald)] text-white hover:bg-[var(--quran-emerald-deep)] transition"
														aria-label={active ? 'Pause recitation' : 'Play recitation'}
													>
														{active ? <Pause size={16} /> : <Play size={16} />}
													</button>
												</li>
											);
										})}
									</ul>
								</div>
							</div>
						) : (
							<p className="p-4 text-sm text-[color:var(--quran-emerald-deep)] opacity-80">Loading...</p>
						)}
					</div>
			)}
			<audio ref={audioRef} onEnded={() => setCurrentAudio(null)} />
		</div>
	);
};

export default InfoDropDown;
