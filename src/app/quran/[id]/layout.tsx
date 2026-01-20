'use client';
import Drawer from '@/components/sidebar/drawer';
import AppBarHeader from '@/components/sidebar/header';
import QuranAudioBottomBar from '@/components/ui/QuranAudioUI';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

const QuranChildPageLayout = ({ children }) => {
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

	const { id } = useParams();

	// normalize the route param to a number or undefined
	const rawId = Array.isArray(id) ? id[0] : id;
	const parsedInitialSurah = rawId !== undefined ? Number(rawId) : undefined;
	const initialSurah =
		parsedInitialSurah !== undefined && !Number.isNaN(parsedInitialSurah)
			? parsedInitialSurah
			: undefined;

	return (
		<>
			<div className=" mt-16">
				<div className="flex flex-col bg-[var(--quran-sand)]">
					<AppBarHeader onSidebarOpen={setSidebarOpen} />
					<Drawer
						onSidebarOpen={setSidebarOpen}
						sidebarOpen={sidebarOpen}
					/>
					<div className="flex flex-1 pt-[64px]">
						<main
							className={`flex-1 flex flex-col transition-all duration-300 ${
								sidebarOpen ? 'md:ml-64' : 'md:ml-0'
							}`}
						>
							{children}
						</main>
					</div>
				</div>
				<QuranAudioBottomBar initialSurah={initialSurah} />
			</div>
		</>
	);
};

export default QuranChildPageLayout;
