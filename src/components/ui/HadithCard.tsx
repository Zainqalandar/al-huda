import React from 'react';
import { BookOpen, Quote } from 'lucide-react';
import hadiths from '@/data/hadith.json';


const HadithCard= () => {
	return (
		<>
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-700 to-green-950 p-2 md:p-6">
				
				<div className="max-w-3xl w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-3.5 md:p-8 border border-white/20  mt-32">
					<div className="flex items-center gap-3 mb-6">
						<BookOpen className="w-8 h-8 text-blue-400" />
						<h1 className="text-3xl font-bold text-white tracking-wide">
							Hadith of the Day
						</h1>
					</div>

					{hadiths.map((hadith, idx) => (
						<div key={idx}>
							<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-xl mb-6">
								<Quote className="w-6 h-6 text-blue-400 mb-3" />
								<p className="text-2xl text-white font-semibold leading-relaxed text-center">
									{hadith.arabic}
								</p>
							</div>
							<p className="text-lg text-gray-200 leading-relaxed mb-6">
								{`"${hadith.translation}"`}
							</p>
							<div className="text-sm text-gray-400 border-t border-white/10 pt-4 mb-8">
								Reference:{' '}
								<span className="font-medium text-gray-300">
									{hadith.reference}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default HadithCard;
