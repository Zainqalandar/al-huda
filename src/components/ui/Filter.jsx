import { ArrowUpDown, RotateCcw } from "lucide-react";

export default function Filter({ sortBy, setSortBy, order, setOrder, resetFilters }) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-green-100 via-green-50 to-green-100 border border-green-300 rounded-2xl shadow-lg p-5 mb-8">
			
			{/* Title */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-200">
					<ArrowUpDown className="w-6 h-6 text-green-800" />
				</div>
				<span className="text-green-900 font-bold text-lg tracking-wide">
					Sort Surahs
				</span>
			</div>

			{/* Controls */}
			<div className="flex flex-col sm:flex-row gap-3 sm:items-center">
				
				{/* Select Field */}
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value)}
					className="px-4 py-2 border border-green-300 rounded-lg bg-green-50 text-green-900 font-medium shadow-sm hover:border-green-400 focus:ring-2 focus:ring-green-400 focus:outline-none"
				>
					<option value="id">By Number</option>
					<option value="surahName">By Name</option>
					<option value="totalAyah">By Ayahs</option>
				</select>

				{/* Ascending / Descending Button */}
				<button
					onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
					className={`
						px-4 py-2 rounded-lg font-semibold shadow-sm transition-all cursor-pointer duration-200 bg-green-600 text-white hover:bg-green-700
						
					`}
				>
					{order === "asc" ? "Ascending ↑" : "Descending ↓"}
				</button>

				{/* Reset Button */}
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
