'use client';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import Link from 'next/link';
import { useContext } from 'react';
import { SurhasList } from '@/context/SurhasListProvider';

export default function SurahList() {
	const { loading, error, filterSurahs:surahs } = useContext(SurhasList);


	if (loading) return <Loading />;
	if (error) return <Error message={error} />;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{surahs?.map((surah) => (
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
	);
}
