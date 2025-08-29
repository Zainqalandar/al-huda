'use client';
import React, { useEffect, useState } from 'react';
import { Info, Play, BookOpen, Eye } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import { useParams } from 'next/navigation';

export default function SurahDetail() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [surah, setSurah] = useState(null);

	const { id } = useParams();

	const [tab, setTab] = useState('translation');

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`https://quranapi.pages.dev/api/${id}.json`
				);

				if (!res.ok) {
					throw new Error('HTTP Error! status: ', res.status);
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
	}, []);

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

			{/* Info & Audio */}
			<div className="flex items-center justify-center gap-8 mb-6">
				<button className="flex items-center gap-2 text-green-300 hover:text-white transition font-medium">
					<Info className="w-5 h-5" />
					Surah Info
				</button>
				<button className="flex items-center gap-2 text-green-300 hover:text-white transition font-medium">
					<Play className="w-5 h-5" />
					Play Audio
				</button>
			</div>

			{/* Quranic Text */}
			<div className=" text-2xl md:text-3xl leading-loose font-arabic text-green-100 tracking-wide">
				{surah?.arabic1.map((verses, index) => (
					<React.Fragment key={index}>
						{/* <p>{verses } ({++index})</p> */}

						<div className="bg-green-900/95 rounded-2xl p-6 shadow-lg max-w-4xl mx-auto">
							<div
								className="text-3xl md:text-4xl leading-loose font-arabic text-green-50 tracking-wide text-right"
								dir="rtl"
							>
								{surah?.arabic1.join(`۝ `)}
							</div>
						</div>

						{/* Har 15th element ke baad separator */}
						{(index + 1) % 15 === 0 && (
							<div className="w-full max-w-xl border-t border-green-500/30 my-8 mx-auto"></div>
						)}
					</React.Fragment>
				))}
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
