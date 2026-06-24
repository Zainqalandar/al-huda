interface ArabicTextProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'text-lg leading-loose',
  md: 'text-2xl leading-loose',
  lg: 'text-3xl leading-relaxed',
  xl: 'text-4xl leading-relaxed',
};

export default function ArabicText({ text, className = '', size = 'md' }: ArabicTextProps) {
  return (
    <p
      dir="rtl"
      lang="ar"
      className={`font-arabic-amiri text-right ${sizeClasses[size]} ${className}`}
      style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
    >
      {text}
    </p>
  );
}
