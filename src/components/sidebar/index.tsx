'use client';
import { useContext, useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import { useParams } from 'next/navigation';
import QuranPageBtn from '@/components/ui/QuranPageBtn';
import ErrorUI from '@/components/ui/Error';
import { SurhasList } from '@/context/SurhasListProvider';


const QuranPage = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [surah, setSurah] = useState(null);

	const { setPageNo } = useContext(SurhasList);


	const [surahTwo, setSurahTwo] = useState(null);
	const [errorTwo, setErrorTwo] = useState(null);
	const [loadingTwo, setLoadingTwo] = useState(true);


	const { id } = useParams() as { id?: string | string[] } | undefined;

	useEffect(() => {
		// normalize param to a single numeric pageNo
		const rawId = Array.isArray(id) ? id[0] : id;
		const n = rawId !== undefined ? Number(rawId) : undefined;
		if (typeof n === 'number' && !Number.isNaN(n)) setPageNo(n);
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
				setLoadingTwo(false);
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



	if (loading) return <Loading />; // Show loader
	if (error || error === undefined) return <ErrorUI message={error} />; // Show error if any
	return (
		<div className="relative min-h-screen w-full font-body text-[var(--quran-ink)]">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_-200px,rgba(31,122,93,0.24),transparent)]" />
			<div className="pointer-events-none absolute -top-24 right-[-12%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(199,154,66,0.4),transparent_70%)] blur-2xl" />
			<div className="pointer-events-none absolute bottom-[-140px] left-[-8%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(31,122,93,0.35),transparent_70%)] blur-2xl" />

			<div className="relative mx-auto max-w-4xl px-4 pb-20 pt-6 sm:pt-10">
				<section className="rounded-3xl border border-emerald-200/70 bg-[var(--quran-paper)] p-6 sm:p-8 shadow-[0_20px_50px_-30px_var(--quran-shadow)] backdrop-blur-sm">
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
							<div>
								<p className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--quran-emerald)] opacity-70">
									Surah {surah?.number}
								</p>
								<h1 className="font-display text-3xl sm:text-4xl text-[var(--quran-ink)]">
									{surah?.englishName}
								</h1>
								<p className="text-sm text-[color:var(--quran-emerald-deep)] opacity-80">
									{surah?.englishNameTranslation}
								</p>
							</div>
							<div className="text-right">
								<div className="arabic-font text-3xl text-[var(--quran-ink)]">
									{surah?.name}
								</div>
								<p className="text-xs text-[color:var(--quran-emerald-deep)] opacity-70">
									Revelation: {surah?.revelationType}
								</p>
							</div>
						</div>

						<div className="flex flex-wrap gap-2 text-xs">
							<span className="rounded-full bg-emerald-100/80 px-3 py-1 font-semibold text-emerald-900">
								{surah?.numberOfAyahs} Ayahs
							</span>
							<span className="rounded-full bg-amber-100/80 px-3 py-1 font-semibold text-amber-900">
								{surah?.revelationType}
							</span>
						</div>

						<QuranPageBtn btnInfo={{ loadingTwo, surahTwo }} />
					</div>
				</section>

				<section className="mt-10 space-y-6">
					{surah?.ayahs?.map((ayah, index) => (
						<article
							key={ayah.number}
							style={{ animationDelay: `${index * 25}ms` }}
							className="group relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-white/80 p-5 sm:p-6 shadow-[0_16px_40px_-28px_var(--quran-shadow)] transition-all duration-200 quran-fade-up"
						>
							<div className="pointer-events-none absolute inset-0 opacity-0 transition duration-200 group-hover:opacity-100 bg-[radial-gradient(520px_200px_at_10%_10%,rgba(31,122,93,0.16),transparent)]" />
							<div className="relative">
								<div className="flex items-center justify-between">
									<span className="inline-flex items-center rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-900">
										Ayah {ayah.numberInSurah}
									</span>
									<button className="flex items-center gap-1 rounded-full bg-[var(--quran-emerald)] text-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-[var(--quran-emerald-deep)] focus:outline-none focus:ring-2 focus:ring-emerald-200 transition">
										<Eye size={16} /> View
									</button>
								</div>

								<p className="mt-4 text-2xl sm:text-3xl text-right leading-relaxed arabic-font text-[var(--quran-ink)]">
									{ayah.text}{' '}
									<span className="text-amber-500 text-lg align-middle">۝</span>
								</p>
							</div>
						</article>
					))}
				</section>
			</div>
		</div>
	);
};

export default QuranPage;
