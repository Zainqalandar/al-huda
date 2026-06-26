'use client';

import { useEffect, useState } from 'react';

const DEFAULT_HEADER_HEIGHT = 68;

function readHeaderHeight(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-height');
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_HEADER_HEIGHT;
}

export function useSiteHeaderHeight() {
  const [height, setHeight] = useState(DEFAULT_HEADER_HEIGHT);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-site-header]');
    if (!header) return;

    const sync = () => setHeight(readHeaderHeight());

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return height;
}
