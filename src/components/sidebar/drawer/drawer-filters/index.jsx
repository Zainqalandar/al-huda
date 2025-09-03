import { Search } from 'lucide-react';
import React from 'react';

const DrawerFilters = () => {
	return (
		<div className="px-4 py-3 space-y-2 border-b border-green-800">
			<div className="flex gap-2">
				<button className="bg-green-700 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">
					Surah
				</button>
				<button className="bg-green-800 text-green-200 px-3 py-1 rounded-md text-sm hover:bg-green-700">
					Verse
				</button>
				<button className="bg-green-800 text-green-200 px-3 py-1 rounded-md text-sm hover:bg-green-700">
					Juz
				</button>
			</div>
			<div className="flex items-center bg-green-800 px-2 py-1 rounded-md">
				<Search size={16} className="text-green-300" />
				<input
					type="text"
					placeholder="Search Surah"
					className="bg-transparent outline-none text-sm text-green-100 ml-2 w-full"
				/>
			</div>
		</div>
	);
};

export default DrawerFilters;
