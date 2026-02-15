import { permanentRedirect } from 'next/navigation';

export default function QuranPageLegacyRedirect() {
  permanentRedirect('/surah');
}
