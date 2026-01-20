import { BookOpen } from 'lucide-react';
import { useContext, useState } from 'react';
import InfoDropDown from './InfoDropDown';
import ListenSelectButton from './ListenSelectButton';
import { SurhasList } from '@/context/SurhasListProvider';


const QuranPageBtn = ({ btnInfo }) => {
	const { loadingTwo, surahTwo: surah } = btnInfo;

	const { handleLanguageChange, language, isPlaying } = useContext(SurhasList);

	// language selection state (ar = Arabic, tr = Translation)
	const [lang, setLang] = useState(language);

	return (
		<div className="w-full">
			<div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-emerald-200/70 bg-[var(--quran-paper)] p-3 shadow-sm backdrop-blur-sm">
				<InfoDropDown surah={surah} />

				<ListenSelectButton
					loading={loadingTwo}
					onChangeLanguage={(l: string) => setLang(l as 'tr' | 'ar')}
					initial={lang}
					onAddLan={handleLanguageChange}
					isPlaying={isPlaying}
				/>

				<button className="flex items-center gap-2 rounded-xl bg-[var(--quran-emerald)] text-white px-4 py-2 shadow hover:bg-[var(--quran-emerald-deep)] transition">
					<BookOpen size={18} /> Tafsir
				</button>
			</div>
		</div>
	);
};

export default QuranPageBtn;
