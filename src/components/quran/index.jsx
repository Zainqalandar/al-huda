'use client';
import { useCallback, useEffect, useState } from 'react';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import Filter from '../ui/Filter';
import Link from 'next/link';
import useSurahList from '@/hooks/useSurahList';

export default function SurahList() {
	const [surah, setSurah] = useState(null);
	const [sortBy, setSortBy] = useState('id');
	const [order, setOrder] = useState('asc');
	
	const { surahList, loading, error } = useSurahList();

	useEffect(() => {
		if (surahList) setSurah(surahList);
	}, [surahList]);

	useEffect(() => {
		if (surah) {
			let sorted = [...surah];
			sorted.sort((a, b) => {
				if (sortBy === 'surahName') {
					return order === 'asc'
						? a.surahName.localeCompare(b.surahName)
						: b.surahName.localeCompare(a.surahName);
				} else {
					return order === 'asc'
						? a[sortBy] - b[sortBy]
						: b[sortBy] - a[sortBy];
				}
			});
			setSurah(sorted);
		}
	}, [sortBy, order]);

	const resetFilters = useCallback(() => {
		setSortBy('id');
		setOrder('asc');
	}, []);

	if (loading) return <Loading />;
	if (error) return <Error message={error} />;

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10 px-4">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-green-800 text-center mb-8">
					📖 Surahs of the Holy Quran
				</h1>

				<Filter
					sortBy={sortBy}
					setSortBy={setSortBy}
					order={order}
					setOrder={setOrder}
					resetFilters={resetFilters}
				/>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{surah?.map((surah) => (
						<Link
							href={`/quran/${surah.id}`}
							key={surah.id}
							className="bg-white border border-green-200 rounded-xl shadow-md hover:shadow-lg transition p-5 flex items-center justify-between"
						>
							<div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-green-600 text-white font-bold text-lg">
								{surah.id}
							</div>

							<div className="flex-1 px-4">
								<h2 className="text-lg font-semibold text-green-900">
									{surah.surahName}
								</h2>
								<p className="text-sm text-green-700">
									{surah.surahNameTranslation}
								</p>
								<p className="text-xs text-green-500">
									{surah.totalAyah} Ayahs
								</p>
							</div>

							<div className="text-green-800 font-bold text-xl">
								{surah.surahNameArabic}
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
