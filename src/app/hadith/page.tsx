import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hadith',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function HadithPage() {
  redirect('/quran');
}
