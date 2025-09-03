import { useRouter } from 'next/navigation';
import React from 'react'


const Items = ({surahs, OnActive, onSetActive, OnSidebarOpen}) => {
	const router = useRouter()
  return (
    <>
    {surahs?.map((s) => (
				<button
					key={s.id}
					onClick={() => {
						onSetActive(s.id);
						router.push(`/quran/${s.id}`)
						if (window.innerWidth < 768) OnSidebarOpen(false);
					}}
					className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm transition ${
						OnActive === s.id
							? 'bg-green-700 text-white font-semibold'
							: 'text-green-200 hover:bg-green-800'
					}`}
				>
					<span>
						{s.id} {s.surahName}
					</span>
					<span
						className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
							OnActive === s.id
								? 'bg-green-600 text-white'
								: 'bg-green-900 text-green-400'
						}`}
					>
						{s.id}
					</span>
				</button>
			))}
    </>
  )
}

export default Items