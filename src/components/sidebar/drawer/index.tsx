'use client'

import React, { useContext, useEffect, useState } from 'react';
import DrawerHeader from './drawer-header';
import { SurhasList } from '@/context/SurhasListProvider';
import DrawerFilters from './drawer-filters';
import DrawerList from './list';
import { useParams } from 'next/navigation';

interface DrawerProps {
	onSidebarOpen: (open: boolean) => void;
	sidebarOpen: boolean;
}

const Drawer: React.FC<DrawerProps> = ({ onSidebarOpen, sidebarOpen }) => {
	// useParams can return strings or string[] depending on route
	const params = useParams() as { id?: string | string[] } | undefined;
	const id = params?.id;

	// normalize id to a single string (like in your layout.tsx)
	const rawId = Array.isArray(id) ? id[0] : id;
	const parsedInitial = rawId !== undefined ? Number(rawId) : undefined;
	const [active, setActive] = useState<number | undefined>(
		parsedInitial !== undefined && !Number.isNaN(parsedInitial)
			? parsedInitial
			: undefined
	);

	const [navVisible, setNavVisible] = useState<boolean>(true);
	const [lastScrollY, setLastScrollY] = useState<number>(0);

	const context = useContext(SurhasList);
	if (!context) throw new Error('Drawer must be used inside SurhasListProvider');

	const { surahs, loading } = context;

	useEffect(() => {
		const handleScroll = () => {
			setLastScrollY((prev) => {
				const cur = window.scrollY;
				if (cur > prev) setNavVisible(false);
				else setNavVisible(true);
				return cur;
			});
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<>
			{/* Sidebar */}
			<div
				className={`fixed md:fixed left-0 h-[calc(100%-57px)] w-64 bg-green-950 text-green-50 flex flex-col border-r border-green-800 transform transition-transform duration-200 z-51 md:z-50
					${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
				`}
				style={{
					top: navVisible ? '106px' : '50px',
					transition: 'top 0.3s ease',
				}}
			>
				<DrawerHeader surahs={surahs} onSidebarOpen={onSidebarOpen} />
				<DrawerFilters />
				<DrawerList
					onSetActive={(id: number) => setActive(id)}
					surahs={surahs}
					Loading={loading}
					OnSidebarOpen={onSidebarOpen}
				/>
			</div>
		</>
	);
};

export default Drawer;
