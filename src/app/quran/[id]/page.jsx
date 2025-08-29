'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Info, Play, Pause, BookOpen, Eye } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function SurahDetail() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [surah, setSurah] = useState(null);

	const { id } = useParams();

	const [tab, setTab] = useState('translation');
	const [isPlaying, setIsPlaying] = useState(false);

	// Audio Ref
	const audioRef = useRef(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`https://quranapi.pages.dev/api/${id}.json`
				);

				if (!res.ok) {
					throw new Error('HTTP Error! status: ' + res.status);
				}

				const data = await res.json();

				setSurah(data);
				setLoading(false);
			} catch (error) {
				console.log(error.message);
				setError(error.message);
				setSurah(null);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	// Toggle Play/Pause
	const handleAudioToggle = () => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		} else {
			audioRef.current.play();
			setIsPlaying(true);
		}
	};

	if (loading) return <Loading />;
	if (error) return <Error message={error} />;

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-950 flex flex-col items-center justify-start py-10 px-4 text-center text-white mt-16">
			{/* Tabs */}
			<div className="flex gap-4 bg-green-700/40 backdrop-blur-md border border-green-400 rounded-full p-2 mb-8 shadow-lg">
				<button
					onClick={() => setTab('translation')}
					className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition ${
						tab === 'translation'
							? 'bg-green-600 text-white shadow'
							: 'text-green-200 hover:text-white'
					}`}
				>
					<BookOpen className="w-5 h-5" />
					Translation
				</button>
				<button
					onClick={() => setTab('reading')}
					className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition ${
						tab === 'reading'
							? 'bg-green-600 text-white shadow'
							: 'text-green-200 hover:text-white'
					}`}
				>
					<Eye className="w-5 h-5" />
					Reading
				</button>
			</div>

			{/* Surah Title */}
			<h2 className="text-2xl md:text-3xl font-arabic font-bold mb-6">
				{surah?.surahNameArabicLong}
			</h2>

			{/* Bismila */}

			<div className="flex justify-center items-center mb-6">
				<Image
					src="/basmalah/b.png"
					alt="Basmalah"
					width={500}
					height={500}
					className="w-full opacity-[0.9] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain"
				/>
			</div>

			{/* Info & Audio */}
			<div className="flex items-center justify-center gap-8 mb-6">
				<button className="flex items-center gap-2 text-green-300 hover:text-white transition font-medium">
					<Info className="w-5 h-5" />
					Surah Info
				</button>
				<button
					onClick={handleAudioToggle}
					className="flex items-center gap-2 text-green-300 hover:text-white transition font-medium"
				>
					{isPlaying ? (
						<Pause className="w-5 h-5" />
					) : (
						<Play className="w-5 h-5" />
					)}
					{isPlaying ? 'Pause Audio' : 'Play Audio'}
				</button>
			</div>

			{/* Hidden Audio Element */}
			<audio
				ref={audioRef}
				src={`${surah?.audio[1]?.originalUrl}`}
				onEnded={() => setIsPlaying(false)}
			/>

			{/* Quranic Text */}
			<div className=" text-2xl md:text-3xl leading-loose font-arabic text-green-100 tracking-wide">
				<div className="bg-green-900/95 rounded-2xl p-6 shadow-lg max-w-4xl mx-auto">
					<div
						className="text-3xl md:text-4xl leading-loose font-arabic text-green-50 tracking-wide text-right"
						dir="rtl"
					>
						{surah?.arabic1
							.filter(
								(arb) =>
									arb !==
									'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ'
							)
							.join(' ۝ ')}
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="w-full max-w-xl border-t border-green-500/30 my-8"></div>

			{/* Navigation Buttons */}
			<div className="flex justify-center gap-4">
				<button className="px-6 py-2 rounded-lg bg-green-700 hover:bg-green-800 transition font-semibold shadow">
					Beginning of Surah
				</button>
				<button className="px-6 py-2 rounded-lg bg-green-700 hover:bg-green-800 transition font-semibold shadow">
					Next Surah →
				</button>
			</div>
		</div>
	);
}
