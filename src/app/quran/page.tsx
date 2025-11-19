import SurahList from '@/components/quran';
import Filter from '@/components/ui/Filter';
import React from 'react';

const QuranPage = () => {
	return (
		<>
			<div className="mt-[57px]  min-h-screen">
				<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10 px-4">
					<div className="max-w-6xl mx-auto">
						<h1 className="text-3xl font-bold text-green-800 text-center mb-8">
							📖 Surahs of the Holy Quran.
						</h1>
						<Filter />
						<SurahList />
					</div>
				</div>
			</div>
		</>
	);
};

export default QuranPage;
