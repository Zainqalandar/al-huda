import React, { useContext } from 'react';
import Items from './items';
import Loading from '@/components/ui/Loading';
import { useParams } from 'next/navigation';

interface DrawerListProps {
	onSetActive: (id: number) => void;
	OnSidebarOpen: (open: boolean) => void;
	surahs: Array<{ id: number; surahNameArabicLong: string }>;
	Loading: boolean;
}


const DrawerList = ({ onSetActive, OnSidebarOpen, surahs, Loading: isLoading  }: DrawerListProps) => {
	const { id: isActive } = useParams();
	return (
		<div className="flex-1 overflow-y-auto">
			{isLoading ? (
				<Loading style="min-h-[50vh]" isText={false} />
			) : (
				<Items
					onSetActive={onSetActive}
					surahs={surahs}
					OnActive={isActive}
					OnSidebarOpen={OnSidebarOpen}
				/>
			)}
			{/* <Loading style="min-h-[50vh]" isText={false} /> */}
		</div>
	);
};

export default DrawerList;
