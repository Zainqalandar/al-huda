import React from 'react';
import Hero from './hero';
import QuotesSection from './quotes-section';
import HadithSection from './hadith-section';
import DuasSection from './duas-section';
import AboutIslam from './about-islam';
import DailyInspirationSlider from '../ui/DailyInspirationSlider';
import PrayerTimeSlider from '../ui/PrayerTimeSlider';
import FAQAccordion from '../ui/FAQAccordion';

const HomeRoot = () => {
	return (
		<>
			<Hero />
			<DailyInspirationSlider />
			<QuotesSection />
			<FAQAccordion />
			<HadithSection />
			<DuasSection />
			<PrayerTimeSlider />
			<AboutIslam />
		</>
	);
};

export default HomeRoot;
