import { Info, Play, BookOpen, Eye, Pause } from 'lucide-react';
import React from 'react';
import InfoDropDown from './InfoDropDown';

const QuranPageBtn = ({ btnInfo }) => {
	const { handleAudioToggle, isPlaying, loadingTwo, surahTwo:surah } = btnInfo;
	return (
		<div className="flex flex-wrap justify-center  gap-6 my-4">
			<InfoDropDown surah={surah} />
			<button
				onClick={handleAudioToggle}
				className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow cursor-pointer hover:bg-green-700"
			>
				{isPlaying ? (
					<>
						<Pause size={18} />{' '}
						{loadingTwo ? 'Loading...' : 'Listen'}
					</>
				) : (
					<>
						<Play size={18} />{' '}
						{loadingTwo ? 'Loading...' : 'Listen'}
					</>
				)}
			</button>
			<button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow cursor-pointer hover:bg-green-700">
				<BookOpen size={18} /> Tafsir
			</button>
			

		</div>
	);
};

export default QuranPageBtn;
