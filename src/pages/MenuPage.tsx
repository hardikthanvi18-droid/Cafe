import React, { useState, useEffect } from 'react';
import { Search, Filter, Coffee, Sparkles, RefreshCw } from 'lucide-react';
import { Product, Category } from '../types/cafe';
import { ProductCard } from '../components/ProductCard';

interface Props {
  onViewProduct: (productId: string) => void;
}

export const MenuPage: React.FC<Props> = ({ onViewProduct }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.categories);
      })
      .catch(console.error);
  }, []);

  // Fetch products with filters
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (sortBy !== 'default') params.append('sort', sortBy);
    if (featuredOnly) params.append('featured', 'true');

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, sortBy, featuredOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold">
          Our Handcrafted Offerings
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D3035]">
          Café Delights & Artisan Beverages
        </h1>
        <p className="text-xs sm:text-sm text-[#806F77]">
          Every drink, pastry, and snack is freshly prepared in our pastel kitchen using pure ingredients.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFF5F8] p-4 sm:p-5 rounded-3xl border border-[#F0DDE5] space-y-4 shadow-2xs">
        {/* Category Tabs (Segmented Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#C96F91] text-white shadow-xs'
                : 'bg-white text-[#3D3035] hover:bg-[#FCE7EF] border border-[#F0DDE5]'
            }`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#C96F91] text-white shadow-xs'
                  : 'bg-white text-[#3D3035] hover:bg-[#FCE7EF] border border-[#F0DDE5]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search, Sort, and Featured Toggles */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#F0DDE5]">
          {/* Search box */}
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 text-[#806F77] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search coffee, strawberry, croissant..."
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-2xl border border-[#F0DDE5] bg-white focus:outline-none focus:border-[#C96F91] placeholder:text-[#806F77]/60"
            />
          </div>

          <div className="flex items-center gap-2.5">
            {/* Featured toggle */}
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold border transition-colors cursor-pointer ${
                featuredOnly
                  ? 'bg-[#FCE7EF] text-[#C96F91] border-[#C96F91]'
                  : 'bg-white text-[#3D3035] border-[#F0DDE5] hover:bg-[#FFF5F8]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Only</span>
            </button>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-xs px-3 py-2 rounded-2xl border border-[#F0DDE5] bg-white text-[#3D3035] font-medium focus:outline-none focus:border-[#C96F91] cursor-pointer"
            >
              <option value="default">Default Sorting</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="h-80 bg-gray-100/70 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#FFF5F8] rounded-3xl border border-[#F0DDE5] space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center text-2xl text-[#C96F91] shadow-2xs">
            ☕
          </div>
          <h3 className="font-serif font-bold text-lg text-[#3D3035]">No treats found</h3>
          <p className="text-xs text-[#806F77] max-w-sm mx-auto">
            We couldn't find anything matching your search. Try adjusting filters or search keywords.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setFeaturedOnly(false);
                setSortBy('default');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C96F91] text-white text-xs font-semibold rounded-full hover:bg-[#b05d7e] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
