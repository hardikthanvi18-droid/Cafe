import React, { useState } from 'react';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types/cafe';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
  onViewDetails: (productId: string) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article
      onClick={() => onViewDetails(product.id)}
      className="bg-white rounded-3xl border border-[#F0DDE5] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="h-52 overflow-hidden relative bg-[#FFF5F8]">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback placeholder if image load fails
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Quiet top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {product.isFeatured ? (
            <span className="text-[11px] font-medium bg-white/95 text-[#C96F91] px-2.5 py-0.5 rounded-md shadow-xs border border-[#F0DDE5]">
              Featured
            </span>
          ) : <span />}

          {product.dietary && (
            <span className="text-[11px] font-medium bg-white/95 text-[#3D3035] px-2.5 py-0.5 rounded-md shadow-xs border border-[#F0DDE5]">
              {product.dietary}
            </span>
          )}
        </div>

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-xs">
              Currently Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div className="text-[11px] text-[#806F77] font-medium flex items-center gap-1.5">
            <span>{product.categoryName}</span>
            {product.preparationTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{product.preparationTime}</span>
              </>
            )}
          </div>

          <h3 className="font-serif font-bold text-base text-[#3D3035] mt-1 group-hover:text-[#C96F91] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#806F77] mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing and Action row */}
        <div className="mt-5 pt-3.5 border-t border-[#F0DDE5] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#806F77] block">Price</span>
            <span className="text-base font-bold text-[#3D3035]">
              ₹{product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product.id);
              }}
              className="p-2 text-[#806F77] hover:text-[#C96F91] hover:bg-[#FFF5F8] rounded-full transition-colors"
              title="View Product Details"
              aria-label={`View details of ${product.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>

            {product.isAvailable ? (
              <button
                type="button"
                onClick={handleAdd}
                disabled={justAdded}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#F8D7E5] text-[#C96F91] hover:bg-[#C96F91] hover:text-white'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </>
                )}
              </button>
            ) : (
              <span className="text-xs text-gray-400 font-medium px-2 py-1">
                Unavailable
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
