'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Eye } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import { useParams } from 'next/navigation';
import QuranPageBtn from '@/components/ui/QuranPageBtn';
import Error from '@/components/ui/Error';
import { SurhasList } from '@/context/SurhasListProvider';


const QuranPage = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [surah, setSurah] = useState(null);

	const { setPageNo } = useContext(SurhasList);


	const [surahTwo, setSurahTwo] = useState(null);
	const [errorTwo, setErrorTwo] = useState(null);
	const [loadingTwo, setLoadingTwo] = useState(true);
	const [isPlaying, setIsPlaying] = useState(false);


	const { id } = useParams();
	const audioRef = useRef(null);

	useEffect(() => {
		setPageNo(JSON.parse(id));
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
				setTimeout(() => {
					setLoadingTwo(false);
				}, 3000);
			} catch (error) {
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
				if (!res.ok) {
					throw new Error('Failed to fetch Surah');
				}
				const data = await res.json();
				setSurah(data.data); // Store Surah details
				setError(null);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false); // Stop loader
			}
		};

		fetchSurah();
		fetchDataTwo();
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

	if (loading) return <Loading />; // Show loader
	if (error || error === undefined) return <Error message={error} />; // Show error if any
	return (
		<div className="min-h-screen bg-green-50 p-2 sm:p-6 flex flex-col items-center">
			<div className="bg-white rounded-2xl  shadow-lg w-full max-w-3xl p-4 sm:p-6 border border-green-200">
				<h1 className="text-3xl font-bold text-green-800 text-center">
					{surah?.englishName} ({surah?.englishNameTranslation})
				</h1>
				<p className="text-lg text-green-600 text-center mb-4">
					Surah {surah?.name} - {surah?.revelationType} (
					{surah?.numberOfAyahs} Ayahs)
				</p>

				<QuranPageBtn
					btnInfo={{ handleAudioToggle, isPlaying, loadingTwo, surahTwo }}
				/>

				<audio
					ref={audioRef}
					src={`https://ia801503.us.archive.org/28/items/quran_urdu_audio_only/002.ogg`}
					onEnded={() => setIsPlaying(false)}
				/>

				<div className="mt-6 space-y-6">
					{surah?.ayahs?.map((ayah) => (
						<div
							key={ayah.number}
							className="p-4 bg-green-100 border border-green-200 rounded-xl shadow-sm hover:shadow-md transition"
						>
							<p className="text-2xl text-green-900 text-right leading-relaxed font-medium">
								{ayah.text}۝
							</p>

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
};

export default QuranPage;
