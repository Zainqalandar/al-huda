'use client';
import { Sparkles, ClipboardCopy, BookOpenCheck } from 'lucide-react';
import duas from '@/data/duas.json';

export function DuaRoot() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-700 to-green-950 p-2 md:p-6">
			<div className="max-w-4xl w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-3.5 md:p-8 border border-white/20 mt-32">
				<div className="flex items-center gap-3 mb-8">
					<BookOpenCheck className="w-8 h-8 text-yellow-300" />
					<h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide">
						🤲 Daily Duas
					</h1>
				</div>

				<div className="space-y-10">
					{duas.map((dua) => (
						<div
							key={dua.id}
							className="rounded-2xl border border-green-400/30 bg-gradient-to-r from-green-800/70 to-green-700/70 p-6 md:p-8 shadow-xl"
						>
							<div className="flex items-center gap-2 mb-4">
								<Sparkles className="w-5 h-5 text-yellow-200" />
								<h2 className="text-2xl font-bold text-yellow-200">
									{dua.title}
								</h2>
							</div>

							<div className="bg-white/5 rounded-xl p-5 md:p-6 mb-5">
								<p
									className="text-2xl md:text-3xl text-white leading-relaxed text-center"
									dir="rtl"
								>
									{dua.arabic}
								</p>
							</div>

							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
								<p className="text-base md:text-lg text-green-100/90">
									<span className="font-semibold text-yellow-100">
										Transliteration:
									</span>{' '}
									{dua.transliteration}
								</p>
								<button
									onClick={() =>
										navigator.clipboard &&
										navigator.clipboard.writeText(
											`${dua.arabic} — ${dua.transliteration}`
										)
									}
									className="inline-flex items-center gap-2 rounded-xl border border-yellow-300/40 px-4 py-2 text-sm font-medium text-yellow-100 hover:bg-yellow-300/10 transition"
								>
									<ClipboardCopy className="w-4 h-4" /> Copy
								</button>
							</div>

							<p className="text-lg md:text-xl text-gray-100/95 leading-relaxed">
								<span className="font-semibold text-yellow-100">
									Translation:
								</span>{' '}
								{dua.translation}
							</p>

							<div className="text-sm text-green-100/80 border-t border-white/10 pt-4 mt-6 text-right">
								<span className="font-medium text-yellow-100">
									Reference:
								</span>{' '}
								{dua.reference}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
