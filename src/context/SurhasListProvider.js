'use client';
import useSurahList from '@/hooks/useSurahList';
import React, { createContext, useEffect, useState } from 'react';
const SurhasList = createContext();

const SurhasListProvider = ({ children }) => {
	const [surahs, setSurahs] = useState(null);
	const [filterSurahs, setFilterSurahs] = useState(null);
	const { surahList, loading, error } = useSurahList();

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
			}}
		>
			{children}
		</SurhasList.Provider>
	);
};

export { SurhasList, SurhasListProvider };
