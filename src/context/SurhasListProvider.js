'use client';
import useSurahList from '@/hooks/useSurahList';
import React, { createContext, useEffect, useState } from 'react';
const SurhasList = createContext();

const SurhasListProvider = ({ children }) => {
	const [surahs, setSurahs] = useState(null);
	const [filterSurahs, setFilterSurahs] = useState(null);
	const [language, setLanguage] = useState('tr');
	const { surahList, loading, error } = useSurahList();
	const [isPlaying, setIsPlaying] = useState(false);

	const handleSetPlaying = () => {
		setIsPlaying(isPlaying);
	}

	const addLanguage = (len) => {
		setLanguage(len);
	};

	let currentPage = 1;
	const [pageNo, setPageNo] = useState(currentPage);

	const addFilterSurahs = (filterList) => {
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
				addLanguage,
				handleSetPlaying,
				isPlaying
			}}
		>
			{children}
		</SurhasList.Provider>
	);
};

export { SurhasList, SurhasListProvider };
