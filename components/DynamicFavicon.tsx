'use client';

import { useEffect } from 'react';
import { useAdminStore } from '../store/useAdminStore';

export default function DynamicFavicon() {
  const { settings } = useAdminStore();

  useEffect(() => {
    if (settings.faviconUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = settings.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    if (settings.siteName) {
      document.title = settings.siteName;
    }
  }, [settings.faviconUrl, settings.siteName]);

  return null;
}
