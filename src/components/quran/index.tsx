'use client';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import Link from 'next/link';
import { useContext } from 'react';
import { SurhasList } from '@/context/SurhasListProvider';

interface Surah {
	id: number;
	surahName: string;
	surahNameArabic: string;
	surahNameTranslation: string;
	totalAyah: number;
}



export default function SurahList() {
	const { loading, error, filterSurahs: surahs } = useContext(SurhasList);

	if (loading) return <Loading />;
	if (error) return <Error message={error} />;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
			{surahs?.map((surah: Surah, index: number) => (
				<Link
					href={`/quran/${surah.id}`}
					key={surah.id}
					style={{ animationDelay: `${index * 40}ms` }}
					className="group relative block quran-fade-up"
				>
					<div className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(31,122,93,0.2),rgba(199,154,66,0.2))] opacity-0 transition duration-200 group-hover:opacity-100" />
					<div className="relative flex h-full flex-col gap-4 rounded-2xl border border-emerald-200/70 bg-[var(--quran-paper)] p-5 shadow-[0_12px_32px_-24px_var(--quran-shadow)] backdrop-blur-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-24px_var(--quran-shadow)]">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-4">
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--quran-emerald)] text-white text-lg font-semibold shadow-sm">
									{surah.id}
								</div>
								<div>
									<h2 className="font-display text-xl text-[var(--quran-ink)]">
										{surah.surahName}
									</h2>
									<p className="text-sm text-[color:var(--quran-emerald-deep)] opacity-80">
										{surah.surahNameTranslation}
									</p>
								</div>
							</div>
							<div className="text-right">
								<div className="arabic-font text-2xl text-[var(--quran-ink)]">
									{surah.surahNameArabic}
								</div>
								<p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--quran-emerald)] opacity-70">
									Surah
								</p>
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-2 text-xs">
							<span className="rounded-full bg-emerald-100/80 px-3 py-1 font-semibold text-emerald-900">
								Ayahs {surah.totalAyah}
							</span>
							<span className="rounded-full bg-amber-100/70 px-3 py-1 font-semibold text-amber-800">
								Quran
							</span>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}
