'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, ChevronDown, Check } from 'lucide-react';

export default function ListenSelectButton({
	loading = false,
	onChangeLanguage = () => {},
	initial = 'tr',
	onAddLan = () => {},
	isPlaying
}) {
	const LANGS = [
		{ key: 'ar', label: 'Listen Arbi' },
		{ key: 'tr', label: 'Listen Translation' },
	];

	const [selected, setSelected] = useState(initial);
	const [open, setOpen] = useState(false);
	const rootRef = useRef(null);

	// close menu on outside click / escape
	useEffect(() => {
		function onDoc(e) {
			if (!rootRef.current?.contains(e.target)) setOpen(false);
		}
		function onEsc(e) {
			if (e.key === 'Escape') setOpen(false);
		}
		document.addEventListener('mousedown', onDoc);
		document.addEventListener('keydown', onEsc);
		return () => {
			document.removeEventListener('mousedown', onDoc);
			document.removeEventListener('keydown', onEsc);
		};
	}, []);

	// initial notify
	useEffect(() => {
		onChangeLanguage(selected);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	console.log('isPlaying', isPlaying)

	const selectedLabel =
		LANGS.find((l) => l.key === selected)?.label ?? 'Listen';

	return (
		<div className="relative inline-flex" ref={rootRef}>
			{/* Main button */}
			<button
				// onClick={() => onToggle(selected)}
				className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-l-xl rounded-r-none shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
			>
				{isPlaying ? <Pause size={16} /> : <Play size={16} />}
				<span className="text-sm font-medium">
					{loading ? 'Loading...' : selectedLabel}
				</span>
			</button>

			{/* Split button dropdown */}
			<button
				onClick={() => setOpen((s) => !s)}
				className="flex items-center justify-center bg-green-600 text-white px-3 py-2 rounded-r-xl shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
			>
				<ChevronDown size={16} />
			</button>

			{/* Dropdown menu */}
			{open && (
				<div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
					<div className="py-1">
						{LANGS.map((l) => {
							const active = l.key === selected;
							return (
								<button
									key={l.key}
									onClick={() => {
										setSelected(l.key);
										onChangeLanguage(l.key);
										onAddLan(l.key)
										setOpen(false);
									}}
									className={`w-full text-left flex items-center justify-between gap-2 px-4 py-2 text-sm hover:bg-gray-50 ${
										active ? 'font-semibold' : ''
									}`}
								>
									<span>{l.label}</span>
									{active && (
										<Check
											size={14}
											className="text-green-600"
										/>
									)}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
