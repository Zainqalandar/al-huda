import SurahList from '@/components/quran';
import Filter from '@/components/ui/Filter';

const QuranPage = () => {
	return (
		<div className="mt-[57px] min-h-screen font-body text-[var(--quran-ink)]">
			<div className="relative min-h-screen overflow-hidden bg-[radial-gradient(1200px_480px_at_50%_-200px,rgba(31,122,93,0.25),transparent)]">
				<div className="pointer-events-none absolute -top-32 right-[-20%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(199,154,66,0.45),transparent_70%)] blur-2xl" />
				<div className="pointer-events-none absolute bottom-[-160px] left-[-10%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(31,122,93,0.35),transparent_70%)] blur-2xl" />
				<div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(640px_260px_at_10%_20%,rgba(20,52,43,0.12),transparent)]" />

				<div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:pt-16">
					<div className="text-center">
						<p className="text-[11px] uppercase tracking-[0.3em] text-[var(--quran-emerald)]">
							Al-Huda Quran
						</p>
						<h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--quran-ink)] mt-3 quran-fade-up">
							Surahs of the Holy Quran
						</h1>
						<p className="mt-3 text-sm sm:text-base text-[color:var(--quran-emerald-deep)] opacity-80 max-w-2xl mx-auto">
							Explore every Surah with calm focus, rich typography, and clear navigation.
							Sort by name, number, or ayahs to find what you need quickly.
						</p>
					</div>

					<div className="mt-10">
						<Filter />
						<SurahList />
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuranPage;
