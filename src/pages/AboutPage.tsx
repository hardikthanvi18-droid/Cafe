import React from 'react';
import { Coffee, Heart, Sparkles, Award } from 'lucide-react';

interface Props {
  onExploreMenu: () => void;
}

export const AboutPage: React.FC<Props> = ({ onExploreMenu }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold">
          Our Heart & Heritage
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#3D3035]">
          About Sip And Joy
        </h1>
        <p className="text-xs sm:text-sm text-[#806F77] leading-relaxed">
          A modern pastel café born from a deep affection for honest coffee roasting, slow pastry baking, and cozy daily rituals.
        </p>
      </div>

      {/* Hero Banner */}
      <div className="rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-gray-100 aspect-21/9">
        <img
          src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80"
          alt="Artisanal cafe roasting and calm aesthetic atmosphere"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Story Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-xs sm:text-sm text-[#806F77] leading-relaxed">
        <div className="bg-white p-8 rounded-3xl border border-[#F0DDE5] space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FFF5F8] border border-[#F8D7E5] flex items-center justify-center text-[#C96F91]">
            <Heart className="w-5 h-5 fill-[#C96F91]" />
          </div>
          <h2 className="font-serif font-bold text-xl text-[#3D3035]">
            The Café Philosophy
          </h2>
          <p>
            At Sip And Joy, we believe that happiness can be found in the smallest moments. From your first morning espresso to an afternoon slice of strawberry cheesecake, our mission is to create delicious, comforting experiences that bring people together.
          </p>
          <p>
            In a bustling world, our pastel café is designed to be your serene pause button. Every interior element — from our soft blush seating to curated ambient acoustic playlists — exists to help you breathe, smile, and savor.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#F0DDE5] space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FFF5F8] border border-[#F8D7E5] flex items-center justify-center text-[#C96F91]">
            <Coffee className="w-5 h-5" />
          </div>
          <h2 className="font-serif font-bold text-xl text-[#3D3035]">
            Our Sourcing & Craft
          </h2>
          <p>
            We take pride in selecting 100% Arabica coffee beans sustainably harvested from misty estates in Southern India. Our baristas balance grind sizes, water temperatures, and milk steaming temperatures daily to achieve silky, micro-foamed perfection.
          </p>
          <p>
            Our bakery counter features authentic 27-layer French butter croissants, rich Belgian chocolate brownies, and contemporary eggless cakes prepared fresh in small batches every morning.
          </p>
        </div>
      </div>

      {/* Values Callout */}
      <div className="bg-[#FFF5F8] p-8 sm:p-12 rounded-3xl border border-[#F0DDE5] text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold">
          Join Us Today
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#3D3035]">
          Every Sip Tells a Lovely Story
        </h3>
        <p className="text-xs sm:text-sm text-[#806F77] max-w-md mx-auto">
          Whether you stop by our Bandra café for a quiet reading session or order your morning favorites to your doorstep, we can't wait to share our joy with you.
        </p>
        <div className="pt-2">
          <button
            onClick={onExploreMenu}
            className="px-8 py-3 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-full shadow-md transition-all cursor-pointer"
          >
            Explore What's Fresh on the Menu →
          </button>
        </div>
      </div>
    </div>
  );
};
