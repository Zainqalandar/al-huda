import { toArabicIndicNumerals } from '@/lib/arabic-utils';

interface AyahEndMarkerProps {
  number: number;
  className?: string;
}

export default function AyahEndMarker({ number, className = '' }: AyahEndMarkerProps) {
  return (
    <span
      className={`ayah-end-marker ${className}`.trim()}
      aria-label={`Ayah ${number}`}
      title={`Ayah ${number}`}
    >
      {toArabicIndicNumerals(number)}
    </span>
  );
}
