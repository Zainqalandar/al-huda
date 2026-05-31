import Image from 'next/image';
import { CSSProperties, ReactNode } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
  blurDataURL?: string;
  onLoad?: () => void;
}

/**
 * Optimized Image component wrapper
 * Provides sensible defaults for performance
 */
export function OptimizedImage({
  src,
  alt,
  priority = false,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
  width = 1200,
  height = 630,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={quality}
      sizes={sizes}
      className={className}
      placeholder={props.blurDataURL ? 'blur' : 'empty'}
      blurDataURL={props.blurDataURL}
      {...props}
    />
  );
}

/**
 * Logo image component - optimized for logo display
 */
export function LogoImage({
  src,
  alt,
  className,
  priority = true,
}: Omit<OptimizedImageProps, 'width' | 'height' | 'quality' | 'sizes'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={192}
      height={192}
      quality={90}
      priority={priority}
      sizes="(max-width: 768px) 64px, 128px"
      className={className}
    />
  );
}

/**
 * Hero image component - optimized for large displays
 */
export function HeroImage({
  src,
  alt,
  className,
  priority = true,
}: Omit<OptimizedImageProps, 'width' | 'height' | 'quality' | 'sizes'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      quality={85}
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 100vw"
      className={className}
    />
  );
}

/**
 * Card image component - optimized for card displays
 */
export function CardImage({
  src,
  alt,
  className,
  priority = false,
}: Omit<OptimizedImageProps, 'width' | 'height' | 'quality' | 'sizes'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={400}
      height={300}
      quality={75}
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className={className}
    />
  );
}
