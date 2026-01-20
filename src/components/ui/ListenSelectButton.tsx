"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, ChevronDown, Check } from 'lucide-react';

interface ListenSelectButtonProps {
	loading?: boolean;
	onChangeLanguage?: (lang: string) => void;
	initial?: string;
	onAddLan?: (lang: string) => void;
	isPlaying?: boolean;
}

export default function ListenSelectButton({
	loading = false,
	onChangeLanguage = (lang: string) => {},
	initial = 'tr',
	onAddLan = (lang: string) => {},
	isPlaying,
}: ListenSelectButtonProps) {
	const LANGS = [
		{ key: 'ar', label: 'Arabic Recitation' },
		{ key: 'tr', label: 'Urdu Translation' },
	];

	const [selected, setSelected] = useState(initial);
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement | null>(null);

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

	const selectedLabel =
		LANGS.find((l) => l.key === selected)?.label ?? 'Listen';

	return (
		<div className="relative inline-flex" ref={rootRef}>
			{/* Main button */}
			<button
				// onClick={() => onToggle(selected)}
				className="flex items-center gap-2 rounded-l-xl rounded-r-none bg-[var(--quran-emerald)] text-white px-4 py-2 shadow hover:bg-[var(--quran-emerald-deep)] focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
			>
				{isPlaying ? <Pause size={16} /> : <Play size={16} />}
				<span className="text-sm font-medium">
					{loading ? 'Loading...' : selectedLabel}
				</span>
			</button>

			{/* Split button dropdown */}
			<button
				onClick={() => setOpen((s) => !s)}
				aria-expanded={open}
				aria-haspopup="listbox"
				className="flex items-center justify-center rounded-r-xl bg-[var(--quran-emerald)] text-white px-3 py-2 shadow hover:bg-[var(--quran-emerald-deep)] focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
			>
				<ChevronDown size={16} />
			</button>

			{/* Dropdown menu */}
			{open && (
				<div className="absolute right-0 mt-2 w-52 rounded-xl bg-[var(--quran-paper)] text-[var(--quran-ink)] shadow-lg ring-1 ring-black/5 z-50">
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
									className={`w-full text-left flex items-center justify-between gap-2 px-4 py-2 text-sm hover:bg-emerald-50 ${
										active ? 'font-semibold text-emerald-900' : 'text-[var(--quran-ink)]'
									}`}
								>
									<span>{l.label}</span>
									{active && (
										<Check
											size={14}
											className="text-emerald-600"
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
