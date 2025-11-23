import React from 'react';

interface IslamicTitleProps {
	title: string;
}

const IslamicTitle: React.FC<IslamicTitleProps> = ({ title }) => {
	return (
		<>
			<h2 className="text-3xl font-bold text-yellow-400 text-center mb-10">
				✨ {title}
			</h2>
		</>
	);
};

export default IslamicTitle;
