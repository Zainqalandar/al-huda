import React from 'react';

const HadithSection = () => {
	return (
		<>
			<section className="py-16 bg-green-950 text-white text-center">
				<h2 className="text-3xl font-bold text-yellow-400 mb-8">
					📖 Hadith of the Prophet ﷺ
				</h2>
				<div className="max-w-3xl mx-auto space-y-6">
					<div className="bg-white/10 border border-yellow-400/40 p-6 rounded-lg shadow">
						<p className="text-lg">
							&quot;The strong man is not the one who overcomes others
							by his strength, but the one who controls himself
							while in anger.&quot;
						</p>
						<span className="block mt-4 text-sm text-yellow-300">
							~ Sahih al-Bukhari
						</span>
					</div>
				</div>
			</section>
		</>
	);
};

export default HadithSection;
