interface ArabicTextProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeScale: Record<NonNullable<ArabicTextProps['size']>, string> = {
  sm: 'text-[calc(1.15rem*var(--arabic-font-scale))]',
  md: 'text-[calc(1.65rem*var(--arabic-font-scale))]',
  lg: 'text-[calc(2rem*var(--arabic-font-scale))]',
  xl: 'text-[calc(2.45rem*var(--arabic-font-scale))]',
};

export default function ArabicText({ text, className = '', size = 'md' }: ArabicTextProps) {
  return (
    <p
      dir="rtl"
      lang="ar"
      className={`arabic-font arabic-reading text-right ${sizeScale[size]} ${className}`.trim()}
    >
      {text}
    </p>
  );
}
