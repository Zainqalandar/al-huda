'use client';
import React, { createContext, useState } from 'react';
const QuranData = createContext();

const DataProvider = ({ children }) => {
	let currentPage = 1;
	const [pageNo, setPageNo] = useState(currentPage);

	return (
		<QuranData.Provider value={{ pageNo, setPageNo }}>
			{children}
		</QuranData.Provider>
	);
};

export { QuranData, DataProvider };
