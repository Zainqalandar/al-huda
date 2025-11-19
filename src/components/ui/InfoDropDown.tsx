
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
		<>
			<button
				onClick={() => setOpen(!open)}
				className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow cursor-pointer hover:bg-green-700"
			>
				<Info size={18} /> Info
			</button>

			{open && (
				<div className="relative inline-block text-left w-full sm:w-auto">
					<div className="absolute top-[-20px] sm:top-[38px] sm:left-[-106px] z-20 mt-2 right-0 w-full sm:w-96 max-h-[80vh] overflow-y-auto rounded-xl shadow-lg bg-green-50 border border-green-200">
						{surah ? (
							<div className="p-4 space-y-4 text-sm text-green-900">
								<div>
									<h2 className="text-xl font-bold text-green-900 sm:text-red-900">
										{surah.surahNameArabicLong} ({surah.surahNo})
									</h2>
									<p className="text-sm text-green-700">
										{surah.surahName} - {surah.surahNameTranslation}
									</p>
									<p className="mt-1 text-xs text-green-600">
										Revealed in {surah.revelationPlace} · {surah.totalAyah} Ayahs
									</p>
								</div>
								<div>
									<h3 className="font-semibold text-green-800 mb-2">Recitations</h3>
									<ul className="space-y-2">
										{(surah && surah.audio ? (Object.values(surah.audio) as Array<{ reciter?: string; url?: string }>) : []).map((reciter, idx) => (
											<li key={idx} className="flex items-center justify-between bg-green-100 rounded-lg p-2">
												<span className="text-sm">{reciter.reciter}</span>
												<button onClick={() => handlePlay(reciter.url)} className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700">
													{currentAudio === reciter.url ? <Pause size={16} /> : <Play size={16} />}
												</button>
											</li>
										))}
									</ul>
								</div>
							</div>
						) : (
							<p>Loading...</p>
						)}
					</div>
					<audio ref={audioRef} onEnded={() => setCurrentAudio(null)} />
				</div>
			)}
		</>
	);
};

export default InfoDropDown;
