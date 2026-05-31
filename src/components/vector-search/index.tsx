'use client';

import { SemanticSearch } from './semantic-search';
import { QuranQA } from './quran-qa';

export function VectorSearchTools() {
  return (
    <div className="space-y-8">
      <SemanticSearch />
      <QuranQA />
    </div>
  );
}

export { SemanticSearch, QuranQA };
