'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Info, Play, BookOpen, Eye, Pause } from 'lucide-react'; // Icons
import Loading from '@/components/ui/Loading'; // Custom loading spinner
import { useParams } from 'next/navigation';

export default function SurahDetail() {
	const [loading, setLoading] = useState(true); // Loading state
	const [error, setError] = useState(null); // Error state
	const [surah, setSurah] = useState(null); // Surah data

	const [surahTwo, setSurahTwo] = useState(null); // Surah data
	const [errorTwo, setErrorTwo] = useState(null); // Error state
	const [loadingTwo, setLoadingTwo] = useState(true); // Loading state╬

	const [isPlaying, setIsPlaying] = useState(false);

	const { id } = useParams(); // Dynamic route param for Surah ID

	const audioRef = useRef(null);


	console.log('surahTwo?.audio[1]?.originalUrl', surahTwo);

	useEffect(() => {
		const fetchDataTwo = async () => {
			try {
				setLoadingTwo(true);
				const res = await fetch(
					`https://quranapi.pages.dev/api/${id}.json`
				);

				if (!res.ok) {
					throw new Error('HTTP Error! status: ' + res.status);
				}

				const data = await res.json();

				setSurahTwo(data);
				console.log('data', data);
				setTimeout(() => {

					setLoadingTwo(false);
					
				}, 3000);
			} catch (error) {
				console.log(error.message);
				setErrorTwo(error.message);
				setSurahTwo(null);
			} finally {
				setLoadingTwo(false);
			}
		};
		const fetchSurah = async () => {
			try {
				// Fetching Surah detail from API
				const res = await fetch(
					`https://api.alquran.cloud/v1/surah/${id}`
				);
				if (!res.ok) throw new Error('Failed to fetch Surah');
				const data = await res.json();
				setSurah(data.data); // Store Surah details
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false); // Stop loader
			}
		};

		fetchSurah();
		fetchDataTwo();
	}, [id]);

	console.log("loadingTwo", loadingTwo)

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

	if (loading) return <Loading />; // Show loader
	if (error) return <p className="text-red-500">{error}</p>; // Show error if any

	return (
		<div className="min-h-screen mt-16 bg-green-50 p-6 flex flex-col items-center">
			{/* Card Container */}
			<div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 border border-green-200">
				{/* Surah Name Section */}
				<h1 className="text-3xl font-bold text-green-800 text-center">
					{surah.englishName} ({surah.englishNameTranslation})
				</h1>
				<p className="text-lg text-green-600 text-center mb-4">
					Surah {surah.name} - {surah.revelationType} (
					{surah.numberOfAyahs} Ayahs) 
				</p>

				{/* Info Icons */}
				<div className="flex justify-center gap-6 my-4">
					<button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700">
						<Info size={18} /> Info
					</button>
					<button
						onClick={handleAudioToggle}
						className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700"
					>
						{isPlaying ? (
							<>
								<Pause size={18} /> {loadingTwo? "Loading..." : "Listen"}
							</>
						) : (
							<>
								<Play size={18} /> {loadingTwo? "Loading..." : "Listen"}
							</>
						)}
					</button>
					<button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700">
						<BookOpen size={18} /> Tafsir
					</button>
				</div>

				<audio
					ref={audioRef}
					src={`${surahTwo?.audio[1]?.originalUrl}`}
					onEnded={() => setIsPlaying(false)}
				/>

				{/* Ayahs List */}
				<div className="mt-6 space-y-6">
					{surah.ayahs.map((ayah) => (
						<div
							key={ayah.number}
							className="p-4 bg-green-100 border border-green-200 rounded-xl shadow-sm hover:shadow-md transition"
						>
							{/* Arabic Text (Solid Green Color) */}
							<p className="text-2xl text-green-900 text-right leading-relaxed font-medium">
								{ayah.text}۝
							</p>

							{/* Ayah Number & Options */}
							<div className="flex justify-between items-center mt-3">
								<span className="text-sm text-green-700">
									Ayah {ayah.numberInSurah}
								</span>
								<button className="flex items-center gap-1 text-green-600 hover:text-green-800">
									<Eye size={16} /> View
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
