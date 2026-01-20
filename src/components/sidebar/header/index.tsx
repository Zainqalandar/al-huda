"use client";
import { SurhasList } from "@/context/SurhasListProvider";
import { PanelLeft } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useContext } from "react";

interface AppBarHeaderProps {
	onSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SurahItem {
	id: number;
	surahNameArabicLong: string;
}

const AppBarHeader = ({ onSidebarOpen }: AppBarHeaderProps) => {
	const [headerVisible, setHeaderVisible] = useState<boolean>(true);
	const [lastScrollY, setLastScrollY] = useState<number>(0);

	const { id: isActive } = useParams();

	const activeId = Array.isArray(isActive) ? isActive[0] : isActive;
	const activeIdNum = activeId ? parseInt(activeId, 10) : undefined;

	const { surahs } = useContext(SurhasList);
	const activeSurah = surahs?.find((s: SurahItem) => s.id === activeIdNum);
	const headerTitle = activeSurah?.surahNameArabicLong || "Quran App";
	const headerTitleClass = activeSurah?.surahNameArabicLong ? "arabic-font" : "font-display";

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > lastScrollY) {
				// scroll down → navbar hide
				setHeaderVisible(false);
			} else {
				// scroll up → navbar show
				setHeaderVisible(true);
			}
			setLastScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	return (
		<header
			className={`bg-[var(--quran-paper)] border-b border-emerald-100/80 h-[50px] flex items-center px-4 fixed left-0 right-0 z-40 shadow-sm backdrop-blur transition-all duration-300 ${
				headerVisible ? "top-[56px]" : "top-0"
			}`}
		>
			{/* Left Section: Menu + Surah Name */}
			<div className="flex items-center gap-3">
				<button
					className="text-[var(--quran-emerald)] hover:text-[var(--quran-emerald-deep)] transition cursor-pointer"
					onClick={() => onSidebarOpen(prev => !prev)}
				>
					<PanelLeft size={20} />
				</button>
				<h1 className={`text-lg font-semibold text-[var(--quran-ink)] ${headerTitleClass}`}>
					{headerTitle}
				</h1>
			</div>
		</header>
	);
};

export default AppBarHeader;
