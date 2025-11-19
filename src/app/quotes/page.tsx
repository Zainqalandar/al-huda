import QuotesSection from '@/components/home/quotes-section';
import React, { FC } from 'react';

const Quotes: FC = () => {
	return (
		<>
			<div className="mt-12">
				<QuotesSection total={10} />
			</div>
		</>
	);
};

export default Quotes;
