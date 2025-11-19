'use client';
import React from 'react';
import Link from 'next/link';
import navLinks from '@/lib/navLinks';
import { usePathname } from 'next/navigation';

const Footer = () => {
	const path = usePathname();
	return (
		<>
			<footer className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white">
				<div className="container mx-auto px-4 sm:px-6 py-10 text-center">
					{/* Islamic Calligraphy / Logo */}
					<h2 className="text-lg sm:text-xl font-semibold text-yellow-400">
						اِیَّاكَ نَعْبُدُ وَ اِیَّاكَ نَسْتَعِیْنُ
					</h2>

					{/* Links */}
					<div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-6 text-sm">
						{navLinks.map((lnk: NavLink) => (
							<Link
								key={lnk.id}
								href={lnk.link}
								className={`hover:text-yellow-400 ${
									path == lnk.link && 'text-yellow-400'
								}`}
							>
								{lnk.name}
							</Link>
						))}
					</div>

					{/* Divider */}
					<div className="border-t border-yellow-500/30 my-6"></div>

					{/* Copyright */}
					<p className="text-xs sm:text-sm text-gray-300">
						© {new Date().getFullYear()} Islamic Site. All rights
						reserved.
					</p>
				</div>
			</footer>
		</>
	);
};

export default Footer;
