import QuotesSection from '@/components/home/quotes-section';
import React from 'react';

const Quotes = () => {
	return (
		<>
			<div className='mt-12'>
                <QuotesSection total={10} />
            </div>
		</>
	);
};

export default Quotes;
