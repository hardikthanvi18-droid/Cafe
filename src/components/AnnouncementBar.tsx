import React from 'react';
import { WebsiteSettings } from '../types/cafe';

interface Props {
  settings?: WebsiteSettings;
}

export const AnnouncementBar: React.FC<Props> = ({ settings }) => {
  if (settings && !settings.announcementEnabled) {
    return null;
  }

  const text = settings?.announcementText || 'Little moments, lovely sips. Welcome to Sip And Joy!';

  return (
    <aside aria-label="Announcement" className="bg-[#F8D7E5] text-[#3D3035] border-b border-[#F0DDE5] py-2 px-4 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-2">
      <span className="text-xs">🌸</span>
      <span>{text}</span>
      <span className="hidden sm:inline text-xs text-[#806F77]">· Free delivery on orders above ₹{settings?.freeDeliveryThreshold || 500}</span>
    </aside>
  );
};
