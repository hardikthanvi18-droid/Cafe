import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  alt: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Damask Rose Latte Art',
    category: 'Coffee & Drinks',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1000&q=80',
    alt: 'Delicate pink latte infused with organic rose petals and fine latte art'
  },
  {
    id: 'g-2',
    title: 'Golden Butter Croissant',
    category: 'Artisanal Bakery',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80',
    alt: 'Golden flaky Parisian butter croissant resting on pastel ceramic dish'
  },
  {
    id: 'g-3',
    title: 'Fresh Strawberry Shake',
    category: 'Milkshakes & Coolers',
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=1000&q=80',
    alt: 'Creamy strawberry milkshake crowned with whipped cream and fresh berry'
  },
  {
    id: 'g-4',
    title: 'Strawberry Cheesecake Slice',
    category: 'Patisserie',
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1000&q=80',
    alt: 'Velvety cream cheesecake topped with strawberry compote glaze'
  },
  {
    id: 'g-5',
    title: 'Belgian Molten Brownie',
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=80',
    alt: 'Warm fudgy dark chocolate brownie with crinkled top and chocolate drizzle'
  },
  {
    id: 'g-6',
    title: 'Sunlit Window Booths',
    category: 'Café Interiors',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    alt: 'Cozy pastel cafe interior with sunlit window seating and warm wooden accents'
  },
  {
    id: 'g-7',
    title: 'Japanese Matcha Cloud',
    category: 'Specialty Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=80',
    alt: 'Ceremonial grade matcha cooler with sweetened cloud foam'
  },
  {
    id: 'g-8',
    title: 'Artisanal Cinnamon Bakes',
    category: 'Morning Bakes',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    alt: 'Warm freshly baked cinnamon rolls glazed with vanilla icing'
  }
];

export const GalleryPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<GalleryItem | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold">
          Visual Memories
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D3035]">
          The Sip And Joy Gallery
        </h1>
        <p className="text-xs sm:text-sm text-[#806F77]">
          A soft pastel snapshot into our kitchen creations, cozy seating, and joyful baristas.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {GALLERY_ITEMS.map(item => (
          <div
            key={item.id}
            onClick={() => setActiveModal(item)}
            className="group relative rounded-3xl overflow-hidden border border-[#F0DDE5] bg-white shadow-2xs hover:shadow-md transition-all cursor-pointer aspect-square"
          >
            <img
              src={item.imageUrl}
              alt={item.alt}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Hover overlay with title */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D3035]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] uppercase font-semibold text-[#F8D7E5]">
                {item.category}
              </span>
              <p className="font-serif font-bold text-sm">{item.title}</p>
              <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/30 backdrop-blur-sm">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Lightbox */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8 animate-in fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full border border-[#F0DDE5] shadow-2xl relative"
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 text-[#3D3035] hover:text-[#C96F91] flex items-center justify-center shadow-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-4/3 sm:aspect-16/10 bg-black">
              <img
                src={activeModal.imageUrl}
                alt={activeModal.alt}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-1">
              <span className="text-xs uppercase font-semibold text-[#C96F91]">
                {activeModal.category}
              </span>
              <h3 className="font-serif font-bold text-xl text-[#3D3035]">
                {activeModal.title}
              </h3>
              <p className="text-xs text-[#806F77] pt-1">
                {activeModal.alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
