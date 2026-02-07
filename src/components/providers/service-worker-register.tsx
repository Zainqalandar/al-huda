'use client';

import { useEffect } from 'react';

async function clearAppCaches() {
  if (!('caches' in window)) {
    return;
  }

  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => key.startsWith('alhuda-'))
      .map((key) => caches.delete(key))
  );
}

async function unregisterServiceWorkers() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
}

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!('serviceWorker' in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      const cleanupDevState = async () => {
        try {
          await unregisterServiceWorkers();
          await clearAppCaches();
        } catch {
          // keep local development resilient even if cleanup fails
        }
      };

      void cleanupDevState();
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
