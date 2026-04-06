'use client';

import { useEffect } from 'react';
import { useAdminStore } from '../store/useAdminStore';

export default function ThemeSync() {
  const settings = useAdminStore((state) => state.settings);

  useEffect(() => {
    if (settings.themeColor) {
      document.documentElement.style.setProperty('--primary', settings.themeColor);
    }
  }, [settings.themeColor]);

  return null;
}
