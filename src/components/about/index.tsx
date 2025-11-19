import React from 'react';
import AboutHero from './about-hero';
import Mission from './mission';
import Values from './values';
import ClosingNote from './closing-note';
import Vision from './vision';

const AboutRoot = () => {
	return (
		<>
			<AboutHero />
			<Mission />
			<Vision />
			<Values />
			<ClosingNote />
		</>
	);
};

export default AboutRoot;
