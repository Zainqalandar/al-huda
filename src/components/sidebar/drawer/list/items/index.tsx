import { useRouter } from 'next/navigation';
import React from 'react'

interface ItemsProps {
	// support either `surahName` or `surahNameArabicLong` depending on source
	surahs: Array<{ id: number; surahName?: string; surahNameArabicLong?: string }>;
	// route params can be string | string[] | undefined; allow number too for internal usage
	OnActive: string | string[] | number | undefined;
	onSetActive: (id: number) => void;
	OnSidebarOpen: (open: boolean) => void;
}


const Items = ({ surahs, OnActive, onSetActive, OnSidebarOpen }: ItemsProps) => {
	const router = useRouter();

	// normalize OnActive to a number (undefined if not present or not parseable)
	const activeId: number | undefined = React.useMemo(() => {
		if (typeof OnActive === 'number') return OnActive;
		if (typeof OnActive === 'string') {
			const n = Number(OnActive);
			return Number.isNaN(n) ? undefined : n;
		}
		if (Array.isArray(OnActive) && OnActive.length > 0) {
			const n = Number(OnActive[0]);
			return Number.isNaN(n) ? undefined : n;
		}
		return undefined;
	}, [OnActive]);

	return (
		<>
			{surahs?.map((s) => (
				<button
					key={s.id}
					onClick={() => {
						onSetActive(s.id);
						router.push(`/quran/${s.id}`);
						if (window.innerWidth < 768) OnSidebarOpen(false);
					}}
					className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm transition rounded-lg ${
						activeId === s.id
							? 'bg-emerald-700/80 text-white font-semibold shadow-sm'
							: 'text-emerald-200 hover:bg-emerald-900/50'
					}`}
				>
					<span>
						{s.id} {s.surahName ?? s.surahNameArabicLong}
					</span>
					<span
						className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
							activeId === s.id
								? 'bg-emerald-600 text-white'
								: 'bg-emerald-950 text-emerald-400'
						}`}
					>
						{s.id}
					</span>
				</button>
			))}
		</>
	);
};

export default Items;
