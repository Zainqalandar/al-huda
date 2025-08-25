import React from 'react';
import Hero from './hero';
import DailyInspiration from './daily-Inspiration';
import QuotesSection from './quotes-section';
import HadithSection from './hadith-section';
import DuasSection from './duas-section';
import AboutIslam from './about-islam';

const HomeRoot = () => {
	return (
		<>
			<Hero />
			<DailyInspiration />
			<QuotesSection />
			<HadithSection />
			<DuasSection />
			<AboutIslam />
		</>
	);
};

export default HomeRoot;
