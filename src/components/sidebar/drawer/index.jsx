'use client'
import React, { useContext, useEffect, useState } from 'react';
import DrawerHeader from './drawer-header';
import { SurhasList } from '@/context/SurhasListProvider';
import DrawerFilters from './drawer-filters';
import DrawerList from './list';
import { useParams } from 'next/navigation';

const Drawer = ({onSidebarOpen, sidebarOpen}) => {
	const { id } = useParams();
	const [active, setActive] = useState(JSON.parse(id));
	const [navVisible, setNavVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	const { surahs, loading } = useContext(SurhasList)


	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > lastScrollY) {
				// scroll down → navbar hide
				setNavVisible(false);
			} else {
				// scroll up → navbar show
				setNavVisible(true);
			}
			setLastScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);


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
				<DrawerHeader
					surahs={surahs}
					onSidebarOpen={onSidebarOpen}
				/>
				<DrawerFilters />
				<DrawerList
					onSetActive={setActive} 
					surahs={surahs}
					isActive={active}
					isLoading={loading}
					OnSidebarOpen={onSidebarOpen}
				/>
			</div>
		</>
	);
};

export default Drawer;
