'use client';
import { useEffect, useState } from 'react';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import Filter from '../ui/Filter';
import Link from 'next/link';

export default function SurahList() {
	const [surahList, setSurahList] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [sortBy, setSortBy] = useState('number');
	const [order, setOrder] = useState('asc');

	useEffect(() => {
		if (surahList) {
			let sorted = [...surahList];
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
			setSurahList(sorted);
		}
	}, [sortBy, order]);

	const resetFilters = () => {
		setSortBy('number');
		setOrder('asc');
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					'https://quranapi.pages.dev/api/surah.json'
				);

				if (!res.ok) {
					throw new Error('HTTP Error! status: ', res.status);
				}

				const data = await res.json();

				setSurahList(data);
				setLoading(false);
			} catch (error) {
				console.log(error.message);
				setError(error.message);
				setSurahList(null);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	console.log('surahs: ', surahList);

	if (loading) return <Loading />;
	if (error) return <Error message={error} />;

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10 px-4">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-green-800 text-center mb-8">
					📖 Surahs of the Holy Quran
				</h1>

				{/* Filter Component */}
				<Filter
					sortBy={sortBy}
					setSortBy={setSortBy}
					order={order}
					setOrder={setOrder}
					resetFilters={resetFilters}
				/>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{surahList?.map((surah, index) => (
						<Link
                        href={`/quran/${++index}`}
							key={index}
							className="bg-white border border-green-200 rounded-xl shadow-md hover:shadow-lg transition p-5 flex items-center justify-between"
						>
							<div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-green-600 text-white font-bold text-lg">
								{sortBy == 'number' ? ++index : ''}
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
