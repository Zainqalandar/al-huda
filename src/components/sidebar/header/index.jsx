import { Menu } from 'lucide-react';
import React from 'react';

const SidebarLayoutHeader = ({ onSidebarOpen }) => {
	return (
		<header className="bg-green-100 border-b border-green-300 p-4 flex items-center gap-4 fixed top-[65px] left-0 right-0 z-49">
			<button
				className="text-green-900 cursor-pointer"
				onClick={() => onSidebarOpen(true)}
			>
				<Menu size={24} />
			</button>
			<h1 className="text-xl font-bold text-green-900">Quran App</h1>
		</header>
	);
};

export default SidebarLayoutHeader;
