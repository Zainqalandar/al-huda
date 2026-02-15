import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function SignUpPage() {
  redirect('/quran');
}
