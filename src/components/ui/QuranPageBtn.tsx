import { BookOpen } from 'lucide-react';
import React, { useContext, useState } from 'react';
import InfoDropDown from './InfoDropDown';
import ListenSelectButton from './ListenSelectButton';
import { SurhasList } from '@/context/SurhasListProvider';

const QuranPageBtn = ({ btnInfo }) => {
	const { loadingTwo, surahTwo: surah } = btnInfo;

	const { addLanguage, language, isPlaying } = useContext(SurhasList);

	// language selection state (ar = Arabic, tr = Translation)
	const [lang, setLang] = useState(language);

	return (
		<div className="flex flex-wrap justify-center gap-6 my-4">
			{/* Surah Info dropdown */}
			<InfoDropDown surah={surah} />

			{/* Listen button with language select */}
			<ListenSelectButton
				loading={loadingTwo}
				onChangeLanguage={(l: string) => setLang(l as 'tr' | 'ar')}
				initial={lang}
				onAddLan={addLanguage}
		isPlaying={isPlaying}
			/>

			{/* Tafsir button */}
			<button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow cursor-pointer hover:bg-green-700">
				<BookOpen size={18} /> Tafsir
			</button>
		</div>
	);
};

export default QuranPageBtn;
