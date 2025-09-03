"use client";
import { SurhasList } from "@/context/SurhasListProvider";
import { PanelLeft } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useContext } from "react";

const AppBarHeader = ({ onSidebarOpen }) => {
	const [navVisible, setNavVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	const { id: isActive } = useParams()


	const { surahs } = useContext(SurhasList);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > lastScrollY) {
				// scroll down → navbar hide
				setNavVisible(false);
			} else {
				// scroll up → navbar show
				setNavVisible(true);
			}
			setLastScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	return (
		<header
			className={`bg-white border-b border-gray-200 h-[50px] flex items-center px-4 fixed left-0 right-0 z-40 shadow-sm transition-all duration-300 ${
				navVisible ? "top-[56px]" : "top-0"
			}`}
		>
			{/* Left Section: Menu + Surah Name */}
			<div className="flex items-center gap-3">
				<button
					className="text-gray-700 hover:text-green-600 transition cursor-pointer"
					onClick={() => onSidebarOpen( prev => !prev)}
				>
					<PanelLeft size={22} />
				</button>
				<h1 className="text-lg font-semibold text-green-900">
					{surahs?.find((s) => s.id == isActive)?.surahNameArabicLong || "Quran App"}
				</h1>
			</div>
		</header>
	);
};

export default AppBarHeader;
