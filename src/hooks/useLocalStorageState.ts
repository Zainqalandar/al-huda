'use client';

import { useEffect, useState } from 'react';

export function useLocalStorageState<T>(
  key: string,
  fallback: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [isLoaded, setIsLoaded] = useState(false);
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      setValue(fallback);
    } finally {
      setIsLoaded(true);
    }
    // only for key changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const updateValue = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // no-op
      }
      return resolved;
    });
  };

  return [value, updateValue, isLoaded];
}
