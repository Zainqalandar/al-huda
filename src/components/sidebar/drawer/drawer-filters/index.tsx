import { Search } from 'lucide-react';
import React from 'react';

const DrawerFilters = () => {
	return (
		<div className="px-4 py-3 space-y-3 border-b border-emerald-900/60">
			<div className="flex gap-2">
				<button className="bg-emerald-700/80 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide hover:bg-emerald-600 transition">
					Surah
				</button>
				<button className="bg-emerald-900/60 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide hover:bg-emerald-800 transition">
					Verse
				</button>
				<button className="bg-emerald-900/60 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide hover:bg-emerald-800 transition">
					Juz
				</button>
			</div>
			<div className="flex items-center rounded-xl border border-emerald-900/60 bg-emerald-900/40 px-3 py-2">
				<Search size={16} className="text-emerald-300" />
				<input
					type="text"
					placeholder="Search Surah"
					className="bg-transparent outline-none text-sm text-emerald-100 ml-2 w-full placeholder:text-emerald-400/70"
				/>
			</div>
		</div>
	);
};

export default DrawerFilters;
