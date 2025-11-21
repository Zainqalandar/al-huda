'use client';
import useSurahList from '@/hooks/useSurahList';
import React, { createContext, useEffect, useState } from 'react';

type Language = 'tr' | 'ar';
type SurahItem = any;

interface SurahListContext {
	pageNo: number;
	setPageNo: React.Dispatch<React.SetStateAction<number>>;
	surahs: SurahItem[] | null;
	loading: boolean;
	error: any;
	filterSurahs: SurahItem[] | null;
	addFilterSurahs: (filterList: SurahItem[]) => void;
	language: Language;
	addLanguage: (len: Language) => void;
	handleSetPlaying: () => void;
	handleLanguageChange: (lang: Language) => void;
	isPlaying: boolean;
}

const SurhasList = createContext<SurahListContext | null>(null);

const SurhasListProvider = ({ children }: { children: React.ReactNode }) => {
	const [surahs, setSurahs] = useState<null | any[]>(null);
	const [filterSurahs, setFilterSurahs] = useState<null | any[]>(null);
	const [language, setLanguage] = useState<Language>('tr');
	const { surahList, loading, error } = useSurahList();
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	const handleSetPlaying = () => {
		setIsPlaying(prev => !prev);
	};

	const addLanguage = (len: Language) => {
		setLanguage(len);
	};

	const handleLanguageChange = (lang: Language) => {
		setLanguage(lang);
		setIsPlaying(true); // auto-play on language change
	};

	let currentPage: number = 1;
	const [pageNo, setPageNo] = useState<number>(currentPage);

	const addFilterSurahs = (filterList: any[]) => {
		setFilterSurahs(filterList);
	};

	useEffect(() => {
		if (surahList) {
			setSurahs(surahList);
			setFilterSurahs(surahList);
		}
	}, [surahList]);

	return (
		<SurhasList.Provider
			value={{
				pageNo,
				setPageNo,
				surahs,
				loading,
				error,
				filterSurahs,
				addFilterSurahs,
				language,
				addLanguage,
				handleSetPlaying,
				handleLanguageChange,
				isPlaying
			}}
		>
			{children}
		</SurhasList.Provider>
	);
};

export { SurhasList, SurhasListProvider };
