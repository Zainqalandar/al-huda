'use client';
import Drawer from '@/components/sidebar/drawer';
import AppBarHeader from '@/components/sidebar/header';
import QuranAudioBottomBar from '@/components/ui/QuranAudioUI';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

const QuranChildPageLayout = ({ children }) => {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const { id } = useParams();

	return (
		<>
			<div className=" mt-16">
				<div className="flex  flex-col bg-green-50">
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
				<QuranAudioBottomBar initialSurah={id} />
			</div>
		</>
	);
};

export default QuranChildPageLayout;
