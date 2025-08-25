'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import navLinks from '@/lib/navLinks';
import { usePathname } from 'next/navigation';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

  const path = usePathname();


	return (
		<>
			<nav className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white shadow-lg fixed top-0 left-0 w-full z-50">
				<div className="container mx-auto px-6 py-4 flex justify-between items-center">
					{/* Logo / Site Name */}
					<Link
						href="/"
						className="text-2xl font-bold text-yellow-400 tracking-wide"
					>
						🕌 Al-Huda
					</Link>

					{/* Desktop Menu */}
					<ul className="hidden md:flex space-x-8 font-medium">
						{navLinks.map((lnk) => (
							<li key={lnk.id}>
								<Link
									href={lnk.link}
									className={`hover:text-yellow-400 ${path == lnk.link && 'text-yellow-400'}`}
								>
									{lnk.name}
								</Link>
							</li>
						))}
					</ul>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="md:hidden text-yellow-400 focus:outline-none"
					>
						{isOpen ? <X size={28} /> : <Menu size={28} />}
					</button>
				</div>

				{/* Mobile Dropdown */}
				{isOpen && (
					<div className="md:hidden bg-green-950/95 text-center py-4 space-y-4">
						{navLinks.map((lnk) => (
							<Link
								key={lnk.id}
								href={lnk.link}
								className="block hover:text-yellow-400"
							>
								{lnk.name}
							</Link>
						))}
					</div>
				)}
			</nav>
		</>
	);
};

export default Navbar;
