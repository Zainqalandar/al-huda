import React, { useEffect, useState } from 'react';

const useSurahList = () => {
	const [surahList, setSurahList] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

    function addIdToSurahs(surahs) {
		return surahs.map((surah, index) => ({
			...surah,
			id: index + 1,
		}));
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					'https://quranapi.pages.dev/api/surah.json'
				);

				if (!res.ok) {
					throw new Error('HTTP Error! status: ', res.status);
				}

				const data = await res.json();

				const withIdData = addIdToSurahs(data);

				setSurahList(withIdData);
				setLoading(false);
			} catch (error) {
				setError(error.message);
				setSurahList(null);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return { surahList, loading, error };
};

export default useSurahList;
