import { buildSurahPath } from '@/lib/quran-routing';

export interface IslamicBannerItem {
  id: string;
  arabic?: string;
  text: string;
  source: string;
  href?: string;
  cta?: string;
}

export const ISLAMIC_BANNER_ITEMS: IslamicBannerItem[] = [
  {
    id: 'bismillah',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    text: 'In the name of Allah, the Most Gracious, the Most Merciful',
    source: 'Quran 1:1',
    href: '/surah',
    cta: 'Open Surah Index',
  },
  {
    id: 'yaseen',
    arabic: 'إِنَّا نَحْنُ نُحْيِي الْمَوْتَىٰ',
    text: 'Indeed, it is We who bring the dead to life',
    source: 'Quran 36:12 · Surah Yaseen',
    href: buildSurahPath(36, 'Yaseen'),
    cta: 'Read Surah Yaseen',
  },
  {
    id: 'rahman',
    arabic: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
    text: 'So which of the favors of your Lord would you deny?',
    source: 'Quran 55:13 · Surah Ar-Rahmaan',
    href: buildSurahPath(55, 'Ar-Rahmaan'),
    cta: 'Read Surah Ar-Rahmaan',
  },
  {
    id: 'hadith-intentions',
    text: 'Actions are judged by intentions, and every person will get what they intended.',
    source: 'Sahih al-Bukhari · Hadith 1',
    href: '/hadith',
    cta: 'Browse Hadith',
  },
  {
    id: 'hadith-kindness',
    text: 'The best of people are those who are most beneficial to others.',
    source: 'Islamic Teaching',
    href: '/hadith/search',
    cta: 'Search Hadiths',
  },
  {
    id: 'dhikr',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    text: 'Glory be to Allah and praise be to Him',
    source: 'Daily Dhikr',
    href: '/read-quran-online',
    cta: 'Read Quran',
  },
  {
    id: 'fajr-reminder',
    text: 'The recitation at Fajr is witnessed by the angels — begin your day with the Quran.',
    source: 'Quran 17:78',
    href: '/surah',
    cta: 'Start Reading',
  },
  {
    id: 'tafseer',
    text: 'Deepen your understanding with Urdu tafseer for every ayah.',
    source: 'Read al Quran',
    href: '/tafsir',
    cta: 'Open Tafseer',
  },
  {
    id: 'assalam',
    arabic: 'ٱلسَّلَامُ عَلَيْكُمْ',
    text: 'Peace be upon you — welcome to your Quran & Hadith companion',
    source: 'Islamic Greeting',
    href: '/about',
    cta: 'About Us',
  },
  {
    id: 'kahf-friday',
    text: 'Whoever reads Surah Al-Kahf on Friday, a light shines for them until the next Friday.',
    source: 'Hadith · Surah Al-Kahf',
    href: buildSurahPath(18, 'Al-Kahf'),
    cta: 'Read Surah Al-Kahf',
  },
];

export function getInitialBannerIndex() {
  const now = new Date();
  const daySeed = now.getDate() + now.getMonth() * 31;
  const hourSeed = now.getHours();
  return (daySeed + hourSeed) % ISLAMIC_BANNER_ITEMS.length;
}

export function getTimeBasedGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'صباح الخير · Good Morning';
  }

  if (hour >= 12 && hour < 17) {
    return 'مساء الخير · Good Afternoon';
  }

  if (hour >= 17 && hour < 21) {
    return 'مساء النور · Good Evening';
  }

  return 'السلام عليكم · Peace be upon you';
}
