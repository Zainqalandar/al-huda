import type { HadithGradeType } from '@/lib/hadith/types/hadith.types';

interface HadithGradeProps {
  grade: string;
}

function normalizeGrade(raw: string): HadithGradeType {
  const lower = raw.toLowerCase();
  if (lower.includes('sahih')) return 'Sahih';
  if (lower.includes('hasan')) return 'Hasan';
  if (lower.includes('da') || lower.includes('weak')) return 'Daif';
  if (lower.includes('maudu') || lower.includes('fabricated')) return 'Maudu';
  return 'Unknown';
}

const gradeConfig: Record<HadithGradeType, { label: string; className: string }> = {
  Sahih: {
    label: 'Sahih',
    className:
      'border border-[color-mix(in_oklab,#22c55e,var(--color-border)_50%)] bg-[color-mix(in_oklab,#22c55e,var(--color-surface)_88%)] text-[#166534] dark:text-[#86efac]',
  },
  Hasan: {
    label: 'Hasan',
    className:
      'border border-[color-mix(in_oklab,#3b82f6,var(--color-border)_50%)] bg-[color-mix(in_oklab,#3b82f6,var(--color-surface)_88%)] text-[#1d4ed8] dark:text-[#93c5fd]',
  },
  Daif: {
    label: "Da'if",
    className:
      'border border-[color-mix(in_oklab,#eab308,var(--color-border)_50%)] bg-[color-mix(in_oklab,#eab308,var(--color-surface)_88%)] text-[#a16207] dark:text-[#fde047]',
  },
  Maudu: {
    label: 'Maudu',
    className:
      'border border-[color-mix(in_oklab,var(--color-danger),var(--color-border)_50%)] bg-[color-mix(in_oklab,var(--color-danger),var(--color-surface)_88%)] text-[var(--color-danger)]',
  },
  Unknown: {
    label: 'Unknown',
    className:
      'border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted-text)]',
  },
};

export default function HadithGrade({ grade }: HadithGradeProps) {
  const normalized = normalizeGrade(grade);
  const config = gradeConfig[normalized];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
