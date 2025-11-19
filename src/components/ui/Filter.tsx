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
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-green-100 via-green-50 to-green-100 border border-green-300 rounded-2xl shadow-lg p-5 mb-8">
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-200">
					<ArrowUpDown className="w-6 h-6 text-green-800" />
				</div>
				<span className="text-green-900 font-bold text-lg tracking-wide">
					Sort Surahs
				</span>
			</div>

			<div className="flex flex-col sm:flex-row gap-3 sm:items-center">
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value as SortBy)}
					className="px-4 py-2 border border-green-300 rounded-lg bg-green-50 text-green-900 font-medium shadow-sm hover:border-green-400 focus:ring-2 focus:ring-green-400 focus:outline-none"
				>
					<option value="id">By Number</option>
					<option value="surahName">By Name</option>
					<option value="totalAyah">By Ayahs</option>
				</select>

				<button
					onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
					className={`
						px-4 py-2 rounded-lg font-semibold shadow-sm transition-all cursor-pointer duration-200 bg-green-600 text-white hover:bg-green-700
						
					`}
				>
					{order === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
				</button>

				<button
					onClick={resetFilters}
					className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-sm transition-all duration-200"
				>
					<RotateCcw className="w-5 h-5" />
					Reset
				</button>
			</div>
		</div>
	);
}
