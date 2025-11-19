import { SurhasListProvider } from '@/context/SurhasListProvider';
import React from 'react';

interface QuranPageLayoutProps {
	children: React.ReactNode;
}

const QuranPageLayout = ({ children }: QuranPageLayoutProps) => {
	return (
		<>
			<SurhasListProvider>{children}</SurhasListProvider>
		</>
	);
};

export default QuranPageLayout;
