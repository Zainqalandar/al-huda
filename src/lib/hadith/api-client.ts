const BASE_URL = 'https://hadithapi.com/api';
const API_KEY = '$2y$10$00FYDd23a9QxcLJi0QPgehmVhJ46aNE5t9T7NALuUteCExBUPfy';

type FetchOptions = {
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
};

export class HadithApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'HadithApiError';
  }
}

export async function hadithFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { cache = 'force-cache', revalidate, tags } = options;

  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${BASE_URL}${endpoint}${separator}apiKey=${API_KEY}`;

  const nextOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    cache,
    next: {},
  };

  if (revalidate !== undefined) {
    nextOptions.next = { revalidate };
  }

  if (tags && tags.length > 0) {
    nextOptions.next = { ...nextOptions.next, tags };
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, nextOptions);

      if (!response.ok) {
        throw new HadithApiError(
          response.status,
          `HadithAPI error: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as T;
      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      if (error instanceof HadithApiError && error.status < 500) {
        throw error;
      }
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error('Failed after 3 attempts');
}
