import React, { useEffect, useState } from 'react';
import { Coffee, Cake, Sparkles, Heart, ArrowRight, Star, ShieldAlert } from 'lucide-react';
import { Product, Review, WebsiteSettings } from '../types/cafe';
import { ProductCard } from '../components/ProductCard';

interface Props {
  onNavigate: (page: string) => void;
  onViewProduct: (productId: string) => void;
  settings?: WebsiteSettings;
}

export const HomePage: React.FC<Props> = ({ onNavigate, onViewProduct, settings }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          fetch('/api/products?featured=true'),
          fetch('/api/reviews')
        ]);
        const prodData = await prodRes.json();
        const revData = await revRes.json();

        if (prodData.success) {
          setFeaturedProducts(prodData.products.slice(0, 6));
        }
        if (revData.success) {
          setReviews(revData.reviews.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* C. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FFF5F8]/70 to-white pt-12 pb-16 sm:py-24">
        {/* Decorative background shapes */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#FCE7EF]/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#F8D7E5]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F0DDE5] text-xs font-semibold text-[#C96F91] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#C96F91] animate-pulse" />
              <span>Artisanal Coffee & Pastel Patisserie</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#3D3035] leading-[1.15] tracking-tight">
              Your Daily Dose of <br className="hidden sm:inline" />
              <span className="text-[#C96F91] italic font-normal">Happiness.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#806F77] leading-relaxed max-w-xl mx-auto lg:mx-0">
              From freshly brewed coffee to delightful desserts, discover your little corner of joy at Sip And Joy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('menu')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                Explore Our Menu
              </button>
              <button
                onClick={() => onNavigate('menu')}
                className="w-full sm:w-auto px-7 py-3.5 bg-white border border-[#F0DDE5] hover:border-[#C96F91] text-[#3D3035] text-sm font-semibold rounded-full hover:bg-[#FFF5F8] transition-all cursor-pointer"
              >
                Order Your Favorites
              </button>
            </div>

            {/* Quiet trust indicators */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#806F77]">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#C96F91]" />
                <span>100% Arabica Roasts</span>
              </div>
              <span className="text-[#F0DDE5] hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <Cake className="w-4 h-4 text-[#C96F91]" />
                <span>Baked Fresh Daily</span>
              </div>
              <span className="text-[#F0DDE5] hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C96F91]" />
                <span>Eggless & Vegan Options</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white aspect-4/3 sm:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
                  alt="Cozy cafe with latte, croissants and flowers"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Little Joy Card */}
              <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#F0DDE5] shadow-lg flex items-center gap-3.5 max-w-xs">
                <div className="w-11 h-11 rounded-full bg-[#FFF5F8] border border-[#F8D7E5] flex items-center justify-center text-[#C96F91] shrink-0">
                  <Heart className="w-5 h-5 fill-[#C96F91]" />
                </div>
                <div>
                  <p className="text-xs font-serif font-bold text-[#3D3035]">Crafted With Care</p>
                  <p className="text-[11px] text-[#806F77]">Every cup poured with velvety perfection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* D. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-left">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold block mb-1">
              Curated Delights
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#3D3035]">
              Featured Treats & Sips
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-semibold text-[#C96F91] hover:text-[#b05d7e] flex items-center gap-1 group"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-80 bg-gray-100 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* E. OUR SPECIALTIES */}
      <section className="bg-[#FFF5F8] py-16 sm:py-20 border-y border-[#F0DDE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold block mb-1">
              What We Do Best
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#3D3035]">Our Café Specialties</h2>
            <p className="text-xs sm:text-sm text-[#806F77] mt-2">
              Three pillars that make every morning and afternoon feel like an indulgence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-[#F0DDE5] text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF5F8] border border-[#F8D7E5] flex items-center justify-center text-[#C96F91] shadow-2xs">
                <Coffee className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#3D3035]">Freshly Brewed Coffee</h3>
              <p className="text-xs text-[#806F77] leading-relaxed">
                Single-origin 100% Arabica beans calibrated every morning. From rich velvety flat whites to slow-dripped iced caramel lattes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl border border-[#F0DDE5] text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF5F8] border border-[#F8D7E5] flex items-center justify-center text-[#C96F91] shadow-2xs">
                <Cake className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#3D3035]">Delicious Desserts</h3>
              <p className="text-xs text-[#806F77] leading-relaxed">
                Signature strawberry cheesecakes, fudgy warm Belgian brownies, and 27-layer butter croissants handcrafted without artificial preservatives.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-[#F0DDE5] text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF5F8] border border-[#F8D7E5] flex items-center justify-center text-[#C96F91] shadow-2xs">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#3D3035]">Cozy Café Experience</h3>
              <p className="text-xs text-[#806F77] leading-relaxed">
                A soothing pastel atmosphere with soft blush tones, warm acoustic playlists, and friendly baristas who remember your favorite order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* F. ABOUT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-gray-100 aspect-4/3">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
              alt="Pastel cafe interior with cozy tables"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold block">
              About Our Café
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D3035] leading-tight">
              More Than Coffee, It's a Feeling.
            </h2>
            <p className="text-sm sm:text-base text-[#806F77] leading-relaxed">
              At Sip And Joy, we believe that happiness can be found in the smallest moments. From your first morning coffee to an afternoon treat, we create delicious experiences that bring people together.
            </p>
            <p className="text-xs sm:text-sm text-[#806F77] leading-relaxed">
              We started with a vision to create an unhurried space in the city where every visitor is greeted with genuine warmth, aesthetic charm, and honest food crafted from scratch.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="px-7 py-3 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-full shadow-md transition-colors"
              >
                Read Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* H. SPECIAL OFFER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#FCE7EF] via-[#F8D7E5] to-[#FFF5F8] p-8 sm:p-14 rounded-3xl border border-[#F0DDE5] text-center space-y-4 shadow-xs relative overflow-hidden">
          <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold">
            Sweet Celebration
          </span>
          <h3 className="text-2xl sm:text-4xl font-serif font-bold text-[#3D3035]">
            {settings?.promoBannerText || 'A Little Treat Makes Every Day Sweeter.'}
          </h3>
          <p className="text-xs sm:text-sm text-[#806F77] max-w-lg mx-auto">
            {settings?.promoBannerSubtext || 'Use code JOY15 during checkout for 15% off orders above ₹499! Valid this month.'}
          </p>

          <div className="pt-3">
            <button
              onClick={() => onNavigate('menu')}
              className="px-8 py-3 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-full shadow-md transition-transform hover:scale-105"
            >
              Explore Offers & Menu
            </button>
          </div>
        </div>
      </section>

      {/* G. CUSTOMER TESTIMONIALS (Transparent Demonstration Content) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] text-amber-800 font-medium mb-3">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Demonstration Reviews Notice</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#3D3035]">Words of Joy</h2>
          <p className="text-xs text-[#806F77] mt-1">
            Sample customer feedback highlighting typical café experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-[#F0DDE5] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-[#3D3035] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0DDE5] flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-[#3D3035]">{rev.customerName}</p>
                  {rev.productName && (
                    <p className="text-[10px] text-[#806F77]">Ordered: {rev.productName}</p>
                  )}
                </div>

                {rev.isDemonstration && (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Demo review
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
