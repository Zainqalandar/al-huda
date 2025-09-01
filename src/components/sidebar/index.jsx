'use client';
import { useEffect, useState } from 'react';
import QuranPage from '../quran/QuranPage';
import SidebarLayoutHeader from './header';
import SidebarHeader from './sidebar-header';
import SidebarFilters from './sidebar-filters';
import SidebarList from './list';
import useSurahList from '@/hooks/useSurahList';
import { useParams } from 'next/navigation';


export default function QuranLayout() {
	const { id } = useParams();
	const [active, setActive] = useState(JSON.parse(id));
	const [isMobile, setIsMobile] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	console.log("QuranLayout!1")


	const { surahList, loading, error } = useSurahList();

	useEffect(() => {
		const checkScreen = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkScreen();
		window.addEventListener('resize', checkScreen);

		return () => window.removeEventListener('resize', checkScreen);
	}, []);

	return (
		<div className="flex  flex-col bg-green-50">
			<SidebarLayoutHeader onSidebarOpen={setSidebarOpen} />

			<div className="flex flex-1 pt-[64px]">
				{/* Sidebar */}
				<div
					className={`fixed md:fixed top-[126px] left-0 h-[calc(100%-57px)] w-64 bg-green-950 text-green-50 flex flex-col border-r border-green-800 transform transition-transform duration-100 z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
				>
					<SidebarHeader
						surahs={surahList}
						onSidebarOpen={setSidebarOpen}
						isActive={active}
					/>
					<SidebarFilters />
					<SidebarList
						onSetActive={setActive}
						surahs={surahList}
						isActive={active}
						isLoading={loading}
						OnSidebarOpen={setSidebarOpen}
					/>
				</div>

				{/* Overlay for mobile */}
				{sidebarOpen && isMobile < 768 && (
					<div
						className="fixed inset-0 bg-black/50 z-30 md:hidden"
						onClick={() => setSidebarOpen(false)}
					/>
				)}

				{/* Body Content */}
				<main
					className={`flex-1 flex flex-col transition-all duration-300 ${
						sidebarOpen ? 'md:ml-64' : 'md:ml-0'
					}`}
				>
					<QuranPage />
				</main>
			</div>
		</div>
	);
}
