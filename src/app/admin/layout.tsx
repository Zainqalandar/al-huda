import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s | Admin | Al-Huda Quran',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  alternates: {
    canonical: '/admin',
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
