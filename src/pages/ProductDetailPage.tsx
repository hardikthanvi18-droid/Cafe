import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Plus, Minus, Check, Clock, Flame, Sparkles } from 'lucide-react';
import { Product } from '../types/cafe';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

interface Props {
  productId: string;
  onBackToMenu: () => void;
  onSelectProduct: (id: string) => void;
}

export const ProductDetailPage: React.FC<Props> = ({ productId, onBackToMenu, onSelectProduct }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.product);
          setRelated(data.related || []);
        } else {
          setProduct(null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF5F8] flex items-center justify-center text-3xl">☕</div>
        <h2 className="font-serif font-bold text-2xl text-[#3D3035]">Treat Not Found</h2>
        <p className="text-xs text-[#806F77]">This delicacy may have been retired from our seasonal menu.</p>
        <button
          onClick={onBackToMenu}
          className="px-6 py-2.5 bg-[#C96F91] text-white text-xs font-semibold rounded-full hover:bg-[#b05d7e]"
        >
          Return to Café Menu
        </button>
      </div>
    );
  }

  const handleAdd = () => {
    if (!product.isAvailable) return;
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back button */}
      <button
        onClick={onBackToMenu}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#806F77] hover:text-[#C96F91] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Café Menu</span>
      </button>

      {/* Main product display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 bg-white rounded-3xl border border-[#F0DDE5] p-6 sm:p-10 shadow-xs items-center">
        {/* Product image */}
        <div className="rounded-3xl overflow-hidden bg-[#FFF5F8] border border-[#F0DDE5] aspect-square relative shadow-inner">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.dietary && (
            <span className="absolute top-4 right-4 bg-white/95 text-xs font-semibold text-[#3D3035] px-3 py-1 rounded-full border border-[#F0DDE5] shadow-xs">
              {product.dietary}
            </span>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#806F77] font-medium">
              <span className="text-[#C96F91] font-semibold">{product.categoryName}</span>
              {product.isFeatured && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#C96F91]">Café Signature</span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D3035]">
              {product.name}
            </h1>

            <p className="text-2xl font-bold text-[#C96F91] pt-1">
              ₹{product.price.toFixed(2)}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#806F77] leading-relaxed">
            {product.description}
          </p>

          {/* Metadata badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-[#FFF5F8] p-3 rounded-2xl border border-[#F0DDE5] flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#C96F91]" />
              <div className="text-xs">
                <span className="text-[#806F77] block text-[10px]">Prep Time</span>
                <span className="font-semibold text-[#3D3035]">{product.preparationTime || '5-7 mins'}</span>
              </div>
            </div>

            <div className="bg-[#FFF5F8] p-3 rounded-2xl border border-[#F0DDE5] flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-[#C96F91]" />
              <div className="text-xs">
                <span className="text-[#806F77] block text-[10px]">Energy</span>
                <span className="font-semibold text-[#3D3035]">{product.calories || '220'} kcal</span>
              </div>
            </div>
          </div>

          {/* Ingredients list if present */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-semibold text-[#3D3035] uppercase tracking-wider block">
                Key Ingredients:
              </span>
              <p className="text-xs text-[#806F77]">
                {product.ingredients.join(', ')}
              </p>
            </div>
          )}

          {/* Quantity Selector & Add to Cart */}
          <div className="pt-4 border-t border-[#F0DDE5] space-y-4">
            {product.isAvailable ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center justify-between border border-[#F0DDE5] rounded-full px-4 py-2 bg-[#FFF5F8] w-36">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="text-[#3D3035] hover:text-[#C96F91] disabled:opacity-40 p-1"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-semibold text-sm text-[#3D3035] w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(20, quantity + 1))}
                    disabled={quantity >= 20}
                    className="text-[#3D3035] hover:text-[#C96F91] disabled:opacity-40 p-1"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAdd}
                  disabled={justAdded}
                  className={`flex-grow py-3 px-6 rounded-full text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#C96F91] hover:bg-[#b05d7e] text-white'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Your Basket!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add {quantity} to Basket · ₹{(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xs font-semibold text-gray-500">
                Currently Out of Stock. Our chefs are crafting more soon!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-[#3D3035]">
              You Might Also Love
            </h2>
            <span className="text-xs text-[#806F77]">From the same kitchen counter</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map(item => (
              <ProductCard
                key={item.id}
                product={item}
                onViewDetails={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
