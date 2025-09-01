import React, { useEffect, useState } from 'react';

let cachedSurahs = null;

const useSurahList = () => {
	const [surahList, setSurahList] = useState(cachedSurahs);
  const [loading, setLoading] = useState(!cachedSurahs);
  const [error, setError] = useState(null);

    

	useEffect(() => {

		if (cachedSurahs) return; 

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

				const withIdData = data.map((surah, i) => ({ ...surah, id: i + 1 }));
				cachedSurahs = withIdData;

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
