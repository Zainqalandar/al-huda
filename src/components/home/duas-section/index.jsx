import React from 'react';

const DuasSection = () => {
	return (
		<>
			<section className="py-16 bg-green-900 text-white">
				<h2 className="text-3xl font-bold text-yellow-400 text-center mb-10">
					🤲 Daily Duas
				</h2>
				<div className="max-w-2xl mx-auto space-y-6 text-center">
					<div className="bg-white/10 border border-yellow-400/30 p-6 rounded-lg">
						<h3 className="text-xl text-yellow-300 mb-2">
							اللّهُـمَّ اغْفِرْ لي
						</h3>
						<p className="italic">"O Allah, forgive me."</p>
					</div>
					<div className="bg-white/10 border border-yellow-400/30 p-6 rounded-lg">
						<h3 className="text-xl text-yellow-300 mb-2">
							رَبِّ زِدْنِي عِلْمًا
						</h3>
						<p className="italic">
							"My Lord, increase me in knowledge."
						</p>
					</div>
				</div>
			</section>
		</>
	);
};

export default DuasSection;
