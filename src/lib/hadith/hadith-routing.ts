export function buildHadithIndexPath() {
  return '/hadith';
}

export function buildHadithSearchPath() {
  return '/hadith/search';
}

export function buildHadithCollectionPath(collectionSlug: string) {
  return `/hadith/${collectionSlug}`;
}

export function buildHadithBookPath(
  collectionSlug: string,
  options?: { chapter?: string; page?: number }
) {
  const path = `/hadith/${collectionSlug}/books/${collectionSlug}`;
  const params = new URLSearchParams();

  if (options?.chapter) {
    params.set('chapter', options.chapter);
  }

  if (options?.page && options.page > 1) {
    params.set('page', String(options.page));
  }

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function buildHadithDetailPath(collectionSlug: string, hadithNumber: string | number) {
  return `/hadith/${collectionSlug}/books/${collectionSlug}/${hadithNumber}`;
}

export function buildHadithOgImagePath(options: {
  variant: 'index' | 'collection' | 'detail';
  bookName?: string;
  hadithNumber?: string;
}) {
  const params = new URLSearchParams({ kind: 'hadith', variant: options.variant });

  if (options.bookName) {
    params.set('book', options.bookName);
  }

  if (options.hadithNumber) {
    params.set('number', options.hadithNumber);
  }

  return `/og?${params.toString()}`;
}
