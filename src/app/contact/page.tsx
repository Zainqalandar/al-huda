import type { Metadata } from 'next';
import { buildLocalBusinessJsonLd, buildEducationalOrganizationJsonLd, toAbsoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact Al-Huda Quran - Pakistan | Get in Touch',
  description:
    'Contact Al-Huda Quran team in Pakistan. Support, feedback, or partnership inquiries. Available in Urdu, English, and Arabic.',
  keywords: [
    'contact al-huda quran',
    'quran app contact pakistan',
    'al-huda support',
    'quran app customer service',
    'islamic learning support',
  ],
  alternates: {
    canonical: '/contact',
    languages: {
      en: '/contact',
      'ur-PK': '/contact',
      ar: '/contact',
    },
  },
  openGraph: {
    title: 'Contact Al-Huda Quran',
    description: 'Get in touch with Al-Huda Quran team',
    url: toAbsoluteUrl('/contact'),
    type: 'website',
  },
};

export default function ContactPage() {
  const localBusinessSchema = buildLocalBusinessJsonLd({
    name: 'Al-Huda Quran',
    description: 'Islamic learning platform with Quran, Tafseer, and Hadith',
    url: toAbsoluteUrl('/'),
    telephone: '+92-51-XXXXXXX',
    email: 'support@al-huda.quran',
    address: {
      city: 'Islamabad',
      country: 'Pakistan',
      postalCode: '44000',
    },
    image: toAbsoluteUrl('/logos/logo3.png'),
  });

  const educationalOrgSchema = buildEducationalOrganizationJsonLd({
    name: 'Al-Huda Quran',
    description: 'Islamic learning platform with Quran, Tafseer, and Hadith',
    url: toAbsoluteUrl('/'),
    logo: toAbsoluteUrl('/logos/logo3.png'),
    location: 'Islamabad, Pakistan',
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Al-Huda Quran
            </h1>
            <p className="text-xl text-slate-300">
              Get in touch with our team. We&apos;re here to help!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-slate-800 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-amber-500 mb-3">Email</h3>
              <p className="text-slate-300 mb-2">General Inquiries:</p>
              <a href="mailto:support@al-huda.quran" className="text-blue-400 hover:underline">
                support@al-huda.quran
              </a>
              <p className="text-slate-300 mt-4 mb-2">Partnerships:</p>
              <a href="mailto:partnerships@al-huda.quran" className="text-blue-400 hover:underline">
                partnerships@al-huda.quran
              </a>
            </div>

            <div className="bg-slate-800 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-amber-500 mb-3">Phone</h3>
              <p className="text-slate-300 mb-2">Pakistan (Local):</p>
              <a href="tel:+92-51-XXXXXXX" className="text-blue-400 hover:underline">
                +92-51-XXXXXXX
              </a>
              <p className="text-slate-300 mt-4 mb-2">WhatsApp:</p>
              <a href="https://wa.me/92XXXXXXXXXX" className="text-blue-400 hover:underline">
                Chat on WhatsApp
              </a>
            </div>

            <div className="bg-slate-800 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-amber-500 mb-3">Location</h3>
              <p className="text-slate-300">
                Islamabad<br />
                Pakistan
              </p>
              <p className="text-slate-400 text-sm mt-4">
                Available 24/7 for support
              </p>
            </div>
          </div>

          <div className="bg-slate-800 p-8 rounded-lg mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">Follow Us</h2>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.facebook.com/alhuda.quran"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/alhuda.quran"
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition"
              >
                Instagram
              </a>
              <a
                href="https://twitter.com/al_huda_quran"
                className="px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition"
              >
                Twitter
              </a>
            </div>
          </div>

          <div className="bg-slate-800 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="cursor-pointer text-lg font-semibold text-amber-500 hover:text-amber-400">
                  How can I report a bug?
                </summary>
                <p className="mt-2 text-slate-300 pl-4">
                  Please email us at support@al-huda.quran with details about the bug.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer text-lg font-semibold text-amber-500 hover:text-amber-400">
                  Is Al-Huda Quran available offline?
                </summary>
                <p className="mt-2 text-slate-300 pl-4">
                  Yes, the app includes offline support for reading Quran.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer text-lg font-semibold text-amber-500 hover:text-amber-400">
                  Does it have Urdu translation?
                </summary>
                <p className="mt-2 text-slate-300 pl-4">
                  Yes, complete Quran with Urdu translation and tafseer.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrgSchema) }}
      />
    </main>
  );
}
