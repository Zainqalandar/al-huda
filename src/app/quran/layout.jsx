import { SurhasListProvider } from '@/context/SurhasListProvider';
import React from 'react';

const QuranPageLayout = ({ children }) => {
	return (
		<>
			<SurhasListProvider>{children}</SurhasListProvider>
		</>
	);
};

export default QuranPageLayout;
