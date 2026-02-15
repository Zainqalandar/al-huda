import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function SettingsPage() {
  redirect('/quran#quran-settings');
}
