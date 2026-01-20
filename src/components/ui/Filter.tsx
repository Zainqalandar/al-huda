'use client';
import { SurhasList } from '@/context/SurhasListProvider';
import { ArrowUpDown, RotateCcw } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

type SortBy = 'id' | 'surahName' | 'totalAyah';
type Order = 'asc' | 'desc';

export default function Filter() {
	const { addFilterSurahs, surahs } = useContext(SurhasList);
	const [sortBy, setSortBy] = useState<SortBy>('id');
	const [order, setOrder] = useState<Order>('asc');

	useEffect(() => {
		if (surahs) {
			const saved = localStorage.getItem('filter');
			let initialSortBy: SortBy = 'id';
			let initialOrder: Order = 'asc';

			if (saved) {
				const parseSaved = JSON.parse(saved);
				const parsedSortBy = parseSaved?.sortBy;
				const parsedOrder = parseSaved?.order;

				if (
					parsedSortBy === 'id' ||
					parsedSortBy === 'surahName' ||
					parsedSortBy === 'totalAyah'
				) {
					initialSortBy = parsedSortBy;
				}

				if (parsedOrder === 'asc' || parsedOrder === 'desc') {
					initialOrder = parsedOrder;
				}

				setSortBy(initialSortBy);
				setOrder(initialOrder);
			}

			let sorted = [...surahs];
			sorted.sort((a, b) => {
				if (initialSortBy === 'surahName') {
					return initialOrder === 'asc'
						? a.surahName.localeCompare(b.surahName)
						: b.surahName.localeCompare(a.surahName);
				} else {
					return initialOrder === 'asc'
						? a[initialSortBy] - b[initialSortBy]
						: b[initialSortBy] - a[initialSortBy];
				}
			});
			addFilterSurahs(sorted);
		}
	}, [surahs]);

	useEffect(() => {
		if (surahs) {
			let sorted = [...surahs];
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
			addFilterSurahs(sorted);
			localStorage.setItem(
				'filter',
				JSON.stringify({
					sortBy: sortBy,
					order: order,
				})
			);
		}
	}, [sortBy, order, surahs]);

	const resetFilters = () => {
		setSortBy('id');
		setOrder('asc');
	};

	return (
		<div className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-[var(--quran-paper)] p-4 sm:p-5 shadow-[0_16px_40px_-28px_var(--quran-shadow)] backdrop-blur-sm mb-8">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_200px_at_20%_10%,rgba(31,122,93,0.15),transparent)]" />
			<div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100/80 text-emerald-800">
						<ArrowUpDown className="h-5 w-5" />
					</div>
					<div>
						<p className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--quran-emerald)] opacity-70">
							Refine
						</p>
						<span className="font-display text-lg text-[var(--quran-ink)]">
							Sort Surahs
						</span>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row gap-3 sm:items-center">
					<div className="flex flex-col">
						<label className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--quran-emerald)] opacity-70">
							Sort by
						</label>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as SortBy)}
							className="mt-1 px-4 py-2 border border-emerald-200/80 rounded-xl bg-white/80 text-[var(--quran-ink)] font-medium shadow-sm hover:border-emerald-300 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
						>
							<option value="id">Number</option>
							<option value="surahName">Name</option>
							<option value="totalAyah">Ayahs</option>
						</select>
					</div>

					<button
						onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
						className="mt-4 sm:mt-5 px-4 py-2 rounded-xl font-semibold shadow-sm transition-all cursor-pointer duration-200 bg-[var(--quran-emerald)] text-white hover:bg-[var(--quran-emerald-deep)]"
					>
						{order === 'asc' ? 'Ascending' : 'Descending'}
					</button>

					<button
						onClick={resetFilters}
						className="mt-4 sm:mt-5 flex items-center gap-2 px-4 py-2 cursor-pointer rounded-xl border border-amber-200/80 text-amber-800 bg-amber-50/70 font-semibold shadow-sm transition-all duration-200 hover:bg-amber-100"
					>
						<RotateCcw className="w-4 h-4" />
						Reset
					</button>
				</div>
			</div>
		</div>
	);
}
