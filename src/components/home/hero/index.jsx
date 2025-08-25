import Link from 'next/link';
import React from 'react';

const Hero = () => {
	return (
		<>
			<section className="relative h-[90vh] flex items-center justify-center text-center bg-[url('/banner/Islamic-banner-two.png')] bg-cover bg-center">
				<div className="absolute  "   style={{ background: "color-mix(in oklab, #0000008c 60%, #00000000)" }}></div>
				<div className="relative z-10 max-w-3xl px-4">
					<h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-6">
						Welcome to Islamic Knowledge
					</h1>
					<p className="text-lg md:text-xl text-gray-200 mb-8">
						Discover Quotes, Hadiths, and Duas that bring peace and
						guidance to your life.
					</p>
					<Link
						href="/quotes"
						className="bg-yellow-400 text-green-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-500"
					>
						Explore Now
					</Link>
				</div>
			</section>
		</>
	);
};

export default Hero;
