import React from 'react';
import quotes from '@/data/quotes.json';
import IslamicTitle from '@/components/ui/IslamicTitle';

const Card = ({ text, reference }) => {
	return (
		<>
			<div className="bg-white/10 border border-yellow-500/40 rounded-xl p-6 shadow-lg hover:shadow-yellow-500/20 transition duration-300">
				<p className="text-lg italic text-gray-100">“{text}”</p>
				{reference && (
					<p className="mt-4 text-sm text-yellow-300 font-semibold">
						~ {reference}
					</p>
				)}
			</div>
		</>
	);
};

const QuotesSection = ({total = 6}) => {
	return (
		<>
			<section className="py-16 bg-green-900 text-white">
				<IslamicTitle title='Famous Islamic Quotes' />
				<div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
					{quotes.slice(0, total).map((q) => (
						<Card
							key={q.id}
							text={q.text}
							reference={q.reference}
						/>
					))}
				</div>
			</section>
		</>
	);
};

export default QuotesSection;
