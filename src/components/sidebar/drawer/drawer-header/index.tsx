'use client'
import { SurhasList } from '@/context/SurhasListProvider';
import { X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useContext } from 'react';

interface DrawerHeaderProps {
	surahs: Array<{ id: number; surahName?: string; surahNameArabicLong?: string }>;
	onSidebarOpen: (open: boolean) => void;
}

const DrawerHeader = ({ surahs, onSidebarOpen }: DrawerHeaderProps) => {
	const { id: isActive } = useParams();
	const activeId =
		typeof isActive === 'string'
			? Number(isActive)
			: Array.isArray(isActive)
			? Number(isActive[0])
			: undefined;
	

	return (
		<div className="px-4 py-3 border-b border-emerald-900/60 flex items-center justify-between">
			<h2 className="text-lg font-bold text-emerald-100 font-display">
				{surahs?.find((s) => s.id === activeId)?.surahName}
			</h2>
			<button
				className="text-emerald-300 cursor-pointer hover:text-emerald-100 transition"
				onClick={() => onSidebarOpen(false)}
			>
				<X size={20} />
			</button>
		</div>
	);
};

export default DrawerHeader;
