'use client'
import { SurhasList } from '@/context/SurhasListProvider';
import { X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useContext } from 'react';

const DrawerHeader = ({ surahs, onSidebarOpen }) => {
	const { id: isActive } = useParams();
	

	return (
		<div className="px-4 py-3 border-b border-green-800 flex items-center justify-between">
			<h2 className="text-lg font-bold text-green-200">
				{surahs?.find((s) => s.id == isActive)?.surahName}
			</h2>
			<button
				className="text-green-300 cursor-pointer"
				onClick={() => onSidebarOpen(false)}
			>
				<X size={20} />
			</button>
		</div>
	);
};

export default DrawerHeader;
