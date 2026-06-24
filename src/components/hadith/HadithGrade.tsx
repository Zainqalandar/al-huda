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
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  },
  Hasan: {
    label: 'Hasan',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  Daif: {
    label: "Da'if",
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  Maudu: {
    label: 'Maudu',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  },
  Unknown: {
    label: 'Unknown',
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  },
};

export default function HadithGrade({ grade }: HadithGradeProps) {
  const normalized = normalizeGrade(grade);
  const config = gradeConfig[normalized];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
