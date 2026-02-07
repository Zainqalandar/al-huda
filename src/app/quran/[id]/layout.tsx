export default function QuranChildPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="relative bg-[var(--color-bg)]">{children}</div>;
}
