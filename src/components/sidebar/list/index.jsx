import React from 'react';
import Items from './items';
import Loading from '@/components/ui/Loading';

const SidebarList = ({ surahs, isActive, onSetActive, isLoading, OnSidebarOpen }) => {
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

export default SidebarList;
