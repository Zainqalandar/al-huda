'use client';

import { useState } from 'react';

export function useLocalStorageState<T>(
  _key: string,
  fallback: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(fallback);
  const isLoaded = true;

  const updateValue = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      return typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
    });
  };

  return [value, updateValue, isLoaded];
}
