'use client';

import { useCallback, useEffect, useState } from 'react';

export function useLocalStorageState<T>(
  key: string,
  fallback: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(fallback);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      // keep fallback
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  const updateValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;

        if (isLoaded) {
          try {
            window.localStorage.setItem(key, JSON.stringify(resolved));
          } catch {
            // ignore quota or privacy errors
          }
        }

        return resolved;
      });
    },
    [isLoaded, key]
  );

  return [value, updateValue, isLoaded];
}
