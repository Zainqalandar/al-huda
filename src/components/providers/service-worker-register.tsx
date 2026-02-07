'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!('serviceWorker' in navigator)) {
      return;
    }

    const register = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch {
        // service worker is optional
      }
    };

    void register();
  }, []);

  return null;
}
